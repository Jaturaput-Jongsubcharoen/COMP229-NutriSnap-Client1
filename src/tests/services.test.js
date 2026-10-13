import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { backendRequest } from '../services/api/backendClient.js';
import {
  login,
  register,
  getUser,
} from '../features/auth/services/authService.js';
import {
  getEntries,
  saveEntry,
  deleteEntry,
} from '../features/nutrition/services/nutritionService.js';
import {
  foodToEntry,
  searchFood,
  lookupBarcode,
  nutritionixClient,
} from '../features/food-search/services/nutritionixService.js';
let calls;
let response;
let token;
beforeEach(() => {
  calls = [];
  response = {};
  token = 'test-token';
  globalThis.localStorage = {
    getItem: (key) => (key === 'token' ? token : null),
  };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options });
    return new Response(JSON.stringify(response), { status: 200 });
  };
});
test('login and register preserve endpoints, JSON fields, and unauthenticated headers', async () => {
  response = { token: 't', userID: 'u' };
  assert.deepEqual(await login({ username: 'u', password: 'p' }), response);
  assert.deepEqual(calls[0], {
    url: '/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"username":"u","password":"p"}',
  });
  await register({ username: 'u', email: 'u@example.test', password: 'p' });
  assert.equal(calls[1].url, '/register');
  assert.deepEqual(JSON.parse(calls[1].body), {
    username: 'u',
    email: 'u@example.test',
    password: 'p',
  });
});
test('profile and history preserve bearer header and response shapes', async () => {
  response = { username: 'Tester' };
  assert.equal((await getUser()).username, 'Tester');
  response = { items: [{ _id: '1' }] };
  assert.deepEqual(await getEntries(), response.items);
  for (const call of calls)
    assert.deepEqual(call.headers, { Authorization: 'Bearer test-token' });
  assert.equal(calls[0].url, '/getUser');
  assert.equal(calls[1].url, '/apiMongo');
});
test('save preserves string nutrient payload and delete accepts an empty success body', async () => {
  const entry = {
    name: 'Rice',
    calories: '100',
    protein: '2',
    carbohydrates: '20',
    fat: '1',
    mealType: 'Dinner',
  };
  response = entry;
  assert.deepEqual(await saveEntry(entry), entry);
  assert.equal(calls[0].url, '/nutrients');
  assert.equal(calls[0].method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].body), entry);
  assert.equal(calls[0].headers.Authorization, 'Bearer test-token');
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options });
    return new Response(null, { status: 204 });
  };
  await deleteEntry('abc123');
  assert.equal(calls[1].url, '/apiMongo/abc123');
  assert.equal(calls[1].method, 'DELETE');
});
test('protected calls do not issue requests without a token', async () => {
  token = null;
  await assert.rejects(getEntries(), /log in/);
  assert.equal(calls.length, 0);
});
test('server failures propagate without retries and malformed history is rejected', async () => {
  globalThis.fetch = async () => {
    calls.push(1);
    return new Response('Invalid credentials', { status: 401 });
  };
  await assert.rejects(backendRequest('/login'), /Invalid credentials/);
  assert.equal(calls.length, 1);
  globalThis.fetch = async () => new Response('{}');
  await assert.rejects(getEntries(), /unexpected history/);
});
test('Nutritionix mapping preserves strings and Dinner default', () => {
  assert.deepEqual(
    foodToEntry({
      food_name: 'Apple',
      nf_calories: 95,
      nf_protein: 0.5,
      nf_total_carbohydrate: 25,
      nf_total_fat: 0.3,
    }),
    {
      name: 'Apple',
      calories: '95',
      protein: '0.5',
      carbohydrates: '25',
      fat: '0.3',
      mealType: 'Dinner',
    }
  );
  assert.equal(foodToEntry({ food_name: 'Unknown' }).calories, '');
});
test('text search preserves query contract and first-result behavior', async () => {
  response = { foods: [{ food_name: 'First' }, { food_name: 'Second' }] };
  assert.equal((await searchFood('1 apple')).food_name, 'First');
  assert.equal(
    calls[0].url,
    'https://trackapi.nutritionix.com/v2/natural/nutrients'
  );
  assert.deepEqual(JSON.parse(calls[0].body), { query: '1 apple' });
  assert.equal(calls[0].headers['Content-Type'], 'application/json');
  assert.ok(Object.hasOwn(calls[0].headers, 'x-app-id'));
  assert.ok(Object.hasOwn(calls[0].headers, 'x-app-key'));
  response = { foods: [] };
  await assert.rejects(searchFood('nothing'), /No nutrition/);
});
test('barcode lookup retains GET, upc, headers, and first food', async () => {
  const previous = nutritionixClient.defaults.adapter;
  nutritionixClient.defaults.adapter = async (config) => {
    assert.equal(config.method, 'get');
    assert.equal(config.url, '/search/item');
    assert.equal(config.baseURL, 'https://trackapi.nutritionix.com/v2');
    assert.equal(config.params.upc, '123456789012');
    assert.equal(
      config.headers.get('Content-Type'),
      'application/x-www-form-urlencoded'
    );
    return {
      data: { foods: [{ food_name: 'Product' }, { food_name: 'Ignored' }] },
      status: 200,
      headers: {},
      config,
    };
  };
  try {
    assert.equal((await lookupBarcode('123456789012')).food_name, 'Product');
  } finally {
    nutritionixClient.defaults.adapter = previous;
  }
});

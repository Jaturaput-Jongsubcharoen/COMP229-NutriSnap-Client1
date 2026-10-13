import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyEntry,
  formatNumber,
  totalEntries,
  validateEntry,
} from '../features/nutrition/nutritionUtils.js';
import { resolveTheme, savedTheme } from '../theme/themeStorage.js';
test('totals convert backend strings and ignore invalid and negative values', () => {
  assert.deepEqual(
    totalEntries([
      { calories: '100.5', protein: '4', carbohydrates: '12', fat: '2' },
      { calories: '99.5', protein: null, carbohydrates: 'invalid', fat: '-3' },
    ]),
    { calories: 200, protein: 4, carbohydrates: 12, fat: 2 }
  );
});
test('missing nutrition stays unknown rather than displaying fabricated zero', () => {
  for (const value of [null, undefined, '', 'unknown'])
    assert.equal(formatNumber(value), '—');
  assert.equal(formatNumber(0), '0');
  assert.equal(formatNumber('1234.56'), '1,234.6');
});
test('entry validation preserves optional blank macros and rejects invalid values', () => {
  const valid = { ...emptyEntry, name: 'Rice', mealType: 'Dinner' };
  assert.equal(validateEntry(valid), '');
  assert.match(validateEntry({ ...valid, name: ' ' }), /name/);
  assert.match(validateEntry({ ...valid, mealType: '' }), /meal type/);
  for (const value of ['-1', 'NaN', 'Infinity'])
    assert.match(
      validateEntry({ ...valid, calories: value }),
      /zero or greater/
    );
  assert.equal(validateEntry({ ...valid, protein: '0.25' }), '');
});
test('manual theme overrides system and system choice follows the OS', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
});
test('theme storage rejects unknown values and handles unavailable storage', () => {
  globalThis.localStorage = { getItem: () => 'light' };
  assert.equal(savedTheme(), 'light');
  globalThis.localStorage.getItem = () => 'other';
  assert.equal(savedTheme(), 'system');
  globalThis.localStorage.getItem = () => {
    throw new Error('blocked');
  };
  assert.equal(savedTheme(), 'system');
});

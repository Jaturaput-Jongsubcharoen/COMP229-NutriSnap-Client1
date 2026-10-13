import axios from 'axios';
export const nutritionixClient = axios.create({
  baseURL: 'https://trackapi.nutritionix.com/v2',
});
const headers = () => ({
  'x-app-id': import.meta.env?.VITE_NUTRITIONIX_APP_ID,
  'x-app-key': import.meta.env?.VITE_NUTRITIONIX_API_KEY,
});
function firstFood(data) {
  const food = data?.foods?.[0];
  if (!food)
    throw new Error('No nutrition found. Try another food or barcode.');
  return food;
}
export async function searchFood(query) {
  const response = await fetch(
    'https://trackapi.nutritionix.com/v2/natural/nutrients',
    {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }
  );
  if (!response.ok)
    throw new Error(
      `Nutrition search failed (${response.status}). Please try again.`
    );
  return firstFood(await response.json());
}
export async function lookupBarcode(upc) {
  const response = await nutritionixClient.get('/search/item', {
    params: { upc },
    headers: {
      ...headers(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return firstFood(response.data);
}
export function foodToEntry(food) {
  const stringValue = (value) => (value == null ? '' : String(value));
  return {
    name: food.food_name,
    calories: stringValue(food.nf_calories),
    protein: stringValue(food.nf_protein),
    carbohydrates: stringValue(food.nf_total_carbohydrate),
    fat: stringValue(food.nf_total_fat),
    mealType: 'Dinner',
  };
}

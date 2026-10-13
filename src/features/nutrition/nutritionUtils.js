export const emptyEntry = {
  name: '',
  calories: '',
  protein: '',
  carbohydrates: '',
  fat: '',
  mealType: '',
};
export const macroFields = [
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbohydrates', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
];
export function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(number)
    : '—';
}
export function totalEntries(entries) {
  return entries.reduce(
    (totals, entry) => {
      for (const key of Object.keys(totals)) {
        const value = Number(entry[key]);
        if (Number.isFinite(value) && value >= 0) totals[key] += value;
      }
      return totals;
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  );
}
export function validateEntry(entry) {
  if (!entry.name.trim()) return 'Enter a food name.';
  if (!entry.mealType) return 'Choose a meal type.';
  for (const key of ['calories', 'protein', 'carbohydrates', 'fat']) {
    if (
      entry[key] !== '' &&
      (!Number.isFinite(Number(entry[key])) || Number(entry[key]) < 0)
    )
      return 'Nutrition values must be zero or greater.';
  }
  return '';
}

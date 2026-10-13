export async function estimateNutrition(input) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key)
    throw new Error(
      'AI estimates are not configured. You can still add nutrition manually.'
    );
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const model = new GoogleGenerativeAI(key).getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  const prompt = `Get an accurate guess of described food. If you cannot find accurate results, return an estimate of 
    caloric, carbohydrate, fat, and protein content for the food item. "${input}".`;
  const response = await model.generateContent(prompt);
  return response.response.text();
}

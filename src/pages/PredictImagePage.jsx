import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAMNLbBF6YhV4RHPzybgdCm9TV8nL5Wk3Y");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function PredictImagePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedItems, setSavedItems] = useState([]); // State for saved items

  const [manualInput, setManualInput] = useState({
    name: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    mealType: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `Get an accurate guess of described food. If you cannot find accurate results, return an estimate of 
    caloric, carbohydrate, fat, and protein content for the food item. "${input}".`;
    try {
      const response = await model.generateContent(prompt);
      const responseText = response.response.text();
      setResult(responseText);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualInput((prev) => ({ ...prev, [name]: value }));
  };

  const saveToDatabase = async (foodData) => {
    console.log("Sending data to backend:", foodData); // Debugging
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      console.log("Data saved successfully:", await response.json());
      alert("Data saved to database successfully!");
    } catch (error) {
      console.error("Error saving to backend:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!manualInput.name.trim()) {
      alert("Please enter a name for the item.");
      return;
    }
    if (!manualInput.mealType.trim()) {
      alert("Please select a meal type.");
      return;
    }

    // Add manual input to the saved items list
    const foodData = { ...manualInput };
    setSavedItems((prev) => [...prev, foodData]);
    setManualInput({
      name: "",
      calories: "",
      protein: "",
      carbohydrates: "",
      fat: "",
      mealType: "",
    });

    // Save to database
    await saveToDatabase(foodData);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Food Nutritional Info</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a food item"
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
            width: "300px",
          }}
        />
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Get Info
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h2>Results:</h2>
          <p>{result}</p>

          {/* Manual Input Fields */}
          <div>
            <h3>Manually Edit Values:</h3>
            <input
              type="text"
              name="name"
              placeholder="Food Name"
              value={manualInput.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="calories"
              placeholder="Calories"
              value={manualInput.calories}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="protein"
              placeholder="Protein (g)"
              value={manualInput.protein}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="carbohydrates"
              placeholder="Carbohydrates (g)"
              value={manualInput.carbohydrates}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="fat"
              placeholder="Fat (g)"
              value={manualInput.fat}
              onChange={handleInputChange}
            />
            <label>
              Meal Type:
              <select
                name="mealType"
                value={manualInput.mealType}
                onChange={handleInputChange}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value="" disabled>
                  Select Meal Type
                </option>
                <option value="Snacks">Snacks</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </label>
            <button
              onClick={handleSave}
            >
              Save to History
            </button>
          </div>
        </div>
      )}

      {/* History Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>History</h3>
        {savedItems.length === 0 ? (
          <p>No items saved yet.</p>
        ) : (
          savedItems.map((item, index) => (
            <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <h4>{item.name}</h4>
              <p>Calories: {item.calories}</p>
              <p>Protein: {item.protein}g</p>
              <p>Carbohydrates: {item.carbohydrates}g</p>
              <p>Fat: {item.fat}g</p>
              <p>Meal Type: {item.mealType}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PredictImagePage;

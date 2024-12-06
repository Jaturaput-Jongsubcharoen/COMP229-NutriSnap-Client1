import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAMNLbBF6YhV4RHPzybgdCm9TV8nL5Wk3Y");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function PredictImagePage({ onSaveItem }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Manual input state
  const [manualInput, setManualInput] = useState({
    name: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
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
    console.log(`Manual Input Change - ${name}:`, value); // Log changes in manual input
    setManualInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Manual Input before saving:", manualInput); // Log manual input state before saving
    if (!manualInput.name.trim()) {
      alert("Please enter a name for the item.");
      return;
    }
    onSaveItem(manualInput);
    console.log("Item saved successfully."); // Log save success
    setManualInput({ name: "", calories: "", protein: "", carbohydrates: "", fat: "" });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Food Nutritional Info</h1>
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
            <button onClick={handleSave}>Save to History</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictImagePage;

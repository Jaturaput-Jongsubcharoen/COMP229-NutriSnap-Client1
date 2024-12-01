import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBjbMiCGWlR2MbgKOH14uGKpb6VHC8H13o");// This is a fake api key which doesn't work
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `Get Estimate of caloric, carbonhydrate, fat, and protein content for the food item, end with thank you "${input}".`;
    try {
      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
        </div>
      )}
    </div>
  );
}

export default App;

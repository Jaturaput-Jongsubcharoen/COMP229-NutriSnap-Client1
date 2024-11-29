import React, { useState } from "react";

const Text_Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [nutrients, setNutrients] = useState(null);

  const handleSearch = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "987883de",
        "x-app-key": "6b96a1f0e21ec3734ee14f5832315d5f",
      },
      body: JSON.stringify({ query: searchTerm }),
    };

    try {
      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNutrients(data.foods[0]); // Assuming data.foods contains the nutrient data
    } catch (error) {
      console.error("Error fetching nutrient data:", error);
    }
  };

  return (
    <div className="search-section">
      <h1>Text Search for Food</h1>
      <input
        type="text"
        placeholder="Enter food name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {nutrients && (
        <div>
          <h4>Nutrient Information</h4>
          <p>Calories: {nutrients.nf_calories}</p>
          <p>Protein: {nutrients.nf_protein} g</p>
          <p>Fat: {nutrients.nf_total_fat} g</p>
          <p>Carbohydrates: {nutrients.nf_total_carbohydrate} g</p>
          
        </div>
      )}
    </div>
  );
};

export default Text_Search;

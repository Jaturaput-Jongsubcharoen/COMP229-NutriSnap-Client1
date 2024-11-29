import React, { useState, useEffect } from "react";

const Text_Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [nutrients, setNutrients] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);

  // Fetch saved entries from the database when the component loads
  useEffect(() => {
    fetchSavedEntries();
  }, []);

  const fetchSavedEntries = async () => {
    try {
      const response = await fetch("http://localhost:5000/nutrients");
      if (!response.ok) {
        throw new Error(`Failed to fetch saved entries: ${response.status}`);
      }
      const data = await response.json();
      setSavedEntries(data);
    } catch (error) {
      console.error("Error fetching saved entries:", error);
    }
  };

  const handleSearch = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "987883de", // Replace with your Nutritionix App ID
        "x-app-key": "6b96a1f0e21ec3734ee14f5832315d5f", // Replace with your Nutritionix API Key
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
      const foodData = data.foods[0]; // Assuming data.foods contains the nutrient data
      setNutrients(foodData);

      // Save the data to MongoDB via the backend
      await saveToDatabase(foodData);
      // Fetch the updated list of saved entries
      fetchSavedEntries();
    } catch (error) {
      console.error("Error fetching nutrient data:", error);
    }
  };

  const saveToDatabase = async (foodData) => {
    try {
      const response = await fetch("http://localhost:5000/nutrients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data to database: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving data to database:", error);
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

      <div>
        <h4>Saved Nutrient Entries</h4>
        {savedEntries.length > 0 ? (
          <ul>
            {savedEntries.map((entry, index) => (
              <li key={index}>
                {entry.food_name} - Calories: {entry.nf_calories}, Protein:{" "}
                {entry.nf_protein}g, Fat: {entry.nf_total_fat}g, Carbs:{" "}
                {entry.nf_total_carbohydrate}g
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved entries found.</p>
        )}
      </div>
    </div>
  );
};

export default Text_Search;
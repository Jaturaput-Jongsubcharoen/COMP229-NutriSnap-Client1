import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../styles/AI.css';

const genAI = new GoogleGenerativeAI("AIzaSyDbfpA9rB_Ihbi-zfISWDCmqGurSTndFME");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function PredictImagePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedItems, setSavedItems] = useState([]); // State for saved items
  const [arrayMongoDB, setArrayMongoDB] = useState([]);
  const [showMongoDBData, setShowMongoDBData] = useState(false);
  const [username, setUsername] = useState("not logged in");
  const [manualInput, setManualInput] = useState({
    name: "",
    calories: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    mealType: "",
  });

  const navigate = useNavigate();

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/getUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setUsername(data.username || "not logged in");
    } catch (error) {
      console.error("Error fetching username:", error);
      setUsername("not logged in");
    }
  };

  const fetchAPIMongoDB = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token to pass as Authorization header
      if (!token) {
        console.error('No token found, user might not be logged in.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setArrayMongoDB(data.items);
      setShowMongoDBData(true);
    } catch (error) {
      console.error('Error fetching data (API Mongo Response):', error);
    }
  };

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
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

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

    await saveToDatabase(foodData);
  };

  useEffect(() => {
    fetchUsername();
    fetchAPIMongoDB();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userID"); 
    setUsername("not logged in"); 
    navigate('/MainPage');
  };

  const handleLoginPageClick = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="container-row">
        <div className="logo-container">
          <img src={logo1} className="logo" alt="Custom Logo 1" />
        </div>
      </div>
      <hr />
      <div className="container-row">
        <div className="title">
          <h1>N U T R I - K C A L</h1>
        </div>
      </div>
      <hr />

      <div className="container-row top-navbar">
        <div className="container-row6">
          <div className="container-row7">
            <h4>Username: {username}.</h4>
          </div>
          <div className="container-row8">
            {username !== "not logged in" ? (
              <button className="login-logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="login-logout-button" onClick={handleLoginPageClick}>
                Login
              </button>
            )}
            <button className="signup-button" onClick={handleRegister}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <br />

      <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <h1>Food Nutritional Info</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a food item"
          />
          <button type="submit">Get Info</button>
        </form>
      </div>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {result && (
          <div>
            <h2>Results:</h2>
            <p>{result}</p>
            
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

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
                  <label>
                    Meal Type:
                    <select
                      name="mealType"
                      value={manualInput.mealType}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select Meal Type</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </label>
                  <button onClick={handleSave}>Save to History</button>
                </div>
              </div>
            )}

            <div className="History">
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
        )
      }
    </>
  );
}

export default PredictImagePage;

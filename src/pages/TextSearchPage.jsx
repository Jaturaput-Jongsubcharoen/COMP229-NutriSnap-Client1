import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';

const TextSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [nutrients, setNutrients] = useState(null);
    const [storedObject, setStoredObject] = useState(null); // State for the most recently stored object
    const [username, setUsername] = useState("not logged in");

    const navigate = useNavigate();

    // Fetch username
    const fetchUsername = async () => {
        try {
            const token = localStorage.getItem("token");
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

    // Save data to database
    const saveToDatabase = async () => {
        if (!nutrients) {
            console.error("No nutrient data to save.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user might not be logged in.");
                return;
            }

            const payload = {
                name: nutrients.food_name,
                calories: nutrients.nf_calories.toString(),
                protein: nutrients.nf_protein.toString(),
                carbohydrates: nutrients.nf_total_carbohydrate.toString(),
                fat: nutrients.nf_total_fat.toString(),
                mealType: "",
            };

            const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to save data to /nutrients: ${response.status}`);
            }

            const savedData = await response.json();
            console.log("Data saved successfully:", savedData);

            // Update the state with the most recently saved object
            setStoredObject(savedData);
        } catch (error) {
            console.error("Error saving data to /nutrients:", error);
        }
    };

    // Handle search for food items
    const handleSearch = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
                "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY,
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
            const foodData = data.foods[0];
            setNutrients(foodData); // Only set nutrient data, do not save
            console.log("Fetched Nutrients:", foodData);
        } catch (error) {
            console.error("Error fetching nutrient data:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUsername("not logged in");
        navigate('/MainPage');
    };

    const handleLoginPageClick = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    // Fetch username on component mount
    useEffect(() => {
        fetchUsername(); // Fetch the username
    }, []);

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
                    <h4>Username: {username}</h4>
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
            <div className="container-row">
                <div className="decorate-main-page2">
                    <div className="textsearch_barcode_container">
                        <p>T E X T&nbsp;&nbsp;&nbsp;&nbsp;S E A R C H&nbsp;&nbsp;&nbsp;&nbsp;F O R&nbsp;&nbsp;&nbsp;&nbsp;F O O D</p>
                        <p>Enter the name of the food to search its nutritional content</p>
                        <div className="decorate-row5">
                        <input
                            type="text"
                            placeholder="Enter food name to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "280px", padding: "10px 20px", borderRadius: "20px" }}
                        />
                        <button onClick={handleSearch} className="white-button">Search</button>
                        </div>
                        {nutrients && (
                            <div>
                                <h2 className="foodname">Food Name : {nutrients.food_name}</h2>
                                <h3>Nutritional Information</h3>
                                <table className='table_NI'>
                                    <thead>
                                        <tr>
                                            <th className='table_th_td'>Nutrient</th>
                                            <th className='table_th_td'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='table_th_td'>Calories</td>
                                            <td className='table_th_td'>{nutrients.nf_calories} kilocalories</td>
                                        </tr>
                                        <tr>
                                            <td className='table_th_td'>Protein</td>
                                            <td className='table_th_td'>{nutrients.nf_protein} grams</td>
                                        </tr>
                                        <tr>
                                            <td className='table_th_td'>Fat</td>
                                            <td className='table_th_td'>{nutrients.nf_total_fat} grams</td>
                                        </tr>
                                        <tr>
                                            <td className='table_th_td'>Carbohydrates</td>
                                            <td className='table_th_td'>{nutrients.nf_total_carbohydrate} grams</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button onClick={saveToDatabase} className="white-button">
                                    Save
                                </button>
                            </div>
                        )}
                        <div>
                            <h4>Nutrient Entry</h4>
                            {storedObject ? (
                                <ul>
                                    <li>
                                        {storedObject.name} - Calories: {storedObject.calories}, 
                                        Protein: {storedObject.protein}g,
                                        Fat: {storedObject.fat}g, 
                                        Carbs: {storedObject.carbohydrates}g
                                    </li>
                                </ul>
                            ) : (
                                <p>No entries found. Please search for and save your nutrition.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TextSearchPage;

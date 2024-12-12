import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import axios from 'axios';
import Quagga from 'quagga';
import '../App.css';

function BarcodePage() {
    const [barcode, setBarcode] = useState("");
    const [image, setImage] = useState(null);
    const [nutrients, setNutrients] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("not logged in");
    const [storedObject, setStoredObject] = useState(null);

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
                mealType: "Dinner", // Default value; you can modify this as needed
            };

            const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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

    // Handle image upload
    const handleImageUpload = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
    };

    // Decode barcode from the image
    const scanBarcode = () => {
        if (!image) {
            setErrorMessage("Please upload an image of a barcode first.");
            return;
        }

        Quagga.decodeSingle(
            {
                src: image,
                numOfWorkers: 0,
                inputStream: {
                    size: 800,
                },
                decoder: {
                    readers: ["ean_reader", "upc_reader"],
                },
            },
            (result) => {
                if (result && result.codeResult) {
                    setBarcode(result.codeResult.code);
                    fetchNutritionalInfo(result.codeResult.code);
                    setErrorMessage("");
                } else {
                    setErrorMessage("Barcode not detected in the uploaded image.");
                }
            }
        );
    };

    // Fetch nutritional info using barcode
    const fetchNutritionalInfo = async (barcode) => {
        try {
            const response = await axios.get(
                `https://trackapi.nutritionix.com/v2/search/item`,
                {
                    params: { upc: barcode },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
                        "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY,
                    },
                }
            );

            if (response.data && response.data.foods && response.data.foods.length > 0) {
                setNutrients(response.data.foods[0]);
            } else {
                setErrorMessage("No nutritional data found for this barcode.");
                setNutrients(null);
            }
        } catch (error) {
            console.error("Error fetching nutritional information:", error);
            setErrorMessage("Failed to fetch nutritional data. Please try again.");
            setNutrients(null);
        }
    };

    // Fetch username on component mount
    useEffect(() => {
        fetchUsername();
    }, []);

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
                            <>
                                <h4>Welcome, {username}!</h4>
                                <button className="login-logout-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="login-logout-button" onClick={handleLoginPageClick}>
                                    Login
                                </button>
                                <button className="signup-button" onClick={handleRegister}>
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <br />
            <div className="container-row">
                <div className="decorate-main-page2">
                    <div style={{ textAlign: "center", marginTop: "20px", color: "#f2f0c4" }}>
                        <h2>F O O D&nbsp;&nbsp;&nbsp;&nbsp;B A R C O D E&nbsp;&nbsp;&nbsp;&nbsp;S C A N N E R</h2>
                        <h3>Upload barcode image of food to search nutrients</h3>
                        <input className="white-button" type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: "10px" }} />
                        <br />
                        <button className="white-button" onClick={scanBarcode} style={{ padding: "10px 20px", marginBottom: "20px" }}>
                            Scan Barcode
                        </button>
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                        {barcode && <p>Barcode: {barcode}</p>}
                        {nutrients && (
                            <div>
                                <h2>Nutritional Information</h2>
                                <table className="table_NI">
                                    <thead>
                                        <tr>
                                            <th className="table_th_td">Nutrient</th>
                                            <th className="table_th_td">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table_th_td">Food Name</td>
                                            <td className="table_th_td">{nutrients.food_name}</td>
                                        </tr>
                                        <tr>
                                            <td className="table_th_td">Calories</td>
                                            <td className="table_th_td">{nutrients.nf_calories} kilocalories</td>
                                        </tr>
                                        <tr>
                                            <td className="table_th_td">Protein</td>
                                            <td className="table_th_td">{nutrients.nf_protein} grams</td>
                                        </tr>
                                        <tr>
                                            <td className="table_th_td">Fat</td>
                                            <td className="table_th_td">{nutrients.nf_total_fat} grams</td>
                                        </tr>
                                        <tr>
                                            <td className="table_th_td">Carbohydrates</td>
                                            <td className="table_th_td">{nutrients.nf_total_carbohydrate} grams</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button onClick={saveToDatabase} className="buttonstyling">
                                    Save
                                </button>
                            </div>
                        )}
                        <div>
                            <h4>Recently Stored Nutrient Entry</h4>
                            {storedObject ? (
                                <ul>
                                    <li>
                                        {storedObject.name} - Calories: {storedObject.calories}, Protein: {storedObject.protein}g, Fat: {storedObject.fat}g, Carbs: {storedObject.carbohydrates}g
                                    </li>
                                </ul>
                            ) : (
                                <p>No recent entry found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BarcodePage;

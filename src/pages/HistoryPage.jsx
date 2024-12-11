import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo1 from '../images/logo1.png';
import '../styles/History.css';

function HistoryPage() {
    //const [array, setArray] = useState([]);
    const [arrayMongoDB, setArrayMongoDB] = useState([]);
    const [showMongoDBData, setShowMongoDBData] = useState(false);
    const [userID, setUserID] = useState("");
    
    // Function to fetch hardcoded API data
    /*
    const fetchAPI = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BE_URL}/api`);
            setArray(response.data.fruits);
            console.log('API Response:', response.data.fruits);
        } catch (error) {
            console.error('Error fetching data (API Response):', error);
        }
    };
    */

    // Function to fetch data from MongoDB
    const fetchAPIMongoDB = async () => {
        try {
            console.log(import.meta.env);
            console.log('VITE_BE_URL:', import.meta.env.VITE_BE_URL); // Debugging
            //------------------------------------------------------------------------------------
            //const userID = localStorage.getItem("userID"); // Get the userID from localStorage
            const token = localStorage.getItem("token"); // Get the token to pass as Authorization header

            if (!token) {
                console.error('No token or userID found, user might not be logged in.');
                return;
            }
            //------------------------------------------------------------------------------------
            const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`, {
                //------------------------------------------------------------------------------------
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`, // Add the token here
                },
                //------------------------------------------------------------------------------------
            });
          
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Mongo Response:', data.items);
            setArrayMongoDB(data.items);
            setShowMongoDBData(true);
        } catch (error) {
            console.error('Error fetching data (API Mongo Response):', error);
        }
    };

    // Fetch the hardcoded API data on component mount
    useEffect(() => {
        const storedUserID = localStorage.getItem("userID");
        setUserID(storedUserID || "not logged in");
        fetchAPIMongoDB();
    }, []);

    return (
        <div>
            <div className="container-row">
                <div className="logo-container">
                    <img src={logo1} className="logo" alt="Custom Logo 1" />
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div className="title">
                    <h1>H I S T O R Y</h1>
                </div>
            </div>
            <hr />
            <br />

            {/*
            <div className="container-row">
                <h2>First, This data is coming from a 'Hardcoded data' defined in the server.js file</h2>
            </div>
            <br />

            <div className="container-row">
                <div className="container-column">
                    {array.map((fruit, index) => (
                        <div key={index}>
                            <p>{fruit}</p>
                        </div>
                    ))}
                </div>
            </div>
            */}
            <div className="decorate-main-page1">
                <div className="container-row">
                    <div className="container-column">
                        <h2>Explore Your History of Added Items.</h2>
                        <h3>user ID: {userID}.</h3>
                    </div>
                </div>
                <br />
                
                <div className="container-row">
                    <div className="container-column">
                        {showMongoDBData && arrayMongoDB && arrayMongoDB.length > 0 ? (
                            arrayMongoDB.map((item, index) => (
                                <div className="decorate-row4" key={item._id || index}>
                                    <div className="item-card">
                                        <p>
                                            <strong>Name:</strong> {item.name}
                                        </p>
                                        <p>
                                            <strong>Calories:</strong> {item.calories}
                                        </p>
                                        <p>
                                            <strong>Protein:</strong> {item.protein}
                                        </p>
                                        <p>
                                            <strong>Fat:</strong> {item.fat}
                                        </p>
                                        <p>
                                            <strong>Carbohydrates:</strong> {item.carbohydrates}
                                        </p>
                                        <p>
                                            <strong>Meal Type:</strong> {item.mealType}
                                        </p>
                                        <p>
                                            <strong>Barcode:</strong> {item.barcode || "N/A"}
                                        </p>
                                        {item.aiImage && (
                                            <p>
                                                <strong>AI Image:</strong> <br />
                                                <img src={item.aiImage} alt={`${item.name} AI Image`} className="ai-image" />
                                            </p>
                                        )}
                                        <br />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h2>No items have been stored yet. Please add some items.</h2>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo1 from '../images/logo1.png';
import history from '../images/history.png';
import '../styles/History.css';

function HistoryPage() {
    //const [array, setArray] = useState([]);
    const [arrayMongoDB, setArrayMongoDB] = useState([]);
    const [showMongoDBData, setShowMongoDBData] = useState(false);
    const [username, setUsername] = useState("not logged in"); 

    const navigate = useNavigate();

    //username
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
                    Authorization: `Bearer ${token}`, // Include token in the Authorization header
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Username:", data.username);
            setUsername(data.username || "not logged in");
        } catch (error) {
            console.error("Error fetching username:", error);
            setUsername("not logged in");
        }
    };

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

    // fetch data from MongoDB
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

    const removeItem = async (id) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error('No token found, user might not be logged in.');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            // Update the frontend state after successful deletion
            setArrayMongoDB(arrayMongoDB.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };    

    // Fetch the hardcoded API data on component mount
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

            <div className="decorate-main-page2">
                <div className="container-row-icon">
                    <img src={history} className="icon3" alt="icon 2" />
                    <h2>H I S T O R Y : {username}</h2>
                </div>

                {/*
                <div className="container-row">
                    <div className="decorate-row9">
                        <h3>Username: {username}.</h3>
                    </div>
                </div>
                <br />
                */}
                
                <div className="container-row">
                    <div className="container-column1">
                        {showMongoDBData && arrayMongoDB && arrayMongoDB.length > 0 ? (
                            arrayMongoDB.map((item, index) => (
                                <div className="decorate-row4" key={item._id || index}>
                                    <div className="item-card">
                                        <hr />
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
                                        <div className="decorate-row5">
                                            <button className="white-button" onClick={() => removeItem(item._id)}>
                                                Remove item
                                            </button>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No items have been stored yet. Please add some items.</p>
                        )}
                    </div>        
                </div>
            </div>
        </>
    );
}

export default HistoryPage;
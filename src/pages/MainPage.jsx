import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import '../styles/DecorateMainPage.css';

function MainPage({}) {
    const [username, setUsername] = useState("not logged in");
    const navigate = useNavigate(); // navigation hook

    //username
    const fetchUsername = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user might not be logged in.");
                setUsername("not logged in");
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
    useEffect(() => {
        fetchUsername();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("userID"); 
        setUsername("not logged in"); 
        navigate('/MainPage');
    };

    // Navigation handlers
    const handlePredictImageClick = () => {
        navigate('/predict-image'); // Navigate to the PredictImagePage
    };

    const handleHistoryPageClick = () => {
        navigate('/history'); // Navigate to the HistoryPage
    };

    const handleLoginPageClick = () => {
        navigate('/login'); // Navigate to the LoginPage
    };

    const handleFetchBarcodePageClick = () => {
        navigate('/barcode'); // Navigate to Barcode Page
    };

    const handleAddItemPageClick = () => {
        navigate('/add-item'); // Navigate to the Add Item Page
    };

    const handleTextSearchforFood = () => {
        navigate('/text-search'); // Navigate to the Text Search for Food Page
    };

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
                    <h1>N U T R I - K C A L</h1>
                </div>
            </div>
            <hr />
            <div className="container-row">
                <div className="container-row6">
                    <div className="container-row7">
                        <h3>Username: {username}.</h3>
                     </div>
                     <div className="container-row8">
                        <button className="login-logout-button" onClick={handleLoginPageClick}>Login</button>
                        <button className="login-logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            <br/>
            <div className="container-row">
                <div className="container-column">
                    <div className="decorate-main-page1">
                        <h2>T R A C K&nbsp;&nbsp;&nbsp;&nbsp;Y O U R&nbsp;&nbsp;&nbsp;&nbsp;M E A L S</h2>
                        <br/>

                        <div className="container-row">
                            <div className="container-row1">
                                <button className="brown1-button" onClick={handleFetchBarcodePageClick}>Upload Barcode</button>
                                <button className="brown2-button" onClick={handlePredictImageClick}>Not sure? Let AI Guess</button>
                                <button className="brown3-button" onClick={handleTextSearchforFood}>Text Search for Food</button>
                            </div>
                        </div>
                        <br/>

                        <div className="container-row">
                            <div className="decorate-row4">
                                <p>Explore Your History of Added Items</p>
                                <hr />
                                <br />
                                <div className="decorate-row5">
                                    <button className="white-button" onClick={handleHistoryPageClick}>History</button>
                                </div>
                            </div>
                        </div>
                        <br />

                        <div className="container-row">
                            <div className="decorate-row4">
                                <p>Add and Customize Your Item</p>
                                <hr />
                                <br />
                                <div className="decorate-row5">
                                    <button className="white-button" onClick={handleAddItemPageClick}>Add Item</button>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
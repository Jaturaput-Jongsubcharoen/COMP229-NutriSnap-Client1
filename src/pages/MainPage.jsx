import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import scan from '../images/scan.png';
import AIpng from '../images/AIpng.png';
import loupe from '../images/loupe.png';
import history from '../images/history.png';
import add from '../images/add.png';
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

    const handleRegister = () => {
        navigate('/register'); // Navigate to the Text Search for Food Page
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
            <div className="container-row">
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
            <br/>
            <div className="container-row">
                <div className="container-column">
                    <div className="decorate-main-page2">
                        <h2>T R A C K&nbsp;&nbsp;&nbsp;&nbsp;Y O U R&nbsp;&nbsp;&nbsp;&nbsp;M E A L S</h2>
                        <br/>

                        <div className="container-row">
                            <div className="container-row1">
                                <button className="container-column2 brown1-button" onClick={handleFetchBarcodePageClick}>
                                    <img src={scan} className="icon1" alt="icon 2" /> 
                                    Upload Barcode
                                </button>
                                <button className="container-column2 brown2-button" onClick={handlePredictImageClick}>
                                    <img src={AIpng} className="icon1" alt="icon 2" /> 
                                    Not sure? Let AI Guess
                                </button>
                                <button className="container-column2 brown3-button" onClick={handleTextSearchforFood}>
                                    <img src={loupe} className="icon1" alt="icon 2" /> 
                                    Text Search for Food
                                </button>
                            </div>
                        </div>
                        <br/>

                        <div className="container-row">
                            <div className="decorate-row4">
                                <p>Explore Your History of Added Items</p>
                                <hr />
                                <br />
                                <div className="decorate-row5">
                                    <button className="container-column3 white-button" onClick={handleHistoryPageClick}>
                                        <img src={history} className="icon2" alt="icon 2" /> 
                                        History
                                    </button>
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
                                    <button className="container-column3 white-button" onClick={handleAddItemPageClick}>
                                        <img src={add} className="icon2" alt="icon 2" /> 
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainPage;
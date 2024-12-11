import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import '../styles/DecorateMainPage.css';

function MainPage({ array, arrayMongoDB, showMongoDBData, fetchAPIMongoDB }) {

    const navigate = useNavigate(); // Initialize navigation hook

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
                    <button className="login-logout-button" onClick={handleLoginPageClick}>Login</button>
                    <button className="login-logout-button">Logout</button>
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
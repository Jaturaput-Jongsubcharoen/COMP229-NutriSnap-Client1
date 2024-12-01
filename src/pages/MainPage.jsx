import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo1 from '../images/logo1.png';

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

    return (
        <div>

            <div className="container-row">
                <div>
                    <img src={logo1} className="logo" alt="Custom Logo 1" />
                </div>
            </div>
            
            <div className="container-row">
                <div className="container-row3">
                    <h1>Nutri-Kcal</h1>
                    <button className="login-logout-button" onClick={handleLoginPageClick}>Login</button>
                    <button className="login-logout-button">Logout</button>
                </div>
            </div>
            <br/>
            <div className="container-row">
                <div className="container-column">
                    <div className="decorate-main-page1">
                        <p className="track-meals-text">Track Your Meals</p>
                        <br/>

                        <div className="container-row">
                            <div className="container-row1">
                                <button className="green-button" onClick={handleFetchBarcodePageClick}>Upload Barcode</button>
                                <button className="purple-button" onClick={handlePredictImageClick}>Upload Image for AI Suggestion</button>
                                <button className="black-button">Text Search for Food</button>
                            </div>
                        </div>
                        <br/>

                        <div className="container-row">
                            <div className="decorate-row2">
                                <p>History</p>
                                <br />
                                <button onClick={handleHistoryPageClick}>History Page</button>
                            </div>
                        </div>
                        <br />

                        <div className="container-row">
                            <div className="decorate-row2">
                                <p>Add Item</p>
                                <br />
                                <button onClick={handleAddItemPageClick}>Add Item Page</button>
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
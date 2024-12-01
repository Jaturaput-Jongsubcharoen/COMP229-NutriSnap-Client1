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
        navigate('/barcode'); // Example: Navigate to Barcode Page
    };

    return (
        <div>
            <div className="container-row">
                <div>
                    <img src={logo1} className="logo" alt="Custom Logo 1" />
                </div>
            </div>
            <br/>

            <div className="container-row">
                <button onClick={handlePredictImageClick}>AI Predict Image Page</button>
            </div>
            <br />

            <div className="container-row">
                <button onClick={handleHistoryPageClick}>History Page</button>
            </div>
            <br />

            <div className="container-row">
                <button onClick={handleLoginPageClick}>Login Page</button>
            </div>
            <br />

            <div className="container-row">
                <button onClick={handleFetchBarcodePageClick}>Fetch Barcode Page</button>
            </div>
            <br/>
        </div>
    );
}

export default MainPage;
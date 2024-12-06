import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo1 from '../images/logo1.png';

function HistoryPage() {
    const [array, setArray] = useState([]);
    const [arrayMongoDB, setArrayMongoDB] = useState([]);
    const [showMongoDBData, setShowMongoDBData] = useState(false);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BE_URL || "http://localhost:8080";

    // Function to fetch hardcoded API data
    const fetchAPI = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api`);
            setArray(response.data.fruits);
        } catch (error) {
            console.error('Error fetching data (API Response):', error);
        }
    };

    // Function to fetch data from MongoDB
    const fetchAPIMongoDB = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/apiMongo`);
            setArrayMongoDB(response.data.items);
            setShowMongoDBData(true);
            setError(null);
        } catch (error) {
            console.error('Error fetching data (API Mongo Response):', error);
            setError("Failed to fetch MongoDB data. Please try again later.");
        }
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <div>
            <div className="container-row">
                <div>
                    <img src={logo1} className="logo" alt="Custom Logo 1" />
                </div>
            </div>
            <br />

            <div className="container-row">
                <h1>History Page: Welcome to "Nutri Kcal"</h1>
            </div>
            <hr />
            <br />

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

            <div className="container-row">
                <h2>Second, Please click the button. These data will come from MongoDB</h2>
            </div>
            <br />

            <div className="container-row">
                <div className="container-column">
                    <button onClick={fetchAPIMongoDB}>Fetch MongoDB Data</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {arrayMongoDB.length > 0 ? (
                        arrayMongoDB.map((item, index) => (
                            <div key={item._id || index}>
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Calories:</strong> {item.Calories}</p>
                                <p><strong>Protein:</strong> {item.Protein}</p>
                                <p><strong>Fat:</strong> {item.Fat}</p>
                                <p><strong>Carbohydrates:</strong> {item.Carbohydrates}</p>
                                <br />
                            </div>
                        ))
                    ) : (
                        <p>No data available from MongoDB.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HistoryPage;
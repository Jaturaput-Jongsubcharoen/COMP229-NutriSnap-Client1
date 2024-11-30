import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

import logo1 from './assets/images/logo1.png';

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [arrayMongoDB, setArrayMongoDB] = useState([]);
  const [showMongoDBData, setShowMongoDBData] = useState(false);


  const fetchAPI = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api");
        setArray(response.data.fruits);
        console.log("API Response:", response.data.fruits);
    } catch (error) {
        console.error("Error fetching data (API Response):", error);
    }
  };
  
  const fetchAPIMongoDB = async () => {
    try {
        console.log("Backend URL MongoDB:", import.meta.env.VITE_BE_URL); // Debugging
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Mongo Response:", data);
        setArrayMongoDB(data.items);
        setShowMongoDBData(true); // Show the data
    } catch (error) {
        console.error("Error fetching data (API Mongo Response):", error);
    }
  };

  useEffect(() => {
      fetchAPI();

  }, []);


  return (
    <>
      <div>
        <img src={logo1} className="logo custom" alt="Custom Logo 1" /> 
      </div>
      <h1>Hello! This is Main Branch</h1>
      <div className="card">

        <h2>Frist, This data is coming from a 'Hardcoded data' defined in the server.js file</h2>
        {
          array.map((fruit, index) => (
            <div key={index}>
              <p>{fruit}</p>
              <br></br>
            </div>
          ))
        }

        <h2>Second, Please click the button. These data will come from MongoDB</h2>
        {/*-------------------------------------------------------------*/}
        <button onClick={fetchAPIMongoDB}>
          Fetch MongoDB Data
        </button>
        {/*-------------------------------------------------------------*/}
        {
          showMongoDBData &&
          arrayMongoDB &&
          arrayMongoDB.length > 0 &&
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
        }

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

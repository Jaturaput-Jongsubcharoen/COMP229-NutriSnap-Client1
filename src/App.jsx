import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

import MainPage from './page/MainPage';

function App() {
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
      <MainPage
        array={array}
        arrayMongoDB={arrayMongoDB}
        showMongoDBData={showMongoDBData}
        fetchAPIMongoDB={fetchAPIMongoDB}
      />
    </>
  )
}

export default App

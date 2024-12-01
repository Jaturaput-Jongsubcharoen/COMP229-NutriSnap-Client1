import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import PredictImagePage from './pages/PredictImagePage'; 
import HistoryPage from './pages/HistoryPage'; 
import LoginPage from './pages/LoginPage'; 
import AddItemPage from './pages/AddItemPage';
import BarcodePage from './pages/BarcodePage';
import TextSearchPage from './pages/TextSearchPage';

function App() {
  const [array, setArray] = useState([]);
  const [arrayMongoDB, setArrayMongoDB] = useState([]);
  const [showMongoDBData, setShowMongoDBData] = useState(false);

  // Function to fetch hardcoded API data
  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api');
      setArray(response.data.fruits);
      console.log('API Response:', response.data.fruits);
    } catch (error) {
      console.error('Error fetching data (API Response):', error);
    }
  };

  const fetchAPIMongoDB = async () => {
    try {
      console.log('Backend URL MongoDB:', import.meta.env.VITE_BE_URL); // Debugging
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Mongo Response:', data);
      setArrayMongoDB(data.items);
      setShowMongoDBData(true); // Show the data
    } catch (error) {
      console.error('Error fetching data (API Mongo Response):', error);
    }
  };

  // Fetch the hardcoded API data on component mount
  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Page */}
        <Route path="/" element={<MainPage />} />

        <Route path="/predict-image" element={<PredictImagePage />} />

        {/* History Page - Jaturaput "Mac"*/}
        <Route
          path="/history"
          element={
            <HistoryPage
              array={array}
              arrayMongoDB={arrayMongoDB}
              showMongoDBData={showMongoDBData}
              fetchAPIMongoDB={fetchAPIMongoDB}
            />
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/add-item" element={<AddItemPage />} />

        <Route path="/barcode" element={<BarcodePage />} />

        <Route path="/text-search" element={<TextSearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
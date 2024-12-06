import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import PredictImagePage from './pages/PredictImagePage'; 
import HistoryPage from './pages/HistoryPage'; 
import LoginPage from './pages/LoginPage'; 
import AddItemPage from './pages/AddItemPage';
import BarcodePage from './pages/BarcodePage';
import TextSearchPage from './pages/TextSearchPage';

function App() {

  return (
    <Router>
      <Routes>
        {/* Main Page */}
        <Route path="/" element={<MainPage />} />

        {/* Predict Image Page - Gowsith */}
        <Route path="/predict-image" element={<PredictImagePage/>} />

        {/* History Page - Jaturaput */}
        <Route path="/history" element={<HistoryPage />} />

        {/* Login Page - Sukhman */}
        <Route path="/login" element={<LoginPage />} />

        {/* Add Item Page - Aryan */}
        <Route path="/add-item" element={<AddItemPage />} />

        {/* Barcode Page - Joseph */}
        <Route path="/barcode" element={<BarcodePage />} />

        {/* Text Search Page - Joseph */}
        <Route path="/text-search" element={<TextSearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
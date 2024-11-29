import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Upload_Barcode from './Upload_Barcode';
import AI_Image from './AI_Image';
import Text_Search from './Text_Search';
import Add_Item from './Add_Item';
import History from './History/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="Title-and-Button">
          <h1 className="Title">MyFitnessPal</h1>
          <button className="Logout-Button">Log Out</button>
        </header>

        <Routes>
          {/* Main Page */}
          <Route
            path="/"
            element={
              <main className="main-container">
                <h2 className="TrackMealsOptions">Track Your Meals</h2>

                {/* Upload Options */}
                <div className="UploadBarcode">
                  <Link to="/Upload-Barcode">
                    <button className="BarcodeImage">
                      <i className="BarcodeButton"></i> Upload Barcode
                    </button>
                  </Link>
                  <Link to="/AI-Image">
                    <button className="UploadImagetoAI">
                      <i className="AI_Image"></i> Upload Image for AI Suggestion
                    </button>
                  </Link>
                  <Link to="/Text-Search">
                    <button className="SearchTextforFood">
                      <i className="Text_Search"></i> Text Search for Food
                    </button>
                  </Link>
                </div>

                {/* Meal Sections */}
                <div className="Meal_Sections">
                  <div className="Breakfast_Div">
                    <h3>Breakfast</h3>
                    <Link to="/Add-Item">
                      <button className="BreakfastButton">Add Item</button>
                    </Link>
                  </div>
                  <div className="Lunch_Div">
                    <h3>Lunch</h3>
                    <Link to="/Add-Item">
                      <button className="LunchButton">Add Item</button>
                    </Link>
                  </div>
                  <div className="Dinner_Div">
                    <h3>Dinner</h3>
                    <Link to="/Add-Item">
                      <button className="DinnerButton">Add Item</button>
                    </Link>
                  </div>
                  <div className="Snacks_Div">
                    <h3>Snacks</h3>
                    <Link to="/Add-Item">
                      <button className="SnacksButton">Add Item</button>
                    </Link>
                  </div>

                  {/* History Button | Mac */}
                  <div className="History_Div" style={{ marginTop: '20px' }}>
                    <h3>View History</h3>
                    <Link to="/History">
                      <button className="HistoryButton">Go to History</button>
                    </Link>
                  </div>

                </div>
              </main>
            }
          />

          {/* Pages */}
          <Route path="/Upload-Barcode" element={<Upload_Barcode />} />
          <Route path="/AI-Image" element={<AI_Image />} />
          <Route path= "/Text-Search" element={<Text_Search/>}/>
          <Route path="/Add-Item" element={<Add_Item />} />
          <Route path="/History" element={<History />} /> {/* History Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

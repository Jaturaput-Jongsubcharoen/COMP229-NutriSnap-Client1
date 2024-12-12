import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import axios from 'axios';
import Quagga from 'quagga';

function BarcodePage() {
    const [barcode, setBarcode] = useState("");
    //const [result, setResult] = useState(null);
    const [image, setImage] = useState(null);
    const [nutrients, setNutrients] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showMongoDBData, setShowMongoDBData] = useState(false);
    const [arrayMongoDB, setArrayMongoDB] = useState([]);
    const [username, setUsername] = useState("not logged in"); 

    const navigate = useNavigate();

    //username
    const fetchUsername = async () => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage

            if (!token) {
                console.error("No token found, user might not be logged in.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BE_URL}/getUser`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the Authorization header
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Username:", data.username);
            setUsername(data.username || "not logged in");
        } catch (error) {
            console.error("Error fetching username:", error);
            setUsername("not logged in");
        }
    };

     // fetch data from MongoDB
  const fetchAPIMongoDB = async () => {
    try {
        console.log(import.meta.env);
        console.log('VITE_BE_URL:', import.meta.env.VITE_BE_URL); // Debugging
        //------------------------------------------------------------------------------------
        //const userID = localStorage.getItem("userID"); // Get the userID from localStorage
        const token = localStorage.getItem("token"); // Get the token to pass as Authorization header

        if (!token) {
            console.error('No token or userID found, user might not be logged in.');
            return;
        }
        //------------------------------------------------------------------------------------
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`, {
            //------------------------------------------------------------------------------------
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Add the token here
            },
            //------------------------------------------------------------------------------------
        });
      
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Mongo Response:', data.items);
        setArrayMongoDB(data.items);
        setShowMongoDBData(true);
    } catch (error) {
        console.error('Error fetching data (API Mongo Response):', error);
    }
  };

    // This section handles the image uploading part
    const handleImageUpload = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
      };
    
    // This section handles image recognition to barcode value using Quagga
      const scanBarcode = () => {
        if(!image){
          setErrorMessage("Please upload an image of a barcode first.");
          return;
        }
    
    // This section handles the decoding of barcode image to barcode value.
        Quagga.decodeSingle({
          src: image,
          numOfWorkers: 0,  // Needs to be 0 when used within Node.js
          inputStream: {
            size: 800  // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers: ["ean_reader", "upc_reader"],}, // List of active readers for two barcode types
        }, 
        (result) => {
          if (result && result.codeResult) {
            setBarcode(result.codeResult.code);
            fetchNutritionalInfo(result.codeResult.code);
            setErrorMessage(""); //Clears previous errors displayed.
          } else {setErrorMessage("Barcode not detected in the uploaded image.");}
        });
      };
    
    // This section fetches the detected barcode from the Nutritionix API
      const fetchNutritionalInfo = async (barcode) => {
        try {
          const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item`, 
          {
            params: {
              upc: barcode,},
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
              "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY,
            },
          });
          
          if (response.data && response.data.foods && response.data.foods.length > 0){
            setNutrients(response.data.foods[0]);} // Accept first food in response array assuming the first match is relevant
          else {
            setErrorMessage("No nutritional data found for this barcode."); // Display error if food item not found for this barcode
            setNutrients(null);} 
        } catch (error) {
          console.error("Error fetching nutritional information:", error);
          setErrorMessage("Failed to fetch nutritional data. Please upload another barcode image again.");
          setNutrients(null);
        }
      };

      useEffect(() => {
        fetchUsername();
        fetchAPIMongoDB();
      }, []);

      const handleLogout = () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("userID"); 
        setUsername("not logged in"); 
        navigate('/MainPage');
      };
    
      const handleLoginPageClick = () => {
          navigate('/login'); // Navigate to the LoginPage
      };
    
      const handleRegister = () => {
          navigate('/register'); // Navigate to the Text Search for Food Page
      };
    

    // This section handles the input and output displays for the user 
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
            <br />    
          <div className="container-row">
            <div style={{textAlign: "center", marginTop: "20px", color: "#f2f0c4" }}>
              <h1>Food Barcode Scanner</h1>
              <h3>Upload barcode image of food to search nutrients</h3>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{marginBottom:"10px"}}/>
              <br/>
              <button onClick={scanBarcode} style={{padding: "10px 20px", marginBottom:"20px"}}>
                Scan Barcode</button>
              {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
              {barcode && <p>Barcode: {barcode}</p>}
              {nutrients && (
                <div>
                  <h2>Nutritional Information</h2>
                  <table className='table_NI'>
                    <thead>
                      <tr>
                        <th className='table_th_td'>Nutrient</th>
                        <th className='table_th_td'>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='table_th_td'>Food Name</td>
                        <td className='table_th_td'>{nutrients.food_name}</td>
                      </tr>
                      <tr>
                        <td className='table_th_td'>Calories</td>
                        <td className='table_th_td'>{nutrients.nf_calories} kilocalories</td>
                      </tr>
                      <tr>
                        <td className='table_th_td'>Protein</td>
                        <td className='table_th_td'>{nutrients.nf_protein} grams</td>
                      </tr>
                      <tr>
                        <td className='table_th_td'>Fat</td>
                        <td className='table_th_td'>{nutrients.nf_total_fat} grams</td>
                      </tr>
                      <tr>
                        <td className='table_th_td'>Carbohydrates</td>
                        <td className='table_th_td'>{nutrients.nf_total_carbohydrate} grams</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      );
   
}

export default BarcodePage;

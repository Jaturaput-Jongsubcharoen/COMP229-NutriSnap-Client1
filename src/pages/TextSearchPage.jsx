import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';

const TextSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [nutrients, setNutrients] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);
  const [arrayMongoDB, setArrayMongoDB] = useState([]);
  const [showMongoDBData, setShowMongoDBData] = useState(false);
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

  const fetchSavedEntries = async (foodData) => {
    console.log("Sending data to backend:", foodData);
    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
          console.error("No token found, user might not be logged in.");
          return;
      }

      // Send the foodData with userID to the backend
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(foodData), // Send foodData with userID
      });

      if (!response.ok) {
          throw new Error(`Failed to save: ${response.status}`);
      }

      console.log("Data saved successfully:", await response.json());
      
    } catch (error) {
      console.error("Error fetching saved entries:", error);
    }
  };

  const handleSearch = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID, 
        "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY,
      },
      body: JSON.stringify({ query: searchTerm }),
    };

    try {
      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const foodData = data.foods[0]; // Assuming data.foods contains the nutrient data
      setNutrients(foodData);

      // Save the data to MongoDB via the backend
      await saveToDatabase(foodData);
      // Fetch the updated list of saved entries
      fetchSavedEntries();
    } catch (error) {
      console.error("Error fetching nutrient data:", error);
    }
  };
  //-----------------------------------------------------------------------------------
  const saveToDatabase = async (foodData) => {
    try {
      //--------------------------------
      const token = localStorage.getItem("token");
      if (!token) {
          console.error("No token found, user might not be logged in.");
          return;
      }
      //--------------------------------
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //--------------------------------
          "Authorization": `Bearer ${token}`,
          //--------------------------------
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data to database: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving data to database:", error);
    }
  };
  
  // Function to save the current nutrient data to MongoDB
  const handleSave = async () => {
    if (nutrients) {
      const foodData = {
        Name: nutrients.food_name,
        Calories: nutrients.nf_calories,
        Protein: nutrients.nf_protein,
        Fat: nutrients.nf_total_fat,
        Carbohydrates: nutrients.nf_total_carbohydrate,
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foodData),
        });

        if (!response.ok) {
          throw new Error(`Failed to save data to MongoDB: ${response.status}`);
        }

        // Fetch the updated list of saved entries
        fetchSavedEntries();
      } catch (error) {
        console.error("Error saving data to MongoDB:", error);
      }
    } else {
      alert("No nutrient data to save. Please search for a food item first.");
    }
  };

  // Fetch saved entries from the database when the component loads
  useEffect(() => {
    fetchUsername();
    fetchAPIMongoDB();
    fetchSavedEntries();
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
        <div className="textsearch_barcode_container">
          <h1>Text Search for Food</h1>
          <h3>Enter the name of the food to search its nutritional content</h3>
          <input
            type="text"
            placeholder="Enter food name to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{width: "280px", padding: "10px 20px", borderRadius:"20px"}}
          />
          <button onClick={handleSearch} className="buttonstyling">Search</button>
          <button onClick={handleSave} className="buttonstyling">Save</button> {/* Jaturaput */}
          {nutrients && (
                <div>
                  <h2 className="foodname">Food Name : {nutrients.food_name}</h2>
                  <h3>Nutritional Information</h3>
                  <table className='table_NI'>
                    <thead>
                      <tr>
                        <th className='table_th_td'>Nutrient</th>
                        <th className='table_th_td'>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
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
        
          <div>
            <h4>Saved Nutrient Entries</h4>
            {savedEntries.length > 0 ? (
              <ul>
                {savedEntries.map((entry, index) => (
                  <li key={index}>
                    {entry.Name} - Calories: {entry.Calories}, Protein: {entry.Protein}g,
                    Fat: {entry.Fat}g, Carbs: {entry.Carbohydrates}g
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved entries found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TextSearchPage;
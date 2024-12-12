import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [username, setUsername] = useState("not logged in"); 
  const navigate = useNavigate();

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/getUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
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
        const token = localStorage.getItem("token");

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
    navigate('/login'); 
  };

  const handleRegister = () => {
    navigate('/register'); 
  };

  return (
    <div className="container-row top-navbar">
      <div className="container-row6">
        <div className="container-row7">
          <h4>Username: {username}</h4>
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
  );
};

export default Navbar;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import '../styles/Login.css';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Using useNavigate for routing

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_BE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();

      
      console.log("Login successful, token:", data.token); // Debugging
      console.log("UserID:", data.userID); // Debugging


      localStorage.setItem('token', data.token); // Save token to localStorage
      //------------------------------------------------------------------------------------
      localStorage.setItem('userID', data.userID); // Save userID
      //------------------------------------------------------------------------------------
      navigate('/main-page'); // Redirect to the dashboard or home page
    } else {
      const errorMessage = await response.text();
      setError(errorMessage);
    }
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
        <div className="container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
          </form>
          <div>
            <p>Don't have an account? <button onClick={() => navigate('/register')}>Register</button></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

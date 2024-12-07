import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Using useNavigate for routing

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save token to localStorage
      navigate('/main-page'); // Redirect to the dashboard or home page
    } else {
      const errorMessage = await response.text();
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
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
  );
};

export default Login;

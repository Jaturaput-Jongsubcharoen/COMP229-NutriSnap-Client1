import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo1 from '../images/logo1.png';
import '../styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Using useNavigate for routing or for redirecting from one page to other 

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      navigate('/'); // Redirect to login page after registration
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
        <div className="sukh-container">
          <h2>Welcome New User</h2>
          <form onSubmit={handleRegister}>
            <input
              className="abing-inputstyle"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="abing-inputstyle"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="abing-inputstyle"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button  type="submit">Register</button>
          </form>
          <div>
            <p>Already have an account? <button onClick={() => navigate('/')}>Login</button></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
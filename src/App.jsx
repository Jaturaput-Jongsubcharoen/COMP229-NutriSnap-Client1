import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [arrayMongoDB, setArrayMongoDB] = useState([]);

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
    } catch (error) {
        console.error("Error fetching data (API Mongo Response):", error);
    }
  };

  useEffect(() => {
      fetchAPI();
      fetchAPIMongoDB();
  }, []);


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        {
          array.map((fruit, index) => (
            <div key={index}>
              <p>{fruit}</p>
              <br></br>
            </div>
          ))
        }
        {
          arrayMongoDB &&
          arrayMongoDB.length > 0 &&
          arrayMongoDB.map((item, index) => (
            <div key={item._id || index}>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Calories:</strong> {item.Calories}</p>
              <p><strong>Protein:</strong> {item.Protein}</p>
              <p><strong>Fat:</strong> {item.Fat}</p>
              <p><strong>Carbohydrates:</strong> {item.Carbohydrates}</p>
              <br />
            </div>
          ))
        }
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

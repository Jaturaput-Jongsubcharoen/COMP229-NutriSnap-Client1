import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import logo1 from '../images/logo1.png';
import '../styles/AddItem.css';
import '../App.css';

function Add_Item() {
  const [products, setProducts] = useState([]);
  const [barcode, setBarcode] = useState(null);
  const [aiImage, setAiImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    mealType: ''
  });
  const [arrayMongoDB, setArrayMongoDB] = useState([]);
  const [showMongoDBData, setShowMongoDBData] = useState(false);

  const fetchAPIMongoDB = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token to pass as Authorization header
      if (!token) {
        console.error('No token found, user might not be logged in.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/apiMongo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setArrayMongoDB(data.items);
      setShowMongoDBData(true);
    } catch (error) {
      console.error('Error fetching data (API Mongo Response):', error);
    }
  };

  const userInput = (input) => {
    const { name, value } = input.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'barcode') {
      setBarcode(file);
    } else if (type === 'aiImage') {
      setAiImage(file);
    }
  };

  const saveToDatabase = async (foodData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BE_URL}/nutrients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(foodData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      console.log("Data saved successfully:", await response.json());
    } catch (error) {
      console.error("Error saving to backend:", error);
    }
  };

  const handleSave = async (foodData) => {
    if (foodData) {
      await saveToDatabase(foodData);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!productDetails.name.trim()) {
      alert('Please enter a name.');
      return;
    }

    const newProduct = { ...productDetails, barcode, aiImage };
    setProducts([...products, newProduct]);

    const foodData = {
      name: productDetails.name,
      calories: productDetails.calories,
      protein: productDetails.protein,
      fat: productDetails.fat,
      carbohydrates: productDetails.carbohydrates,
      mealType: productDetails.mealType,
    };

    handleSave(foodData);

    setProductDetails({ name: '', calories: '', protein: '', carbohydrates: '', fat: '', mealType: '' });
    setAiImage(null);
    setBarcode(null);
  };

  // Fetch the API data on component mount
  useEffect(() => {
    fetchAPIMongoDB();
  }, []);

  return (
    <>
      <Navbar />

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
        <div className="decorate-main-page2">
          <div className="add-item-container">
            <h2>A D D&nbsp;&nbsp;&nbsp;&nbsp;I T E M</h2>
            <div className="add-item-form-container">
              <form onSubmit={submit}>
                <div className="product-info-container">
                  <p>Fill Product Information</p>
                  <input
                    type="text"
                    name="name"
                    size={40}
                    value={productDetails.name}
                    onChange={userInput}
                    placeholder="Product Name"
                    required
                    className="product-name-input"
                  />
                  <input
                    type="number"
                    name="calories"
                    value={productDetails.calories}
                    onChange={userInput}
                    placeholder="Calories"
                    className="calories-input"
                  />
                  <input
                    type="number"
                    name="protein"
                    value={productDetails.protein}
                    onChange={userInput}
                    placeholder="Protein (g)"
                    className="protein-input"
                  />
                  <input
                    type="number"
                    name="carbohydrates"
                    value={productDetails.carbohydrates}
                    onChange={userInput}
                    placeholder="Carbohydrates (g)"
                    className="carbohydrates-input"
                  />
                  <input
                    type="number"
                    name="fat"
                    value={productDetails.fat}
                    onChange={userInput}
                    placeholder="Fat (g)"
                    className="fat-input"
                  />
                  <label className="meal-type-label">Meal Type:</label>
                  <select
                    name="mealType"
                    value={productDetails.mealType}
                    onChange={userInput}
                    required
                    className="meal-type-select"
                  >
                    <option value="" disabled>
                      Select Meal Type
                    </option>
                    <option value="Snacks">Snacks</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
                <div className="upload-container">
                  <label className="upload-label">Upload Barcode:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'barcode')}
                    className="barcode-upload"
                  />
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>

              <h3>History</h3>
              <div>
                {products.length === 0 ? (
                  <p>No products added yet.</p>
                ) : (
                  products.map((product, index) => (
                    <div key={index} className="product-history-item">
                      <h4>{product.name}</h4>
                      <p>Calories: {product.calories}</p>
                      <p>Protein: {product.protein}g</p>
                      <p>Carbohydrates: {product.carbohydrates}g</p>
                      <p>Fat: {product.fat}g</p>
                      <p>Meal Type: {product.mealType}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Add_Item;
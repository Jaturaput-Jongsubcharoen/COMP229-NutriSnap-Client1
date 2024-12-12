import React, { useState } from 'react';
import '../styles/AddItem.css';

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
    console.log("Sending data to backend:", foodData); // Debugging
    try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, user might not be logged in.");
            return;
        }

        // Decode the token to extract the userID
        /*
        const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT token to extract payload
        const userID = decodedToken.userID;  // Extract the userID from decoded token
        
        if (!userID) {
            console.error("User ID not found in the token.");
            return;
        }
        */
        // Add userID to the food data
        //const foodDataWithUserID = { ...foodData, userID };  // Merge the userID into the food data object

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
    
    console.log("Food data being sent to backend:", foodData); // Debugging

    handleSave(foodData);

    setProductDetails({ name: '', calories: '', protein: '', carbohydrates: '', fat: '', mealType: '' });
    setAiImage(null);
    setBarcode(null);
    
  };

  return (
    <div className="add-item-container">
      <h1>Add Item</h1>
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
              siz
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
            <label className="meal-type-label">
              Meal Type:
            </label>
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
            <label className="upload-label">
              Upload Barcode:
            </label>
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
  );
}

export default Add_Item;

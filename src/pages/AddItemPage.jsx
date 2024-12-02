import React, { useState } from 'react';
import '../styles/AddItem.css'; 

function Add_Item() {
  const [products, serProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
  });

  const userInput = (input) => {
    const { name, value } = input.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value || '', // Default to empty string for safety
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!productDetails.name || productDetails.name.trim() === '') {
      alert('Please enter a valid product name.');
      return;
    }

    const newProduct = { ...productDetails };
    serProducts([...products, newProduct]);

    setProductDetails({
      name: '',
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
    });
  };

  return (
    <div className="add-item-container">
      <h1 className="title">Add Item</h1>
      <form onSubmit={submit} className="form">
        <p className="section-title">Product Information</p>
        <input
          type="text"
          name="name"
          value={productDetails.name}
          onChange={userInput}
          placeholder="Product Name"
          required
          className="input-field"
        />
        <input
          type="number"
          name="calories"
          value={productDetails.calories}
          onChange={userInput}
          placeholder="Calories"
          className="input-field"
        />
        <input
          type="number"
          name="protein"
          value={productDetails.protein}
          onChange={userInput}
          placeholder="Protein (g)"
          className="input-field"
        />
        <input
          type="number"
          name="carbohydrates"
          value={productDetails.carbohydrates}
          onChange={userInput}
          placeholder="Carbohydrates (g)"
          className="input-field"
        />
        <input
          type="number"
          name="fat"
          value={productDetails.fat}
          onChange={userInput}
          placeholder="Fat (g)"
          className="input-field"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      <h3 className="history-title">History</h3>
      <div className="history">
        {products.length === 0 ? (
          <p className="no-products">No products added yet.</p>
        ) : (
          products.map((product, index) => (
            <div key={index} className="product-card">
              <h4 className="product-name">{product.name}</h4>
              <p>Calories: {product.calories}</p>
              <p>Protein: {product.protein}g</p>
              <p>Carbohydrates: {product.carbohydrates}g</p>
              <p>Fat: {product.fat}g</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Add_Item;

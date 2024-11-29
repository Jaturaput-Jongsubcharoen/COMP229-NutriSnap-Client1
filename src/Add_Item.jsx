import React, { useState } from 'react';

function Add_Item() {

  const [products, serProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: ''
  });
  const [barcode, setBarcode] = useState(null);
  const [aiImage, setAiImage] = useState(null);

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

  const submit = (event) => {
    event.preventDefault();
    if (productDetails.name.trim() === '') {
      alert('Please enter a name.');
      return;
    }
    const newProduct = { ...productDetails, barcode, aiImage };
    serProducts([...products, newProduct]);
    setProductDetails({ name: '', calories: '', protein: '', carbohydrates: '', fat: '' });
    setAiImage(null);
    setBarcode(null);
  };

  return (
    <div>
      <div>
        <h1>Add Item</h1>
        <form onSubmit={submit}>
          <div>
            <p>Product Information</p>
            <input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={userInput}
              placeholder="Product Name"
              required
            />
            <input
              type="number"
              name="calories"
              value={productDetails.calories}
              onChange={userInput}
              placeholder="Calories"
            />
            <input
              type="number"
              name="protein"
              value={productDetails.protein}
              onChange={userInput}
              placeholder="Protein (g)"
            />
            <input
              type="number"
              name="carbohydrates"
              value={productDetails.carbohydrates}
              onChange={userInput}
              placeholder="Carbohydrates (g)"
            />
            <input
              type="number"
              name="fat"
              value={productDetails.fat}
              onChange={userInput}
              placeholder="Fat (g)"
            />
          </div>
          <div>
            <label>
              Upload Barcode:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'barcode')}
              />
            </label>
            <label>
              Upload Image for AI:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'aiImage')}
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>

        <h3>History</h3>
        <div>
          {products.length === 0 ? (
            <p>No products added yet.</p>
          ) : (
            products.map((product, index) => (
              <div key={index}>
                <h4>{product.name}</h4>
                <p>Calories: {product.calories}</p>
                <p>Protein: {product.protein}g</p>
                <p>Carbohydrates: {product.carbohydrates}g</p>
                <p>Fat: {product.fat}g</p>
                <p>Barcode uploaded: {product.barcode ? 'Yes' : 'No'}</p>
                <p>AI Image uploaded: {product.aiImage ? 'Yes' : 'No'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Add_Item;

import React, { useState, useEffect } from 'react';

const History = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    Calories: '',
    Protein: '',
    Fat: '',
    Carbohydrates: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3000'; // Update with your backend URL

  // Fetch data from the server
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/get-nutrition`);
      const result = await response.json();
      setData(result);
      setError('');
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/add-nutrition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          Calories: '',
          Protein: '',
          Fat: '',
          Carbohydrates: '',
        });
        fetchData(); // Refresh the data
        setError('');
      } else {
        setError('Failed to add data. Please try again.');
      }
    } catch (err) {
      setError('Failed to add data. Please try again.');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Nutrition Data</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Data */}
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Calories</th>
            <th>Protein</th>
            <th>Fat</th>
            <th>Carbohydrates</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Calories}</td>
              <td>{item.Protein}</td>
              <td>{item.Fat}</td>
              <td>{item.Carbohydrates}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Data Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <h2>Add Nutrition Data</h2>
        <label>
          Calories:
          <input
            type="number"
            name="Calories"
            value={formData.Calories}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Protein:
          <input
            type="number"
            name="Protein"
            value={formData.Protein}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Fat:
          <input
            type="number"
            name="Fat"
            value={formData.Fat}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Carbohydrates:
          <input
            type="number"
            name="Carbohydrates"
            value={formData.Carbohydrates}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};

export default History;
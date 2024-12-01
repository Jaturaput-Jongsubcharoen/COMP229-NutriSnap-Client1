import React, { useState } from 'react';

function AddItemPage() {
    // State variables for item fields
    const [itemName, setItemName] = useState('');
    const [itemCalories, setItemCalories] = useState('');
    const [itemProtein, setItemProtein] = useState('');
    const [itemFat, setItemFat] = useState('');
    const [itemCarbohydrates, setItemCarbohydrates] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            name: itemName,
            calories: itemCalories,
            protein: itemProtein,
            fat: itemFat,
            carbohydrates: itemCarbohydrates,
        };

        console.log('New Item:', newItem);

        // Optionally clear the form after submission
        setItemName('');
        setItemCalories('');
        setItemProtein('');
        setItemFat('');
        setItemCarbohydrates('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Add Item</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                        style={{ padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="calories">Calories: </label>
                    <input
                        type="number"
                        id="calories"
                        value={itemCalories}
                        onChange={(e) => setItemCalories(e.target.value)}
                        required
                        style={{ padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="protein">Protein: </label>
                    <input
                        type="number"
                        id="protein"
                        value={itemProtein}
                        onChange={(e) => setItemProtein(e.target.value)}
                        required
                        style={{ padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="fat">Fat: </label>
                    <input
                        type="number"
                        id="fat"
                        value={itemFat}
                        onChange={(e) => setItemFat(e.target.value)}
                        required
                        style={{ padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="carbohydrates">Carbohydrates: </label>
                    <input
                        type="number"
                        id="carbohydrates"
                        value={itemCarbohydrates}
                        onChange={(e) => setItemCarbohydrates(e.target.value)}
                        required
                        style={{ padding: '5px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
                    Add Item
                </button>
            </form>
        </div>
    );
}

export default AddItemPage;
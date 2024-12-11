import React, { useState } from 'react';
import axios from 'axios';
import Quagga from 'quagga';

function BarcodePage() {
    const [barcode, setBarcode] = useState("");
    //const [result, setResult] = useState(null);
    const [image, setImage] = useState(null);
    const [nutrients, setNutrients] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // This section handles the image uploading part
    const handleImageUpload = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
      };
    
    // This section handles image recognition to barcode value using Quagga
      const scanBarcode = () => {
        if(!image){
          setErrorMessage("Please upload an image of a barcode first.");
          return;
        }
    
    // This section handles the decoding of barcode image to barcode value.
        Quagga.decodeSingle({
          src: image,
          numOfWorkers: 0,  // Needs to be 0 when used within Node.js
          inputStream: {
            size: 800  // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers: ["ean_reader", "upc_reader"],}, // List of active readers for two barcode types
        }, 
        (result) => {
          if (result && result.codeResult) {
            setBarcode(result.codeResult.code);
            fetchNutritionalInfo(result.codeResult.code);
            setErrorMessage(""); //Clears previous errors displayed.
          } else {setErrorMessage("Barcode not detected in the uploaded image.");}
        });
      };
    
    // This section fetches the detected barcode from the Nutritionix API
      const fetchNutritionalInfo = async (barcode) => {
        try {
          const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item`, 
          {
            params: {
              upc: barcode,},
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
              "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY,
            },
          });
          
          if (response.data && response.data.foods && response.data.foods.length > 0){
            setNutrients(response.data.foods[0]);} // Accept first food in response array assuming the first match is relevant
          else {
            setErrorMessage("No nutritional data found for this barcode."); // Display error if food item not found for this barcode
            setNutrients(null);} 
        } catch (error) {
          console.error("Error fetching nutritional information:", error);
          setErrorMessage("Failed to fetch nutritional data. Please upload another barcode image again.");
          setNutrients(null);
        }
      };

    // This section handles the input and output displays for the user 
    return (
        <div style={{textAlign: "center", marginTop: "20px", color: "#f2f0c4" }}>
          <h1>Food Barcode Scanner</h1>
          <h3>Upload barcode image of food to search nutrients</h3>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{marginBottom:"10px"}}/>
          <br/>
          <button onClick={scanBarcode} style={{padding: "10px 20px", marginBottom:"20px"}}>
            Scan Barcode</button>
          {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
          {barcode && <p>Barcode: {barcode}</p>}
          {nutrients && (
            <div>
              <h2>Nutritional Information</h2>
              <table className='table_NI'>
                <thead>
                  <tr>
                    <th className='table_th_td'>Nutrient</th>
                    <th className='table_th_td'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='table_th_td'>Food Name</td>
                    <td className='table_th_td'>{nutrients.food_name}</td>
                  </tr>
                  <tr>
                    <td className='table_th_td'>Calories</td>
                    <td className='table_th_td'>{nutrients.nf_calories} kilocalories</td>
                  </tr>
                  <tr>
                    <td className='table_th_td'>Protein</td>
                    <td className='table_th_td'>{nutrients.nf_protein} grams</td>
                  </tr>
                  <tr>
                    <td className='table_th_td'>Fat</td>
                    <td className='table_th_td'>{nutrients.nf_total_fat} grams</td>
                  </tr>
                  <tr>
                    <td className='table_th_td'>Carbohydrates</td>
                    <td className='table_th_td'>{nutrients.nf_total_carbohydrate} grams</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
   
}

export default BarcodePage;

import React, { useState } from 'react';
//import axios from 'axios';
//import Quagga from 'quagga';

function BarcodePage() {
    const [barcode, setBarcode] = useState('');
    const [result, setResult] = useState(null);
    const [image, setImage] = useState(null);
    const [nutrients, setNutrients] = useState(null);

    const handleImageUpload = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
      };
    
      const scanBarcode = () => {
        Quagga.decodeSingle({
          src: image,
          numOfWorkers: 0,  // Needs to be 0 when used within node
          inputStream: {
            size: 800  // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers: ["ean_reader"]  // List of active readers
          },
        }, (result) => {
          if (result && result.codeResult) {
            setBarcode(result.codeResult.code);
            fetchNutritionalInfo(result.codeResult.code);
          } else {
            console.log("Barcode not detected");
          }
        });
      };

      const fetchNutritionalInfo = async (barcode) => {
        try {
          const response = await axios.get('https://api.nutritionix.com/v2/search/item', {
            params: {
              upc: barcode,
              appId: import.meta.env.VITE_NUTRITIONIX_APP_ID,
              appKey: import.meta.env.VITE_NUTRITIONIX_API_KEY,
            },
          });
          setNutrients(response.data);
        } catch (error) {
          console.error("Error fetching nutritional information:", error);
        }
      };

    // Handle barcode submission
    const handleScan = (e) => {
        e.preventDefault();
        if (barcode) {
            setResult(`Scanned result for barcode: ${barcode}`);
            setBarcode(''); 
        } else {
            setResult('Please enter a barcode!');
        }
    };

    return (
        <div>
          <h1>Barcode Scanner</h1>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <button onClick={scanBarcode}>Scan Barcode</button>
          {barcode && <p>Barcode: {barcode}</p>}
          {nutrients && (
            <div>
              <h2>Nutritional Information</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nutrient</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(nutrients).map((key) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{nutrients[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    /*return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Barcode Page</h1>
            <p>Scan or enter a barcode below:</p>
            
            <form onSubmit={handleScan} style={{ margin: '20px auto', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Enter barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        marginBottom: '10px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Scan Barcode
                </button>
            </form>

            {result && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        display: 'inline-block',
                    }}
                >
                    <p>{result}</p>
                </div>
            )}
        </div>
    );*/
}

export default BarcodePage;

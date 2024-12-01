import React, { useState } from 'react';

function BarcodePage() {
    const [barcode, setBarcode] = useState('');
    const [result, setResult] = useState(null); 

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
    );
}

export default BarcodePage;

import React from 'react';
import logo1 from '../images/logo1.png';

function MainPage({ array, arrayMongoDB, showMongoDBData, fetchAPIMongoDB }) {
  return (
    <div>
        <div className="container-row">
            <div>
                <img src={logo1} className="logo" alt="Custom Logo 1" />
            </div>
        </div>
        <br/>

        <div className="container-row">
            <h1>Main Page: Welcome to "Nutri Kcal"</h1>
            
        </div>
        <hr></hr>
        <br/>
        
        <div className="container-row">
            <h2>First, This data is coming from a 'Hardcoded data' defined in the server.js file</h2>
        </div>  
        <br/>

        <div className="container-row">
            <div className="container-column">
                {array.map((fruit, index) => (
                <div key={index}>
                    <p>{fruit}</p>
                </div>
                ))}
            </div>
        </div>
        
        <div className="container-row">
            <h2>Second, Please click the button. These data will come from MongoDB</h2>
        </div>
        <br/>

        <div className="container-row">
            <div className="container-column">
            <button onClick={fetchAPIMongoDB}>Fetch MongoDB Data</button>
            
            {showMongoDBData && arrayMongoDB && arrayMongoDB.length > 0 && arrayMongoDB.map((item, index) => (
                <div key={item._id || index}>
                    <p>
                        <strong>Name:</strong> {item.name}
                    </p>
                    <p>
                        <strong>Calories:</strong> {item.Calories}
                    </p>
                    <p>
                        <strong>Protein:</strong> {item.Protein}
                    </p>
                    <p>
                        <strong>Fat:</strong> {item.Fat}
                    </p>
                    <p>
                        <strong>Carbohydrates:</strong> {item.Carbohydrates}
                    </p>
                    <br/>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
}

export default MainPage;
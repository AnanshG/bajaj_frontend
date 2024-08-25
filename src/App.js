import React, { useState } from 'react';
import Select from 'react-select';

import './App.css'

const App = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate JSON
        let parsedData;
        try {
            parsedData = JSON.parse(jsonInput);
        } catch (err) {
            setError('Invalid JSON format.');
            return;
        }

        // Ensure the JSON has the "data" key
        if (!parsedData.data) {
            setError('JSON must contain a "data" key.');
            return;
        }

        console.log(parsedData)
        // Make API call to the backend
        try {
            const response = await fetch('http://localhost:5000/bfhl', {
              method : "POST",
              body : JSON.stringify({ data: parsedData.data }),
              headers : {
                "Content-Type" : "application/json"
              }
            });
            
            const data1 = await response.json()
            setResponseData(data1);
        } catch (err) {
            setError('Error calling the API. Please try again.');
        }
    };

    // Options for the dropdown
    const options = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
    ];

    const handleSelectChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    return (
        <div className='App'>
            <h2>API Input</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Enter your JSON here...'
                    rows="5"
                    cols="50"
                />
                <br />
                <button className="submit" type="submit">Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>

            {responseData && (
                <>  
                    <h2>Multi Filter</h2>
                    <Select className = "select"
                        isMulti
                        options={options}
                        onChange={handleSelectChange}
                    />
                    <div>
                        {selectedOptions.map(option => (
                            <div key={option.value}>
                                <h2>{option.label}</h2>
                                {Array.isArray(responseData[option.value]) ? (
                        <p>{responseData[option.value].join(', ')}</p> // Join the array items with a comma
                    ) : (
                        <p>{JSON.stringify(responseData[option.value], null, 2)}</p>
                    )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;

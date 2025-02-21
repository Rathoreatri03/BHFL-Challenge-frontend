import React, { useState } from 'react';
import Select from 'react-select';
import './styles.css';  // Import the CSS file

const API_URL = 'https://bhfl-challenge.vercel.app/bfhl'; // Replace with your deployed backend URL

export default function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest alphabet' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonInput);

      // Validate data structure
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Invalid input format. Expected {"data": [...]}');
      }

      // Make API call
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonInput
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const selectedFields = selectedOptions.map(option => option.value);
    const filteredResponse = {};

    selectedFields.forEach(field => {
      if (response[field] !== undefined) {
        filteredResponse[field] = response[field];
      }
    });

    return (
        <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto">
        {JSON.stringify(filteredResponse, null, 2)}
      </pre>
    );
  };

  return (
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
          <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Enter JSON (e.g., {"data": ["A","1","B","2"]})'
              className="w-full h-32 p-2 border rounded"
          />
          </div>
          <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {error && (
            <div className="mt-4 p-2 text-red-500 bg-red-100 rounded">
              {error}
            </div>
        )}

        {response && (
            <div className="mt-4 space-y-4">
              <Select
                  isMulti
                  options={options}
                  value={selectedOptions}
                  onChange={setSelectedOptions}
                  placeholder="Select fields to display..."
                  className="basic-multi-select"
              />
              {renderFilteredResponse()}
            </div>
        )}
      </div>
  );
}
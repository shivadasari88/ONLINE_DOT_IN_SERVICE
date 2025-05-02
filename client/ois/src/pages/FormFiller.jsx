import React, { useState } from 'react';
import axios from 'axios';

const FormFiller = () => {
    const [url, setUrl] = useState('');
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await axios.post('/api/profile/fill-form', { url });
        setFields(response.data.fields || []);
      } catch (error) {
        console.error('Error scanning form:', error);
        alert('Failed to scan the form. See console for details.');
      }
      setLoading(false);
    };
  
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <h1>OIS Form Scanner</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter form page URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '300px', padding: '8px', marginRight: '10px' }}
            required
          />
          <button type="submit" style={{ padding: '8px 16px' }}>
            {loading ? 'Scanning...' : 'Scan Form'}
          </button>
        </form>
  
        <div>
          <h2>Detected Form Fields:</h2>
          {fields.length > 0 ? (
            <ul>
              {fields.map((field, index) => (
                <li key={index}>
                  <strong>{field.label || field.placeholder || field.name || field.id}</strong>  
                  <small> ({field.tagName.toLowerCase()}{field.type ? ` - ${field.type}` : ''})</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No fields detected yet.</p>
          )}
        </div>
      </div>
    );
};

export default FormFiller;

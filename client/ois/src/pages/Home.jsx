import React from 'react';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-container">

      <div className="hero-section">
        <h1>One Click. One Service. Get Your Work Done.</h1>
        <p>Experience seamless automation for applications like scholarships, bus passes, and more.</p>
        <div className="input-container">
          <input 
            type="text" 
            placeholder="Enter your Aadhaar / Application ID"
          />
          <input 
            type="text" 
            placeholder="Search for service"
          />
        </div>
      </div>

      <div className="categories-container">
        <div className="category-card">
          <img src="https://via.placeholder.com/100" alt="Scholarship" />
          <h2>Scholarship Application</h2>
          <p>Automate Postmatric Scholarship Form</p>
          <p className="discount">Upto 100% Automation</p>
        </div>
        <div className="category-card">
          <img src="https://via.placeholder.com/100" alt="Bus Pass" />
          <h2>Bus Pass Automation</h2>
          <p>Get Bus Pass in One Click</p>
          <p className="discount">No Manual Entries</p>
        </div>
        <div className="category-card">
          <img src="https://via.placeholder.com/100" alt="Job Applications" />
          <h2>Job Application</h2>
          <p>Submit Forms Automatically</p>
          <p className="discount">Time Saving 90%</p>
        </div>
        <div className="category-card">
          <img src="https://via.placeholder.com/100" alt="Document Extraction" />
          <h2>Documents to Data</h2>
          <p>Extract Details from Documents</p>
          <p className="discount">OCR Enabled</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import './HomePage.css';
import img1 from "./assets/1.png";
import img2 from "./assets/2.png";
import img3 from "./assets/3.png";
import img4 from "./assets/4.png";


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
          <img src={img1} alt="Scholarship" />
        </div>
        <div className="category-card">
          <img src={img2}alt="Bus Pass" />
        </div>
        <div className="category-card">
          <img src={img3} alt="Job Applications" />
        </div>
        <div className="category-card">
          <img src={img4} alt="Document Extraction" />
        </div>
      </div>
    </div>
  );
}

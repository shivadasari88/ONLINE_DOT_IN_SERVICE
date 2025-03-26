import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/form-check.png";
import About from "./About";
import Work from "./Work";
import Testimonial from "./Testimonial";
import Contact from "./Contact";
import { FiArrowRight } from "react-icons/fi";


const Home = () => {
  return (
    <div className="home-container">

      {/* ✅ Hero Section */}
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Background" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
          Apply for Government Services with Just One Click!
          </h1>
          <p className="primary-text">
          O.IS simplifies online applications for scholarships, bus passes, and 
        other government services. No more manual form filling—let automation 
        handle it for you.
          </p>
          <button className="secondary-button">
          Get Started <FiArrowRight />
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="Banner" />
        </div>
      </div>

      {/* ✅ Other Sections Moved Here */}
      <About />
      <Work />
      <Testimonial />
      <Contact />

    </div>
  );
};

export default Home;

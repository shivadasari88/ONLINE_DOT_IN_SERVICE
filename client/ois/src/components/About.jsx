import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/cloud-computing-security-abstract-concept-illustration.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About O.IS</p>
        <h1 className="primary-heading">
        Simplifying Online Applications for Everyone        </h1>
        <p className="primary-text">
        O.IS (Online. In Service) is your one-stop solution for automating government 
      applications. Whether it's scholarships, bus passes, or other essential services, 
      we streamline the process for you.
       </p>
        <p className="primary-text">
        Our intelligent system extracts and fills out forms automatically, reducing 
        errors and saving you valuable time.</p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;

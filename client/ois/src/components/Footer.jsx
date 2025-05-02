import React from "react";
import { Link } from 'react-router-dom';

//import Logo from "../Assets/Logo.svg";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container">
          {
           // <img src={Logo} alt="" />
          }
          <h1>O.IS</h1>
        </div>
        <div className="footer-icons">
          <a
        href="https://www.linkedin.com/company/online-dot-in-service"
        target="_blank"
        rel="noopener noreferrer"
        className="linkedin-icon"
      >
        <SiLinkedin />
      </a>
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Qualtiy</span>
          <span>Help</span>
          <span>Share</span>
          <span>Carrers</span>
          <span>Testimonials</span>
          <span>Work</span>
        </div>
        <div className="footer-section-columns">
          <span>  <a href="mailto:o.is.ceoandfdr@gmail.com">o.is.ceoandfdr@gmail.com</a>
          </span>
        </div>
        <div className="footer-section-columns">
          <span>Terms & Conditions</span>
          <Link to="/notefile">Privacy Policy</Link>
          </div>
      </div>
    </div>
  );
};

export default Footer;

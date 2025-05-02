import React from "react";

const PrivacyPolicy = () => {
    return (
      <div className="privacy-container">
        <h1>📜 O.IS Privacy Policy & User Guidelines</h1>
  
        <section>
          <h2>🔒 Privacy Policy</h2>
          <h3>1. Data Collection & Usage</h3>
          <p>
            We collect the following types of data to provide seamless automation and support services:
            <ul>
              <li>Personal details: Name, date of birth, phone number, Aadhaar, educational documents, etc.</li>
              <li>Application-specific information (scholarships, exams, ID cards, etc.)</li>
              <li>Uploaded documents for verification and form-filling automation.</li>
            </ul>
            Your data is stored securely and used only for the purpose of fulfilling your requested services.
          </p>
  
          <h3>2. Data Sharing</h3>
          <p>We do not sell or share your personal information with third-party marketing platforms. Data is only shared with government portals or services as part of the automation process, strictly based on your actions and approvals.</p>
  
          <h3>3. Data Security</h3>
          <p>All sensitive data is encrypted in storage. Access is limited to authorized personnel and automation tools within our system. We comply with data protection best practices.</p>
        </section>
  
        <section>
          <h2>⚙️ Automation Disclaimer & CAPTCHA Consent</h2>
          <p>O.IS offers automation services to simplify and accelerate form submissions. This includes auto-filling forms, uploading documents, and CAPTCHA automation (when explicitly consented).</p>
          <ul>
            <li>This is done strictly for user convenience.</li>
            <li>The intention is to assist, not bypass or misuse any system.</li>
            <li>We do not automate any system that prohibits such activity in its Terms of Use.</li>
          </ul>
          <p>By agreeing, you confirm that you allow O.IS to act on your behalf solely for completing the application process.</p>
        </section>
  
        <section>
          <h2>📘 User Guidelines</h2>
          <h3>✅ What You Can Expect:</h3>
          <ul>
            <li>Secure storage of your personal profile.</li>
            <li>Fast, accurate form automation for eligible services.</li>
            <li>Guidance tailored to your documents and profile.</li>
          </ul>
  
          <h3>🚫 What You Should Avoid:</h3>
          <ul>
            <li>Submitting false or forged documents.</li>
            <li>Using O.IS for illegal or misleading purposes.</li>
            <li>Sharing your account or credentials with others.</li>
          </ul>
  
          <h3>🛡️ User Responsibility:</h3>
          <p>You are solely responsible for the authenticity of the data you provide. Misuse of the platform may result in suspension of your access.</p>
  
          <h3>🤝 Your Consent:</h3>
          <p>By using O.IS, you consent to our policies and grant permission to act on your behalf for automation purposes.</p>
        </section>
      </div>
    );
  };

export default PrivacyPolicy;

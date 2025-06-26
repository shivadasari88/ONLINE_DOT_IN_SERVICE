import React from "react";
import { FaLock, FaCogs, FaBook, FaCheck, FaBan, FaShieldAlt, FaHandshake } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4">
              <h1 className="text-2xl font-bold flex items-center">
                <FaLock className="mr-2" />
                O.IS Privacy Policy & User Guidelines
              </h1>
              <p className="text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="p-6 space-y-8">
              {/* Privacy Policy Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <FaLock className="mr-2 text-gray-700" />
                  Privacy Policy
                </h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">1. Data Collection & Usage</h3>
                  <p className="text-gray-600">
                    We collect the following types of data to provide seamless automation and support services:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Personal details: Name, date of birth, phone number, Aadhaar, educational documents, etc.</li>
                    <li>Application-specific information (scholarships, exams, ID cards, etc.)</li>
                    <li>Uploaded documents for verification and form-filling automation.</li>
                  </ul>
                  <p className="text-gray-600">
                    Your data is stored securely and used only for the purpose of fulfilling your requested services.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">2. Data Sharing</h3>
                  <p className="text-gray-600">
                    We do not sell or share your personal information with third-party marketing platforms. Data is only shared with government portals or services as part of the automation process, strictly based on your actions and approvals.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">3. Data Security</h3>
                  <p className="text-gray-600">
                    All sensitive data is encrypted in storage. Access is limited to authorized personnel and automation tools within our system. We comply with data protection best practices.
                  </p>
                </div>
              </section>

              {/* Automation Disclaimer Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <FaCogs className="mr-2 text-gray-700" />
                  Automation Disclaimer & CAPTCHA Consent
                </h2>
                
                <p className="text-gray-600">
                  O.IS offers automation services to simplify and accelerate form submissions. This includes auto-filling forms, uploading documents, and CAPTCHA automation (when explicitly consented).
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>This is done strictly for user convenience.</li>
                  <li>The intention is to assist, not bypass or misuse any system.</li>
                  <li>We do not automate any system that prohibits such activity in its Terms of Use.</li>
                </ul>
                <p className="text-gray-600">
                  By agreeing, you confirm that you allow O.IS to act on your behalf solely for completing the application process.
                </p>
              </section>

              {/* User Guidelines Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <FaBook className="mr-2 text-gray-700" />
                  User Guidelines
                </h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    What You Can Expect:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Secure storage of your personal profile.</li>
                    <li>Fast, accurate form automation for eligible services.</li>
                    <li>Guidance tailored to your documents and profile.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <FaBan className="mr-2 text-red-500" />
                    What You Should Avoid:
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Submitting false or forged documents.</li>
                    <li>Using O.IS for illegal or misleading purposes.</li>
                    <li>Sharing your account or credentials with others.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <FaShieldAlt className="mr-2 text-blue-500" />
                    User Responsibility:
                  </h3>
                  <p className="text-gray-600">
                    You are solely responsible for the authenticity of the data you provide. Misuse of the platform may result in suspension of your access.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <FaHandshake className="mr-2 text-orange-500" />
                    Your Consent:
                  </h3>
                  <p className="text-gray-600">
                    By using O.IS, you consent to our policies and grant permission to act on your behalf for automation purposes.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    );
};

export default PrivacyPolicy;
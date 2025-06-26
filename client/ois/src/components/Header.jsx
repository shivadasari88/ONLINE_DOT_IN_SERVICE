import React from 'react';
import { FiArrowRight, FiUpload, FiCheckCircle, FiAward, FiUserCheck, FiShield } from 'react-icons/fi';
import { FaBus, FaUserGraduate, FaClock, FaRupeeSign, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-scroll';
import {assets} from '../Assets/assets'
import { useNavigate } from 'react-router-dom';



const Header = () => {

  // Inside your component:
const navigate = useNavigate();

const handleApplyNow = () => {
  navigate('/login'); // Navigates to login page
};
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center mt-20 px-4 text-center">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 z-10">
              <h2 className="text-lg font-semibold text-orange-500 mb-4">Hyderabad Student BusPass</h2>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Just one click busPass service <br />for College & School Students
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                O.IS automates your Hyderabad city bus pass application with AI. 
                No more manual forms - let it done by AI.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={handleApplyNow}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Apply Now <FiArrowRight className="ml-2" />
                </button>
                <Link 
                  to="how-it-works" 
                  smooth={true} 
                  duration={500}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  How It Works
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2 relative">
              <div className="relative z-10">
                <img 
                  src={assets.bus_pass}
                  alt="Student with bus pass" 
                  className="rounded-lg shadow-xl w-full max-w-lg mx-auto"
                />
              </div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-100 rounded-full opacity-20"></div>
              <div className="absolute -right-20 bottom-0 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Use Our Smart Bus Pass Service?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaClock className="h-8 w-8 text-orange-500" />,
                title: "90% Time Saved",
                description: "Complete applications in seconds instead of minutes"
              },
              {
                icon: <FiShield className="h-8 w-8 text-orange-500" />,
                title: "Error-Free Applications",
                description: "AI verifies all details before submission"
              },
              {
                icon: <FaRupeeSign className="h-8 w-8 text-orange-500" />,
                title: "Zero Service Charges",
                description: "Free for students - pay only government fees"
              },
              {
                icon: <FaBus className="h-8 w-8 text-orange-500" />,
                title: "Hyderabad City Focus",
                description: "Optimized specifically for TSRTC requirements"
              },
              {
                icon: <FaUserGraduate className="h-8 w-8 text-orange-500" />,
                title: "Easy Apply",
                description: "Simple process designed for college & school students"
              },
              {
                icon: <FaChartLine className="h-8 w-8 text-orange-500" />,
                title: "Higher Approval Rate",
                description: "Properly filled applications get approved faster"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-orange-50 mr-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 pl-12">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get your Hyderabad student bus pass in just 4 simple steps
            </p>
          </div>
          
          <div className="space-y-12 md:space-y-8">
            {[
              {
                icon: <FiUpload className="h-6 w-6 text-white" />,
                step: "1",
                title: "Upload Documents",
                description: "Upload required Documents. Our AI automates for you .",
              },
              {
                icon: <FiCheckCircle className="h-6 w-6 text-white" />,
                step: "2",
                title: "Verify Information",
                description: "Review the automatically filling details. Make corrections if needed.",
                note: "98% accuracy rate"
              },
              {
                icon: <FaBus className="h-6 w-6 text-white" />,
                step: "3",
                title: "Select Pass service",
                description: "Choose your busPass and service from Hyderabad city options.",
                routes: ["College ", "School"]
              },
              {
                icon: <FiUserCheck className="h-6 w-6 text-white" />,
                step: "4",
                title: "Submit & Track",
                description: "One-click submission. Track application status in your historyPage.",
                tracking: ["Real-time Updates", "Approval Notifications"]
              }
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row items-center">
                {/* Step circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mx-auto md:mx-0 z-10 mb-4 md:mb-0">
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="md:ml-8 text-center md:text-left flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 mt-2">{step.description}</p>
                  
                  {step.documents && (
                    <div className="mt-3">
                      <span className="text-xs font-medium text-gray-500">REQUIRED DOCUMENTS:</span>
                      <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
                        {step.documents.map((doc, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.note && (
                    <p className="text-sm text-orange-500 mt-2">{step.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Your Bus Pass?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join in cummunity of Hyderabad students who save's Time and Money every year with our automated bus pass service
          </p>
          <button 
          onClick={handleApplyNow}

          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition-colors">
            Start Application <FiArrowRight className="ml-2" />
          </button>
          <p className="mt-4 text-gray-400 text-sm">
            <FiShield className="inline mr-1" /> single step service by Online Dot In Service
          </p>
        </div>
      </section>
    </div>
  );
};

export default Header;
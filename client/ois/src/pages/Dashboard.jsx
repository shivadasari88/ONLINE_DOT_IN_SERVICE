import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { AiOutlineFileSearch, AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineSafety } from 'react-icons/ai';
import { FiLogOut, FiHelpCircle, FiBookOpen } from 'react-icons/fi';
import {  FiMail } from 'react-icons/fi';


export default function Dashboard() {
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();

    const handleUpdateProfile = () => navigate('/updateprofile');
    const handleAutoFill = () => navigate('/formfiller');
    const handleServicesPage = () => navigate('/services')
    const handleProfilePage = () => navigate('/profilepage')

  const handleContactSupport = () => {
    window.location.href = 'mailto:info@onlinedotinservice.com';
    // Alternatively for copying to clipboard:
    // navigator.clipboard.writeText('dasarishivasai71@gmail.com');
    // toast.success('Email copied to clipboard!');
  };

    return (
        <section className="flex flex-col items-center mt-20 px-4 text-center 
    text-gray-800">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    {!!userData && (
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
                            Welcome back, <span className="text-primary">{userData.name}</span>
                        </h2>
                    )}
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your secure portal for streamlined applications and services.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                                    <AiOutlineCheckCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Profile</h3>
                                    <p className="text-gray-600 mb-4">
                                        Keep your information current for seamless form completion.
                                    </p>
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Form Filling Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-3 bg-purple-50 rounded-lg">
                                    <AiOutlineFileSearch className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Form Filling</h3>
                                    <p className="text-gray-600 mb-4">
                                        Let our AI handle the paperwork for you automatically.
                                    </p>
                                    <button
                                        onClick={handleAutoFill}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                    >
                                        Auto-Fill Forms
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Card (Full Width) */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <AiOutlineSafety className="h-5 w-5 text-gray-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Quick Services</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button onClick={handleServicesPage} className="flex items-center justify-center gap-2 text-sm font-medium h-12 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors px-4">
                                    Bus Pass Application
                                </button>
                                <button onClick={handleServicesPage} className="flex items-center justify-center gap-2 text-sm font-medium h-12 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors px-4">
                                    Scholarship Form
                                </button>
                                <button onClick={handleServicesPage} className="flex items-center justify-center gap-2 text-sm font-medium h-12 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors px-4">
                                    Exam Registration
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Documents Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-3 bg-teal-50 rounded-lg">
                                    <AiOutlineCloudUpload className="h-6 w-6 text-teal-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Documents</h3>
                                    <p className="text-gray-600 mb-4">
                                        Securely stored for automatic form population.
                                    </p>
                                    <button onClick={handleProfilePage} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6">
                                        Manage Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-3 bg-orange-50 rounded-lg">
                                    <FiHelpCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Assistance?</h3>
                                    <p className="text-gray-600 mb-4">
                                        We're here to help with any questions.
                                    </p>
                                    <div className="flex space-x-3">
                                        <button 
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-10 rounded-md px-4"
                                        >
                                            <FiBookOpen className="h-4 w-4" />
                                            FAQs
                                        </button>
                                        
                                        <button 
                                            onClick={handleContactSupport}
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                        >
                                            <FiMail className="h-4 w-4" />
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
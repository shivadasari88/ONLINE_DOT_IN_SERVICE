import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaBus, FaSchool, FaUserCheck } from 'react-icons/fa';

export default function ServicesPage() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleBusPassProfile = () => navigate('/buspassprofile');
    const handleSchoolBusPassProfile = () => navigate('/schoolbuspassprofile');

    const handleAutomateRegistration = async () => {
        try {
            const response = await axios.post('/apply', { username: user.name });
            toast.success('Application submitted successfully');
        } catch (error) {
            console.error('Error applying:', error);
            toast.error('Failed to submit application');
        }
    };

    return (
        <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold">Transportation Services</h1>
                        <p className="text-gray-300">Select your required bus pass service</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Service Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* College Bus Pass */}
                            <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-blue-50 rounded-full">
                                            <FaBus className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                        College Student Bus Pass
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-center">
                                        Monthly general pass for college students in Hyderabad
                                    </p>
                                    <button
                                        onClick={handleBusPassProfile}
                                        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>

                            {/* School Bus Pass */}
                            <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-green-50 rounded-full">
                                            <FaSchool className="h-8 w-8 text-green-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                        School Student Bus Pass
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-center">
                                        Monthly general pass for school students in Hyderabad
                                    </p>
                                    <button
                                        onClick={handleSchoolBusPassProfile}
                                        className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Registration Check (commented out but styled) */}
                        {/*
                        <div className="pt-6 border-t border-gray-200">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                                <div className="flex items-start">
                                    <FaUserCheck className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-800">Registration Status Check</h3>
                                        <p className="mt-1 text-sm text-blue-700">
                                            Verify your application status automatically
                                        </p>
                                        <button
                                            onClick={handleAutomateRegistration}
                                            className="mt-2 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500 bg-white text-blue-600 hover:bg-blue-50 h-8 rounded-md px-4"
                                        >
                                            Check Registration Status
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </section>
    );
}
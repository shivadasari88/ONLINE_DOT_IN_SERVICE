import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaQuestionCircle, FaVenusMars, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { setIsLoggedin, getUserData } = useContext(UserContext);
    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (state === 'Sign Up' && !acceptedTerms) {
            toast.error('You must accept the terms and conditions');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const endpoint = state === 'Sign Up' ? '/register' : '/login';
            const payload = state === 'Sign Up' ? { name, email, password, gender, phone } : { email, password };
            
            const { data } = await axios.post(endpoint, payload);

            if (data.success) {
                setIsLoggedin(true);
                getUserData();
                navigate('/updateprofile');
                toast.success(state === 'Sign Up' ? 'Account created successfully!' : 'Login successful!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToTerms = () => {
        navigate('/notefile');
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gray-900 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold text-center">
                        {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-300 text-center text-sm mt-1">
                        {state === 'Sign Up' ? 'Start your journey with us' : 'Login to continue'}
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    <form onSubmit={onSubmitHandler} className="space-y-5">
                        {state === 'Sign Up' && (
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaVenusMars className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>

                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                        placeholder="+1 (123) 456-7890"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {state === 'Sign Up' && (
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="focus:ring-gray-500 h-4 w-4 text-gray-900 border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">
                                        I agree to the{' '}
                                        <button 
                                            type="button" 
                                            onClick={navigateToTerms}
                                            className="text-gray-900 underline hover:text-gray-700 inline-flex items-center"
                                        >
                                            Terms and Conditions
                                            <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                                        </button>
                                    </label>
                                </div>
                            </div>
                        )}

                        {state === 'Login' && (
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate('/reset-password')}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
                                >
                                    <FaQuestionCircle className="mr-1" />
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaArrowRight className="mr-2" />
                            )}
                            {state === 'Sign Up' ? 'Create Account' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                type="button"
                                onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                                className="ml-1 font-medium text-gray-900 hover:text-gray-700"
                            >
                                {state === 'Sign Up' ? 'Login' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
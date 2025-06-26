import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const inputRefs = useRef([]);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/send-reset-otp', { email });
            if (data.success) {
                toast.success(data.message);
                setIsEmailSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to send OTP');
        }
    };

    const onSubmitOTP = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(input => input.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/reset-password', { email, otp, newPassword });
            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to reset password');
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="absolute top-6 left-6 sm:left-12">
                <div 
                    onClick={() => navigate('/')} 
                    className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                >
                    O.IS
                </div>
            </div>

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Email Form */}
                {!isEmailSent && (
                    <form onSubmit={onSubmitEmail} className="p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                            <p className="text-gray-600 mt-2">Enter your registered email address</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                )}

                {/* OTP Form */}
                {!isOtpSubmitted && isEmailSent && (
                    <form onSubmit={onSubmitOTP} className="p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
                            <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <div className="flex justify-between space-x-2" onPaste={handlePaste}>
                                    {Array(6).fill(0).map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 border border-gray-300 text-center text-xl rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                            ref={el => inputRefs.current[index] = el}
                                            onInput={(e) => handleInput(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Verify OTP
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsEmailSent(false)}
                                className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center"
                            >
                                <FiArrowLeft className="mr-1" />
                                Back to email entry
                            </button>
                        </div>
                    </form>
                )}

                {/* New Password Form */}
                {isOtpSubmitted && isEmailSent && (
                    <form onSubmit={onSubmitNewPassword} className="p-6 sm:p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
                            <p className="text-gray-600 mt-2">Enter your new secure password</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Reset Password
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOtpSubmitted(false)}
                                className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center"
                            >
                                <FiArrowLeft className="mr-1" />
                                Back to OTP entry
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default ResetPassword;
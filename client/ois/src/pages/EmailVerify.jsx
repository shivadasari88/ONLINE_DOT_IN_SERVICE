import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { assets } from '../Assets/assets'

const EmailVerify = () => {
  const { isLoggedin, userData, getUserData } = useContext(UserContext);
  const navigate = useNavigate();
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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');

      const { data } = await axios.post('verify-account', { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Verification failed');
    }
  };

  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
        >
          <FiArrowLeft className="mr-1" />
          Back to Home
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-900 text-white px-6 py-4">
          <h1 className="text-2xl font-bold flex items-center justify-center">
            <FiMail className="mr-2" />
            Email Verification
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-gray-600 text-center mb-6">
            Enter the 6-digit verification code sent to your email address.
          </p>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="flex justify-between space-x-2" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-12 border border-gray-300 text-center text-xl rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  ref={el => inputRefs.current[index] = el}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Verify Email
            </button>
          </form>

          <div className="mt-4 text-center">
            <button 
              onClick={() => navigate('/resend-otp')} 
              className="text-sm text-orange-500 hover:text-orange-700"
            >
              Didn't receive code? Resend OTP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailVerify;
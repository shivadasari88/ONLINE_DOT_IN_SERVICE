import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiLogIn, FiUser, FiHome, FiBriefcase, FiSettings, FiLogOut, FiMail } from 'react-icons/fi';

const NavbarPublic = () => {
    const navigate = useNavigate();
    const { userData, setUserData, setIsLoggedin } = useContext(UserContext);

    const sendVerificationOtp = async () => {
        try {
            const { data } = await axios.post('send-verify-otp');
            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = async () => {
        try {
            const { data } = await axios.post('/logout');
            if (data.success) {
                setIsLoggedin(false);
                setUserData(false);
                toast.success('Logged out successfully');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const menuItems = [
        { name: 'Dashboard', icon: <FiHome className="mr-2" />, action: () => navigate('/dashboard') },
        { name: 'Services', icon: <FiBriefcase className="mr-2" />, action: () => navigate('/services') },
        { name: 'Profile', icon: <FiUser className="mr-2" />, action: () => navigate('/profilepage') },
    ];

    return (
        <nav className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo */}
                <div 
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-orange-500 transition-colors"
                >
                    O.IS
                </div>

                {/* User Menu */}
                {userData ? (
                    <div className="relative group">
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                            {userData.name[0].toUpperCase()}
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-1">
                                {!userData.isAccountVerified && (
                                    <button
                                        onClick={sendVerificationOtp}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                    >
                                        <FiMail className="mr-2" />
                                        Verify Email
                                    </button>
                                )}
                                
                                {menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item.action}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                    >
                                        {item.icon}
                                        {item.name}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={logout}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                >
                                    <FiLogOut className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 border border-gray-300 rounded-md hover:border-orange-300 transition-colors"
                    >
                        <FiLogIn />
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default NavbarPublic;
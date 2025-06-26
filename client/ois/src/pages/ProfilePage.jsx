import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import { AiOutlineFileText, AiOutlineFilePdf, AiOutlineEdit, AiOutlineSave } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/profile`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // ✅ Handle Input Changes
    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section === 'memo') {
            setProfileData((prevData) => ({
                ...prevData,
                parsedMemoData: {
                    ...prevData.parsedMemoData,
                    [name]: value
                }
            }));
        } else if (section === 'bonafide') {
            setProfileData((prevData) => ({
                ...prevData,
                parsedbonofideData: {
                    ...prevData.parsedbonofideData,
                    [name]: value
                }
            }));
        }
    };

    // ✅ Save Data (PUT Request)
    const handleSave = async () => {
        try {
            setIsLoading(true);
            await axios.put(`/api/profile/`, {
                parsedMemoData: profileData.parsedMemoData,
                parsedbonofideData: profileData.parsedbonofideData
            });
            setIsEditing(false);
            // You might want to use toast instead of alert for better UX
            alert('Data updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            <div className="space-y-6 pt-8">
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold flex items-center">
                            <AiOutlineFileText className="mr-2" />
                            Your Documents
                        </h1>
                        <p className="text-gray-300">View and manage your uploaded documents</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Memo Data Section */}
                        {profileData.parsedMemoData && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <AiOutlineFilePdf className="mr-2 text-red-500" />
                                        10th Memo Certificate
                                    </h2>
                                    <button 
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                        onClick={() => {/* Add download functionality */}}
                                    >
                                        <FiDownload className="mr-1" />
                                        Download
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.keys(profileData.parsedMemoData).map((key) => (
                                        <div key={key} className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </label>
                                            <input
                                                type="text"
                                                name={key}
                                                value={profileData.parsedMemoData[key] || ''}
                                                onChange={(e) => handleChange(e, 'memo')}
                                                disabled={!isEditing}
                                                className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bonafide Data Section */}
                        {profileData.parsedbonofideData && (
                            <div className="space-y-4 pt-8">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <AiOutlineFilePdf className="mr-2 text-blue-500" />
                                        Bonafide Certificate
                                    </h2>
                                    <button 
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                        onClick={() => {/* Add download functionality */}}
                                    >
                                        <FiDownload className="mr-1" />
                                        Download
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.keys(profileData.parsedbonofideData).map((key) => (
                                        <div key={key} className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </label>
                                            <input
                                                type="text"
                                                name={key}
                                                value={profileData.parsedbonofideData[key] || ''}
                                                onChange={(e) => handleChange(e, 'bonafide')}
                                                disabled={!isEditing}
                                                className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 rounded-md px-6"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                        disabled={isLoading}
                                    >
                                        <AiOutlineSave className="mr-1" />
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                >
                                    <AiOutlineEdit className="mr-1" />
                                    Edit Data
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
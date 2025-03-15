import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({
        parsedMemoData: {},
        parsedbonofideData: {}
    });
    const [isEditing, setIsEditing] = useState(false);

    // ✅ Get Email from LocalStorage
    const email = localStorage.getItem('email');

    // ✅ Fetch Profile Data Based on User Email
    useEffect(() => {
        if (!email) return;
    
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profile/${email}`);
                setProfileData(response.data || { parsedMemoData: {}, parsedbonofideData: {} });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
    }, [email, isEditing]); // ✅ Depend on `email` and `isEditing`
    

    // ✅ Handle Input Changes
    const handleChange = (e, section) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [section]: {
                ...(prevData[section] || {}),
                [name]: value
            }
        }));
    };

    // ✅ Save Data
    const handleSave = async () => {
        try {
            const response = await axios.put(`/api/profile/${email}`, {
                parsedMemoData: profileData.parsedMemoData || {},
                parsedbonofideData: profileData.parsedbonofideData || {}
            });
    
            alert('Data updated successfully!');
            setIsEditing(false);
    
            // ✅ Update UI with the latest profile data
            setProfileData(response.data.profile || { parsedMemoData: {}, parsedbonofideData: {} });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="container">
            <h2>User Verification Data</h2>

            {/* ✅ Memo Data */}
            {profileData.parsedMemoData && (
                <div className="memo-data">
                    <h3>Memo Data</h3>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="candidateName"
                            value={profileData.parsedMemoData?.candidateName || ""}
                            onChange={(e) => handleChange(e, 'parsedMemoData')}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label>10th Hall Ticket Number:</label>
                        <input
                            type="text"
                            name="rollNumber"
                            value={profileData.parsedMemoData?.rollNumber || ""}
                            onChange={(e) => handleChange(e, 'parsedMemoData')}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label>Exam Type:</label>
                        <input
                            type="text"
                            name="examType"
                            value={profileData.parsedMemoData?.examType || ""}
                            onChange={(e) => handleChange(e, 'parsedMemoData')}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label>Date of Birth:</label>
                        <input
                            type="text"
                            name="dateOfBirth"
                            value={profileData.parsedMemoData?.dateOfBirth || ""}
                            onChange={(e) => handleChange(e, 'parsedMemoData')}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            )}

            {/* ✅ Bonafide Data */}
            {profileData.parsedbonofideData && (
                <div className="bonafide-data">
                    <h3>Bonafide Data</h3>
                    <div>
                        <label>College Name:</label>
                        <input
                            type="text"
                            name="collegeName"
                            value={profileData.parsedbonofideData?.collegeName || ""}
                            onChange={(e) => handleChange(e, 'parsedbonofideData')}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label>course and year:</label>
                        <input
                            type="text"
                            name="course"
                            value={profileData.parsedbonofideData?.course || ""}
                            onChange={(e) => handleChange(e, 'parsedbonofideData')}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label>admission or college hallticket no:</label>
                        <input
                            type="text"
                            name="hallticketNo"
                            value={profileData.parsedbonofideData?.hallticketNo || ""}
                            onChange={(e) => handleChange(e, 'parsedbonofideData')}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            )}

            {isEditing ? (
                <button onClick={handleSave}>Save</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>Edit Data</button>
            )}
        </div>
    );
};

export default ProfilePage;

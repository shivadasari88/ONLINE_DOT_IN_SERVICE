import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // ✅ Get Email from LocalStorage
    const email = localStorage.getItem('email');

    // ✅ Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profile/${email}`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
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
            await axios.put(`/api/profile/${email}`, {
                parsedMemoData: profileData.parsedMemoData,
                parsedbonofideData: profileData.parsedbonofideData
            });
            alert('Data updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="container">
            <h2>User Documents</h2>

            {profileData.parsedMemoData && (
                <div className="memo-data">
                    <h3>Memo Data</h3>
                    {Object.keys(profileData.parsedMemoData).map((key) => (
                        <div key={key}>
                            <label>{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={profileData.parsedMemoData[key]}
                                onChange={(e) => handleChange(e, 'memo')}
                                disabled={!isEditing}
                            />
                        </div>
                    ))}
                </div>
            )}

            {profileData.parsedbonofideData && (
                <div className="bonafide-data">
                    <h3>Bonafide Data</h3>
                    {Object.keys(profileData.parsedbonofideData).map((key) => (
                        <div key={key}>
                            <label>{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={profileData.parsedbonofideData[key]}
                                onChange={(e) => handleChange(e, 'bonafide')}
                                disabled={!isEditing}
                            />
                        </div>
                    ))}
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

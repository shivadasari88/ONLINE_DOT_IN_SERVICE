import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { toast } from 'react-hot-toast'

const BusPassProfile = () => {
    const [profileData, setProfileData] = useState({
        parsedMemoData: {},
        parsedbonofideData: {}
    });
    const [isEditing, setIsEditing] = useState(false);

        const { user, setUser } = useContext(UserContext);
        const navigate = useNavigate();

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

    const handleAutomateBussPassRegistration = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    console.log(`User location: ${latitude}, ${longitude}`);
    
                    try {
                        const response = await axios.post('/applyBusPass', {
                            username: user.name,
                            latitude,
                            longitude
                        });
                        toast.success('Application submitted successfully for Bus Pass');
                    } catch (error) {
                        console.error('Error applying:', error);
                        toast.error('Failed to submit application');
                    }
                },
                (err) => {
                    console.error('Geolocation error:', err.message);
                    toast.error('Failed to get location. Please enable location services.');
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
        }
    };
    

    return (
        <div className="container">

            <div>
            <button onClick={handleAutomateBussPassRegistration}>Verified</button>
            <h3>make sure everything below is filled correctly</h3>
            </div>

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
                        <select
                name="collegeName"
                value={profileData.parsedbonofideData?.collegeName || ""}
                onChange={(e) => handleChange(e, 'parsedbonofideData')}
                disabled={!isEditing}
            >
                <option value="">Select a College</option>
                <option value="St. MARTINS ENGINEERING COLLEGE">St. MARTINS ENGINEERING COLLEGE</option>
                <option value="ACE ENG.COLLGE,ANKUSHPUR---T3246">ACE ENG.COLLGE,ANKUSHPUR---T3246</option>
                <option value="BVRIT, BACHUPALLY,HYD.---T3389">BVRIT, BACHUPALLY,HYD.---T3389</option>
                <option value="CBIT GANDIPET---P0031">CBIT GANDIPET---P0031</option>
                <option value="CBIT---T3001">CBIT---T3001</option>
                <option value="CMR COLL OF ENGGANDTECH KANDLA KOYALA---T3175">CMR COLL OF ENGGANDTECH KANDLA KOYALA---T3175</option>
                <option value="CMR ENGINEERING COLLEGE, KANDLAKOYA---T3328">CMR ENGINEERING COLLEGE, KANDLAKOYA---T3328</option>
                <option value="CMR INSTITUTE OF TECHNOLOGY.,KANDLAKOYA---T3220">CMR INSTITUTE OF TECHNOLOGY.,KANDLAKOYA---T3220</option>
                <option value="CVR COLLEGE OF ENGINEERING, MANGALPALLY---T3141">CVR COLLEGE OF ENGINEERING, MANGALPALLY---T3141</option>
                <option value="MALLA REDDY COLLEGE OF ENGINEERING,MYSAMMAGUDA.---T3217">MALLA REDDY COLLEGE OF ENGINEERING,MYSAMMAGUDA.---T3217</option>
                <option value="MALLA REDDY INSTITUTE OF TECHNOLOGY AND SCIENCE,MYSAMMAGUDA---T3214">MALLA REDDY INSTITUTE OF TECHNOLOGY AND SCIENCE,MYSAMMAGUDA---T3214</option>
                <option value="MARRI LAXMA REDDY INST.TECH. AND MANAGMENT,DUNDIGAL---T3316">MARRI LAXMA REDDY INST.TECH. AND MANAGMENT,DUNDIGAL---T3316</option>
                <option value="NARASIMHA REDDY ENG COLLEGE,MAISAMMAGUDA---T3238">NARASIMHA REDDY ENG COLLEGE,MAISAMMAGUDA---T3238</option>
                <option value="ST PETERS ENGINEERING COLLEGE MAISAMMAGUDA,MEDCHAL---T3242">ST PETERS ENGINEERING COLLEGE MAISAMMAGUDA,MEDCHAL---T3242</option>
                <option value="TKR COLLEGE OF ENGG AND TECH, MEDBOWLI, MEERPET---T3169">TKR COLLEGE OF ENGG AND TECH, MEDBOWLI, MEERPET---T3169</option>
                <option value="TKR INST. OF MANAGEMENT   SCIENCE,MEDIBOWLI MEERPET.---P3112">TKR INST. OF MANAGEMENT   SCIENCE,MEDIBOWLI MEERPET.---P3112</option>

            </select>
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

export default BusPassProfile;

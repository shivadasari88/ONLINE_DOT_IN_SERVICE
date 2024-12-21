import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext'; // Import your UserContext

export default function UpdateProfile() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext); // Assuming UserContext provides user and setUser
    
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        gender: '',
        phone: '',
    });
// Image fields state
    const [brideAadhaarCard, setBrideAadhaarCard] = useState(null);
    const [fatherAadhaarCard, setFatherAadhaarCard] = useState(null);
    const [casteCertificate, setCasteCertificate] = useState(null);
    const [incomeCertificate, setIncomeCertificate] = useState(null);
    const [educationCertificate, setEducationCertificate] = useState(null);
    const [bridePhoto, setBridePhoto] = useState(null);
    

    useEffect(() => {
        // Load user data into form when component mounts, assuming user data is already available in the context
        if (user) {
            setUserData({
                username: user.username || '',
                email: user.email || '',
                gender: user.gender || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            switch (name) {
                case 'brideAadhaarCard':
                    setBrideAadhaarCard(files[0]);
                    break;
                case 'fatherAadhaarCard':
                    setFatherAadhaarCard(files[0]);
                    break;
                case 'casteCertificate':
                    setCasteCertificate(files[0]);
                    break;
                case 'incomeCertificate':
                    setIncomeCertificate(files[0]);
                    break;
                case 'educationCertificate':
                    setEducationCertificate(files[0]);
                    break;
                case 'bridePhoto':
                    setBridePhoto(files[0]);
                    break;
                default:
                    break;
            }
        }
    };

     const updateUser = async (e) => {
        e.preventDefault();

        // Use FormData to include both text data and file uploads
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });

        // Append file data to FormData
        formData.append('brideAadhaarCard', brideAadhaarCard);
        formData.append('fatherAadhaarCard', fatherAadhaarCard);
        formData.append('casteCertificate', casteCertificate);
        formData.append('incomeCertificate', incomeCertificate);
        formData.append('educationCertificate', educationCertificate);
        formData.append('bridePhoto', bridePhoto);

        try {
            const { data } = await axios.post('/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile updated successfully!');
            // Additional actions based on response
        } catch (error) {
            toast.error('Failed to update profile.');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className='updateform'>
            <form onSubmit={updateUser}>
                <div className='feilds'>
                    <h1>BASIC INPUTS</h1>
                    <ul>
                        <li>
                            <label>Name</label>
                            <input type='text' name='username' value={userData.username} onChange={handleInputChange} />
                        </li>

                        <li>
                            <label>Email</label>
                            <input type='email' name='email' value={userData.email} onChange={handleInputChange} />
                        </li>

                        <li>
                            <label>Gender</label>
                            <input type='text' name='gender' value={userData.gender} onChange={handleInputChange} />
                        </li>

                        <li>
                            <label>Phone</label>
                            <input type='text' name='phone' value={userData.phone} onChange={handleInputChange} />
                        </li>
                    
                    {/* Additional fields */}

                    </ul>
                    
               </div>
               <div className='images'>
                    {/* Image Uploads */}
                    <h1>UPLOAD IMAGES</h1>
                    <ul>
                        <li>
                            <label>Bride Aadhaar Card</label>
                            <input type='file' name='brideAadhaarCard' onChange={handleFileChange} />
                        </li>

                        <li>
                            <label>Father Aadhaar Card</label>
                            <input type='file' name='fatherAadhaarCard' onChange={handleFileChange} />
                        </li>

                        <li> 
                            <label>Caste Certificate</label>
                             <input type='file' name='casteCertificate' onChange={handleFileChange} />
                        </li>

                        <li>
                            <label>Income Certificate</label>
                             <input type='file' name='incomeCertificate' onChange={handleFileChange} />
                        </li>

                        <li>
                            <label>Education Certificate</label>
                             <input type='file' name='educationCertificate' onChange={handleFileChange} />
                        </li>

                        <li>
                            <label>Bride Photo</label>
                             <input type='file' name='bridePhoto' onChange={handleFileChange} />
                        </li>
                    </ul>

                </div>

                
                {/* Add remaining fields similarly... */}

               
                <button type='submit'>Update</button>
            </form>
        </div>
    );
}

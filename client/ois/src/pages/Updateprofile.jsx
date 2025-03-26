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
    const [memo, setMemo] = useState(null);
    const [bonofide, setBonofide] = useState(null);
    const [passPhoto, setPassPhoto] = useState(null);
    

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
                case 'memo':
                    setMemo(files[0]);
                    break;
                case 'bonofide':
                    setBonofide(files[0]);
                    break;
                case 'passPhoto':
                    setPassPhoto(files[0]);
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
        formData.append('memo', memo);
        formData.append('bonofide', bonofide);
        formData.append('passPhoto', passPhoto);

        try {
            const { data } = await axios.post('/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile updated successfully!');
            console.log('Extracted Aadhaar Data:', data.user);

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
                    <h2>NOTE</h2>
                    <h3>-name should be same as registerd Name</h3>
                    <h3>-photo should be below 100 kb</h3>
                    <h3>-mandate to submit memo,photo and fill name, phone, gender, photo</h3>

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
                            <label>10th memo</label>
                            <input type='file' name='memo' onChange={handleFileChange} />
                        </li>

                        <li>
                            <label>Bonofide</label>
                            <input type='file' name='bonofide' onChange={handleFileChange} />
                        </li>

                        <li>
                            <label>pass Photo</label>
                             <input type='file' name='passPhoto' onChange={handleFileChange} />
                        </li>
                    </ul>

                </div>

                
                {/* Add remaining fields similarly... */}

               
                <button type='submit'>Update</button>
            </form>
        </div>
    );
}

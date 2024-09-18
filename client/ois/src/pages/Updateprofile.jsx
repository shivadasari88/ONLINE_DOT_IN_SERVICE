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
        brideName: '',
        brideDob: '',
        brideAadhaar: '',
        caste: '',
        educationQualification: '',
        brideAddress: '',
        fatherName: '',
        fatherAadhaar: '',
        motherName: '',
        motherAadhaar: '',
        annualIncome: '',
        rationCard: '',
        groomName: '',
        groomDob: '',
        groomAadhaar: '',
        marriageDate: '',
        marriageVenue: '',
        bankAccount: '',
        bankName: '',
        branchName: '',
        ifscCode: '',
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
                brideName: user.brideName || '',
                brideDob: user.brideDob || '',
                brideAadhaar: user.brideAadhaar || '',
                caste: user.caste || '',
                educationQualification: user.educationQualification || '',
                brideAddress: user.brideAddress || '',
                fatherName: user.fatherName || '',
                fatherAadhaar: user.fatherAadhaar || '',
                motherName: user.motherName || '',
                motherAadhaar: user.motherAadhaar || '',
                annualIncome: user.annualIncome || '',
                rationCard: user.rationCard || '',
                groomName: user.groomName || '',
                groomDob: user.groomDob || '',
                groomAadhaar: user.groomAadhaar || '',
                marriageDate: user.marriageDate || '',
                marriageVenue: user.marriageVenue || '',
                bankAccount: user.bankAccount || '',
                bankName: user.bankName || '',
                branchName: user.branchName || '',
                ifscCode: user.ifscCode || '',
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
        <div>
            <form onSubmit={updateUser}>
                <label>Name</label>
                <input type='text' name='username' value={userData.username} onChange={handleInputChange} />
                
                <label>Email</label>
                <input type='email' name='email' value={userData.email} onChange={handleInputChange} />

                <label>Gender</label>
                <input type='text' name='gender' value={userData.gender} onChange={handleInputChange} />

                <label>Phone</label>
                <input type='text' name='phone' value={userData.phone} onChange={handleInputChange} />

                {/* Additional fields */}
                <label>Bride Name</label>
                <input type='text' name='brideName' value={userData.brideName} onChange={handleInputChange} />
                
                <label>Bride Date of Birth</label>
                <input type='date' name='brideDob' value={userData.brideDob} onChange={handleInputChange} />
                
                <label>Bride Aadhaar</label>
                <input type='text' name='brideAadhaar' value={userData.brideAadhaar} onChange={handleInputChange} />
                
                <label>Caste</label>
                <input type='text' name='caste' value={userData.caste} onChange={handleInputChange} />

                <label>Education Qualification</label>
                <input type='text' name='educationQualification' value={userData.educationQualification} onChange={handleInputChange} />

                <label>Bride Address</label>
                <input type='text' name='brideAddress' value={userData.brideAddress} onChange={handleInputChange} />

                <label>Father Name</label>
                <input type='text' name='fatherName' value={userData.fatherName} onChange={handleInputChange} />

                <label>Father Aadhaar</label>
                <input type='text' name='fatherAadhaar' value={userData.fatherAadhaar} onChange={handleInputChange} />

                
                <label>Mother Name</label>
                <input type='text' name='motherName' value={userData.motherName} onChange={handleInputChange} />

                
                <label>Mother Aadhaar</label>
                <input type='text' name='motherAadhaar' value={userData.motherAadhaar} onChange={handleInputChange} />

                
                <label> AnnualIncome</label>
                <input type='text' name='annualIncome' value={userData.annualIncome} onChange={handleInputChange} />

                <label> rationCard</label>
                <input type='text' name='rationCard' value={userData.rationCard} onChange={handleInputChange} />

                <label>groomName </label>
                <input type='text' name='groomName' value={userData.groomName} onChange={handleInputChange} />

                <label>groomDob </label>
                <input type='date' name='groomDob' value={userData.groomDob} onChange={handleInputChange} />

                <label> groomAadhaar</label>
                <input type='text' name='groomAadhaar' value={userData.groomAadhaar} onChange={handleInputChange} />

                
                <label>marriageDate</label>
                <input type='date' name='marriageDate' value={userData.marriageDate} onChange={handleInputChange} />
                
                <label>marriageVenue</label>
                <input type='text' name='marriageVenue' value={userData.marriageVenue} onChange={handleInputChange} />

                
                <label>bankAccount</label>
                <input type='text' name='bankAccount' value={userData.bankAccount} onChange={handleInputChange} />

                <label>bankName</label>
                <input type='text' name='bankName' value={userData.bankName} onChange={handleInputChange} />

                
                <label>branchName</label>
                <input type='text' name='branchName' value={userData.branchName} onChange={handleInputChange} />

                
                <label>ifscCode</label>
                <input type='text' name='ifscCode' value={userData.ifscCode} onChange={handleInputChange} />


                {/* Add remaining fields similarly... */}

                {/* Image Uploads */}
                <label>Bride Aadhaar Card</label>
                <input type='file' name='brideAadhaarCard' onChange={handleFileChange} />

                <label>Father Aadhaar Card</label>
                <input type='file' name='fatherAadhaarCard' onChange={handleFileChange} />

                <label>Caste Certificate</label>
                <input type='file' name='casteCertificate' onChange={handleFileChange} />

                <label>Income Certificate</label>
                <input type='file' name='incomeCertificate' onChange={handleFileChange} />

                <label>Education Certificate</label>
                <input type='file' name='educationCertificate' onChange={handleFileChange} />

                <label>Bride Photo</label>
                <input type='file' name='bridePhoto' onChange={handleFileChange} />

                <button type='submit'>Update</button>
            </form>
        </div>
    );
}

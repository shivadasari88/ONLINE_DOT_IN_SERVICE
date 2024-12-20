import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const registerUser = async (e) => {
        e.preventDefault();
       
        try {
            // Directly using axios.post without destructuring the response to avoid shadowing
            const response = await axios.post('/register', userData);
            
            // Accessing data property of the response object
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                // Resetting userData to initial structure
                setUserData({ name: '', email: '', password: '' });
                toast.success('Registration successful');
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            // Assuming error response might not always be in the expected format
            toast.error(error.response?.data?.message || 'An error occurred during registration');
        }                                               
    };

    // Handler function to update userData state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        
        <div className='register'>
            <form onSubmit={registerUser}>
                <label>Name</label>
                <input type='text' name='name' placeholder='Enter name...' value={userData.name} onChange={handleInputChange}/>
                <label>Email</label>
                <input type='email' name='email' placeholder='Enter email...' value={userData.email} onChange={handleInputChange}/>
                <label>Password</label>
                <input type='password' name='password' placeholder='Enter password...' value={userData.password} onChange={handleInputChange}/>
                <button type='submit'>Register</button>
            </form>
        </div>
        
    );
}

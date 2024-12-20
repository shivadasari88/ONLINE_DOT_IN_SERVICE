import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = loginData;
        try {
            const response = await axios.post('/login', {
                email,
                password,
            });
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                // Assuming the login response includes a token or similar
                // Save it to localStorage or context for authenticated state management
                // localStorage.setItem('authToken', response.data.token);

                setLoginData({ email: '', password: '' }); // Reset form fields
                navigate('/dashboard'); // Navigate to the homepage or dashboard as appropriate
            }
        } catch (error) {
            toast.error('An error occurred during login');
            console.error(error);
        }
    };

    return (
        <div className='login'>
           
            <form onSubmit={loginUser}>
                <label>Email</label>
                <input 
                    type='email' // Use type 'email' for email input for appropriate keyboard and validation
                    placeholder='Enter email...'
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <label>Password</label>
                <input 
                    type='password' // Use type 'password' to hide password input
                    placeholder='Enter password...'
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

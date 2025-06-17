import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext'; // Make sure the path is correct

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

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
                // ✅ Save email for reference if needed
                localStorage.setItem('email', email);

                // ✅ Fetch user details after login
                const userResponse = await axios.get('/profile');

                if (userResponse.data && userResponse.data.name) {
                    // ✅ Save to localStorage for persistence
                    localStorage.setItem('user', JSON.stringify(userResponse.data));

                    // ✅ Update context so components re-render instantly
                    setUser(userResponse.data);
                }

                // ✅ Reset form and navigate
                setLoginData({ email: '', password: '' });
                navigate('/');
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
                    type='email'
                    placeholder='Enter email...'
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <label>Password</label>
                <input 
                    type='password'
                    placeholder='Enter password...'
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

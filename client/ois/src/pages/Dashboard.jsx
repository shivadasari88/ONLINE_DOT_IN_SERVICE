/*
import { useContext} from 'react'
import { UserContext, UserContextProvider } from '../contexts/userContext'


export default function Dashboard() {
    const {user} = useContext(UserContext)
  return (
    <div>
       <h1>Dashboard</h1>
       {!!user && (<h2>Hi {user.name}!</h2>)}
    </div>
  )
}
  */

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast'

export default function Dashboard() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Function to handle profile update (navigate to profile update page)
    const handleUpdateProfile = () => {
        navigate('/updateprofile'); // Assumes you have an UpdateProfile component routed at '/update-profile'
    };

    // Function to simulate automating registration (you might want to integrate with a backend or automation service)
    const handleAutomateRegistration  = async () => {
        console.log('Automating registration for:', user.name);

        // Implement the logic to automate registration
        // This might involve setting some state, calling a backend service, etc.
        try {
            const response = await axios.post('/apply', { username: user.name });
            toast.success('application submitted successfully')
        } catch (error) {
            console.error('error applying:',error)
            toast.error('failed to submit application');
            
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {!!user && <h2>Hi {user.name}!</h2>}
            <div>
                <button onClick={handleUpdateProfile}>Update Profile</button>
                <button onClick={handleAutomateRegistration}>Apply</button>
            </div>
        </div>
    );
}
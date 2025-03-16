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
    /*

    const handleAutomateBussPassRegistration  = async () => {
        console.log('Automating registration of bussPass for:', user.name);

        // Implement the logic to automate registration
        // This might involve setting some state, calling a backend service, etc.
        try {
            const response = await axios.post('/applyBusPass', { username: user.name });
            toast.success('application submitted successfully for busPass')
        } catch (error) {
            console.error('error applying:',error)
            toast.error('failed to submit application');
            
        }
    };
    */
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
        <div className='dashboard'>
            
            <div >
                <div>
                    <h1>Dashboard</h1>
                    {!!user && <h2>Hi {user.name}!</h2>}
                </div>
                <div className='updateProfile'>
                    <h1>UPDATE PROFILE</h1>
                    <button onClick={handleUpdateProfile}>Update Profile</button>
                </div>
                <div className='services'>
                    <h1>SERVICES</h1>
                    <ul>
                        <li>
                            <button onClick={handleAutomateRegistration}>Service A</button>
                        </li>
                        <li>                    
                            <button onClick={handleAutomateBussPassRegistration}>Apply buss pass</button>
                        </li>
                        <li>                    
                            <button onClick={handleAutomateRegistration}>Service C</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
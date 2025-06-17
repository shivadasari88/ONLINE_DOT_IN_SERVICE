import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast'

export default function ServicesPage() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleBusPassProfile = () => {
        navigate('/buspassprofile'); // Assumes you have an UpdateProfile component routed at '/update-profile'
    };

    const handleSchoolBusPassProfile = () => {
        navigate('/schoolbuspassprofile'); // Assumes you have an UpdateProfile component routed at '/update-profile'
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
        <div className='services'>
           <h1>Select a Service for monthly general pass</h1>
           {/*  
           <div className='registraionCheck'>
            <button onClick={handleAutomateRegistration}>AUTOMATION FOR REGISTRAION CHECK</button>
            </div>
           */}         
            <div className='BuspassRegistraion'>
            <button onClick={handleBusPassProfile}> HYDERABAD CITY BUSS PASS FOR COLLEGE STUDENTS</button>
            </div>
            <div className='SchoolBuspassRegistraion'>
            <button onClick={handleSchoolBusPassProfile}> HYDERABAD CITY BUSS PASS FOR SCHOOL STUDENTS</button>
            </div>
        </div>
    );
}

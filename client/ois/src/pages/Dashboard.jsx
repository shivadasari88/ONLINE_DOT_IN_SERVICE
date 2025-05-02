import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { SiLinkedin } from 'react-icons/si';
import { AiOutlineFileSearch, AiOutlineCloudUpload, AiOutlineCheckCircle } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';

export default function Dashboard() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Navigate to profile update
    const handleUpdateProfile = () => {
        navigate('/updateprofile');
    };

    const handleAutoFill = ()=> {
        navigate('/formfiller')
    }

    // Simulate automation for bus pass application
    const handleAutomateBusPass = async () => {
        try {
            await axios.post('/applyBusPass', { username: user.name });
            toast.success('Bus pass application submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit bus pass application.');
        }
    };

    return (
        <div className='dashboard-container'>
            {/* Header */}
            <div className='dashboard-header'>
                <h1>O.IS Dashboard</h1>
                {!!user && <h2>Hi {user.name}, Welcome to O.IS!</h2>}
                <p>Your one-click solution for applications & services.</p>
            </div>

            {/* Profile Section */}
            <div className='dashboard-card profile-card'>
                <div className='profile-info'>
                    <AiOutlineCheckCircle className='icon' />
                    <h2>Profile</h2>
                    <p>Ensure your details are up-to-date for quick form filling.</p>
                    <button onClick={handleUpdateProfile}>Update Profile</button>
                </div>
            </div>

            {/* AI-Based Form Filling */}
            <div className='dashboard-card form-filling'>
                <AiOutlineFileSearch className='icon' />
                <h2>AI Form Filling</h2>
                <p>Paste a form link & let O.IS fill it automatically.</p>
                {/*<input type="text" placeholder="Paste form link here..." />*/}
                <button onClick={handleAutoFill}>AUTO-FILL BY URL</button>
                </div>

            {/* Suggested Services */}
            <div className='dashboard-card services-card'>
                <h2>Suggested Services</h2>
                <button onClick={handleAutomateBusPass}>Apply for Bus Pass</button>
                <button>Apply for Scholarship</button>
                <button>Apply for Job Exams</button>
            </div>

            {/* Uploaded Documents */}
            <div className='dashboard-card docs-card'>
                <AiOutlineCloudUpload className='icon' />
                <h2>Uploaded Documents</h2>
                <p>Manage your documents for auto-filling forms.</p>
                <button>Upload Document</button>
            </div>

            {/* Support Section */}
            <div className='dashboard-card support-card'>
                <h2>Need Help?</h2>
                <p>Check FAQs or contact support.</p>
                <button>View FAQs</button>
                <button>Contact Support</button>
            </div>
        </div>
    );
}

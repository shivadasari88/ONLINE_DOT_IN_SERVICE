import './App.css'
import './index.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from '../src/pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './contexts/userContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import UpdateProfile from './pages/Updateprofile';
import ProfilePage from './pages/ProfilePage';
import BusPassProfile from './pages/BusPassProfile';
import SchoolBusPassProfile from './pages/SchoolBusPassProfile';
import Services from './pages/Services';
import FormFiller from "./pages/FormFiller"; 
import NoteFile from "./legal/NoteFile";
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import NavbarPublic from './components/NavbarPublic';

axios.defaults.baseURL = "https://onlinedotinservice.com/api";
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation();

          const hideNavbarPaths = ['/login', '/email-verify', '/reset-password'];


  return (
    <>
      <UserContextProvider>
        <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
        {!hideNavbarPaths.includes(location.pathname) && <NavbarPublic />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/dashboard' element={<Dashboard />} />  
          <Route path='/updateprofile' element={<UpdateProfile />} /> 
          <Route path='/profilepage' element={<ProfilePage />} />
          <Route path='/services' element={<Services />} />
          <Route path='/buspassprofile' element={<BusPassProfile />} />
          <Route path='/schoolbuspassprofile' element={<SchoolBusPassProfile />} />
          <Route path="/formfiller" element={<FormFiller />} />
          <Route path="/notefile" element={<NoteFile />} />
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
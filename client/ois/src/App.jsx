import './App.css'
import './index.css'
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Register from '../src/pages/Register';
import Login from '../src/pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './contexts/userContext';
import Dashboard from './pages/Dashboard';
import UpdateProfile from './pages/Updateprofile';
import ProfilePage from './pages/ProfilePage';
import BusPassProfile from './pages/BusPassProfile';
import Services from './pages/Services';
import Home from "./components/Home";
import Footer from '../src/components/Footer';
import HistoryPage from "./pages/HistoryPage"; // ✅ Import
import FormFiller from "./pages/FormFiller"; 
import NoteFile from "./legal/NoteFile"; // ✅ Import



axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <Navbar /> {/* ✅ Navbar is here */}
        <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/updateprofile' element={<UpdateProfile />} />
          <Route path='/profilepage' element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path='/services' element={<Services />} />
          <Route path='/buspassprofile' element={<BusPassProfile />} />
          <Route path="/formfiller" element={<FormFiller />} />
          <Route path="/notefile" element={<NoteFile />} />
        </Routes>
        <Footer /> 
      </UserContextProvider>
    </>
  );
}

export default App;

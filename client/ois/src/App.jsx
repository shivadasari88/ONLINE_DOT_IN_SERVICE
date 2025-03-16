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
import Home from "./components/Home";

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
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;

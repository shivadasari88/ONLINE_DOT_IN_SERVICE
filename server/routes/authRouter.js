const express = require('express')
const router = express.Router();
const cors = require('cors')
const {test,registerUser,loginUser, createProfile,logout,sendVerifyOtp,verifyEmail, isAuthenticated,sendRestOtp,resetPassword} = require('../controllers/authController')

const multer = require('multer')
const path = require('path');
const userAuth = require('../helpers/userAuth');
const getUserData = require('../controllers/userController');

//middleware

router.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://15.206.117.255:5173']
}));


// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure you have this folder in your project
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/',test)
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logout)
router.post('/send-verify-otp',userAuth, sendVerifyOtp)
router.post('/verify-account',userAuth, verifyEmail)
router.get('/is-auth',userAuth, isAuthenticated)
router.post('/send-reset-otp', sendRestOtp)
router.post('/reset-password', resetPassword)

router.get('/profile',userAuth,getUserData)
router.post('/update', upload.fields([
    { name: 'memo', maxCount: 1 },
    { name: 'bonofide', maxCount: 1 },
    { name: 'passPhoto', maxCount: 1 }
]), userAuth,createProfile);

module.exports =router;
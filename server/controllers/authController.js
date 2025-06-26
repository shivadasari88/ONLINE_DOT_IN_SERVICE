const User = require('../models/user')
const {hashPassword,comparePassword} = require('../helpers/auth')
const transporter = require('../helpers/nodemailer')

const { hash } = require('bcrypt')
const jwt = require('jsonwebtoken')

const {extractDetailsFromMemo } = require('../dataExtraction/memo')
const {extractDetailsFromBonofide} =require('../dataExtraction/bonofide')

const test = (req,res)=>{
    res.json('test is working')
    console.log("ol")
}

const registerUser = async (req, res) => {

    const { name, email, password ,phone, gender,} = req.body;

    if (!name || !email || !password || !phone || !gender){
            return res.json({success: false, message: 'Missing Details'})
        }

    try {

        // Check if email is already taken
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, error: 'Email is taken already' , message:"user already exists" });
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone, 
            gender,
        });

        await user.save();

        const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //sending welcome email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to ONLINEDOTINSERVICE',
            text : `Welcome to ONLINEDOTINSERVICE. Your account has
            been created with email id: ${email} . You just away to single step 
            to apply your hyd city bussPass
            
            Thank you for choosing onlinedotinservice.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success:true});

    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


//login end point
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        return res.json({success: false, message : 'Email and password are required'})
    }

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({success: false, message : 'Invalid email' });
        }

        const match = await comparePassword(password, user.password);
        
        if(!match){
            return res.json({success: false, message: 'Invalid password'})
        }

        const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true});

    } catch (error) {
        return res.status(500).json({ success: false, message:  error.message });
    }
};

const logout =async (req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
            })

        return res.json({success: true , message: "Logged out"})
    } catch (error) {
        return res.json({success: false, message: error.message })
    }
}

 //send verification OTP to the User's Email

const sendVerifyOtp =async(req, res)=>{

    try {
        const {userId} = req.body;

        const user = await User.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account Already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

         user.verifyOtp =otp;
         user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

         await user.save();

         const mailOptions ={
            from : process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text : `Your OTP is ${otp}. Verify your account using this OTP.`
         }
         await transporter.sendMail(mailOptions);

         res.json({success: true, message: 'Verification OTP Sent on Email'})

    } catch (error) {
        return res.json({success: false, message: error.message })
    }
}

const verifyEmail = async(req, res) =>{
    const {userId, otp} = req.body;

    if(!userId || ! otp){
        return res.json({success: false, message: 'Missing Details'});
    }

    try {
        const  user = await User.findById(userId);

        if(!user){
            return res.json ({success: false, message: 'User not found'})
        }

        if(user.verifyOtp === '' || user.verifyOtp !==otp)
        {
        return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: 'Email verified Successfully'})

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}

//check if user is authenticated
const isAuthenticated =async (req,res) =>{
    try {
        return res.json({success:true});
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

//send password Reset OTP
const sendRestOtp = async (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.json({success: false, message: 'Email is required'})
    }

    try {
        const user =await User.findOne({email});

        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

         const otp = String(Math.floor(100000 + Math.random() * 900000));

         user.resetOtp =otp;
         user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

          await user.save();

         const mailOptions ={
            from : process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text : `Your OTP for resetting your password is  ${otp}.
            Use this OTP to proceed with resetting your password.`
         }
         await transporter.sendMail(mailOptions);

         res.json({success: true, message: 'OTP Sent on Email'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//Reset User Password

const resetPassword =async (req, res) =>{
    const {email, otp, newPassword} =req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: 'Email, OTP and new Password are required'})
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: 'user not found'})
        }

        if(user.reserOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP is Expired'});

        }

        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt =0;

        await user.save();

        return res.json({success: true, message: 'Password has been reset successfully'})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}




const createProfile = async(req,res)=>{
    const { userId } = req.body;

             // Access uploaded files from req.files
    const memoPath = req.files['memo'] ? req.files['memo'][0].path : null;
    const bonofidePath = req.files['bonofide'] ? req.files['bonofide'][0].path : null;
    const passPhotoPath = req.files['passPhoto'] ? req.files['passPhoto'][0].path : null;
    
    try {

        let memoData ={};
        let bonofideData= {};
        if(memoPath){
            memoData = await extractDetailsFromMemo(memoPath)
        }
        if(bonofidePath){
            bonofideData = await extractDetailsFromBonofide(bonofidePath)
        }
        // Assuming you have a method to find and update the user, or create if not found
        const user = await User.findOneAndUpdate({ _id: userId }, {
              memo: memoPath, 
              bonofide: bonofidePath, 
              passPhoto: passPhotoPath ,
              parsedMemoData :memoData,
              parsedbonofideData : bonofideData,
            
            },
               { new: true, upsert: true });
               res.status(200).json({ message: 'Profile updated successfully', user });
            } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error aving profile' });
    }
}


module.exports = {
    test,
    registerUser,
    loginUser,
    createProfile,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendRestOtp,
    resetPassword,
}
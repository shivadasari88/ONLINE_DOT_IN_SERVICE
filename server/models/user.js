const mongoose = require('mongoose');
const { Schema } = mongoose;

const MemoDataSchema = new mongoose.Schema({
  examBoardType: String,
  state: String,
  certificateType: String,
  candidateName: String,
  fathersName: String,
  mothersName: String,
  rollNumber: String,
  dateOfBirth: String,
  examType: String,
  aadhaarNo: String,
  schoolName: String,
  medium: String,
  examYear: String,
  cgpa: String,
  identificationMark1: String,
  identificationMark2: String
}, { _id: false });  // Added _id: false for subdocuments

const BonofideSchema = new mongoose.Schema({
  collegeName: String,
  collegeAddress: String,
  hallticketNo: String,
  course: String,
  branch: String,
}, { _id: false });  // Added _id: false for subdocuments

const applicationHistorySchema = new mongoose.Schema({
    applicationName: { type: String,  }, // Application type (Bus Pass, Scholarship, etc.)
    submittedAt: { type: Date, default: Date.now }, // Timestamp of submission
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    remarks: { type: String } // Optional: admin remarks for approval/rejection
});

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  // Make these optional for registration
  gender: {
    type: String,
    required: [true, 'gender is required'],
  },
  phone: {
    type: String,
    required: [true, 'phoneNo is required'],
    minlength: 10
  },
  verifyOtp: String,
  verifyOtpExpiteAt: Number,
  isAccountVerified: {
    type: Boolean,
    default: false
  },
  resetOtp: String,
  resetOtpExpireAt: Number,
  memo: String,
  bonofide: String,
  passPhoto: String,
  parsedMemoData: MemoDataSchema,
  parsedbonofideData: BonofideSchema,
  applicationHistory: [applicationHistorySchema] // Changed to array of application history
}, { timestamps: true });



const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
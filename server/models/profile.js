const mongoose = require('mongoose');

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
});

const ProfileSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    unique: true 
  },
  email: { 
    type: String,
    required: true,
    unique: true 
  },
  gender: {  
    type: String,
    required: true 
  },
  phone: { 
    type: String,
    required: true 
  },
  // New fields for Kalyana Lakshmi Pathakam
 
  // File uploads can be managed as paths or base64 strings
  brideAadhaarCard: { type: String },
  fatherAadhaarCard: { type: String },
  casteCertificate: { type: String },
  incomeCertificate: { type: String },
  educationCertificate: { type: String },
  bridePhoto: { type: String },
  parsedData: MemoDataSchema,
});

module.exports = mongoose.model('profile', ProfileSchema);


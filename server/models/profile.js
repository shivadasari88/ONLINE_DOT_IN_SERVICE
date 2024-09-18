const mongoose = require('mongoose');

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
  brideName: { 
    type: String, 
    required: true 
  },
  brideDob: { 
    type: Date, 
    required: true 
  },
  brideAadhaar: { 
    type: String, 
    required: true 
  },
  caste: { 
    type: String, 
    required: true 
  },
  educationQualification: { 
    type: String, 
    required: true 
  },
  brideAddress: { 
    type: String, 
    required: true 
  },
  fatherName: { 
    type: String, 
    required: true 
  },
  fatherAadhaar: { 
    type: String, 
    required: true 
  },
  motherName: { 
    type: String, 
    required: true 
  },
  motherAadhaar: { 
    type: String, 
    required: true 
  },
  annualIncome: { 
    type: Number, 
    required: true 
  },
  rationCard: { 
    type: String, 
    required: true 
  },
  groomName: { 
    type: String, 
    required: true 
  },
  groomDob: { 
    type: Date, 
    required: true 
  },
  groomAadhaar: { 
    type: String, 
    required: true 
  },
  marriageDate: { 
    type: Date, 
    required: true 
  },
  marriageVenue: { 
    type: String, 
    required: true 
  },
  bankAccount: { 
    type: String, 
    required: true 
  },
  bankName: { 
    type: String, 
    required: true 
  },
  branchName: { 
    type: String, 
    required: true 
  },
  ifscCode: { 
    type: String, 
    required: true 
  },
  // File uploads can be managed as paths or base64 strings
  brideAadhaarCard: { type: String },
  fatherAadhaarCard: { type: String },
  casteCertificate: { type: String },
  incomeCertificate: { type: String },
  educationCertificate: { type: String },
  bridePhoto: { type: String }
 
});

module.exports = mongoose.model('profile', ProfileSchema);


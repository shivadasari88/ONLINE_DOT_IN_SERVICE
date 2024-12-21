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
 
  // File uploads can be managed as paths or base64 strings
  brideAadhaarCard: { type: String },
  fatherAadhaarCard: { type: String },
  casteCertificate: { type: String },
  incomeCertificate: { type: String },
  educationCertificate: { type: String },
  bridePhoto: { type: String }
 
});

module.exports = mongoose.model('profile', ProfileSchema);


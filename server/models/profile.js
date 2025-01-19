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
const BonofideSchema = new mongoose.Schema({
  collegeName:String,
  collegeAddress: String,
  hallticketNo: String,
  course: String,
  branch: String,
})

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
  memo: { type: String },
  bonofide: { type: String },
  passPhoto: { type: String },
  parsedMemoData: MemoDataSchema,
  parsedbonofideData:BonofideSchema,
});

module.exports = mongoose.model('profile', ProfileSchema);


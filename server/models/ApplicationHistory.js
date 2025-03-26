const mongoose = require("mongoose");

const applicationHistorySchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // User's email
    applicationName: { type: String, required: true }, // Application type (Bus Pass, Scholarship, etc.)
    submittedAt: { type: Date, default: Date.now }, // Timestamp of submission
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    remarks: { type: String } // Optional: admin remarks for approval/rejection
});

const ApplicationHistory = mongoose.model("ApplicationHistory", applicationHistorySchema);
module.exports = ApplicationHistory;

const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');

// ✅ Route 1: Get User Profile Data
router.get('/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Route 2: Update User Profile Data
router.put('/:email', async (req, res) => {
    const { email } = req.params;
    const { parsedMemoData, parsedbonofideData } = req.body;
    
    try {
        // ✅ Find User Profile
        const profile = await Profile.findOne({ email });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // ✅ Update only provided fields
        if (parsedMemoData) profile.parsedMemoData = parsedMemoData;
        if (parsedbonofideData) profile.parsedbonofideData = parsedbonofideData;

        // ✅ Save Changes
        await profile.save();

        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const ApplicationHistory = require("../models/ApplicationHistory");

// ✅ Get application history by user email
router.get("/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const history = await ApplicationHistory.find({ userEmail: email });
        res.json(history);
    } catch (error) {
        console.error("Error fetching application history:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Update application status (used by automation or admin)
router.put("/update-status", async (req, res) => {
    try {
        const { email, applicationName, status, remarks } = req.body;
        if (!email || !applicationName || !status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        await ApplicationHistory.findOneAndUpdate(
            { userEmail: email, applicationName },
            { status, remarks },
            { new: true }
        );

        res.json({ message: "Application status updated successfully." });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

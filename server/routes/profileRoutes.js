const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');
const { chromium } = require('playwright');

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

router.post('/fill-form', async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ message: 'URL is required.' });
    }
  
    try {
      const browser = await chromium.launch({ headless: false }); // set headless: true later
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
  
      // Scrape all input fields
      const inputFields = await page.$$eval('input, select, textarea', (elements) => {
        return elements.map(el => ({
          tagName: el.tagName,
          type: el.type || null,
          name: el.name || null,
          id: el.id || null,
          placeholder: el.placeholder || null,
          label: el.labels && el.labels.length > 0 ? el.labels[0].innerText : null
        }));
      });
  
      console.log('Scraped Fields:', inputFields);
  
      await browser.close();
  
      res.json({ fields: inputFields });
  
    } catch (error) {
      console.error('Error scraping form:', error);
      res.status(500).json({ message: 'Failed to process the URL.', error: error.message });
    }
  });

module.exports = router;

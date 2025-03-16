
const express = require('express');
const dotenv = require('dotenv').config();
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const { Router } = express;
const cors = require('cors');

const router = Router();

router.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://65.2.167.243:5173']
}));


router.use(express.json()); // Add this to ensure the body is parsed correctly

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function fillForm(profileData) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://forms.gle/3N82sCRA2dQsdBX67');

  console.log('Typing username:', profileData.username);
  console.log('Typing email:', profileData.email);

  await page.type('.whsOnd', profileData.username);
  await page.type('.whsOnd', profileData.email);

  await page.click('.NPEfkd');

  await browser.close();
  console.log('Form filled and submitted');
}

router.post('/apply', async (req, res) => {
  
  const username = req.body.username;
  console.log(username)

  if (!username) {
    return res.status(400).json({ error: 'Username is missing' });
  }

  try {
    const profileData = await Profile.findOne({ username });
    if (profileData) {
      await fillForm(profileData);
      res.status(200).json({ message: 'Form submitted successfully' });
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    console.error('Error retrieving profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

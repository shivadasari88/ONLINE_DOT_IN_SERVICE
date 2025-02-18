const express = require('express');
const dotenv = require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const { Router } = express;
const cors = require('cors');
const axios = require('axios');
const { firefox } = require('playwright');

const router = Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

router.use(express.json());

async function getAddress(latitude, longitude) {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    console.log('Fetching address with URL:', url);  // Debugging log

    try {
        const response = await axios.get(url);
        console.log('API Response:', response.data);  // Print full response

        if (response.data.status === 'OK') {
            return response.data.results[0].formatted_address;
        } else {
            throw new Error('Geocoding failed: ' + response.data.status);
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}


router.post('/applyBusPass', async (req, res) => {
    const { username, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Location data is required' });
    }

    console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);

    try {
        const address = await getAddress(latitude, longitude);
        if (!address) {
            return res.status(500).json({ error: 'Failed to fetch address' });
        }
        console.log(`User's Address: ${address}`);

        const browser = await firefox.launch({ headless: false });
        const context = await browser.newContext({
            permissions: ['geolocation'],
            geolocation: { latitude, longitude },
            locale: 'en-US',
        });

        const page = await context.newPage();
        await page.goto('https://tgsrtcpass.com/');
        await page.waitForTimeout(3000);
        await page.click('#hyderabadAdd');
        console.log('Clicked on apply button');

        // Verify geolocation within the browser
        const geoLocation = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        reject(`Error getting location: ${error.message}`);
                    }
                );
            });
        });

        console.log('Geolocation from browser:', geoLocation);
        
        await page.waitForTimeout(3000);
        await browser.close();
        
        res.json({ success: true, message: 'Bus pass application submitted', address });

    } catch (error) {
        console.error('Error processing bus pass automation:', error);
        res.status(500).json({ error: 'Automation failed' });
    }
});

module.exports = router;

const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const { Router } = express;
const cors = require('cors');
const axios = require('axios');
const path = require('path');
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
    if (!API_KEY) {
        console.error('Google Maps API key is missing');
        return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    //console.log('Fetching address with URL:', url);

    try {
        const response = await axios.get(url);
        const data = response.data;

        //console.log('API Response:', response.data);

        if (data.status === "OK" && data.results.length > 0) {
            const firstResult = data.results[0];

            let houseNo = "";
            const addressParts = firstResult.formatted_address.split(",");
            for (let part of addressParts) {
                const match = part.trim().match(/\d+/);
                if (match) {
                    houseNo = part.trim();
                    break;
                }
            }

            let postalCode = "";
            for (const component of firstResult.address_components) {
                if (component.types.includes("postal_code")) {
                    postalCode = component.long_name;
                    break;
                }
            }

            console.log(`Extracted House No: ${houseNo}`);
            console.log(`Extracted Postal Code: ${postalCode}`);

            return { houseNo, postalCode, fullAddress: firstResult.formatted_address };
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
        const addressData = await getAddress(latitude, longitude);
        if (!addressData) {
            return res.status(500).json({ error: 'Failed to fetch address' });
        }
        
        const { houseNo, postalCode, fullAddress } = addressData;
        console.log(`User's Address: ${fullAddress}`);

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
        console.log("Clicked on apply button");

        await page.waitForSelector('a.btn.applyBtns[href="#myModal"]', { timeout: 10000 });
        await page.click('a.btn.applyBtns[href="#myModal"]');

        await page.waitForSelector('a.btn.applyBtns[href="#GhzStuclgPhotoInstructions"]', { visible: true });
        await page.click('a.btn.applyBtns[href="#GhzStuclgPhotoInstructions"]');

        await page.waitForTimeout(3000);

        let newPage = null;
        try {
            [newPage] = await Promise.all([
                context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
                page.click('a.btn.applyBtns[href="https://tgsrtcpass.com:443/counterstupass.do?prm=hyd"]'),
            ]);
        } catch (error) {
            console.error('Error waiting for new page:', error);
        }

        const targetPage = newPage || page;

        targetPage.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });

        await targetPage.waitForSelector('input#userProperties\\(sscpassfailyr\\)');
        await targetPage.fill('input#userProperties\\(sscpassfailyr\\)', '2019');
        await targetPage.fill('input#userProperties\\(sscno\\)', '1907110061');
        await targetPage.fill('input#userProperties\\(passdob\\)', '16/02/2004');

        await targetPage.evaluate(() => {
            const input = document.querySelector('input#youthname');
            if (input) {
                input.removeAttribute('disabled');
                input.removeAttribute('readonly');
            }
        });

        await targetPage.waitForSelector('input#youthname');
        await targetPage.fill('input#youthname', 'SHIVA DASARI');
        await targetPage.fill('input#youthfgname', 'srinivas');
        await targetPage.fill('input#studentmobileno', '6304893242');
        await targetPage.check('input[name="userProperties(gender)"][value="F"]');

        await targetPage.fill('textarea[name="userProperties(addrhouseno)"]', houseNo);
        await targetPage.fill('input[name="userProperties(pincode)"]', postalCode);

        const filePath = path.resolve(__dirname, '../uploads/bonofide.jpg');
        await targetPage.setInputFiles('input#studentphoto', filePath);
        console.log('File uploaded successfully!');

        await targetPage.waitForTimeout(3000);
        console.log('Form filled successfully!');

        const geoLocation = await targetPage.evaluate(() => {
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


        //await browser.close();

        res.json({ success: true, message: 'Bus pass application submitted', address: fullAddress });

    } catch (error) {
        console.error('Error processing bus pass automation:', error);
        res.status(500).json({ error: 'Automation failed' });
    }
});

module.exports = router;

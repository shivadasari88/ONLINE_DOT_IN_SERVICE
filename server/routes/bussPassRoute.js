const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../models/profile');
const { Router } = express;
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { firefox } = require('playwright');


const fs = require('fs');
const tesseract = require('tesseract.js');

const router = Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);
router.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


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
            let postalCode = "";
            let street = "";
            let city = "";
            let state = "";
            let district = "";
            let landmark = "";

            for (const component of firstResult.address_components) {
                if (component.types.includes("street_number")) {
                    houseNo = component.long_name;
                }
                if (component.types.includes("route")) {
                    street = component.long_name;
                }
                if (component.types.includes("locality")) {
                    city = component.long_name;
                }
                if (component.types.includes("administrative_area_level_2")) {
                    district = component.long_name;
                }
                if (component.types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }
                if (component.types.includes("postal_code")) {
                    postalCode = component.long_name;
                }
                if (component.types.includes("point_of_interest")) {
                    landmark = component.long_name;
                }
            }

            return { houseNo, street, city, district, state, postalCode, landmark, fullAddress: firstResult.formatted_address };
        } else {
            throw new Error('Geocoding failed: ' + data.status);
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}

router.post('/applyBusPass', async (req, res) => {
    const { username, latitude, longitude } = req.body;

    const profileData = await Profile.findOne({ username });
    

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Location data is required' });
    }

    console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);

    try {
        const addressData = await getAddress(latitude, longitude);
        if (!addressData) {
            return res.status(500).json({ error: 'Failed to fetch address' });
        }
       
        
        const { houseNo, street, city, district, state, postalCode, landmark, fullAddress } = addressData;
console.log(`User's Address: ${fullAddress}`);

        let nearestCounter;
        try {
            nearestCounter = await findNearestCounter(latitude, longitude);
            if (!nearestCounter) {
                return res.status(500).json({ error: 'No bus pass counters found' });
            }
            console.log(`Nearest Counter: ${nearestCounter.name} - ${nearestCounter.address}`);
        } catch (error) {
            console.error('Error finding nearest counter:', error);
            return res.status(500).json({ error: 'Failed to find nearest counter' });
        }

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

        await page.waitForSelector('a.btn.applyBtns[href="#myModal"]', { timeout: 1000 });
        await page.click('a.btn.applyBtns[href="#myModal"]');

        await page.waitForSelector('a.btn.applyBtns[href="#GhzStuclgPhotoInstructions"]', { visible: true });
        await page.click('a.btn.applyBtns[href="#GhzStuclgPhotoInstructions"]');

        await page.waitForTimeout(3000);

        let newPage = null;
        try {
            [newPage] = await Promise.all([
                context.waitForEvent('page', { timeout: 1000 }).catch(() => null),
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
        //await targetPage.fill('input#userProperties\\(sscpassfailyr\\)',"2019");
        let passYear = "MARCH-2019";  // Example input

            // Extract only the year
            let yearOnly = passYear.split("-")[1];  // Splits at '-' and takes the second part

            // Alternative using regex (if format may vary)
            let match = passYear.match(/\d{4}/);  
            if (match) {
                yearOnly = match[0]; // Extracts first 4-digit number (e.g., 2019)
            }

            console.log(yearOnly); // Outputs: 2019

            // Fill the form with extracted year
            await targetPage.fill('input#userProperties\\(sscpassfailyr\\)', yearOnly);
        await targetPage.fill('input#userProperties\\(sscno\\)', profileData.parsedMemoData.rollNumber);
        await targetPage.fill('input#userProperties\\(passdob\\)', profileData.parsedMemoData.dateOfBirth);

        await targetPage.evaluate(() => {
            const input = document.querySelector('input#youthname');
            if (input) {
                input.removeAttribute('disabled');
                input.removeAttribute('readonly');
            }
        });

        await targetPage.waitForSelector('input#youthname');
        await targetPage.fill('input#youthname',profileData.parsedMemoData.candidateName);
        await page.waitForTimeout(1000);

        await targetPage.fill('input#youthname', profileData.parsedMemoData.candidateName);

        await targetPage.fill('input#youthfgname', profileData.parsedMemoData.fathersName);
        await targetPage.fill('input#studentmobileno', profileData.phone);
        //await targetPage.check('input[name="userProperties(gender)"][value="F"]');

        const userGender =profileData.gender.toLowerCase(); // Assuming 'M' or 'F' from the user data

        if (userGender === 'male') {
            await targetPage.check('input[name="userProperties(gender)"][value="M"]');
        } else if (userGender === 'female') {
            await targetPage.check('input[name="userProperties(gender)"][value="F"]');
        } else {
            console.error("Invalid gender value! Expected 'M' or 'F'.");
        }

        await targetPage.fill('textarea[name="userProperties(addrhouseno)"]', houseNo || street || city);
        await targetPage.fill('input[name="userProperties(pincode)"]', postalCode || "500001");

        const filePath = path.resolve(__dirname, '../uploads/bonofide.jpg');
        await targetPage.setInputFiles('input#studentphoto', filePath);
        console.log('File uploaded successfully!');

    // Select an option by value (e.g., "32282" for AADHYA DEGREE COLLEGE)
    //await targetPage.selectOption('#instcollname', '32282'); 

    const instituteMap = {
        "AADHYA  DEGREE COLLEGE, ANUPURAM,KAPRA---D5915": "32282",
        "St. MARTINS ENGINEERING COLLEGE": "30899",
        
      };
      
      const instituteValue = instituteMap[profileData.parsedbonofideData.collegeName];
      
      if (instituteValue) {
        //await page.waitForSelector('select[name="religion"]'); // Wait for the religion dropdown
        //await page.select('select[name="religion"]', instituteValue);
        await targetPage.selectOption('#instcollname', instituteValue);
        console.log(`Selected Religion: ${profileData.parsedbonofideData.collegeName}`);
      } else {
        console.error("institute not found in the dropdown!");
      }
      
      await targetPage.fill('input#userProperties\\(admissionno\\)', profileData.parsedbonofideData.hallticketNo);
// Delay after selecting religion


//caste 
// Caste map based on the options in the dropdown (adjusted according to the values in the screenshot)
const collegeMaps = {
  "AADHYA  DEGREE COLLEGE, ANUPURAM,KAPRA---D5915": {
    "BC-A": "3",
    "BC-B": "4",
    "BC-D": "6",
    
  },
  "St. MARTINS ENGINEERING COLLEGE": {
    "B.Tech 1st Yr": "027A",  // Muslim BC-A (Example value, adjust based on actual HTML values)
    "B.Tech 2nd Yr": "027B",  // Muslim BC-B
    "B.Tech 3rd Yr": "027C",  // Muslim BC-E
    "B.TECH- - IV": "027D" // Muslim OC (Example value)
  },
  // Add mappings for other religions if needed...
};

// Get the appropriate caste map based on the selected religion
const collegeMap = collegeMaps[profileData.parsedbonofideData.collegeName];


// Get the value that corresponds to the user's caste
const collegeValue = collegeMap[profileData.parsedbonofideData.course]; // `user.caste` should hold the caste value (e.g., "BC-A")

// Wait for the caste dropdown to appear and select the caste
if (collegeValue) {
//await page.waitForSelector('select[name="caste"]'); // Wait for the caste dropdown
  //await page.select('select[name="caste"]', collegeValue);
  await targetPage.selectOption('#instcourseid', collegeValue);

  console.log(`Selected Caste: ${profileData.parsedbonofideData.course}`);
} else {
  console.error("course not found in the dropdown!");
}

    // Select "Payment at Counter" (value="2")
    await targetPage.selectOption('#paymentmodeId', '2');
   // await targetPage.selectOption('#cen', { value: "1275" });


    const locationMap = {

        "Abids":"1275",
        "Afzalgunj":"850",
        "Aramghar":"1197",
        "Balanagar":"1212",
        "Borabanda":"1284",
        "CBS":"923",
        "Charminar":"1222",
        "Dilsukhnagar":"918",
        "ECIL":"992",
        "Kukatpally":"945",
        "Lakdikapool":"1342",
        "Farooqnagar":"1203",
        "Ghatkesar":"1175",

        "Hayathnagar":"876",
        "Ibrahimpatnam":"852",
        "JBS":"924",
        "Kachiguda":"1036",
        "Kothi":"1024",
        "KPHB":"944",
        "LB Nagar":"990",
        "Lingampalli":"1186",
        "Lothukunta":"1272",
        "Medchal":"1034",
        "Mehdipatnam":"931",
        "Midhani":"851",
        "Moinabad":"1206",
        "NGOs Colony":"991",
        "Patancheru":"943",
        "Rathifile":"1096",

        "Risalabazar":"1183",
        "Secretariat":"1215",
        "Shapurnagar":"877",
        "SR Nagar":'1194',
        "Suchitra":'1209',
        "Tarnaka":"1023",
        "Thukkuguda":"1231",
        "Uppal":"993",
        "Uppal X Road":"1198",
        "Vanasthalipuram":"1223",
        "W. College":'1263',
        };
    
    // Normalize and check if location exists
    const formattedLocationName = nearestCounter.name.trim();
    console.log(`Nearest Counter Name: ${formattedLocationName}`);
    console.log(`Available Locations: ${Object.keys(locationMap)}`);
    
    const locationValue = locationMap[formattedLocationName];
    
    if (locationValue) {
        await targetPage.selectOption('#cen', locationValue);
        console.log(`Selected location: ${formattedLocationName}`);
    } else {
        console.error(`Location '${formattedLocationName}' not found in the dropdown!`);
    }
    
    await targetPage.selectOption('#passTypeId', "175-26");

        // STEP 1: Capture CAPTCHA Image
        const captchaElement = await targetPage.$('#imagetext');
        if (!captchaElement) {
            console.error("CAPTCHA image not found!");
            await browser.close();
            return;
        }
    
        // Extract CAPTCHA Image as Base64
        const captchaSrc = await targetPage.evaluate(img => img.src, captchaElement);
    
        // Decode and Save CAPTCHA Image
        const base64Data = captchaSrc.replace(/^data:image\/jpeg;base64,/, "");
        const imagePath = 'captcha.jpg';
        fs.writeFileSync(imagePath, base64Data, 'base64');
    
        console.log("CAPTCHA image saved as captcha.jpg");
    
        // STEP 2: Process Image with OCR
        const { data: { text } } = await tesseract.recognize(imagePath);
    
        const captchaText = text.trim().replace(/[^a-zA-Z0-9]/g, ''); // Clean extracted text
        console.log("Extracted CAPTCHA:", captchaText);
    
        if (!captchaText || captchaText.length < 4) {
            console.error("CAPTCHA recognition failed, try again.");
            await browser.close();
            return;
        }
    
        // STEP 3: Fill in the CAPTCHA
        await targetPage.fill('[name="userProperties(inputcaptcha)"]', captchaText);
        console.log("Filled CAPTCHA successfully");
    

    



        await targetPage.waitForTimeout(3000);
        console.log('Form filled successfully!');
///////////////////////////////////////////////////////////////////////////////////////////////
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

        function getDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        }

        async function findNearestCounter(userLat, userLon) {
            // Load bus pass counter locations (from JSON or database)
            const busPassCounters = [
    { name: "Abids", latitude: 17.3660, longitude: 78.4760, address: "Abids Bus Pass Counter" },
    { name: "Afzalgunj", latitude: 17.3725, longitude: 78.4643, address: "Afzalgunj Bus Pass Counter" },
    { name: "Aramghar", latitude: 17.3500, longitude: 78.4800, address: "Aramghar Bus Pass Counter" },
    { name: "Balanagar", latitude: 17.4667, longitude: 78.4500, address: "Balanagar Bus Pass Counter" },
    { name: "Borabanda", latitude: 17.4489, longitude: 78.4067, address: "Borabanda Bus Pass Counter" },
    { name: "CBS", latitude: 17.3833, longitude: 78.4794, address: "Central Bus Station (CBS) Bus Pass Counter" },
    { name: "Charminar", latitude: 17.3614, longitude: 78.4744, address: "Charminar Bus Pass Counter" },
    { name: "Dilsukhnagar", latitude: 17.3833, longitude: 78.5333, address: "Dilsukhnagar Bus Pass Counter" },
    { name: "ECIL", latitude: 17.4833, longitude: 78.5333, address: "ECIL Bus Pass Counter" },
    { name: "Kukatpally", latitude: 17.4700, longitude: 78.4000, address: "Kukatpally Bus Pass Counter" },
    { name: "Lakdikapool", latitude: 17.4000, longitude: 78.4667, address: "Lakdikapool Bus Pass Counter" },
    { name: "Farooqnagar", latitude: 17.3944, longitude: 78.4639, address: "Farooqnagar Bus Pass Counter" },
    { name: "Ghatkesar", latitude: 17.4500, longitude: 78.6833, address: "Ghatkesar Bus Pass Counter" },
    { name: "Hayathnagar", latitude: 17.4000, longitude: 78.6000, address: "Hayathnagar Bus Pass Counter" },
    { name: "Ibrahimpatnam", latitude: 17.2000, longitude: 78.5000, address: "Ibrahimpatnam Bus Pass Counter" },
    { name: "JBS", latitude: 17.4333, longitude: 78.4833, address: "Jubilee Bus Station (JBS) Bus Pass Counter" },
    { name: "Kachiguda", latitude: 17.3833, longitude: 78.4833, address: "Kachiguda Bus Pass Counter" },
    { name: "Kothi", latitude: 17.3667, longitude: 78.4750, address: "Kothi Bus Pass Counter" },
    { name: "KPHB", latitude: 17.4833, longitude: 78.3833, address: "KPHB Bus Pass Counter" },
    { name: "LB Nagar", latitude: 17.3667, longitude: 78.5500, address: "LB Nagar Bus Pass Counter" },
    { name: "Lingampalli", latitude: 17.5000, longitude: 78.3333, address: "Lingampalli Bus Pass Counter" },
    { name: "Lothukunta", latitude: 17.5000, longitude: 78.5000, address: "Lothukunta Bus Pass Counter" },
    { name: "Medchal", latitude: 17.5667, longitude: 78.4667, address: "Medchal Bus Pass Counter" },
    { name: "Mehdipatnam", latitude: 17.3833, longitude: 78.4500, address: "Mehdipatnam Bus Pass Counter" },
    { name: "Midhani", latitude: 17.4167, longitude: 78.5833, address: "Midhani Bus Pass Counter" },
    { name: "Moinabad", latitude: 17.3333, longitude: 78.3333, address: "Moinabad Bus Pass Counter" },
    { name: "NGOs Colony", latitude: 17.4333, longitude: 78.4333, address: "NGOs Colony Bus Pass Counter" },
    { name: "Patancheru", latitude: 17.5000, longitude: 78.2500, address: "Patancheru Bus Pass Counter" },
    { name: "Rathifile", latitude: 17.4167, longitude: 78.4667, address: "Rathifile Bus Pass Counter" },
    { name: "Risalabazar", latitude: 17.3750, longitude: 78.4667, address: "Risalabazar Bus Pass Counter" },
    { name: "Santhnagar", latitude: 17.4333, longitude: 78.4667, address: "Santhnagar Bus Pass Counter" },
    { name: "Secretariat", latitude: 17.4000, longitude: 78.4700, address: "Secretariat Bus Pass Counter" },
    { name: "Shamshabad", latitude: 17.1333, longitude: 78.4000, address: "Shamshabad Bus Pass Counter" },
    { name: "Shapurnagar", latitude: 17.5000, longitude: 78.4000, address: "Shapurnagar Bus Pass Counter" },
    { name: "SR Nagar", latitude: 17.4333, longitude: 78.4500, address: "SR Nagar Bus Pass Counter" },
    { name: "Suchitra", latitude: 17.5167, longitude: 78.4833, address: "Suchitra Bus Pass Counter" },
    { name: "Tarnaka", latitude: 17.4333, longitude: 78.5167, address: "Tarnaka Bus Pass Counter" },
    { name: "Thukkuguda", latitude: 17.0667, longitude: 78.3333, address: "Thukkuguda Bus Pass Counter" },
    { name: "Uppal", latitude: 17.4167, longitude: 78.5333, address: "Uppal Bus Pass Counter" },
    { name: "Uppal X Road", latitude: 17.4167, longitude: 78.5333, address: "Uppal X Road Bus Pass Counter" },
    { name: "Vanasthalipuram", latitude: 17.3667, longitude: 78.5667, address: "Vanasthalipuram Bus Pass Counter" },
    { name: "W. College", latitude: 17.3667, longitude: 78.4750, address: "W. College Bus Pass Counter" }
];

        
            let nearestCounter = null;
            let minDistance = Infinity;
        
            for (const counter of busPassCounters) {
                const distance = getDistance(userLat, userLon, counter.latitude, counter.longitude);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCounter = counter;
                }
            }
        
            return nearestCounter;
        }
        
        

        console.log('Geolocation from browser:', geoLocation);


        await browser.close();

 // **Now send the response after everything is done**
        return res.json({
            success: true,
            message: 'Bus pass application completed successfully',
            nearestCounter,
            address: fullAddress
        });
    } catch (error) {
        console.error('Error processing bus pass automation:', error);
        res.status(500).json({ error: 'Automation failed' });
    }
});

module.exports = router;

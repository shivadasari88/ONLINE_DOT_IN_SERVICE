import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { toast } from 'react-hot-toast';
import { FaSchool, FaUserEdit, FaSave, FaCheckCircle, FaMapMarkerAlt, FaChild } from 'react-icons/fa';

const SchoolBusPassProfile = () => {
    const [profileData, setProfileData] = useState({
        parsedMemoData: {},
        parsedbonofideData: {}
    });
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/profile`);
                setProfileData(response.data || { parsedMemoData: {}, parsedbonofideData: {} });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
    }, [ isEditing]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [section]: {
                ...(prevData[section] || {}),
                [name]: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`/api/profile`, {
                parsedMemoData: profileData.parsedMemoData || {},
                parsedbonofideData: profileData.parsedbonofideData || {}
            });
    
            toast.success('Data updated successfully!');
            setIsEditing(false);
            setProfileData(response.data.profile || { parsedMemoData: {}, parsedbonofideData: {} });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleAutomateBussPassRegistration = async () => {
            setIsLoading(true); // Start loading

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    try {
                        const response = await axios.post('/applySchoolBusPass', {
                        
                            latitude,
                            longitude
                        });
                        
                        setStatus("Application submitted successfully" || "N/A");
                        setRemarks("An application reg no has been sent your registered mobile no and download your application from tsrtc.com "|| "N/A");
                        toast.success('School bus pass application submitted successfully');
                    } catch (error) {
                        console.error('Error applying:', error);
                        toast.error('Failed to submit application');
                        setStatus("incorrect or missing data, Error occurred while applying.");
                        setRemarks("Make sure the provided information is currect and Apply again");
                    }finally {
                    setIsLoading(false); // Stop loading in both success and error cases
                }
                },
                (err) => {
                    console.error('Geolocation error:', err.message);
                    toast.error('Please enable location services to verify your application');
                                    setIsLoading(false); // Stop loading on geolocation error

                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
                    setIsLoading(false); // Stop loading if geolocation not supported

        }
    };

    return (
        <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold">School Bus Pass Application</h1>
                        <p className="text-gray-300">Verify the details, This data will be considered for automation</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Verification Section */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                            <div className="flex items-start">
                                <FaCheckCircle className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-medium text-blue-800">Verification Required</h3>
                                            <p className="mt-1 text-sm text-blue-700">
                                                Ensure all information below is accurate before clicking on verify & Apply
                                                button as if not correct edit information
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleAutomateBussPassRegistration}
                                            disabled={isLoading}
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-4"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Applying...
                                                </>
                                            ) : (
                                                <>
                                                    <FaMapMarkerAlt className="mr-1" />
                                                    Verify & Apply
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {status && (
                                        <div className="mt-2 text-sm">
                                            <p><span className="font-medium">Status:</span> {status}</p>
                                            {remarks && <p><span className="font-medium">Remarks:</span> {remarks}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Memo Data Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                                <FaSchool className="mr-2 text-gray-700" />
                                Student Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="candidateName"
                                        value={profileData.parsedMemoData?.candidateName || ""}
                                        onChange={(e) => handleChange(e, 'parsedMemoData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="text"
                                        name="dateOfBirth"
                                        value={profileData.parsedMemoData?.dateOfBirth || ""}
                                        onChange={(e) => handleChange(e, 'parsedMemoData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hall Ticket Number
                                    </label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={profileData.parsedMemoData?.rollNumber || ""}
                                        onChange={(e) => handleChange(e, 'parsedMemoData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exam Type
                                    </label>
                                    <input
                                        type="text"
                                        name="examType"
                                        value={profileData.parsedMemoData?.examType || ""}
                                        onChange={(e) => handleChange(e, 'parsedMemoData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* School Information Section */}
                        <div className="space-y-6 pt-8">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                                <FaChild className="mr-2 text-gray-700" />
                                School Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        School Name
                                    </label>
                                    <select
                                        name="collegeName"
                                        value={profileData.parsedbonofideData?.collegeName || ""}
                                        onChange={(e) => handleChange(e, 'parsedbonofideData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    >
                                        <option value="">Select a School</option>
                <option value="AASHRAY MODEL HIGH SCHOOL,LALAPET---HH453">AASHRAY MODEL HIGH SCHOOL,LALAPET---HH453</option>
                <option value="ADARSHA VIDYALAYA HIGH SCHOOL,NIRD ROAD,RAJENDRANAAGR.---R2160">ADARSHA VIDYALAYA HIGH SCHOOL,NIRD ROAD,RAJENDRANAAGR.---R2160</option>
                <option value="A.E.C. II,ECIL X ROAD---R9622">A.E.C. II,ECIL X ROAD---R9622</option>
                <option value="AGARWAL GIRLS HS CHARKAMAN---H1702">AGARWAL GIRLS HS CHARKAMAN---H1702</option>
                <option value="CBIT---T3001">CBIT---T3001</option>
                <option value="CMR COLL OF ENGGANDTECH KANDLA KOYALA---T3175">CMR COLL OF ENGGANDTECH KANDLA KOYALA---T3175</option>
                <option value="CMR ENGINEERING COLLEGE, KANDLAKOYA---T3328">CMR ENGINEERING COLLEGE, KANDLAKOYA---T3328</option>
                <option value="CMR INSTITUTE OF TECHNOLOGY.,KANDLAKOYA---T3220">CMR INSTITUTE OF TECHNOLOGY.,KANDLAKOYA---T3220</option>
                <option value="CVR COLLEGE OF ENGINEERING, MANGALPALLY---T3141">CVR COLLEGE OF ENGINEERING, MANGALPALLY---T3141</option>
                <option value="MALLA REDDY COLLEGE OF ENGINEERING,MYSAMMAGUDA.---T3217">MALLA REDDY COLLEGE OF ENGINEERING,MYSAMMAGUDA.---T3217</option>
                <option value="MALLA REDDY INSTITUTE OF TECHNOLOGY AND SCIENCE,MYSAMMAGUDA---T3214">MALLA REDDY INSTITUTE OF TECHNOLOGY AND SCIENCE,MYSAMMAGUDA---T3214</option>
                <option value="MARRI LAXMA REDDY INST.TECH. AND MANAGMENT,DUNDIGAL---T3316">MARRI LAXMA REDDY INST.TECH. AND MANAGMENT,DUNDIGAL---T3316</option>
                <option value="NARASIMHA REDDY ENG COLLEGE,MAISAMMAGUDA---T3238">NARASIMHA REDDY ENG COLLEGE,MAISAMMAGUDA---T3238</option>
                <option value="ST PETERS ENGINEERING COLLEGE MAISAMMAGUDA,MEDCHAL---T3242">ST PETERS ENGINEERING COLLEGE MAISAMMAGUDA,MEDCHAL---T3242</option>
                <option value="TKR COLLEGE OF ENGG AND TECH, MEDBOWLI, MEERPET---T3169">TKR COLLEGE OF ENGG AND TECH, MEDBOWLI, MEERPET---T3169</option>
                <option value="TKR INST. OF MANAGEMENT   SCIENCE,MEDIBOWLI MEERPET.---P3112">TKR INST. OF MANAGEMENT   SCIENCE,MEDIBOWLI MEERPET.---P3112</option>


<option value="AASHRAY MODEL HIGH SCHOOL,LALAPET---HH453">AASHRAY MODEL HIGH SCHOOL,LALAPET---HH453</option>
<option value="ADARSHA VIDYALAYA HIGH SCHOOL,NIRD ROAD,RAJENDRANAAGR.---R2160">ADARSHA VIDYALAYA HIGH SCHOOL,NIRD ROAD,RAJENDRANAAGR.---R2160</option>
<option value="A.E.C. II,ECIL X ROAD---R9622">A.E.C. II,ECIL X ROAD---R9622</option>
<option value="AGARWAL GIRLS HS CHARKAMAN---H1702">AGARWAL GIRLS HS CHARKAMAN---H1702</option>
<option value="AGARWAL HSC. BOYS, PATHERGATTI---HH071">AGARWAL HSC. BOYS, PATHERGATTI---HH071</option>
<option value="AIR FORCE SCHOOL, BEGUMPET---HH295">AIR FORCE SCHOOL, BEGUMPET---HH295</option>
<option value="AKSHARA HIGH SCHOOL JAGANGUDA---R2347">AKSHARA HIGH SCHOOL JAGANGUDA---R2347</option>
<option value="ALFALAH HIGH SCHOOL, SHANTHINAGAR,LALAPET.---H3514">ALFALAH HIGH SCHOOL, SHANTHINAGAR,LALAPET.---H3514</option>
<option value="AL KAREEM SCHOOL,SHAPURNAGAR---R1549">AL KAREEM SCHOOL,SHAPURNAGAR---R1549</option>
<option value="ALL SAINTS HIGH SCHOOL,GUNFOUNDRY, ABIDS---HH024">ALL SAINTS HIGH SCHOOL,GUNFOUNDRY, ABIDS---HH024</option>
<option value="AMARAVATHI GRAMMAR SCHOOL, SITHAPHALMANDI---HH045">AMARAVATHI GRAMMAR SCHOOL, SITHAPHALMANDI---HH045</option>
<option value="ANDHRA VIDYALAY HIGH SCHOOL,KATTEL MANDI---H5711">ANDHRA VIDYALAY HIGH SCHOOL,KATTEL MANDI---H5711</option>
<option value="ANGLIST HIGH SCHOOL,IBRAHIMPATNAM.IMPATNAM---R1300">ANGLIST HIGH SCHOOL,IBRAHIMPATNAM.IMPATNAM---R1300</option>
<option value="ARMY H.S OLD FEELKHANA---H6711">ARMY H.S OLD FEELKHANA---H6711</option>
<option value="ARMY PUBLIC SCHOOL,BOLARAM,JAI JAWAHAR NAGAR---HH676">ARMY PUBLIC SCHOOL,BOLARAM,JAI JAWAHAR NAGAR---HH676</option>
<option value="ARMY PUBLIC SCHOOL GOLCONDA---HH494">ARMY PUBLIC SCHOOL GOLCONDA---HH494</option>
<option value="ARMY SCHOOL R K PURAM,SECBAD.---R9714">ARMY SCHOOL R K PURAM,SECBAD.---R9714</option>
<option value="ARMY SCHOOL - SEC-BAD---HH226">ARMY SCHOOL - SEC-BAD---HH226</option>
<option value="ARUNDHATHI VIDYALAYA  HSC, KEESARA---R9772">ARUNDHATHI VIDYALAYA  HSC, KEESARA---R9772</option>
<option value="ASHRAY-AKRUTI SCHOOL(DEAF DUMB),SRINAGAR COLONY---HH663">ASHRAY-AKRUTI SCHOOL(DEAF DUMB),SRINAGAR COLONY---HH663</option>
<option value="ATOMIC ENERGY CENT SCH. SURARM---R9833">ATOMIC ENERGY CENT SCH. SURARM---R9833</option>
<option value="AVE MARIA SCHOOL,RAMANTHAPUR---HH292">AVE MARIA SCHOOL,RAMANTHAPUR---HH292</option>
<option value="AVENUE GRAMMER SCHOOL - G P CL---HH228">AVENUE GRAMMER SCHOOL - G P CL---HH228</option>
<option value="AZAAN INTERNATIONAL SCHOOL, TOLOCHOWKI---R9994">AZAAN INTERNATIONAL SCHOOL, TOLOCHOWKI---R9994</option>
<option value="BALAJI HIGH SCHOOL,MALKAJGIRI---R9684">BALAJI HIGH SCHOOL,MALKAJGIRI---R9684</option>
<option value="BALA SRI CHAITANYA MODEL SCHOOL,KARWAN---H6102">BALA SRI CHAITANYA MODEL SCHOOL,KARWAN---H6102</option>
<option value="BEAUTIFUL HANDS SCHOOL---HH537">BEAUTIFUL HANDS SCHOOL---HH537</option>
<option value="BHARATH TEJA HIGH SCHOOL MOINABAD RR DIST---R1725">BHARATH TEJA HIGH SCHOOL MOINABAD RR DIST---R1725</option>
<option value="BHARATIYA VIDYA BHAVANS PUBLIC SCHOOL,JUBLEEHILLS,HYD.. SCH---H1951">BHARATIYA VIDYA BHAVANS PUBLIC SCHOOL,JUBLEEHILLS,HYD.. SCH---H1951</option>
<option value="BHASHYAM HIGH SCH,HABSIGUDA---R1492">BHASHYAM HIGH SCH,HABSIGUDA---R1492</option>
<option value="BHASHYAM HIGH SCHOOL, AS RAO NAGAR---R1496">BHASHYAM HIGH SCHOOL, AS RAO NAGAR---R1496</option>
<option value="BHASHYAM HIGH SCHOOL,BRINDAVAN COLONY,MLKG---R1280">BHASHYAM HIGH SCHOOL,BRINDAVAN COLONY,MLKG---R1280</option>
<option value="BHASHYAM HIGH SCHOOL,DURGABHAVANI NAGAR,SANTOSHNAGAR.---R1184">BHASHYAM HIGH SCHOOL,DURGABHAVANI NAGAR,SANTOSHNAGAR.---R1184</option>
<option value="BHASHYAM HIGH SCHOOL, KARKANA---HH435">BHASHYAM HIGH SCHOOL, KARKANA---HH435</option>
<option value="BHASHYAM HIGH SCHOOL, KUKATPALLY---R1554">BHASHYAM HIGH SCHOOL, KUKATPALLY---R1554</option>
<option value="BHASHYAM HIGH SCHOOL ,MARGADARSHI COLONY,R.K.PURAM.---R1643">BHASHYAM HIGH SCHOOL ,MARGADARSHI COLONY,R.K.PURAM.---R1643</option>
<option value="BHASHYAM HIGH SCHOOL MEERPET MAIN ROAD MEERPET.---R1765">BHASHYAM HIGH SCHOOL MEERPET MAIN ROAD MEERPET.---R1765</option>
<option value="BHASHYAM HIGH SCHOOL OLD ALWAL.---R2252">BHASHYAM HIGH SCHOOL OLD ALWAL.---R2252</option>
<option value="BHASHYAM HIGH SCHOOL,PANAMA GOWDEN,VANASTHALIPURAM.---R1534">BHASHYAM HIGH SCHOOL,PANAMA GOWDEN,VANASTHALIPURAM.---R1534</option>
<option value="BHASHYAM HIGH SCHOOL,PHASE-III,KPHB COLONY.---R1435">BHASHYAM HIGH SCHOOL,PHASE-III,KPHB COLONY.---R1435</option>
<option value="BHASHYAM HIGH SCHOOL SR NAGAR.---HH307">BHASHYAM HIGH SCHOOL SR NAGAR.---HH307</option>
<option value="BHASHYAM HIGH SCHOOL,VASUDEVI NAGAR,ATTAPUR.---R2031">BHASHYAM HIGH SCHOOL,VASUDEVI NAGAR,ATTAPUR.---R2031</option>
<option value="BHASHYAM SCHOOL,NIZAMPET.---R2070">BHASHYAM SCHOOL,NIZAMPET.---R2070</option>
<option value="BHAVANS SRIRAMAKRISHNA VIDYALAYA, SAINIKPURI.---HH031">BHAVANS SRIRAMAKRISHNA VIDYALAYA, SAINIKPURI.---HH031</option>
<option value="BHAVISHYA HIGH SCHOOL,SRIRAMNAGAR,RJNR---R9610">BHAVISHYA HIGH SCHOOL,SRIRAMNAGAR,RJNR---R9610</option>
<option value="BHAVYAS GRAMMER SCHOOL,ADARSHNAGAR,NAGOLE.---R1528">BHAVYAS GRAMMER SCHOOL,ADARSHNAGAR,NAGOLE.---R1528</option>
<option value="BLUE BELLS ISCHOOL, TURKAYAMJAL,HAYATHNAGAR.---R2370">BLUE BELLS ISCHOOL, TURKAYAMJAL,HAYATHNAGAR.---R2370</option>
<option value="BMRS GRAMMAR HIGH SCHOOL CHENGICHERLA---R1739">BMRS GRAMMAR HIGH SCHOOL CHENGICHERLA---R1739</option>
<option value="BPDAV SCHOOL,KANCHANBAGH(MDN TOWNSHIP)---R9562">BPDAV SCHOOL,KANCHANBAGH(MDN TOWNSHIP)---R9562</option>
<option value="BRILLIANT ADONAI HIGH SCHOOL, PEDDASHAPUR(V), SHAMSHABAD(M)---R2165">BRILLIANT ADONAI HIGH SCHOOL, PEDDASHAPUR(V), SHAMSHABAD(M)---R2165</option>
<option value="BRILLIANT GRAMMAR HIGH SCH,NARAYANGUDA---HH361">BRILLIANT GRAMMAR HIGH SCH,NARAYANGUDA---HH361</option>
<option value="BRILLIANT GRAMMAR HIGH SCHOOL, DSNR---HH081">BRILLIANT GRAMMAR HIGH SCHOOL, DSNR---HH081</option>
<option value="BRILLIANT GRAMMAR HIGH SCHOOL, IBPM---R1936">BRILLIANT GRAMMAR HIGH SCHOOL, IBPM---R1936</option>
<option value="BRILLIANT GRAMMAR HIGH SCHOOL,KUSHAIGUDA---R1067">BRILLIANT GRAMMAR HIGH SCHOOL,KUSHAIGUDA---R1067</option>
<option value="BRILLIANT GRAMMAR HIGH SCHOOL,SHAMSHABAD.---R1923">BRILLIANT GRAMMAR HIGH SCHOOL,SHAMSHABAD.---R1923</option>
<option value="BRILLIANT GRAMMAR SCHOOL,TUKKUGUDA---R1954">BRILLIANT GRAMMAR SCHOOL,TUKKUGUDA---R1954</option>
<option value="BRILLIANT HIGH SCHOOL, LANGER HOUSE, BAPUNAGAR---HH044">BRILLIANT HIGH SCHOOL, LANGER HOUSE, BAPUNAGAR---HH044</option>
<option value="BRILLIANT HIGH SCHOOL,TURKAYAMJAL.---R2406">BRILLIANT HIGH SCHOOL,TURKAYAMJAL.---R2406</option>
<option value="BRJC PARSI HIGH SCHOOL,RATNA J CHENOY,PARKLANE,SECBAD.---H3810">BRJC PARSI HIGH SCHOOL,RATNA J CHENOY,PARKLANE,SECBAD.---H3810</option>

<option value="CAL PUBLIC SCHOOL, KAPRA---R1055">CAL PUBLIC SCHOOL, KAPRA---R1055</option>
<option value="CAMBRIDGE HIGH SCHOOL KARANBAGH---HH649">CAMBRIDGE HIGH SCHOOL KARANBAGH---HH649</option>
<option value="CAMBRIDGE H.S. BADI CHOWDI---H4822">CAMBRIDGE H.S. BADI CHOWDI---H4822</option>
<option value="CANTONMENT UP SCHOOL---RG075">CANTONMENT UP SCHOOL---RG075</option>
<option value="CARMEL SCHOOL,CHINTALCHERU, MDK DIST---M0131">CARMEL SCHOOL,CHINTALCHERU, MDK DIST---M0131</option>
<option value="CBHS GANDIPET RJNR---R9578">CBHS GANDIPET RJNR---R9578</option>
<option value="CBR MEMORIAL SCHOOL, THUKKUGUDA---R1940">CBR MEMORIAL SCHOOL, THUKKUGUDA---R1940</option>
<option value="CHAITANYA SCHOOL, PALAMAKULA.---R2169">CHAITANYA SCHOOL, PALAMAKULA.---R2169</option>
<option value="CHALLENGER INTERNATIONAL SCHOOL SURANGAL ROAD,MOINABAD.---R2037">CHALLENGER INTERNATIONAL SCHOOL SURANGAL ROAD,MOINABAD.---R2037</option>
<option value="CHERRY SCHOOL,NARKODA---R2209">CHERRY SCHOOL,NARKODA---R2209</option>
<option value="CHINNA KANJARLA P.S---M0004">CHINNA KANJARLA P.S---M0004</option>
<option value="CHITKUL M.P.H.S---M0049">CHITKUL M.P.H.S---M0049</option>
<option value="CHITKUL W/S P.S---M0028">CHITKUL W/S P.S---M0028</option>
<option value="CITY MODEL HIGH SCHOOL, HAYATHNAGAR.YT---R1273">CITY MODEL HIGH SCHOOL, HAYATHNAGAR.YT---R1273</option>
<option value="CMR INTERNATIONAL SCHOOL, SURARAM COLONY---R2378">CMR INTERNATIONAL SCHOOL, SURARAM COLONY---R2378</option>
<option value="C M R MODEL HSC. BWNPALLY---R9923">C M R MODEL HSC. BWNPALLY---R9923</option>
<option value="COLONELS HIGH SCHOOL,JAMALBANDA,BARKAS.---HH691">COLONELS HIGH SCHOOL,JAMALBANDA,BARKAS.---HH691</option>
<option value="CPD ATHAVELLI---RG265">CPD ATHAVELLI---RG265</option>
<option value="CPS ARUTLA---R1748">CPS ARUTLA---R1748</option>
<option value="CPS CHAMPAPET---R1853">CPS CHAMPAPET---R1853</option>
<option value="CPS CHINNA KANDI GUDA---R1960">CPS CHINNA KANDI GUDA---R1960</option>
<option value="CPS DUNDIGAL---RG160">CPS DUNDIGAL---RG160</option>
<option value="CPS GANDHI NAGAR---RG217">CPS GANDHI NAGAR---RG217</option>
<option value="CPS GHATKESAR---RG321">CPS GHATKESAR---RG321</option>
<option value="CPS GURUMURTHY NAGAR---RG179">CPS GURUMURTHY NAGAR---RG179</option>
<option value="CPS INJAPUR---RG024">CPS INJAPUR---RG024</option>
<option value="CPS INJAPUR---RG167">CPS INJAPUR---RG167</option>
<option value="CPS KANDUKUR---R1838">CPS KANDUKUR---R1838</option>
<option value="CPS KOMPALLY---RG071">CPS KOMPALLY---RG071</option>
<option value="CPS KONGRA RAVIRALA---RG130">CPS KONGRA RAVIRALA---RG130</option>
<option value="CPS KUSHAIGUDA---RG089">CPS KUSHAIGUDA---RG089</option>
<option value="CPS MALLAPUR---RG042">CPS MALLAPUR---RG042</option>
<option value="CPS MANCHAL---RG275">CPS MANCHAL---RG275</option>
<option value="CPS MANCHAL RR DIST---RG269">CPS MANCHAL RR DIST---RG269</option>
<option value="CPS MANIKONDA---R9577">CPS MANIKONDA---R9577</option>
<option value="CPS MEDIPALLY---RG279">CPS MEDIPALLY---RG279</option>
<option value="CPS NARSINGI---RG123">CPS NARSINGI---RG123</option>
<option value="CPS NARSI REDDY NGR,BAHADURPURA---HG047">CPS NARSI REDDY NGR,BAHADURPURA---HG047</option>
<option value="C.P.S NEREDMET---RG132">C.P.S NEREDMET---RG132</option>
<option value="CPS PASUMAMULA---RG317">CPS PASUMAMULA---RG317</option>
<option value="CPS PEDDAAMBERPET---RG022">CPS PEDDAAMBERPET---RG022</option>
<option value="CPS PULIMAMIDI---R1836">CPS PULIMAMIDI---R1836</option>
<option value="CPS QUTHBULLAPUR---R2075">CPS QUTHBULLAPUR---R2075</option>
<option value="CPS  RAIDURG---RG176">CPS  RAIDURG---RG176</option>
<option value="CPS RANGAPUR---RG238">CPS RANGAPUR---RG238</option>
<option value="CPS SAHEBNAGAR---RG037">CPS SAHEBNAGAR---RG037</option>
<option value="CPS SAROOR NAGAR---R2076">CPS SAROOR NAGAR---R2076</option>
<option value="CPS SHIVARAMPALLY---RG169">CPS SHIVARAMPALLY---RG169</option>
<option value="CPS TARAMATIPET---RG039">CPS TARAMATIPET---RG039</option>
<option value="CPS THIMMAPUR---R1837">CPS THIMMAPUR---R1837</option>
<option value="CPS THUMKUNTA---RG127">CPS THUMKUNTA---RG127</option>
<option value="CPS TORRUR---RG038">CPS TORRUR---RG038</option>
<option value="CPS YAPRAL---RG376">CPS YAPRAL---RG376</option>
<option value="CPUS , JAGANGUDA---RG146">CPUS , JAGANGUDA---RG146</option>
<option value="CRPF SCHOOL HAKIMPET.---HH105">CRPF SCHOOL HAKIMPET.---HH105</option>
<option value="CUPA MEERPET---R1861">CUPA MEERPET---R1861</option>
<option value="CUP NOMULA---R1955">CUP NOMULA---R1955</option>
<option value="CUPS AHMADGUDA---RG212">CUPS AHMADGUDA---RG212</option>
<option value="C.U.P.S ANNOJIGUDA---R9510">C.U.P.S ANNOJIGUDA---R9510</option>
<option value="C.U.P.S BODUPPAL---R9507">C.U.P.S BODUPPAL---R9507</option>
<option value="CUPS CHINNA GOLLAPALLY---RG249">CUPS CHINNA GOLLAPALLY---RG249</option>
<option value="CUP SCHOOL---M0122">CUP SCHOOL---M0122</option>
<option value="CUPS GANESH NAGAR---RG244">CUPS GANESH NAGAR---RG244</option>
<option value="CUPS GHATPALLY---RG240">CUPS GHATPALLY---RG240</option>
<option value="CUPS GIRMAPUR---RG209">CUPS GIRMAPUR---RG209</option>
<option value="CUPS GOWRELLY---RG354">CUPS GOWRELLY---RG354</option>
<option value="CUPS GUDUR---RG313">CUPS GUDUR---RG313</option>
<option value="CUPS HABSIGUDA---RG155">CUPS HABSIGUDA---RG155</option>
<option value="CUPS HYDERSHAKOTA RJNR---R9575">CUPS HYDERSHAKOTA RJNR---R9575</option>
<option value="CUPS JAIPALLY.---RG250">CUPS JAIPALLY.---RG250</option>
<option value="CUPS JAWAHAR NAGAR---RG085">CUPS JAWAHAR NAGAR---RG085</option>
<option value="CUPS ,KHANAPUR,RJNR(M)---RG337">CUPS ,KHANAPUR,RJNR(M)---RG337</option>
<option value="CUPS KURMALGUDA---RG287">CUPS KURMALGUDA---RG287</option>
<option value="CUPS LOTHKUNTA---RG251">CUPS LOTHKUNTA---RG251</option>
<option value="CUPS MACHA BOLLARAM---RG301">CUPS MACHA BOLLARAM---RG301</option>
<option value="CUPS MADHAPUR,MADHAPUR---RG129">CUPS MADHAPUR,MADHAPUR---RG129</option>
<option value="C.U P S MADHAPUR SERILINGAMPALLY---R1240">C.U P S MADHAPUR SERILINGAMPALLY---R1240</option>
<option value="CUPS MANSOORABAD---RG157">CUPS MANSOORABAD---RG157</option>
<option value="CUPS MEERPET---RG387">CUPS MEERPET---RG387</option>
<option value="CUPS NACHARAM---RG284">CUPS NACHARAM---RG284</option>
<option value="CUPS NARAPALLY---RG324">CUPS NARAPALLY---RG324</option>
<option value="CUPS , OLD SAFILGUDA---RG141">CUPS , OLD SAFILGUDA---RG141</option>
<option value="CUPS SAFILGUDA---R1898">CUPS SAFILGUDA---R1898</option>
<option value="CUPS VAMPUGUDA---RG094">CUPS VAMPUGUDA---RG094</option>
<option value="CUPS VENKATAPURAM---R9757">CUPS VENKATAPURAM---R9757</option>
<option value="CYBERAGE PUPIL SCHOOL MEDCHAL.---R1125">CYBERAGE PUPIL SCHOOL MEDCHAL.---R1125</option>
<option value="DAV BDL PUBLIC SCHOOL,BDL TOWNSHIP,BHANOOR.---M0067">DAV BDL PUBLIC SCHOOL,BDL TOWNSHIP,BHANOOR.---M0067</option>
<option value="DAVID MEM. HIGH SCHOOL, TARNAKA---HH172">DAVID MEM. HIGH SCHOOL, TARNAKA---HH172</option>
<option value="DAVID MEMO UPS PICKET.---HH220">DAVID MEMO UPS PICKET.---HH220</option>
<option value="D.A.V. PUBLIC SCHOOL SAFILGUDA---R9697">D.A.V. PUBLIC SCHOOL SAFILGUDA---R9697</option>
<option value="DAYARA P.S---M0033">DAYARA P.S---M0033</option>
<option value="DEFENCE LAB SCHOOL. PAHADISHRF---R9753">DEFENCE LAB SCHOOL. PAHADISHRF---R9753</option>
<option value="DEFENCE LABS SCHOOL---R9561">DEFENCE LABS SCHOOL---R9561</option>
<option value="DEVENDRA VIDYALAYA,TUKKUGUDA.---R1429">DEVENDRA VIDYALAYA,TUKKUGUDA.---R1429</option>
<option value="DIKSHA HIGH SCHOOL, RISALA BAZAR---HH610">DIKSHA HIGH SCHOOL, RISALA BAZAR---HH610</option>
<option value="DILSUKHNAGAR HIGH SCHOOL,DILSUKHNAGAR.---R1625">DILSUKHNAGAR HIGH SCHOOL,DILSUKHNAGAR.---R1625</option>
<option value="DILSUKHNAGAR HIGH SCHOOL,VASAVI COLONY,RK PURAM---R1635">DILSUKHNAGAR HIGH SCHOOL,VASAVI COLONY,RK PURAM---R1635</option>
<option value="DILSUKHNAGAR H.SCHOOL,SKD NAGAR,VSPM.---R1341">DILSUKHNAGAR H.SCHOOL,SKD NAGAR,VSPM.---R1341</option>
<option value="DILSUKHNAGER HIGH SCHOOL,BADANGPET.---R1639">DILSUKHNAGER HIGH SCHOOL,BADANGPET.---R1639</option>
<option value="DIVYA JYOTHI SCHOOL SHAMIRPET---R2135">DIVYA JYOTHI SCHOOL SHAMIRPET---R2135</option>
<option value="DONALD MEMORIAL SCHOOL,HYDERGUDA(V),RAJENDRANAGAR(M)---R9528">DONALD MEMORIAL SCHOOL,HYDERGUDA(V),RAJENDRANAGAR(M)---R9528</option>
<option value="DON BAGH HIGH SCHOOL,MARUTHI NAAGR,MP.---H9541">DON BAGH HIGH SCHOOL,MARUTHI NAAGR,MP.---H9541</option>
<option value="DON BOSCO SCHOOL,BANDLAGUDA JAGIR.---R2335">DON BOSCO SCHOOL,BANDLAGUDA JAGIR.---R2335</option>
<option value="DR.B.R.AMBEDKAR HIGH SCH.,BAGHLINGAMPALLY---HH665">DR.B.R.AMBEDKAR HIGH SCH.,BAGHLINGAMPALLY---HH665</option>
<option value="DR.KKRS GOWTHAM  SCHOOL,PADMAVATHI COLONY,KGUSHAIGUDA,HYD.---R1545">DR.KKRS GOWTHAM  SCHOOL,PADMAVATHI COLONY,KGUSHAIGUDA,HYD.---R1545</option>

<option value="EMMANUEL HIGH SCHOOL,KRUPA COMPLEX.---R1730">EMMANUEL HIGH SCHOOL,KRUPA COMPLEX.---R1730</option>
<option value="FATIMA MATHA SCHOOL,PL.NO.43,44,BALAJINAGAR---R2281">FATIMA MATHA SCHOOL,PL.NO.43,44,BALAJINAGAR---R2281</option>
<option value="FIITJEE SCHOOL, GADDIANNARAM---R2422">FIITJEE SCHOOL, GADDIANNARAM---R2422</option>
<option value="FR FRANCIS MEMORIAL HIGH SCHOOL IDPL COLONY---R1079">FR FRANCIS MEMORIAL HIGH SCHOOL IDPL COLONY---R1079</option>
<option value="GANAPATI GUDA P.S---M0005">GANAPATI GUDA P.S---M0005</option>
<option value="GAUTAMI VIDYA KSHETRA,MADINAGUDA---R1414">GAUTAMI VIDYA KSHETRA,MADINAGUDA---R1414</option>
<option value="GBES AMEERPET---H1006">GBES AMEERPET---H1006</option>
<option value="GBES BANDLAGUDA---H2003">GBES BANDLAGUDA---H2003</option>
<option value="GBES BHOLESAHEBMAQTA,SANATHNGR---H1004">GBES BHOLESAHEBMAQTA,SANATHNGR---H1004</option>
<option value="GBES KHAIRATABAD NO.1---H9942">GBES KHAIRATABAD NO.1---H9942</option>
<option value="GBES NEW BANDLAGUDA---H2012">GBES NEW BANDLAGUDA---H2012</option>
<option value="GBES PANJAGUTTA---H8004">GBES PANJAGUTTA---H8004</option>
<option value="GBES PANJESHAH, PANJESHAH---H6001">GBES PANJESHAH, PANJESHAH---H6001</option>
<option value="GBES PRAKASH NAGAR---H2002">GBES PRAKASH NAGAR---H2002</option>
<option value="GBES PREMNAGAR,ERRAGADDA---H1003">GBES PREMNAGAR,ERRAGADDA---H1003</option>
<option value="GBES RIKAB GUNJ, KALIKAMAN---H6008">GBES RIKAB GUNJ, KALIKAMAN---H6008</option>
<option value="GBES TUMMALABASTHI,KHAIRTABAD---H8002">GBES TUMMALABASTHI,KHAIRTABAD---H8002</option>
<option value="GBHS.ALIYA---H6611">GBHS.ALIYA---H6611</option>
<option value="GBHS AMBERPET---HG060">GBHS AMBERPET---HG060</option>
<option value="GBHS AMEERPET---HH363">GBHS AMEERPET---HH363</option>
<option value="GBHS ASIFNAGAR---H9605">GBHS ASIFNAGAR---H9605</option>
<option value="GBHS, BEGUMPET NO.2---HG009">GBHS, BEGUMPET NO.2---HG009</option>
<option value="GBHS BLIND DARULSHI---H0615">GBHS BLIND DARULSHI---H0615</option>
<option value="GBHS BOWENPALLY---HG012">GBHS BOWENPALLY---HG012</option>
<option value="GBHS B R BOLARAM, SECBAD---H8001">GBHS B R BOLARAM, SECBAD---H8001</option>
<option value="GBHS CHANCHAL GUDA---H6901">GBHS CHANCHAL GUDA---H6901</option>
<option value="GBHS CHARMAHAL---HG029">GBHS CHARMAHAL---HG029</option>
<option value="GBHS CHOWNI NADI ALI BAIG---H1691">GBHS CHOWNI NADI ALI BAIG---H1691</option>
<option value="GBHS DAREECHE BAWAHEER---HG061">GBHS DAREECHE BAWAHEER---HG061</option>
<option value="GBHS DARUL-ULOOM,GULZAR HOUSE,HYD.---HG70">GBHS DARUL-ULOOM,GULZAR HOUSE,HYD.---HG70</option>
<option value="GBHS EDIBAZAR---H0613">GBHS EDIBAZAR---H0613</option>
<option value="GBHS ERRAMANZIL---H8602">GBHS ERRAMANZIL---H8602</option>
<option value="GBHS,GALBALGUDA---HG003">GBHS,GALBALGUDA---HG003</option>
<option value="GBHS (GAZ) MUSTAIDPURA---H9691">GBHS (GAZ) MUSTAIDPURA---H9691</option>
<option value="GBHS ,GOLKONDA---H9925">GBHS ,GOLKONDA---H9925</option>
<option value="GBHS GOSHACUT---H9604">GBHS GOSHACUT---H9604</option>
<option value="GBHS GOSHAMAHAL---H6692">GBHS GOSHAMAHAL---H6692</option>
<option value="GBHS HILL STREET.SECBAD.---H3608">GBHS HILL STREET.SECBAD.---H3608</option>
<option value="GBHS JAMA E OSMANIA---H4605">GBHS JAMA E OSMANIA---H4605</option>
<option value="GBHS KALASIGUDA---HG016">GBHS KALASIGUDA---HG016</option>
<option value="GBHS, KALASIGUDA---HH037">GBHS, KALASIGUDA---HH037</option>
<option value="GBHS KHALASIGUDA---HH090">GBHS KHALASIGUDA---HH090</option>
<option value="GBHS KISHANBAGH---RG243">GBHS KISHANBAGH---RG243</option>
<option value="GBHS KOTLA ALUAH.,HAFIJ BABANAGAR---H6694">GBHS KOTLA ALUAH.,HAFIJ BABANAGAR---H6694</option>
<option value="GBHS KUNTA ROAD---HG040">GBHS KUNTA ROAD---HG040</option>
<option value="GBHS KURMA GUDA.---H0601">GBHS KURMA GUDA.---H0601</option>
<option value="GBHS MADANNAPET---H0611">GBHS MADANNAPET---H0611</option>
<option value="GBHS MAISARAM,BARKAS.---H2601">GBHS MAISARAM,BARKAS.---H2601</option>
<option value="GBHS. MOGHALPURA---H6013">GBHS. MOGHALPURA---H6013</option>
<option value="GBHS NALLAGUTTA---H3604">GBHS NALLAGUTTA---H3604</option>
<option value="GBHS NAMPALLY---H5901">GBHS NAMPALLY---H5901</option>
<option value="GBHS NEW BHOIGUDA---H3306">GBHS NEW BHOIGUDA---H3306</option>

<option value="GBHS PETLABURZ---RG165">GBHS PETLABURZ---RG165</option>
<option value="GBHS P.LINE,AMBERPET---H4601">GBHS P.LINE,AMBERPET---H4601</option>
<option value="GBHS SECOND LANCER,GOLKONDA---H7601">GBHS SECOND LANCER,GOLKONDA---H7601</option>
<option value="GBHS SHAHALIBANDA---H2602">GBHS SHAHALIBANDA---H2602</option>
<option value="GBHS,SHAHGUNJ---HG057">GBHS,SHAHGUNJ---HG057</option>
<option value="GBHS SULTAN BAZAR---H5692">GBHS SULTAN BAZAR---H5692</option>
<option value="GBHS SULTANSHAHI---H6602">GBHS SULTANSHAHI---H6602</option>
<option value="GBHS TADBAN---RG162">GBHS TADBAN---RG162</option>
<option value="GBHS TIRUMALGHERRY.---H2006">GBHS TIRUMALGHERRY.---H2006</option>
<option value="GBHS TRISHUL PARK, BOLLARUM---HG032">GBHS TRISHUL PARK, BOLLARUM---HG032</option>
<option value="GBHS U/M RISALABAZAR GOLKONDA.---H9920">GBHS U/M RISALABAZAR GOLKONDA.---H9920</option>
<option value="GBHS URDU SHAREEF FATHE DARWAZA---HH688">GBHS URDU SHAREEF FATHE DARWAZA---HH688</option>
<option value="GBHS YAKUTPURA---H6601">GBHS YAKUTPURA---H6601</option>
<option value="GBHS, YMCA, SECBAD---HH135">GBHS, YMCA, SECBAD---HH135</option>
<option value="GBJPS ALLURI SEETARAMNAGAR---H9021">GBJPS ALLURI SEETARAMNAGAR---H9021</option>
<option value="GBJPS AMBERPET---H4006">GBJPS AMBERPET---H4006</option>
<option value="GBJPS INDIRANAGAR,YOUSUFGUDA---H1009">GBJPS INDIRANAGAR,YOUSUFGUDA---H1009</option>
<option value="GBJPS . KUMAR VADI---H9926">GBJPS . KUMAR VADI---H9926</option>
<option value="GBJPS. RASOOL PURA---H3040">GBJPS. RASOOL PURA---H3040</option>
<option value="GBPS ALAWA PANCH BAI KARWAN---H9001">GBPS ALAWA PANCH BAI KARWAN---H9001</option>
<option value="GBPS. ANDROON YAKUTPURA---H6023">GBPS. ANDROON YAKUTPURA---H6023</option>
<option value="GBPS ARYA VATIKA, LALAPET---H3012">GBPS ARYA VATIKA, LALAPET---H3012</option>
<option value="GBPS BABRI ALAWA---H9867">GBPS BABRI ALAWA---H9867</option>
<option value="GBPS BAIDERWADI TOLICHOWKI---H7002">GBPS BAIDERWADI TOLICHOWKI---H7002</option>
<option value="GBPS. BALAMRAI---H3016">GBPS. BALAMRAI---H3016</option>
<option value="GBPS BANJARI DARWAZA---H9923">GBPS BANJARI DARWAZA---H9923</option>
<option value="GBPS. BARANCH SEETARAM PET---H9830">GBPS. BARANCH SEETARAM PET---H9830</option>
<option value="GBPS. BASHEER BAGH---H9844">GBPS. BASHEER BAGH---H9844</option>
<option value="GBPS BEGUMPET---H8003">GBPS BEGUMPET---H8003</option>
<option value="GBPS BEROON GOWLIPURA---H6030">GBPS BEROON GOWLIPURA---H6030</option>
<option value="GBPS BOLAKPUR---H3015">GBPS BOLAKPUR---H3015</option>
<option value="GBPS CHANDRIKAPUR---H2004">GBPS CHANDRIKAPUR---H2004</option>
<option value="GBPS CHILKALGUDA,EASTMARREDPLY---H3011">GBPS CHILKALGUDA,EASTMARREDPLY---H3011</option>
<option value="GBPS CHOWKMAIDEN KHAN---H6006">GBPS CHOWKMAIDEN KHAN---H6006</option>
<option value="GBPS CHUDI BAZAR NO2 (DFT)---H9842">GBPS CHUDI BAZAR NO2 (DFT)---H9842</option>
<option value="GBPS. DEVTON NAKA BOLLRAM---H9954">GBPS. DEVTON NAKA BOLLRAM---H9954</option>
<option value="GBPS DHOOLPET NO .1---H9828">GBPS DHOOLPET NO .1---H9828</option>
<option value="GBPS. DOOD BOWLI NO2 S.GUNJ---H9869">GBPS. DOOD BOWLI NO2 S.GUNJ---H9869</option>
<option value="GBPS. EXP KANDIKALGATE---H6020">GBPS. EXP KANDIKALGATE---H6020</option>
<option value="GBPS FALAKNUMA---H2005">GBPS FALAKNUMA---H2005</option>
<option value="GBPS GADDIANNARAM---H0005">GBPS GADDIANNARAM---H0005</option>
<option value="GBPS. GANDHI NAGAR---H3023">GBPS. GANDHI NAGAR---H3023</option>
<option value="GBPS. GOLLAKIDIKIDEVDI BAGH---H9888">GBPS. GOLLAKIDIKIDEVDI BAGH---H9888</option>
<option value="GBPS GOWLIPURA---H6027">GBPS GOWLIPURA---H6027</option>
<option value="GBPS HAMALBASTHI---H9968">GBPS HAMALBASTHI---H9968</option>
<option value="GBPS HOUSE GOSHALMAHAL---H6009">GBPS HOUSE GOSHALMAHAL---H6009</option>
<option value="GBPS HUGES TOWN NEW BAKARAM---H4001">GBPS HUGES TOWN NEW BAKARAM---H4001</option>
<option value="GBPS. HYDER BASTHI NO2---H3022">GBPS. HYDER BASTHI NO2---H3022</option>
<option value="GBPS HYDERGUDA GAGN MAHAL---H5010">GBPS HYDERGUDA GAGN MAHAL---H5010</option>
<option value="GBPS. IMLIBAN YAKUTPURA---H6022">GBPS. IMLIBAN YAKUTPURA---H6022</option>
<option value="GBPS JAGADISH PATASHAIA---H9822">GBPS JAGADISH PATASHAIA---H9822</option>
<option value="GBPS JAWHARNAGAR---H9914">GBPS JAWHARNAGAR---H9914</option>
<option value="GBPS JIYAGUDA---H9009">GBPS JIYAGUDA---H9009</option>
<option value="GBPS KAKAGUDA---H9955">GBPS KAKAGUDA---H9955</option>
<option value="GBPS.KAMAN SUKHMEER S.GUNJ---H9865">GBPS.KAMAN SUKHMEER S.GUNJ---H9865</option>
<option value="GBPS KAMELA GOWLIPURA---H6025">GBPS KAMELA GOWLIPURA---H6025</option>
<option value="GBPS KANCHANBAGH---H6026">GBPS KANCHANBAGH---H6026</option>
<option value="GBPS KANDIKALGATE---H6002">GBPS KANDIKALGATE---H6002</option>
<option value="GBPS KANDIKALGATE CHANDRAYANGUTTA---HG036">GBPS KANDIKALGATE CHANDRAYANGUTTA---HG036</option>
<option value="GBPS.KASARATTA BABRIALAWA---H9866">GBPS.KASARATTA BABRIALAWA---H9866</option>
<option value="GBPS.KUCHE CHIRAG ALI---H9843">GBPS.KUCHE CHIRAG ALI---H9843</option>
<option value="GBPS. KUMMARWADI---H6029">GBPS. KUMMARWADI---H6029</option>
<option value="GBPS LALAGUDA NO.1,TUKARAMGATE---H3009">GBPS LALAGUDA NO.1,TUKARAMGATE---H3009</option>
<option value="GBPS LALAGUDA NO2 LALAPET---H9993">GBPS LALAGUDA NO2 LALAPET---H9993</option>
<option value="GBPS LALDARWAZA---H6012">GBPS LALDARWAZA---H6012</option>
<option value="GBPS LOWER DHOOLPET---H9019">GBPS LOWER DHOOLPET---H9019</option>
<option value="GBPS MADANNAPET---H0008">GBPS MADANNAPET---H0008</option>
<option value="GBPS. MAHARAJ GUNJ---H9847">GBPS. MAHARAJ GUNJ---H9847</option>
<option value="GBPS MALLEPALLY NO 2---H9016">GBPS MALLEPALLY NO 2---H9016</option>
<option value="GBPS.MARREDPALLY---H3001">GBPS.MARREDPALLY---H3001</option>
<option value="GBPS MEKALMANDI KAVADIGUDA---H3013">GBPS MEKALMANDI KAVADIGUDA---H3013</option>
<option value="GBPS METTUGUDA---H3034">GBPS METTUGUDA---H3034</option>
<option value="GBPS M.G. ROAD PAN BAZAR---H3028">GBPS M.G. ROAD PAN BAZAR---H3028</option>
<option value="GBPS MISSION STREET---H3031">GBPS MISSION STREET---H3031</option>
<option value="GBPS MOTI MARKET---H5008">GBPS MOTI MARKET---H5008</option>
<option value="GBPS MUCHKUNDA NAGAR---H9002">GBPS MUCHKUNDA NAGAR---H9002</option>
<option value="GBPS NALLAKUNTA---H4004">GBPS NALLAKUNTA---H4004</option>
<option value="GBPS NAMPALLY NO2 RED HILLS---H9825">GBPS NAMPALLY NO2 RED HILLS---H9825</option>
<option value="GBPS NEW BHOIGUDA---H9821">GBPS NEW BHOIGUDA---H9821</option>
<option value="GBPS NEW PHISALBANDA---H0010">GBPS NEW PHISALBANDA---H0010</option>
<option value="GBPS OLD MALLEPALLY---H9014">GBPS OLD MALLEPALLY---H9014</option>
<option value="GBPS. PATTABHI NAGAR---H4113">GBPS. PATTABHI NAGAR---H4113</option>
<option value="GBPS PHULE QADEEM KARWAN---H9020">GBPS PHULE QADEEM KARWAN---H9020</option>
<option value="GBPS PICKET---H9952">GBPS PICKET---H9952</option>
<option value="GBPS QAZIPURA KALAPATHER---H4000">GBPS QAZIPURA KALAPATHER---H4000</option>
<option value="GBPS. REGIMENTAL BAZAR---H3008">GBPS. REGIMENTAL BAZAR---H3008</option>
<option value="GBPS. RISALAABDULLAH---H9829">GBPS. RISALAABDULLAH---H9829</option>

<option value="GBPS. RISALA BAZAR---H2007">GBPS. RISALA BAZAR---H2007</option>
<option value="GBPS SAIFABAD RED HILLS---H9826">GBPS SAIFABAD RED HILLS---H9826</option>
<option value="GBPS SANATHNAGAR NO.1---H1005">GBPS SANATHNAGAR NO.1---H1005</option>
<option value="GBPS SEETAPHALMANDI---H3035">GBPS SEETAPHALMANDI---H3035</option>
<option value="GBPS SEETARAMBAGH FEELKHANA---H9005">GBPS SEETARAMBAGH FEELKHANA---H9005</option>
<option value="GBPS SHAKARGUNJ---H9750">GBPS SHAKARGUNJ---H9750</option>
<option value="GBPS SHANTI NAGAR---H3033">GBPS SHANTI NAGAR---H3033</option>
<option value="GBPS SUBRICK STREET SECBAD---H3030">GBPS SUBRICK STREET SECBAD---H3030</option>
<option value="GBPS SULTHAN SHAI---H6014">GBPS SULTHAN SHAI---H6014</option>
<option value="GBPS. TADBAND---H9951">GBPS. TADBAND---H9951</option>
<option value="GBPS.TIRUMALGIRI VILLAGE---H2010">GBPS.TIRUMALGIRI VILLAGE---H2010</option>
<option value="GBPS UPPER DHOOLPET---H9017">GBPS UPPER DHOOLPET---H9017</option>
<option value="GBPS UPPUGUDA---H6011">GBPS UPPUGUDA---H6011</option>
<option value="GBPS.WALKER TOWN SEETHPMANDI---H9995">GBPS.WALKER TOWN SEETHPMANDI---H9995</option>
<option value="GBPS. WARASIGUDA---H3003">GBPS. WARASIGUDA---H3003</option>
<option value="GBPS. WEST MAREDPALLY---H3002">GBPS. WEST MAREDPALLY---H3002</option>
<option value="GBPS. YAKUTPURA---H6019">GBPS. YAKUTPURA---H6019</option>
<option value="GBPS ZEERA BANSILALPET---H3029">GBPS ZEERA BANSILALPET---H3029</option>
<option value="GBPS ZUMMERATH BAZAR---H9827">GBPS ZUMMERATH BAZAR---H9827</option>
<option value="GBUPS. 2 LANCER---H9928">GBUPS. 2 LANCER---H9928</option>
<option value="GBUPS ADIGMET---H4306">GBUPS ADIGMET---H4306</option>
<option value="GBUPS - AGHAPURA---HH229">GBUPS - AGHAPURA---HH229</option>
<option value="GBUPS ALIABAD NO1.---H1303">GBUPS ALIABAD NO1.---H1303</option>
<option value="GBUPS AMBERPET---H4303">GBUPS AMBERPET---H4303</option>
<option value="GBUPS ANDROON KARWAN ZIAGUDA---H9015">GBUPS ANDROON KARWAN ZIAGUDA---H9015</option>
<option value="GBUPS. BAZAR E GHANSI .---H9871">GBUPS. BAZAR E GHANSI .---H9871</option>
<option value="GBUPS. BEROON FATHE DARWAZA---H9872">GBUPS. BEROON FATHE DARWAZA---H9872</option>
<option value="GBUPS CHIKKADAPALLY---H9915">GBUPS CHIKKADAPALLY---H9915</option>
<option value="GBUPS CHOWDINANA MITYA---H5303">GBUPS CHOWDINANA MITYA---H5303</option>
<option value="GBUPS DABEERPURA---H6306">GBUPS DABEERPURA---H6306</option>
<option value="GBUPS DAREECHE BAWAHEER---H6010">GBUPS DAREECHE BAWAHEER---H6010</option>
<option value="GBUPS. DARGA BAHRAN SHAH---H6016">GBUPS. DARGA BAHRAN SHAH---H6016</option>
<option value="GBUPS, DARULSHIFA---H0305">GBUPS, DARULSHIFA---H0305</option>
<option value="GBUPS DOODBOWLI---H4500">GBUPS DOODBOWLI---H4500</option>
<option value="GBUPS GAGANMAHAL---H5307">GBUPS GAGANMAHAL---H5307</option>
<option value="GBUPS GHAS MANDI---H3302">GBUPS GHAS MANDI---H3302</option>
<option value="GBUPS HUMAYUN NAGAR NO 2---H9304">GBUPS HUMAYUN NAGAR NO 2---H9304</option>
<option value="GBUPS. HYDERBHASTI---H3308">GBUPS. HYDERBHASTI---H3308</option>
<option value="GBUPS JAHANUMA---H4110">GBUPS JAHANUMA---H4110</option>
<option value="GBUPS KAGAZIGUDDA KUMAR WADI---H9012">GBUPS KAGAZIGUDDA KUMAR WADI---H9012</option>
<option value="GBUPS KUMMER GUDA---H3305">GBUPS KUMMER GUDA---H3305</option>
<option value="GBUPS LANGER HOUSE---H9927">GBUPS LANGER HOUSE---H9927</option>
<option value="GBUPS MALLEPALLY NO1---H9311">GBUPS MALLEPALLY NO1---H9311</option>
<option value="GBUPS  MANDIMIRALAM---H6309">GBUPS  MANDIMIRALAM---H6309</option>
<option value="GBUPS MANDIMIRALAM---H6302">GBUPS MANDIMIRALAM---H6302</option>
<option value="GBUPS MEWATIPURA---H9003">GBUPS MEWATIPURA---H9003</option>
<option value="GBUPS MOGHALNAGAR RING ROAD---H9004">GBUPS MOGHALNAGAR RING ROAD---H9004</option>
<option value="GBUPS. MOOSA BOWLI PETLABURJ---H9874">GBUPS. MOOSA BOWLI PETLABURJ---H9874</option>
<option value="GBUPS MOOSARAM BAGH---H0001">GBUPS MOOSARAM BAGH---H0001</option>
<option value="GBUPS MUSTAIDPURA---H9305">GBUPS MUSTAIDPURA---H9305</option>
<option value="GBUPS NANDI MUSLAIGUDA---HG043">GBUPS NANDI MUSLAIGUDA---HG043</option>
<option value="GBUPS NAWAB SAHEB KUNTA---H9890">GBUPS NAWAB SAHEB KUNTA---H9890</option>
<option value="GBUPS OLD MALAKPET---H4302">GBUPS OLD MALAKPET---H4302</option>
<option value="GBUPS PARKLANE---H3307">GBUPS PARKLANE---H3307</option>
<option value="GBUPS. PEDDAGUDA---H6021">GBUPS. PEDDAGUDA---H6021</option>
<option value="GBUPS RAM NAGAR---H4305">GBUPS RAM NAGAR---H4305</option>
<option value="GBUPS, SANATHNAGAR---H1301">GBUPS, SANATHNAGAR---H1301</option>
<option value="GBUPS SHAH ALI BANDA---H1308">GBUPS SHAH ALI BANDA---H1308</option>
<option value="GBUPS SHAH GUNJ---H1305">GBUPS SHAH GUNJ---H1305</option>
<option value="GBUPS SHANKESHWAR---H0015">GBUPS SHANKESHWAR---H0015</option>
<option value="GBUPS SUBZIMANDI NO1---H9018">GBUPS SUBZIMANDI NO1---H9018</option>
<option value="GBUPS. TALABMIRJUMIA---H6018">GBUPS. TALABMIRJUMIA---H6018</option>
<option value="GBUPS TAPPACHABUTRA---H9013">GBUPS TAPPACHABUTRA---H9013</option>
<option value="GBUPS. URDU SHAREEFPOLICE LANE---H9870">GBUPS. URDU SHAREEFPOLICE LANE---H9870</option>
<option value="GBUPS VATTEPALLY FALAKNUMA---H4112">GBUPS VATTEPALLY FALAKNUMA---H4112</option>
<option value="GBUPS. YAKUTPURA.---H6314">GBUPS. YAKUTPURA.---H6314</option>
<option value="GBUPS. ZOHRA NAGAR---H6015">GBUPS. ZOHRA NAGAR---H6015</option>

<option value="G.C.B.H.SCHOOL,LAD BAZAR---HG017">G.C.B.H.SCHOOL,LAD BAZAR---HG017</option>
<option value="GCEPS CHILKALLGUDA NO.2---H3010">GCEPS CHILKALLGUDA NO.2---H3010</option>
<option value="GCPS HYDERBASTHI NO1---H3021">GCPS HYDERBASTHI NO1---H3021</option>
<option value="G.C.P.S KHARKAHANA---H3020">G.C.P.S KHARKAHANA---H3020</option>
<option value="GCPS. MAHANKALI STREET SECBAD---H3032">GCPS. MAHANKALI STREET SECBAD---H3032</option>
<option value="GEETA HIGH SCHOOL,SHANTINAGAR,PTC---M0071">GEETA HIGH SCHOOL,SHANTINAGAR,PTC---M0071</option>
<option value="GEETHA H.SCH,TEMPLE ALWAL---R1356">GEETHA H.SCH,TEMPLE ALWAL---R1356</option>
<option value="GENIUS GRAMMAR SCHOOL,CHAITANAYPURI---R1785">GENIUS GRAMMAR SCHOOL,CHAITANAYPURI---R1785</option>
<option value="GENIUS GRAMMAR SCHOOL,JAGANGUDA, SHAMEERPET---R2244">GENIUS GRAMMAR SCHOOL,JAGANGUDA, SHAMEERPET---R2244</option>
<option value="GENIUS GRAMMAR SHC,KOTHAPET---R1786">GENIUS GRAMMAR SHC,KOTHAPET---R1786</option>
<option value="GGBPS SEETAPHALMANDI---H3018">GGBPS SEETAPHALMANDI---H3018</option>
<option value="GGEPS DEVDE SARWARJUNG---H0003">GGEPS DEVDE SARWARJUNG---H0003</option>
<option value="GGES ALIABAD---H2001">GGES ALIABAD---H2001</option>
<option value="G.G.H.S---H0606">G.G.H.S---H0606</option>
<option value="GGHS 1ST LANCER---H5604">GGHS 1ST LANCER---H5604</option>
<option value="GGHS 2ND LANCER---H5603">GGHS 2ND LANCER---H5603</option>
<option value="GGHS BANSILALPET.---H3602">GGHS BANSILALPET.---H3602</option>
<option value="GGHS BLIND MALAKPET---H0616">GGHS BLIND MALAKPET---H0616</option>
<option value="GGHS BOWENPALLY---RG189">GGHS BOWENPALLY---RG189</option>
<option value="GGHS. CBS---H6607">GGHS. CBS---H6607</option>
<option value="GGHS CHADERGHAT---H0610">GGHS CHADERGHAT---H0610</option>
<option value="GGHS CHANCHALGIDA---H6603">GGHS CHANCHALGIDA---H6603</option>
<option value="GGHS CHATTA BAZAR---H0609">GGHS CHATTA BAZAR---H0609</option>
<option value="GGHS. CITY KOTLA ALI JAH---H6691">GGHS. CITY KOTLA ALI JAH---H6691</option>
<option value="GGHS FALAKNUMA---H2603">GGHS FALAKNUMA---H2603</option>
<option value="GGHS GIRLS SECBAD---HG015">GGHS GIRLS SECBAD---HG015</option>
<option value="GGHS GOSHAMAHAL---H4691">GGHS GOSHAMAHAL---H4691</option>
<option value="GGHS HYDERGUDA---H5693">GGHS HYDERGUDA---H5693</option>
<option value="GGHS KACHIGUDA.---H5691">GGHS KACHIGUDA.---H5691</option>
<option value="GGHS KAVADIGUDA---H3027">GGHS KAVADIGUDA---H3027</option>
<option value="GGHS KHURSHID JAH DEVDI---H1901">GGHS KHURSHID JAH DEVDI---H1901</option>
<option value="GGHS KINGS WAY---H3607">GGHS KINGS WAY---H3607</option>
<option value="GGHS LALAPET---H3301">GGHS LALAPET---H3301</option>
<option value="GGHS MAHABOOBIA GUNFOUNDRY.---H6613">GGHS MAHABOOBIA GUNFOUNDRY.---H6613</option>
<option value="GGHS MAISARAM,BARKAS.---H2605">GGHS MAISARAM,BARKAS.---H2605</option>
<option value="GGHS MAJEEDIA---H6693">GGHS MAJEEDIA---H6693</option>
<option value="GGHS MANGALHAT.---H6612">GGHS MANGALHAT.---H6612</option>
<option value="GGHS MOGHALPURA---H6004">GGHS MOGHALPURA---H6004</option>
<option value="GGHS MOOSARAM BAGH---H0608">GGHS MOOSARAM BAGH---H0608</option>
<option value="GGHS MUSHEERABAD---H4603">GGHS MUSHEERABAD---H4603</option>
<option value="GGHS MUSTAIDPURA---H9606">GGHS MUSTAIDPURA---H9606</option>
<option value="GGHS NALLAGUTTA (OLD)---H3304">GGHS NALLAGUTTA (OLD)---H3304</option>
<option value="GGHS NEW NALLAGUTTA.---H3603">GGHS NEW NALLAGUTTA.---H3603</option>
<option value="GGHS PICKET---H3601">GGHS PICKET---H3601</option>
<option value="GGHS REGIMENTAL BAZAR.---H3611">GGHS REGIMENTAL BAZAR.---H3611</option>
<option value="GGHS REZIMENTAL BAZAR-I.---HH103">GGHS REZIMENTAL BAZAR-I.---HH103</option>
<option value="GGHS SHAHALIBANDA---H2604">GGHS SHAHALIBANDA---H2604</option>
<option value="GGHS (TELUGU), NAMPALLY---H6608">GGHS (TELUGU), NAMPALLY---H6608</option>
<option value="GGHS,TRIMULGHRRTRIMULGHERRYY---RG147">GGHS,TRIMULGHRRTRIMULGHERRYY---RG147</option>
<option value="GGHS, WEST MAREDPALLY.---HG050">GGHS, WEST MAREDPALLY.---HG050</option>
<option value="G. GIRLS MODEL UPS. NAMPALLY---H9832">G. GIRLS MODEL UPS. NAMPALLY---H9832</option>
<option value="GGPS AMBEERPET---H4002">GGPS AMBEERPET---H4002</option>
<option value="GGPS. BOWENPALLY---H2008">GGPS. BOWENPALLY---H2008</option>
<option value="GGPS CHILKALGUDA---H3036">GGPS CHILKALGUDA---H3036</option>
<option value="GGPS.DEVTON BAZAR BOLLRAM---H9953">GGPS.DEVTON BAZAR BOLLRAM---H9953</option>
<option value="GGPS DOODBOWLI---H1008">GGPS DOODBOWLI---H1008</option>
<option value="GGPS KACHIGUDA---H5005">GGPS KACHIGUDA---H5005</option>
<option value="GGPS KAMELA QADEEM, CHANCGUDA---H0006">GGPS KAMELA QADEEM, CHANCGUDA---H0006</option>
<option value="GGPS.KARKHANA---H2009">GGPS.KARKHANA---H2009</option>
<option value="GGPS KATTALLGUDA---H0009">GGPS KATTALLGUDA---H0009</option>
<option value="GGPS KOTLAALIJAH---H6007">GGPS KOTLAALIJAH---H6007</option>
<option value="GGPS KURMAGUDA---H0002">GGPS KURMAGUDA---H0002</option>
<option value="GGPS LOWER CHANCHALGUDA---H0004">GGPS LOWER CHANCHALGUDA---H0004</option>
<option value="GGPS MALLEPALLY OLD MALLEPALLY---H9006">GGPS MALLEPALLY OLD MALLEPALLY---H9006</option>
<option value="GGPS MANDIMIRALAM---H6005">GGPS MANDIMIRALAM---H6005</option>
<option value="GGPS.M.J. MARKET O.GUNJ---H9846">GGPS.M.J. MARKET O.GUNJ---H9846</option>
<option value="GGPS MUMTAZ COLONY---H0017">GGPS MUMTAZ COLONY---H0017</option>
<option value="GGPS. NEW BHOIGUDA---H3026">GGPS. NEW BHOIGUDA---H3026</option>
<option value="GGPS OLD MALAKPET---H4005">GGPS OLD MALAKPET---H4005</option>
<option value="GGPS. RASOOL PURA---H3024">GGPS. RASOOL PURA---H3024</option>
<option value="GGPS REGIMENTAL BAZAR---H9966">GGPS REGIMENTAL BAZAR---H9966</option>
<option value="GGPS SAIDABAD---H0007">GGPS SAIDABAD---H0007</option>
<option value="GGPS. SAIFABAD---H9937">GGPS. SAIFABAD---H9937</option>
<option value="GGPS SANATHNAGAR NO.2---H1001">GGPS SANATHNAGAR NO.2---H1001</option>
<option value="GGPS SEETAPHALMANDI NO.2---H3019">GGPS SEETAPHALMANDI NO.2---H3019</option>
<option value="GGPS SEETHPHALMANDI NO1.---H9965">GGPS SEETHPHALMANDI NO1.---H9965</option>
<option value="GGPS TELUGU NAMPALLY---H9938">GGPS TELUGU NAMPALLY---H9938</option>
<option value="GGPS UPPER CHANCHALGUDA---H0014">GGPS UPPER CHANCHALGUDA---H0014</option>
<option value="GGPS.WARSIGUDA---H9967">GGPS.WARSIGUDA---H9967</option>
<option value="GGPS YAKUTPURA---H6003">GGPS YAKUTPURA---H6003</option>
<option value="GGUPS A.C. GUARDS---H9313">GGUPS A.C. GUARDS---H9313</option>
<option value="GGUPS ADIGMET---H4307">GGUPS ADIGMET---H4307</option>
<option value="GGUPS ALIABAD---H6304">GGUPS ALIABAD---H6304</option>
<option value="GGUPS AMEERPET---H1302">GGUPS AMEERPET---H1302</option>
<option value="GGUPS DABEERPURA---H2306">GGUPS DABEERPURA---H2306</option>
<option value="GGUPS.HUSSAINIALUM---H1306">GGUPS.HUSSAINIALUM---H1306</option>
<option value="GGUPS IRANIGALLI---H6301">GGUPS IRANIGALLI---H6301</option>
<option value="GGUPS KHAIRTABAD---H8304">GGUPS KHAIRTABAD---H8304</option>
<option value="GGUPS MUSRAIPURA---H9301">GGUPS MUSRAIPURA---H9301</option>
<option value="GGUPS PURANI HAVELI---H0304">GGUPS PURANI HAVELI---H0304</option>
<option value="GGUPS QAZI PURA---H9889">GGUPS QAZI PURA---H9889</option>
<option value="GGUPS. RAIN BAZAR---H6017">GGUPS. RAIN BAZAR---H6017</option>
<option value="GGUPS SULTANSHAHI TALABKATTA---H2301">GGUPS SULTANSHAHI TALABKATTA---H2301</option>
<option value="GGUPS. ZEERA---H3025">GGUPS. ZEERA---H3025</option>
<option value="GHANA PUR M.P.H.S---M0050">GHANA PUR M.P.H.S---M0050</option>
<option value="GHATKESAR MODEL HIGH SCHOOL, SAI NAGAR COLONY, GHATKESAR---R9790">GHATKESAR MODEL HIGH SCHOOL, SAI NAGAR COLONY, GHATKESAR---R9790</option>


<option value="G.H.S ADDAGUTTA---HH545">G.H.S ADDAGUTTA---HH545</option>
<option value="GHS. AFZALGUNJ---H6604">GHS. AFZALGUNJ---H6604</option>
<option value="G.H.S. AMEERPET NO.1---H1606">G.H.S. AMEERPET NO.1---H1606</option>
<option value="G.H.S AMEERPET NO.2---H1602">G.H.S AMEERPET NO.2---H1602</option>
<option value="G.H.S.AZAM PURA NO 1---H0605">G.H.S.AZAM PURA NO 1---H0605</option>
<option value="GHS BAHADURPALLY.---RG033">GHS BAHADURPALLY.---RG033</option>
<option value="GHS BALKAMGUDA---HG039">GHS BALKAMGUDA---HG039</option>
<option value="GHS BANJARA HILLS,RD.7---RG182">GHS BANJARA HILLS,RD.7---RG182</option>
<option value="G.H.S BEGUMPET NO.2---H1601">G.H.S BEGUMPET NO.2---H1601</option>
<option value="GHS CHADERGHAT---H6605">GHS CHADERGHAT---H6605</option>
<option value="GHS CHANDRAYANGUTTA---H2303">GHS CHANDRAYANGUTTA---H2303</option>
<option value="GHS DARGAH BARHANA  SHAH RLYASATNAGAR---HG065">GHS DARGAH BARHANA  SHAH RLYASATNAGAR---HG065</option>
<option value="GHS DARGAH BARHANA  SHAH RLYASATNAGAR---HG068">GHS DARGAH BARHANA  SHAH RLYASATNAGAR---HG068</option>
<option value="G.H.S.DARULSHIFA H.SCHOOL---H0603">G.H.S.DARULSHIFA H.SCHOOL---H0603</option>
<option value="GHS DHOOLPET---H9607">GHS DHOOLPET---H9607</option>
<option value="GHS, ESAMIA BAZAR.---HH152">GHS, ESAMIA BAZAR.---HH152</option>
<option value="GHS FOR DEAF MALAKPET.---H0614">GHS FOR DEAF MALAKPET.---H0614</option>
<option value="GHS GALBAGUDA,TADBAN---RG263">GHS GALBAGUDA,TADBAN---RG263</option>
<option value="GHS. GALBAL GUDA TADBAN---H9868">GHS. GALBAL GUDA TADBAN---H9868</option>
<option value="GHS GIRLS MOOSABOWLI---HG026">GHS GIRLS MOOSABOWLI---HG026</option>
<option value="GHS GOLCONDA (TEL)---H5602">GHS GOLCONDA (TEL)---H5602</option>
<option value="GHS, GOWLIGUDA, N.B.T.NAGAR---RG262">GHS, GOWLIGUDA, N.B.T.NAGAR---RG262</option>
<option value="GHS GULAB SINGH LANE HYD---H1603">GHS GULAB SINGH LANE HYD---H1603</option>
<option value="GHS JAHANUMA---HG042">GHS JAHANUMA---HG042</option>
<option value="GHS, JAMA-E-OSMANIA.---HH128">GHS, JAMA-E-OSMANIA.---HH128</option>
<option value="GHS JAWAHARNAGAR---RG213">GHS JAWAHARNAGAR---RG213</option>
<option value="G.H.S (J.C) MALAKPET---H0901">G.H.S (J.C) MALAKPET---H0901</option>
<option value="GHS - KALI KAMAN,TADBAN.---HH204">GHS - KALI KAMAN,TADBAN.---HH204</option>
<option value="GHS KAVADIGUDA---H4308">GHS KAVADIGUDA---H4308</option>
<option value="GHS KULSUMPURA---H9602">GHS KULSUMPURA---H9602</option>
<option value="GHS LALAPET NO.1---H3605">GHS LALAPET NO.1---H3605</option>
<option value="GHS MOAZAM SHAHI---H9601">GHS MOAZAM SHAHI---H9601</option>
<option value="GHS MOGHALPURA NO.1.---H1607">GHS MOGHALPURA NO.1.---H1607</option>
<option value="GHS MONDAMARKET.---HG014">GHS MONDAMARKET.---HG014</option>
<option value="GHS, MUDFORT,HYD.---HG044">GHS, MUDFORT,HYD.---HG044</option>
<option value="G.H.S.MUFEED UN NISWAN---H9921">G.H.S.MUFEED UN NISWAN---H9921</option>
<option value="G.H.S. NALLAKUNTA.---H4604">G.H.S. NALLAKUNTA.---H4604</option>
<option value="GHS NAMPALLY GANDHI BHAVAN---H6606">GHS NAMPALLY GANDHI BHAVAN---H6606</option>
<option value="GHS NARSAPUR---M172">GHS NARSAPUR---M172</option>
<option value="GHS NAYA BAZAR---H5601">GHS NAYA BAZAR---H5601</option>
<option value="GHS NEW RLY COLONY---H3606">GHS NEW RLY COLONY---H3606</option>
<option value="GHS PANJAGUTTA NO.1,HYD.---H8601">GHS PANJAGUTTA NO.1,HYD.---H8601</option>
<option value="GHS. PRAC. KHAIRTABAD---H5605">GHS. PRAC. KHAIRTABAD---H5605</option>
<option value="GHS,PUSALABASTHI,SAIDABAD---H0308">GHS,PUSALABASTHI,SAIDABAD---H0308</option>
<option value="GHS, RAJ BHAVAN.---H8691">GHS, RAJ BHAVAN.---H8691</option>
<option value="GHS RAJENDRANAGAR.---R9563">GHS RAJENDRANAGAR.---R9563</option>
<option value="GHS RASULPURA,BEGUMPET.---R9601">GHS RASULPURA,BEGUMPET.---R9601</option>
<option value="GHS. RLY QRTS, MOULA ALI---R9906">GHS. RLY QRTS, MOULA ALI---R9906</option>
<option value="G.H.S. SANATH NAAGAR OLD---H1604">G.H.S. SANATH NAAGAR OLD---H1604</option>
<option value="GHS SEETAPHALMANDI---H3613">GHS SEETAPHALMANDI---H3613</option>
<option value="GHS SEETHAPHALMANDI BOYS AND GIRLS.---H3712">GHS SEETHAPHALMANDI BOYS AND GIRLS.---H3712</option>
<option value="G.H.S. SHAIKPET---H7602">G.H.S. SHAIKPET---H7602</option>
<option value="G.H.S SRIRAMNAGAR---H1605">G.H.S SRIRAMNAGAR---H1605</option>
<option value="GHS (T/M), LANGARHOUSE.---HG038">GHS (T/M), LANGARHOUSE.---HG038</option>
<option value="GHS U/E MEDIUM,HUMAYUNNAGAR NO 1,MURADNAGAR,HYD.---H9302">GHS U/E MEDIUM,HUMAYUNNAGAR NO 1,MURADNAGAR,HYD.---H9302</option>
<option value="GHS U/M B K GUDA,SANATHNAGAR.---H2685">GHS U/M B K GUDA,SANATHNAGAR.---H2685</option>
<option value="GHS (U/M) MUSTAIDPURA---H4304">GHS (U/M) MUSTAIDPURA---H4304</option>
<option value="GHS U/M MUSTAIDPURA.(HARA DARWAZA).---HG062">GHS U/M MUSTAIDPURA.(HARA DARWAZA).---HG062</option>
<option value="GHS VIJAY NAGAR COLONY---H6610">GHS VIJAY NAGAR COLONY---H6610</option>
<option value="GHS, YELLAREDDYGUDA NO-11.---RG052">GHS, YELLAREDDYGUDA NO-11.---RG052</option>
<option value="G.H.S YOUSUFGUDA.---H8603">G.H.S YOUSUFGUDA.---H8603</option>
<option value="GHS, YOUSUFGUDA.---HH070">GHS, YOUSUFGUDA.---HH070</option>
<option value="GHS, ZAMISTANPUR---H4602">GHS, ZAMISTANPUR---H4602</option>
<option value="GIRLS P.S DARUSALAM---H9800">GIRLS P.S DARUSALAM---H9800</option>
<option value="GOOD SAMARITAN HIGH SCHOOL,VENGALRAO NAGAR,---H1811">GOOD SAMARITAN HIGH SCHOOL,VENGALRAO NAGAR,---H1811</option>
<option value="GOOD SHEPHERDS HIGH SCHOOL, ADARSHNAGAR, OPP IDPL COLONY---H1815">GOOD SHEPHERDS HIGH SCHOOL, ADARSHNAGAR, OPP IDPL COLONY---H1815</option>
<option value="GOOD SHEPHERED HS SRINIVASANAGAR---R1205">GOOD SHEPHERED HS SRINIVASANAGAR---R1205</option>
<option value="GOVERNMENT HIGH SCHOOL H.NO:9-1-37/B,PRASHANTH NAGAR LANGAR HOUSE---HG055">GOVERNMENT HIGH SCHOOL H.NO:9-1-37/B,PRASHANTH NAGAR LANGAR HOUSE---HG055</option>

<option value="GOVT A.P.S.R. H.SCHOOL,GADDI ANNARAM,DILSUKHNAGAR.---H0607">GOVT A.P.S.R. H.SCHOOL,GADDI ANNARAM,DILSUKHNAGAR.---H0607</option>
<option value="GOVT BALAJYITHI PS,SHYMALAKUNT---H1031">GOVT BALAJYITHI PS,SHYMALAKUNT---H1031</option>
<option value="GOVT BALA JYOTHI P.S ADDAGUTTA---H3005">GOVT BALA JYOTHI P.S ADDAGUTTA---H3005</option>
<option value="GOVT BALAJYOTHI PS,AMBEDKARNGR---H3039">GOVT BALAJYOTHI PS,AMBEDKARNGR---H3039</option>
<option value="GOVT BALA JYOTHI P.S AMBERPET---H4007">GOVT BALA JYOTHI P.S AMBERPET---H4007</option>
<option value="GOVT BALA JYOTHI P.S AMMMMBERT---H4009">GOVT BALA JYOTHI P.S AMMMMBERT---H4009</option>
<option value="GOVT BALA JYOTHI PS. ANNANAGAR---H3041">GOVT BALA JYOTHI PS. ANNANAGAR---H3041</option>
<option value="GOVT BALA JYOTHI PS ASMANGDH---H0020">GOVT BALA JYOTHI PS ASMANGDH---H0020</option>
<option value="GOVT BALA JYOTHI P.S BABA NGR---H9964">GOVT BALA JYOTHI P.S BABA NGR---H9964</option>
<option value="GOVT BALAJYOTHI PS,BK GUDA---H1030">GOVT BALAJYOTHI PS,BK GUDA---H1030</option>
<option value="GOVT BALAJYOTHI PS BORABANDA---H1011">GOVT BALAJYOTHI PS BORABANDA---H1011</option>
<option value="GOVT BALAJYOTHI PS CHADERGHAT---H0019">GOVT BALAJYOTHI PS CHADERGHAT---H0019</option>
<option value="GOVT BALA JYOTHI PS FILM NAGAR---H7006">GOVT BALA JYOTHI PS FILM NAGAR---H7006</option>
<option value="GOVT BALA JYOTHI P.S FILM NGR---H7010">GOVT BALA JYOTHI P.S FILM NGR---H7010</option>
<option value="GOVT BALA JYOTHI PS. FILM NGR---H7004">GOVT BALA JYOTHI PS. FILM NGR---H7004</option>
<option value="GOVT BALAJYOTHI PSHYMAVATHINGR---H1012">GOVT BALAJYOTHI PSHYMAVATHINGR---H1012</option>
<option value="GOVT BALAJYOTHIPS,JAWAHARNGR---H1024">GOVT BALAJYOTHIPS,JAWAHARNGR---H1024</option>
<option value="GOVT BALAJYOTHI PS,JYOTHINGR---H1023">GOVT BALAJYOTHI PS,JYOTHINGR---H1023</option>
<option value="GOVT BALA JYOTHI PS KAMALANGR---H0018">GOVT BALA JYOTHI PS KAMALANGR---H0018</option>
<option value="GOVT. BALAJYOTHI PS,KARMIKANGR---H1021">GOVT. BALAJYOTHI PS,KARMIKANGR---H1021</option>
<option value="GOVT BALA JYOTHI P.S KAVADIGUD---H9946">GOVT BALA JYOTHI P.S KAVADIGUD---H9946</option>
<option value="GOVT. BALAJYOTHI PS,MADHURANGR---H1014">GOVT. BALAJYOTHI PS,MADHURANGR---H1014</option>
<option value="GOVT BALAJYOTHI PS,MAHATMANGR---H1022">GOVT BALAJYOTHI PS,MAHATMANGR---H1022</option>
<option value="GOVT BALAJYOTHI PS,MASJID AREA---H3007">GOVT BALAJYOTHI PS,MASJID AREA---H3007</option>
<option value="GOVT BALA JYOTHI P.S M.G. NGR---H3004">GOVT BALA JYOTHI P.S M.G. NGR---H3004</option>
<option value="GOVT BALAJYOTHI PS MOOSANGR---H0021">GOVT BALAJYOTHI PS MOOSANGR---H0021</option>
<option value="GOVT BALAJYOTHI PS,NATRAJ NGR---H1013">GOVT BALAJYOTHI PS,NATRAJ NGR---H1013</option>
<option value="GOVT.BALAJYOTHIPS,OLDSULTANNGR---H1010">GOVT.BALAJYOTHIPS,OLDSULTANNGR---H1010</option>
<option value="GOVT BALAJYOTHI PS,REHMATHNGR---H1027">GOVT BALAJYOTHI PS,REHMATHNGR---H1027</option>
<option value="GOVT. BALAJYOTHI PS,SAILANINGR---H1015">GOVT. BALAJYOTHI PS,SAILANINGR---H1015</option>
<option value="GOVT BALA JYOTHI P.S SEC-BAD---H9994">GOVT BALA JYOTHI P.S SEC-BAD---H9994</option>
<option value="GOVT. BALAJYOTHI PS,SREERAMNGR---H1017">GOVT. BALAJYOTHI PS,SREERAMNGR---H1017</option>
<option value="GOVT BALAJYOTHIPS,SUNILNGR---H1026">GOVT BALAJYOTHIPS,SUNILNGR---H1026</option>
<option value="GOVT BALA JYOTHI PS,SWARJNGR---H1020">GOVT BALA JYOTHI PS,SWARJNGR---H1020</option>
<option value="GOVT BALA JYOTHI PS TALLAGADDA---H9924">GOVT BALA JYOTHI PS TALLAGADDA---H9924</option>
<option value="GOVT BALA JYOTHI PS VINAYAKNGR---H3006">GOVT BALA JYOTHI PS VINAYAKNGR---H3006</option>
<option value="GOVT BALAJYOTHI PS,VINAYAK NGR---H1019">GOVT BALAJYOTHI PS,VINAYAK NGR---H1019</option>
<option value="GOVT BALAL JYOTHI P.S FILM NGR---H7007">GOVT BALAL JYOTHI P.S FILM NGR---H7007</option>
<option value="GOVT BOYS HIGH SCHOOL---HG007">GOVT BOYS HIGH SCHOOL---HG007</option>
<option value="GOVT CENTRAL UPPER PRIMARY SCHOOL NUNTHALKAL---R1855">GOVT CENTRAL UPPER PRIMARY SCHOOL NUNTHALKAL---R1855</option>
<option value="GOVT CITY BOYS HIGH SCHOOL LAD BAZAR---RG137">GOVT CITY BOYS HIGH SCHOOL LAD BAZAR---RG137</option>
<option value="GOVT CITY GHS KOTLA ALZA.---HH221">GOVT CITY GHS KOTLA ALZA.---HH221</option>
<option value="GOVT.CITY HIGH SCHOOL,ALIJAKOTLA---HG005">GOVT.CITY HIGH SCHOOL,ALIJAKOTLA---HG005</option>
<option value="GOVT CITY MODEL HIGH SCHOOL,CHADARGHAT.---H0602">GOVT CITY MODEL HIGH SCHOOL,CHADARGHAT.---H0602</option>
<option value="GOVT CPS MALLAPUR---R1891">GOVT CPS MALLAPUR---R1891</option>
<option value="GOVT CPS MEERKHANPET---R1877">GOVT CPS MEERKHANPET---R1877</option>
<option value="GOVT ELE SCH CAPPAL BAZAR---H5006">GOVT ELE SCH CAPPAL BAZAR---H5006</option>
<option value="GOVT ELE SCH KURMAGUDA---H5004">GOVT ELE SCH KURMAGUDA---H5004</option>
<option value="GOVT ESP BOYS UPS SHANKERBAGAT---H9996">GOVT ESP BOYS UPS SHANKERBAGAT---H9996</option>
<option value="GOVT (G) EXP PSC,NEW MALLAKPET---H0011">GOVT (G) EXP PSC,NEW MALLAKPET---H0011</option>
<option value="GOVT.GHSC.MAJEEDIA MASABTANK---HH098">GOVT.GHSC.MAJEEDIA MASABTANK---HH098</option>
<option value="GOVT.GIRLS HIGH SCHOOL,BOLLARAM---R9602">GOVT.GIRLS HIGH SCHOOL,BOLLARAM---R9602</option>
<option value="GOVT  GIRLS HSC. BARKAS---HH114">GOVT  GIRLS HSC. BARKAS---HH114</option>
<option value="GOVT GIRLS HSC. MARREDPALLY---HH119">GOVT GIRLS HSC. MARREDPALLY---HH119</option>
<option value="GOVT GIRLS H.S. SHALIBANDA---H2713">GOVT GIRLS H.S. SHALIBANDA---H2713</option>
<option value="GOVT GIRLS H.S SULTAN BAZAR---H5002">GOVT GIRLS H.S SULTAN BAZAR---H5002</option>
<option value="GOVT GIRLS PRIMARY SCHOOL MUSHEERABAD---HG033">GOVT GIRLS PRIMARY SCHOOL MUSHEERABAD---HG033</option>
<option value="GOVT.GIRLS PRIMARY SCHOOL TRIMALGIRRY---HG053">GOVT.GIRLS PRIMARY SCHOOL TRIMALGIRRY---HG053</option>
<option value="GOVT HIGH SCH. NARSINGI---R9882">GOVT HIGH SCH. NARSINGI---R9882</option>
<option value="GOVT. HIGH SCHOOL---H7777">GOVT. HIGH SCHOOL---H7777</option>
<option value="GOVT HIGH SCHOOL AZAM PURA NO2---H0612">GOVT HIGH SCHOOL AZAM PURA NO2---H0612</option>
<option value="GOVT HIGH SCHOOL BORABANDA---RG316">GOVT HIGH SCHOOL BORABANDA---RG316</option>
<option value="GOVT HIGH SCHOOL BOWENPALLY---HG034">GOVT HIGH SCHOOL BOWENPALLY---HG034</option>
<option value="GOVT HIGH SCHOOL BOWENPALLY---RG211">GOVT HIGH SCHOOL BOWENPALLY---RG211</option>
<option value="GOVT HIGH SCHOOL,CHETTA BAZAR---HG035">GOVT HIGH SCHOOL,CHETTA BAZAR---HG035</option>
<option value="GOVT. HIGH SCHOOL,DEVAL JAM SINGH HYD---H9312">GOVT. HIGH SCHOOL,DEVAL JAM SINGH HYD---H9312</option>
<option value="GOVT HIGH SCHOOL, FALAKNUMA---HH142">GOVT HIGH SCHOOL, FALAKNUMA---HH142</option>
<option value="GOVT HIGH SCHOOL FILMNAGAR---HG021">GOVT HIGH SCHOOL FILMNAGAR---HG021</option>
<option value="GOVT HIGH SCHOOL IBRAHIMPATAN---R9635">GOVT HIGH SCHOOL IBRAHIMPATAN---R9635</option>
<option value="GOVT HIGH SCHOOL JANGAMMET---HG023">GOVT HIGH SCHOOL JANGAMMET---HG023</option>
<option value="GOVT HIGH SCHOOL, SARDAR BAZAR,BOLLARUM---H2901">GOVT HIGH SCHOOL, SARDAR BAZAR,BOLLARUM---H2901</option>
<option value="GOVT.HIGH SCHOOL, SUBJIMANDI.GOLKONDA---HG056">GOVT.HIGH SCHOOL, SUBJIMANDI.GOLKONDA---HG056</option>
<option value="GOVT HIGH SCHOOL,  SUBZIMANDI NO2,  JIYAGUDA---H9307">GOVT HIGH SCHOOL,  SUBZIMANDI NO2,  JIYAGUDA---H9307</option>
<option value="GOVT.HIGH SCHOOL (TOLI)---HH262">GOVT.HIGH SCHOOL (TOLI)---HH262</option>
<option value="GOVT HIGH SCHOOL VATTEPALLY---HG028">GOVT HIGH SCHOOL VATTEPALLY---HG028</option>
<option value="GOVT HIGH SCHOOL, VENGAL RAO.---HG045">GOVT HIGH SCHOOL, VENGAL RAO.---HG045</option>
<option value="GOVT HIGH SCHOOL VENGAL RAO NAGAR---HGO45">GOVT HIGH SCHOOL VENGAL RAO NAGAR---HGO45</option>
<option value="GOVT MAHABOOBIA G H/S L B STAD---HH162">GOVT MAHABOOBIA G H/S L B STAD---HH162</option>
<option value="GOVT MODEL HSC.ALIYA GUNFOUNDRY.---HH027">GOVT MODEL HSC.ALIYA GUNFOUNDRY.---HH027</option>
<option value="GOVT MODEL P.S NHYDERGUDA---H5009">GOVT MODEL P.S NHYDERGUDA---H5009</option>
<option value="GOVT MPHS          KHAJAGUDA---HH079">GOVT MPHS          KHAJAGUDA---HH079</option>
<option value="GOVT NEHRU MEMORIAL H.SCHOOL---H0604">GOVT NEHRU MEMORIAL H.SCHOOL---H0604</option>
<option value="GOVT PRAC. UPS,KHAIRTABAD---H8302">GOVT PRAC. UPS,KHAIRTABAD---H8302</option>
<option value="GOVT PRATICING H.SCH,KHAIRTHABAD---HG049">GOVT PRATICING H.SCH,KHAIRTHABAD---HG049</option>
<option value="GOVT PRIMARY SCHOOL---M151">GOVT PRIMARY SCHOOL---M151</option>
<option value="GOVT PRIMARY SCHOOL---M152">GOVT PRIMARY SCHOOL---M152</option>
<option value="GOVT PRIMARY SCHOOL GULZARNAGAR---HG022">GOVT PRIMARY SCHOOL GULZARNAGAR---HG022</option>
<option value="GOVT PRIMARY SCHOOL KRISHNA NAGAR KCG KAMELA---HG031">GOVT PRIMARY SCHOOL KRISHNA NAGAR KCG KAMELA---HG031</option>
<option value="GOVT PRIMARY SCHOOL LALAPET---HG024">GOVT PRIMARY SCHOOL LALAPET---HG024</option>
<option value="GOVT PRIMARY SCHOOL NARSIREDDY NAGAR BAHADURPURA HYD---HH441">GOVT PRIMARY SCHOOL NARSIREDDY NAGAR BAHADURPURA HYD---HH441</option>
<option value="GOVT PRIMARY SCHOOL PUDURU---R1744">GOVT PRIMARY SCHOOL PUDURU---R1744</option>
<option value="GOVT. PRIMARY SCHOOL, SULTAN BAZAR, KOTI---HG073">GOVT. PRIMARY SCHOOL, SULTAN BAZAR, KOTI---HG073</option>
<option value="GOVT PRI SCH TROOP BAZAR---H5001">GOVT PRI SCH TROOP BAZAR---H5001</option>
<option value="GOVT. P.R.VIDYALAYA HIMAYTHNGR,DOMALGUDA---H5713">GOVT. P.R.VIDYALAYA HIMAYTHNGR,DOMALGUDA---H5713</option>
<option value="GOVT. P.S,ALLAM THOTA BAWI---R2052">GOVT. P.S,ALLAM THOTA BAWI---R2052</option>
<option value="GOVT P.S RANIGUNJ---H3038">GOVT P.S RANIGUNJ---H3038</option>
<option value="GOVT P.S ZEBA BAGH ASIF NAGAR---H9023">GOVT P.S ZEBA BAGH ASIF NAGAR---H9023</option>
<option value="GOVT. RED CROSS HIGH SCHOOL,BANDLAGUDA,HYD---HG058">GOVT. RED CROSS HIGH SCHOOL,BANDLAGUDA,HYD---HG058</option>
<option value="GOVT SHRADANANDA PATASHALA---H2102">GOVT SHRADANANDA PATASHALA---H2102</option>
<option value="GOVT ST PETERS HIGH SCHOOL---HG025">GOVT ST PETERS HIGH SCHOOL---HG025</option>
<option value="GOVT ST. PETERS H.S BANDLINES---H6710">GOVT ST. PETERS H.S BANDLINES---H6710</option>
<option value="GOVT SVBP HIGH SCHOOL ASIFNAGAR---H9603">GOVT SVBP HIGH SCHOOL ASIFNAGAR---H9603</option>
<option value="GOVT UPPER PRIMARY SCHOOL KOMPALLY---R1745">GOVT UPPER PRIMARY SCHOOL KOMPALLY---R1745</option>
<option value="GOVT UPS. BEGUM BAZAR---H9848">GOVT UPS. BEGUM BAZAR---H9848</option>
<option value="GOVT UPS DADDIPALLY---R1854">GOVT UPS DADDIPALLY---R1854</option>
<option value="GOVT UPS DHANALAXMI CENTER,KPHB COLONY---RG320">GOVT UPS DHANALAXMI CENTER,KPHB COLONY---RG320</option>
<option value="GOVT U P S KHORKARWADI---RG120">GOVT U P S KHORKARWADI---RG120</option>
<option value="GOVT UPS SCHOOL DASARLAPALLY---R1878">GOVT UPS SCHOOL DASARLAPALLY---R1878</option>
<option value="GOVT UPS THIPPAIGUDA---R2005">GOVT UPS THIPPAIGUDA---R2005</option>
<option value="GOVT YADAIAH MEM HIGH SCHOOL,RANIGUNJ---HG001">GOVT YADAIAH MEM HIGH SCHOOL,RANIGUNJ---HG001</option>

<option value="GOWTHAMI VIDYALAYAM, NANDI WANAPARTHY,YACHARAM---R1270">GOWTHAMI VIDYALAYAM, NANDI WANAPARTHY,YACHARAM---R1270</option>
<option value="GOWTHAM MODEL SCHOOL, AMEERPET. HYD---HH652">GOWTHAM MODEL SCHOOL, AMEERPET. HYD---HH652</option>
<option value="GOWTHAM MODEL SCHOOL, A S RAO NAGAR.---R9532">GOWTHAM MODEL SCHOOL, A S RAO NAGAR.---R9532</option>
<option value="GOWTHAM MODEL SCHOOL,ATTAPUR, HYDERGUDA---R2063">GOWTHAM MODEL SCHOOL,ATTAPUR, HYDERGUDA---R2063</option>
<option value="GOWTHAM MODEL SCHOOL,CHANDANAGAR---R1638">GOWTHAM MODEL SCHOOL,CHANDANAGAR---R1638</option>
<option value="GOWTHAM MODEL SCHOOL,KARKHANA---HH413">GOWTHAM MODEL SCHOOL,KARKHANA---HH413</option>
<option value="GOWTHAM MODEL SCHOOL, MEHDIPATNAM---HH641">GOWTHAM MODEL SCHOOL, MEHDIPATNAM---HH641</option>
<option value="GOWTHAM MODEL SCHOOL RTC X ROAD,HYD---HH272">GOWTHAM MODEL SCHOOL RTC X ROAD,HYD---HH272</option>
<option value="GOWTHAM MODEL SCHOOL,ST.NO.8, HABSHIGUDA.---R1195">GOWTHAM MODEL SCHOOL,ST.NO.8, HABSHIGUDA.---R1195</option>
<option value="GPS AZAMJAHI RD,KACHIGUDA---HG048">GPS AZAMJAHI RD,KACHIGUDA---HG048</option>
<option value="GPS, BABBUGUDA---RG259">GPS, BABBUGUDA---RG259</option>
<option value="GPS BALKAMPET,BORABANDA---H1007">GPS BALKAMPET,BORABANDA---H1007</option>
<option value="GPS CHENNAPUR.---RG048">GPS CHENNAPUR.---RG048</option>
<option value="GPS  DURGA BHAVANI NAGAR---HG010">GPS  DURGA BHAVANI NAGAR---HG010</option>
<option value="GPS GANGANAGAR,GOLNAKA---H9024">GPS GANGANAGAR,GOLNAKA---H9024</option>
<option value="GPS GULZARNAGAR.---HG004">GPS GULZARNAGAR.---HG004</option>
<option value="GPS HAFEEZPET---RG369">GPS HAFEEZPET---RG369</option>
<option value="GPS HARIJANWADI PURANAPOOL---H4114">GPS HARIJANWADI PURANAPOOL---H4114</option>
<option value="GPS IBRAHIPATNAM---R2119">GPS IBRAHIPATNAM---R2119</option>
<option value="GPS JAME OSMANIA---HG011">GPS JAME OSMANIA---HG011</option>
<option value="GPS KAMAN.---HG002">GPS KAMAN.---HG002</option>
<option value="GPS. KESHAV GIRI---H4100">GPS. KESHAV GIRI---H4100</option>
<option value="GPS KHAJAGUDA---R1942">GPS KHAJAGUDA---R1942</option>
<option value="GPS KOLTHUR---RG363">GPS KOLTHUR---RG363</option>
<option value="GPS LANGAR HOUSE---HG037">GPS LANGAR HOUSE---HG037</option>
<option value="GPS ,MAKTHA MAHABOOBPET.---RG315">GPS ,MAKTHA MAHABOOBPET.---RG315</option>
<option value="GPS ,MARREPALLY.---R2107">GPS ,MARREPALLY.---R2107</option>
<option value="GPS MARRIPALLY---RG276">GPS MARRIPALLY---RG276</option>
<option value="GPS MUDFORT---R9836">GPS MUDFORT---R9836</option>
<option value="GPS NALABAZAR, SECBAD---H3303">GPS NALABAZAR, SECBAD---H3303</option>
<option value="GPS NEW JANGAMMET---H2011">GPS NEW JANGAMMET---H2011</option>
<option value="GPS.NEW MARATHI PATIGADDA---H3017">GPS.NEW MARATHI PATIGADDA---H3017</option>
<option value="GPS NEW RAILWAY COLONY MOULALI---RG074">GPS NEW RAILWAY COLONY MOULALI---RG074</option>
<option value="GPS,  PARDAGATE, HIMAYATH NAGAR(M)---HG054">GPS,  PARDAGATE, HIMAYATH NAGAR(M)---HG054</option>
<option value="GPS PRABHATNAGAR,BORABANDA---H1002">GPS PRABHATNAGAR,BORABANDA---H1002</option>
<option value="GPS PRAGATHINAGAR,HYT.---RG218">GPS PRAGATHINAGAR,HYT.---RG218</option>
<option value="GPS RAJENDRANAGAR.---R9850">GPS RAJENDRANAGAR.---R9850</option>
<option value="GPS RAVINARAYANREDDY COLONY.---RG364">GPS RAVINARAYANREDDY COLONY.---RG364</option>
<option value="GPS RAYA RAOPET---NG003">GPS RAYA RAOPET---NG003</option>
<option value="GPS REZIMENTAL BAZAR---HG051">GPS REZIMENTAL BAZAR---HG051</option>
<option value="GPS SAHYANAGAR---H9913">GPS SAHYANAGAR---H9913</option>
<option value="GPS.SARDAR BAZAR BOLLARAM.---H9957">GPS.SARDAR BAZAR BOLLARAM.---H9957</option>
<option value="GPS SYED ALI GUDA ASIF NAGAR---H9010">GPS SYED ALI GUDA ASIF NAGAR---H9010</option>
<option value="GPS. TAKKIKOKA---H6310">GPS. TAKKIKOKA---H6310</option>
<option value="GPS TOLI CHOWKI---H7001">GPS TOLI CHOWKI---H7001</option>
<option value="G PULLA REDDY HIGH SCHOOL,MEHDIPATNAM.---H5801">G PULLA REDDY HIGH SCHOOL,MEHDIPATNAM.---H5801</option>
<option value="G.PULLA REDDY MEM. SCH. LALITHANAGR.DSNR---R2024">G.PULLA REDDY MEM. SCH. LALITHANAGR.DSNR---R2024</option>
<option value="GREEN FIELDS SCHOOL,VENKATARDI TOWNSHIP, KORREMULA ROAD---R2077">GREEN FIELDS SCHOOL,VENKATARDI TOWNSHIP, KORREMULA ROAD---R2077</option>
<option value="GUN ROCK ENCLAVE HIGH SCHOOL,KARKHANA,SECBAD.---R9956">GUN ROCK ENCLAVE HIGH SCHOOL,KARKHANA,SECBAD.---R9956</option>
<option value="GUPS AGAPALLY.---RG088">GUPS AGAPALLY.---RG088</option>
<option value="GUPS ALIABAD NO.2---H1304">GUPS ALIABAD NO.2---H1304</option>
<option value="GUPS. ASR CHANDULAL BARADARI---H9875">GUPS. ASR CHANDULAL BARADARI---H9875</option>
<option value="GUPS AZAMJAHI ROAD---H5304">GUPS AZAMJAHI ROAD---H5304</option>
<option value="GUPS BANDARAMARAM---RG010">GUPS BANDARAMARAM---RG010</option>
<option value="GUPS BANDIMET, BEGUMPET---H3309">GUPS BANDIMET, BEGUMPET---H3309</option>
<option value="GUPS BANZARA HILLS---H7301">GUPS BANZARA HILLS---H7301</option>
<option value="GUPS BHAGAT SINGH OLD MALEPALL---H9303">GUPS BHAGAT SINGH OLD MALEPALL---H9303</option>
<option value="GUPS CHANCHALGUDA---H0301">GUPS CHANCHALGUDA---H0301</option>
<option value="GUPS CHANDRA SHEKAR AZAD---H9309">GUPS CHANDRA SHEKAR AZAD---H9309</option>
<option value="GUPS CHAWNINADEALIBAIG NO.1---H6305">GUPS CHAWNINADEALIBAIG NO.1---H6305</option>
<option value="GUPS CHELAPURA---H1309">GUPS CHELAPURA---H1309</option>
<option value="GUPS CHINTALGUDA KHAIRATABAD---H8305">GUPS CHINTALGUDA KHAIRATABAD---H8305</option>
<option value="GUPS CHOWRAHA JINSI HAKEEMPET---H7302">GUPS CHOWRAHA JINSI HAKEEMPET---H7302</option>
<option value="GUPS DABILPURA---RG008">GUPS DABILPURA---RG008</option>
<option value="GUPS GACHIBOWLI---RG109">GUPS GACHIBOWLI---RG109</option>
<option value="GUPS GOMARAM---RG007">GUPS GOMARAM---RG007</option>
<option value="GUPS GOPINAGAR---RG116">GUPS GOPINAGAR---RG116</option>
<option value="GUPS GOSHA MAHAL GANDHIBHAVAN---H9831">GUPS GOSHA MAHAL GANDHIBHAVAN---H9831</option>
<option value="GUPS GULZARNAGAR---RG113">GUPS GULZARNAGAR---RG113</option>
<option value="GUPS HAMAMBOWLI, CHARMINAR---H6303">GUPS HAMAMBOWLI, CHARMINAR---H6303</option>
<option value="GUPS HIMAYATH NAGAR---H4301">GUPS HIMAYATH NAGAR---H4301</option>
<option value="G.U.P.S HINDINAGAR---H7003">G.U.P.S HINDINAGAR---H7003</option>
<option value="GUPS III BETALIAN KHAIRATABAD---H9943">GUPS III BETALIAN KHAIRATABAD---H9943</option>
<option value="GUPS IMAMPURA ZIAGUDA---H9011">GUPS IMAMPURA ZIAGUDA---H9011</option>
<option value="GUPS JANGAMMET---H2305">GUPS JANGAMMET---H2305</option>
<option value="GUPS KALADERA---H0302">GUPS KALADERA---H0302</option>
<option value="GUPS KALVAGADDA---H2304">GUPS KALVAGADDA---H2304</option>
<option value="GUPS KAMATIPURA---H9007">GUPS KAMATIPURA---H9007</option>
<option value="GUPS.KOKERWADI---H1307">GUPS.KOKERWADI---H1307</option>
<option value="GUPS. MAILARGUDA---H9997">GUPS. MAILARGUDA---H9997</option>
<option value="GUPS MOINABAD---RG194">GUPS MOINABAD---RG194</option>
<option value="GUPS MURAD NAGAR HUMAYUN NAGAR---H9939">GUPS MURAD NAGAR HUMAYUN NAGAR---H9939</option>
<option value="GUPS NAMPALLY NEW MALLEPALLY---H9310">GUPS NAMPALLY NEW MALLEPALLY---H9310</option>
<option value="GUPS NANDI NAGAR---H9008">GUPS NANDI NAGAR---H9008</option>
<option value="GUPS.PIONEER BAZAR BOLLARAM---H9956">GUPS.PIONEER BAZAR BOLLARAM---H9956</option>
<option value="GUPS RAHEEMPURA---H9308">GUPS RAHEEMPURA---H9308</option>
<option value="GUPS. RAIN BAZAR---H6312">GUPS. RAIN BAZAR---H6312</option>
<option value="GUPS RAMKOTE---H5302">GUPS RAMKOTE---H5302</option>
<option value="GUPS RIYASATNAGAR---HG046">GUPS RIYASATNAGAR---HG046</option>
<option value="GUPS SEETARAMPET---H9306">GUPS SEETARAMPET---H9306</option>
<option value="GUPS SOMAJIGUDA---H8306">GUPS SOMAJIGUDA---H8306</option>
<option value="GUPS (SS) HIMAYATHNAGAR---H5301">GUPS (SS) HIMAYATHNAGAR---H5301</option>
<option value="GUPS STATION DABEERPURA---H0306">GUPS STATION DABEERPURA---H0306</option>
<option value="GUPS STN ROAD KACHIGUDA---H5305">GUPS STN ROAD KACHIGUDA---H5305</option>
<option value="GUPS SUTANPURA---H0303">GUPS SUTANPURA---H0303</option>
<option value="GUPS TADABAND INDIRA NAGAR---H4111">GUPS TADABAND INDIRA NAGAR---H4111</option>
<option value="GUPS TATTIKOKA NO1---H6311">GUPS TATTIKOKA NO1---H6311</option>
<option value="GUPS T.D.SINGH, HAFEEZ BABANGR---H2302">GUPS T.D.SINGH, HAFEEZ BABANGR---H2302</option>
<option value="GUPS TEGA, DABEERPURA---H0307">GUPS TEGA, DABEERPURA---H0307</option>
<option value="GUPS(URDU), NARSING---R2002">GUPS(URDU), NARSING---R2002</option>
<option value="GUPS VENGAL RAONAGAR---H8301">GUPS VENGAL RAONAGAR---H8301</option>
<option value="GUPS YELLAREDDY GUDA NO.1---H8307">GUPS YELLAREDDY GUDA NO.1---H8307</option>
<option value="GUPS YELLAREDDY GUDA NO.2---H8303">GUPS YELLAREDDY GUDA NO.2---H8303</option>
<option value="GURUNANAK HIGH SCHOOL ATTAPUR---R1503">GURUNANAK HIGH SCHOOL ATTAPUR---R1503</option>


<option value="HAL HIGH SCHOOL,BALANAGAR---HH085">HAL HIGH SCHOOL,BALANAGAR---HH085</option>
<option value="HAPPY ROSARY NIKETAN HIGH SCHOOL, ASIF NAGAR, HYD---H9503">HAPPY ROSARY NIKETAN HIGH SCHOOL, ASIF NAGAR, HYD---H9503</option>
<option value="HARI HARA GRAMMAR SCHOOL,NAGOLE.---R9980">HARI HARA GRAMMAR SCHOOL,NAGOLE.---R9980</option>
<option value="HAYATHNAGAR HIGH SCHOOL,HAYATHNAGAR.---R1318">HAYATHNAGAR HIGH SCHOOL,HAYATHNAGAR.---R1318</option>
<option value="HELEN KELLERS SCHOOL FOR DEAF AND MENT.RETARDED CHIDREN,RK PURAM---R2321">HELEN KELLERS SCHOOL FOR DEAF AND MENT.RETARDED CHIDREN,RK PURAM---R2321</option>
<option value="HERALDS HIGH SCHOOL. KRANTHI HILLS,V.PURAM---R9777">HERALDS HIGH SCHOOL. KRANTHI HILLS,V.PURAM---R9777</option>
<option value="HINDU PUBLIC SCHOOL,SANATHA NAGAR---H1893">HINDU PUBLIC SCHOOL,SANATHA NAGAR---H1893</option>
<option value="HOLY ANGELS HIGH SCHOOL,BOLLARUM,SECBAD.---R1383">HOLY ANGELS HIGH SCHOOL,BOLLARUM,SECBAD.---R1383</option>
<option value="HOLY FAITH GRAMMAR HIGH SCH. GTKSR,---R9811">HOLY FAITH GRAMMAR HIGH SCH. GTKSR,---R9811</option>
<option value="HOLY FAITH H SCHOOL MACHBOLARAM---R1255">HOLY FAITH H SCHOOL MACHBOLARAM---R1255</option>
<option value="HOLY ZION HIGH SCHOOL, JAWAHAR NAGAR,SECBAD---R1480">HOLY ZION HIGH SCHOOL, JAWAHAR NAGAR,SECBAD---R1480</option>
<option value="HOPE FOUNDATION SCHOOL, CHENGICHERLA---R2381">HOPE FOUNDATION SCHOOL, CHENGICHERLA---R2381</option>
<option value="HRD SCHOOL OF EXCELLENCE, SITHARAMPET, IBP.---R2386">HRD SCHOOL OF EXCELLENCE, SITHARAMPET, IBP.---R2386</option>
<option value="HUDA PRIMARY SCHOOL,SULTANSHAH---H6212">HUDA PRIMARY SCHOOL,SULTANSHAH---H6212</option>
<option value="HYDERABAD PUBLIC SCHOOL,BEGUMPET---H1201">HYDERABAD PUBLIC SCHOOL,BEGUMPET---H1201</option>
<option value="HYDERABAD SAINIK HIGH SCHOOL,SANTOSHNAGAR X RD---H0820">HYDERABAD SAINIK HIGH SCHOOL,SANTOSHNAGAR X RD---H0820</option>
<option value="HYD PUBLIC SCH. RAMANTHAPUR.---R9889">HYD PUBLIC SCH. RAMANTHAPUR.---R9889</option>
<option value="ICFAI REPUBLIC SCH,IDPL COLNY,BLN.---R1721">ICFAI REPUBLIC SCH,IDPL COLNY,BLN.---R1721</option>
<option value="ICF SCHOOL,AMBOTH THANDA, MANCHAL---R1348">ICF SCHOOL,AMBOTH THANDA, MANCHAL---R1348</option>
<option value="IDEAL GRAMMAR SCHOOL,BONGLOOR X RD.---R1279">IDEAL GRAMMAR SCHOOL,BONGLOOR X RD.---R1279</option>
<option value="IICT-ZM HIGH SCHOOL,HABSIGUDA---R1655">IICT-ZM HIGH SCHOOL,HABSIGUDA---R1655</option>
<option value="ILAPUR P.S---M0008">ILAPUR P.S---M0008</option>
<option value="ILAPUR TANDA P.S---M0031">ILAPUR TANDA P.S---M0031</option>
<option value="INDIAN PEOPLE HIGH SCHOOL,RAIDURGA,HYD./S - RAI DURG---R1028">INDIAN PEOPLE HIGH SCHOOL,RAIDURGA,HYD./S - RAI DURG---R1028</option>
<option value="INDIAN PUBLIC SCHOOL,MANCHAL ROAD, IBP.---R2364">INDIAN PUBLIC SCHOOL,MANCHAL ROAD, IBP.---R2364</option>
<option value="INDIRA NAGAR P.S---M0092">INDIRA NAGAR P.S---M0092</option>
<option value="INDRESHAM P.S---M0009">INDRESHAM P.S---M0009</option>
<option value="INFANT JESUS INTERNATIONAL SCHOOL VELANKANNI NAGAR SHAMSHABAD.---R2229">INFANT JESUS INTERNATIONAL SCHOOL VELANKANNI NAGAR SHAMSHABAD.---R2229</option>
<option value="INOLE P.S---M0010">INOLE P.S---M0010</option>
<option value="IQRA HIGH SCHOOL  MAHABOOB COLONY,ASIFNAGAR.---H1531">IQRA HIGH SCHOOL  MAHABOOB COLONY,ASIFNAGAR.---H1531</option>
<option value="IRIS EDU VALLEY SCHOOL,RAMPALLY---H0818">IRIS EDU VALLEY SCHOOL,RAMPALLY---H0818</option>
<option value="ISLAMIAH BOYS HIGH SCHOOL,MONDA MARKET,SECBAD.---H3720">ISLAMIAH BOYS HIGH SCHOOL,MONDA MARKET,SECBAD.---H3720</option>
<option value="ISNAPUR M.P.H.S---M0051">ISNAPUR M.P.H.S---M0051</option>
<option value="JAGRUTHI HIGH SCHOOL, VIJAYANAGAR COLONY MOINABAD---R1820">JAGRUTHI HIGH SCHOOL, VIJAYANAGAR COLONY MOINABAD---R1820</option>
<option value="JAMIA DARUL HUDA HIGH SCHOOL,WADI-E-HUDA,JALPALLY.---R2084">JAMIA DARUL HUDA HIGH SCHOOL,WADI-E-HUDA,JALPALLY.---R2084</option>
<option value="JANAKAM PET P.S---M0012">JANAKAM PET P.S---M0012</option>
<option value="JAWAHAR NAGAR PINION SCHOOL, BALAJINAGAR,JAWAHARNAGAR,KAPRA(M)---R1471">JAWAHAR NAGAR PINION SCHOOL, BALAJINAGAR,JAWAHARNAGAR,KAPRA(M)---R1471</option>
<option value="JOHNSON GRAMMAR SCHOOL, NACHARAM---HH507">JOHNSON GRAMMAR SCHOOL, NACHARAM---HH507</option>
<option value="JOHNSON GRAM SCHOOL - NACHARAM---R1016">JOHNSON GRAM SCHOOL - NACHARAM---R1016</option>
<option value="JOHNSON GRAM SCH ST.3,KAKATIYANAGAR.HABSIGUDA---HH200">JOHNSON GRAM SCH ST.3,KAKATIYANAGAR.HABSIGUDA---HH200</option>
<option value="JOHNSON GRMR SCH. HUBSIGUDA---R9747">JOHNSON GRMR SCH. HUBSIGUDA---R9747</option>
<option value="JOVIAL HIGH SCHOOL, YACHARAM---R1322">JOVIAL HIGH SCHOOL, YACHARAM---R1322</option>
<option value="KAKATIYA HIGH SCHOOL,MOINABAD.---R2033">KAKATIYA HIGH SCHOOL,MOINABAD.---R2033</option>
<option value="KAKATIYA SCHOOL BAGH HAYATHNAGAR---R9568">KAKATIYA SCHOOL BAGH HAYATHNAGAR---R9568</option>
<option value="KAKATIYA SCHOOL, ECIL---R2404">KAKATIYA SCHOOL, ECIL---R2404</option>
<option value="KAKATIYA VIDYA NIKETAN HIGH SCHOOL,KAKATIYANAGAR.---HH041">KAKATIYA VIDYA NIKETAN HIGH SCHOOL,KAKATIYANAGAR.---HH041</option>
<option value="KALLAM ANJI REDDY VIDYALAYA,MADINAGUDA---R1285">KALLAM ANJI REDDY VIDYALAYA,MADINAGUDA---R1285</option>
<option value="KAMALA MEMO HIGH SCHOOL,ANNAPURNA COLONY,NACHARAM.---R9658">KAMALA MEMO HIGH SCHOOL,ANNAPURNA COLONY,NACHARAM.---R9658</option>
<option value="KAMALA RANI SANGHI PUB SCHOOL,SANGHI NAGAR---R1443">KAMALA RANI SANGHI PUB SCHOOL,SANGHI NAGAR---R1443</option>
<option value="KANCHARLA GUDA P.S---M0013">KANCHARLA GUDA P.S---M0013</option>
<option value="KANYA GURUKUL H.S,AMEERPET---HH324">KANYA GURUKUL H.S,AMEERPET---HH324</option>
<option value="KARDANOOR P.S---M0014">KARDANOOR P.S---M0014</option>
<option value="KARMIKA VIDYA KENDRAM H.SCH,AZAMABAD---H4720">KARMIKA VIDYA KENDRAM H.SCH,AZAMABAD---H4720</option>
<option value="KASIREDDYPALLY P.S---M0085">KASIREDDYPALLY P.S---M0085</option>
<option value="K.B.SAINIK SCHOOL,T.YAMJAL---R1354">K.B.SAINIK SCHOOL,T.YAMJAL---R1354</option>
<option value="KESHAV MEMORIAL HIGH SCHOOL,  NARAYANAGUDA---H5814">KESHAV MEMORIAL HIGH SCHOOL,  NARAYANAGUDA---H5814</option>
<option value="K.G.K. VIDYA BHAVAN GANDHI NGR---H4534">K.G.K. VIDYA BHAVAN GANDHI NGR---H4534</option>
<option value="KING VICTORS GRAMMAR SCHOOL H B COLONY MEDCHAL---R2089">KING VICTORS GRAMMAR SCHOOL H B COLONY MEDCHAL---R2089</option>
<option value="KLN VIDYA NIKETAN, BOMMARASIPET---R1179">KLN VIDYA NIKETAN, BOMMARASIPET---R1179</option>
<option value="KNR HIGH SCHOOL THOLKATTA.---R1780">KNR HIGH SCHOOL THOLKATTA.---R1780</option>
<option value="KOTHA YELLAIAH MEMO HIGH SCH,SOMASUNDRAM STREET,SECBAD..---H3811">KOTHA YELLAIAH MEMO HIGH SCH,SOMASUNDRAM STREET,SECBAD..---H3811</option>
<option value="KRANTHI HIGH SCHOOL, LANGER HOUSE.---H5519">KRANTHI HIGH SCHOOL, LANGER HOUSE.---H5519</option>
<option value="KRISHNAVENI HIGH SCHOOL PATELGUDA PATANCHERU---R1647">KRISHNAVENI HIGH SCHOOL PATELGUDA PATANCHERU---R1647</option>
<option value="KRISHNAVENI HSC, MASJIDPUR,SHAMIRPET(M)---R2201">KRISHNAVENI HSC, MASJIDPUR,SHAMIRPET(M)---R2201</option>
<option value="KRISHNAVENI SCHOOL BANDLAGUDA NAGOLE---R9584">KRISHNAVENI SCHOOL BANDLAGUDA NAGOLE---R9584</option>
<option value="KRISHNAVENI SCHOOL CHILKA NAGAR, UPPAL---R2242">KRISHNAVENI SCHOOL CHILKA NAGAR, UPPAL---R2242</option>
<option value="KRISHNAVENI SCHOOL,MEDCHAL---R2299">KRISHNAVENI SCHOOL,MEDCHAL---R2299</option>
<option value="KRISHNAVENI SCHOOL,NFC MALALPUR.---R2109">KRISHNAVENI SCHOOL,NFC MALALPUR.---R2109</option>
<option value="KRISHNAVENI TALENT SCHOOL,ATTAPUR---R1632">KRISHNAVENI TALENT SCHOOL,ATTAPUR---R1632</option>
<option value="KRISHNAVENI TALENT SCHOOL, BAGHHAYATHNAGAR, HAYATHNAGAR.---R2365">KRISHNAVENI TALENT SCHOOL, BAGHHAYATHNAGAR, HAYATHNAGAR.---R2365</option>
<option value="KRISHNAVENI TALENT SCHOOL IBRAHIMPATNAM.---R1792">KRISHNAVENI TALENT SCHOOL IBRAHIMPATNAM.---R1792</option>
<option value="KRISHNAVENI TALENT SCHOOL,PEERUMCHERVU---R1935">KRISHNAVENI TALENT SCHOOL,PEERUMCHERVU---R1935</option>
<option value="KRISHNAVENI TALENT SCHOOL,SHAMSHABAD---R1922">KRISHNAVENI TALENT SCHOOL,SHAMSHABAD---R1922</option>
<option value="KRUSHI HIGH SCHOOL,SURARAM COLONY.---MD004">KRUSHI HIGH SCHOOL,SURARAM COLONY.---MD004</option>
<option value="K V AFS BEGUMPET---HH060">K V AFS BEGUMPET---HH060</option>
<option value="K V AIR FORCE HPT---R1050">K V AIR FORCE HPT---R1050</option>
<option value="K V BOLLARAM---R9606">K V BOLLARAM---R9606</option>
<option value="K V BOLLARAM---R9894">K V BOLLARAM---R9894</option>
<option value="K.V ,BOWENPALY---HH227">K.V ,BOWENPALY---HH227</option>
<option value="K V CRPF BARKAS---H2961">K V CRPF BARKAS---H2961</option>
<option value="K V GACHIBOWLI---R9761">K V GACHIBOWLI---R9761</option>
<option value="K V GOLCONDA---H5962">K V GOLCONDA---H5962</option>
<option value="K V KANCHANBAGH---HH016">K V KANCHANBAGH---HH016</option>
<option value="K.V KANCHANBAGH---R9675">K.V KANCHANBAGH---R9675</option>
<option value="K V LANGARHOUSE---HG027">K V LANGARHOUSE---HG027</option>
<option value="K V NFC NAGAR---R9867">K V NFC NAGAR---R9867</option>
<option value="KV NO.1 AFA DUNDIGAL,HYD.---RG375">KV NO.1 AFA DUNDIGAL,HYD.---RG375</option>
<option value="K V NO 1 UPPAL X RD---H5963">K V NO 1 UPPAL X RD---H5963</option>
<option value="K.V NO.2 AIR FORCE ADY---R1538">K.V NO.2 AIR FORCE ADY---R1538</option>
<option value="K V NO 2 UPPAL.---R9501">K V NO 2 UPPAL.---R9501</option>
<option value="K V ORDNANCE FACTORY EDDUMYLARAM---M166">K V ORDNANCE FACTORY EDDUMYLARAM---M166</option>
<option value="K V PICKET---R9605">K V PICKET---R9605</option>
<option value="K V PICKET---HH089">K V PICKET---HH089</option>
<option value="K V SHIVARAMPALLY---R9940">K V SHIVARAMPALLY---R9940</option>
<option value="K.V SHIVARAMPALLY---R9607">K.V SHIVARAMPALLY---R9607</option>
<option value="K.V TRIMULGHEERY---HH205">K.V TRIMULGHEERY---HH205</option>
<option value="K V TRIMULGHERRY---R9604">K V TRIMULGHERRY---R9604</option>
<option value="KV, UNIVERSITY OF HYD.---R9854">KV, UNIVERSITY OF HYD.---R9854</option>
<option value="KYASARAM U.P.S.---M0039">KYASARAM U.P.S.---M0039</option>

<option value="LAKDARAM P.S---M0015">LAKDARAM P.S---M0015</option>
<option value="LITTLE ANGELS CONVENT SHCOOL ,RAGHAVENDRANAGAR.HYT.---R1019">LITTLE ANGELS CONVENT SHCOOL ,RAGHAVENDRANAGAR.HYT.---R1019</option>
<option value="LITTLE ANGELS SCHOOL,THUKKUGUA---R1134">LITTLE ANGELS SCHOOL,THUKKUGUA---R1134</option>
<option value="LITTLE FLOWER HIGH SCHOOL OLD ALWAL.---HH417">LITTLE FLOWER HIGH SCHOOL OLD ALWAL.---HH417</option>
<option value="LITTLE FLOWER HIGH SCHOOLPADMASHALI CLY HYD.---HH406">LITTLE FLOWER HIGH SCHOOLPADMASHALI CLY HYD.---HH406</option>
<option value="LITTLE FLOWER H SC.  ABIDS---HH025">LITTLE FLOWER H SC.  ABIDS---HH025</option>
<option value="LITTLE FLOWER SCHOOL,UPPAL.L---R1360">LITTLE FLOWER SCHOOL,UPPAL.L---R1360</option>
<option value="LITTLE ROSE HIGH SCHOOL,SHAMSHABAD---R9785">LITTLE ROSE HIGH SCHOOL,SHAMSHABAD---R9785</option>
<option value="LITTLE SAINTS P.SCH OLD MALAKP---H5211">LITTLE SAINTS P.SCH OLD MALAKP---H5211</option>
<option value="LITTLE SCOLARS MODEL SCH.,VELIMELA.---M0144">LITTLE SCOLARS MODEL SCH.,VELIMELA.---M0144</option>
<option value="LITTLE STARS HIGH SCHOOL,MOINABAD.---H0535">LITTLE STARS HIGH SCHOOL,MOINABAD.---H0535</option>
<option value="LITTLE TULIPS SCHOOL---H5510">LITTLE TULIPS SCHOOL---H5510</option>
<option value="LNR CONCEPT SCHOOL,KALIKA MANDIR,RAJENDRANAGAR.---R1917">LNR CONCEPT SCHOOL,KALIKA MANDIR,RAJENDRANAGAR.---R1917</option>
<option value="LORVENS SCHOOL,KEESARA---R2141">LORVENS SCHOOL,KEESARA---R2141</option>
<option value="LOTUS LAP HIGH SCHOOL HAYATHNAGAR.---R1508">LOTUS LAP HIGH SCHOOL HAYATHNAGAR.---R1508</option>
<option value="LOTUS LAP HIGH SCHOOL , LALITHA NAGAR, DILSHUKNAGAR.---R2277">LOTUS LAP HIGH SCHOOL , LALITHA NAGAR, DILSHUKNAGAR.---R2277</option>
<option value="LOYALA MODEL HIGH SCHOOL,VANASTHALIPURAM.---R9737">LOYALA MODEL HIGH SCHOOL,VANASTHALIPURAM.---R9737</option>
<option value="MAHABUB COLLEGE HIGH SCHOOL---H3719">MAHABUB COLLEGE HIGH SCHOOL---H3719</option>
<option value="MAHARSHI MODEL SCHOOL,YENKIRYAL---R1372">MAHARSHI MODEL SCHOOL,YENKIRYAL---R1372</option>
<option value="MAHATMA GANDHI MEMO H.SCH,BAPUGHAT,L.HOUSE.---H8814">MAHATMA GANDHI MEMO H.SCH,BAPUGHAT,L.HOUSE.---H8814</option>
<option value="MAHESH VIDYA BHAVAN HIGH SCHOOL,SHIVARAMPALLY.---R9887">MAHESH VIDYA BHAVAN HIGH SCHOOL,SHIVARAMPALLY.---R9887</option>
<option value="MALIK HIGH SCHOOL,LALGADI MALAKPET---R1189">MALIK HIGH SCHOOL,LALGADI MALAKPET---R1189</option>
<option value="MAMATHA HIGH SCHOOL,MOINABAD---H3804">MAMATHA HIGH SCHOOL,MOINABAD---H3804</option>
<option value="MANDAL PARISHAT PRIMARY SCHOOL PEDDA AMBERPET---RG100">MANDAL PARISHAT PRIMARY SCHOOL PEDDA AMBERPET---RG100</option>
<option value="MARKS NAGAR P.S---M0088">MARKS NAGAR P.S---M0088</option>
<option value="MARWADI HINDI VIDYALAYA HIGH SCHOOL BEGUM BAZAR---HH658">MARWADI HINDI VIDYALAYA HIGH SCHOOL BEGUM BAZAR---HH658</option>
<option value="MARWADI HINDI VIDYALAYA H.S ESAMIABAZAR---HH656">MARWADI HINDI VIDYALAYA H.S ESAMIABAZAR---HH656</option>
<option value="MARY IMMACULATE HIGH SCHOOL,PATIGADDA---R2417">MARY IMMACULATE HIGH SCHOOL,PATIGADDA---R2417</option>
<option value="MARY MOTHER OF DIVINE GRACE SCHOOL, CHERIYAL---R2189">MARY MOTHER OF DIVINE GRACE SCHOOL, CHERIYAL---R2189</option>
<option value="MASTERS GRAMMAR HIGH SCHOOL, NEW NAGOLE---R1469">MASTERS GRAMMAR HIGH SCHOOL, NEW NAGOLE---R1469</option>
<option value="MATHRUSRI H.S MALKAJIGIRI---R9689">MATHRUSRI H.S MALKAJIGIRI---R9689</option>
<option value="M B GRAMMAR HIGH SCHOOL, SURARAM COLONY, QUTHBULLAPUR(M)---R1374">M B GRAMMAR HIGH SCHOOL, SURARAM COLONY, QUTHBULLAPUR(M)---R1374</option>
<option value="MEGA CITY HSC, HAYATH NGR---R9902">MEGA CITY HSC, HAYATH NGR---R9902</option>
<option value="MGM GGHS NAMPALLY---H6609">MGM GGHS NAMPALLY---H6609</option>
<option value="MILAT MODEL SCHOOL,CHILKALGUDA---HH309">MILAT MODEL SCHOOL,CHILKALGUDA---HH309</option>
<option value="MILLENIUM H IGH SCHOOL,RAJAPPA NAGAR, VANASTHALIPURAM---R1319">MILLENIUM H IGH SCHOOL,RAJAPPA NAGAR, VANASTHALIPURAM---R1319</option>
<option value="MMPS SEETHAVANI GUDEM---NG027">MMPS SEETHAVANI GUDEM---NG027</option>
<option value="MODEL HIGH SCHOOL,OU,CAMPUS,HYD.---H0713">MODEL HIGH SCHOOL,OU,CAMPUS,HYD.---H0713</option>
<option value="MODEL MISSION HIGH SCHOOL,BOLLARAM---R9734">MODEL MISSION HIGH SCHOOL,BOLLARAM---R9734</option>
<option value="MODEL MISSION HSC LOTHKUNTA---R9763">MODEL MISSION HSC LOTHKUNTA---R9763</option>
<option value="MOHAMMAD HUSSAIN ZPHS---RG308">MOHAMMAD HUSSAIN ZPHS---RG308</option>
<option value="MOTHER THERESA HIGH SCHOOL, VENKATESHWARA NAGAR, MOULALI---R9847">MOTHER THERESA HIGH SCHOOL, VENKATESHWARA NAGAR, MOULALI---R9847</option>
<option value="MOULANA AZAD NATIONAL URDU UNIVERSITY MODEL SCHOOL---HH648">MOULANA AZAD NATIONAL URDU UNIVERSITY MODEL SCHOOL---HH648</option>
<option value="MOUNT CARMEL HIGH SCHOOL,NEW BOWENPALLY.---H2802">MOUNT CARMEL HIGH SCHOOL,NEW BOWENPALLY.---H2802</option>
<option value="MOUNT HELICON PUBLIC SCHOOL,SOMAJIGUDA---H1814">MOUNT HELICON PUBLIC SCHOOL,SOMAJIGUDA---H1814</option>
<option value="MPC UPPER PRIMARY SCHOOL NACHARAM---R1147">MPC UPPER PRIMARY SCHOOL NACHARAM---R1147</option>
<option value="MPCUPS INJAPUR---RG122">MPCUPS INJAPUR---RG122</option>
<option value="MPCUPS KUNTLOOR.---RG214">MPCUPS KUNTLOOR.---RG214</option>
<option value="MPHS AMEENPUR---M0048">MPHS AMEENPUR---M0048</option>
<option value="MPHS CHILKANAGAR.---RG222">MPHS CHILKANAGAR.---RG222</option>
<option value="MPHS RAMANJAPUR,SHAMSHABAD---RG372">MPHS RAMANJAPUR,SHAMSHABAD---RG372</option>
<option value="MPP MEDCHAL HARIZANWADA---RG185">MPP MEDCHAL HARIZANWADA---RG185</option>
<option value="MPP PRIMARY SCHOOL,KUNDANPALLY---R2131">MPP PRIMARY SCHOOL,KUNDANPALLY---R2131</option>
<option value="M.P.PRIMARY SCHOOL,DAMMAIGUDA---RG092">M.P.PRIMARY SCHOOL,DAMMAIGUDA---RG092</option>
<option value="MPPS ADRASPALLY---R9810">MPPS ADRASPALLY---R9810</option>
<option value="MPPS ALINAGAR,JINNARAM---MG032">MPPS ALINAGAR,JINNARAM---MG032</option>
<option value="MPPS ANANTHARAM---RG350">MPPS ANANTHARAM---RG350</option>
<option value="MPPS APPOJIGUDA,MOINABAD(M)---R1303">MPPS APPOJIGUDA,MOINABAD(M)---R1303</option>
<option value="MPPS AZIZNAGAR,MOINABAD---R9878">MPPS AZIZNAGAR,MOINABAD---R9878</option>
<option value="MPPS BAHADURGUDA, LB NAGAR---RG215">MPPS BAHADURGUDA, LB NAGAR---RG215</option>
<option value="MPPS BAIRAGIGUDA---RG036">MPPS BAIRAGIGUDA---RG036</option>
<option value="MPPS BAKARAM---RG173">MPPS BAKARAM---RG173</option>
<option value="MPPS BALAJINAGAR---RG195">MPPS BALAJINAGAR---RG195</option>
<option value="MPPS BALAPUR---RG002">MPPS BALAPUR---RG002</option>
<option value="MPPS BANDA MADHAVARAM---R1747">MPPS BANDA MADHAVARAM---R1747</option>
<option value="M.P.PS. BANDAMILARAM---MG134">M.P.PS. BANDAMILARAM---MG134</option>
<option value="MPPS, BANDLAGUDA---M0087">MPPS, BANDLAGUDA---M0087</option>
<option value="MPPS BASWAPUR---M157">MPPS BASWAPUR---M157</option>
<option value="MPPS BEERAMGUDA---M0124">MPPS BEERAMGUDA---M0124</option>
<option value="MPPS BHARSHAPET---RG286">MPPS BHARSHAPET---RG286</option>
<option value="MPPS BHOODAN POCHAMPALLY---NG028">MPPS BHOODAN POCHAMPALLY---NG028</option>
<option value="MPPS BOMMARASIPET---RG357">MPPS BOMMARASIPET---RG357</option>
<option value="MPPS BUDWEL---RG252">MPPS BUDWEL---RG252</option>
<option value="MPPS CHANDANAGAR, MOINABAD(M)---HG041">MPPS CHANDANAGAR, MOINABAD(M)---HG041</option>
<option value="MPPS CHARAKONDA---NG040">MPPS CHARAKONDA---NG040</option>
<option value="MPPS CHERLAPALLY---RG188">MPPS CHERLAPALLY---RG188</option>
<option value="MPPS CHINNA MANGALARAM---RG396">MPPS CHINNA MANGALARAM---RG396</option>
<option value="MPPS DEVENDER NAGAR BODUPPAL---R9527">MPPS DEVENDER NAGAR BODUPPAL---R9527</option>
<option value="MPPS DEVUNI YERRAVALLY,CHEVELLA(M)---R1846">MPPS DEVUNI YERRAVALLY,CHEVELLA(M)---R1846</option>
<option value="MPPS DUDDAGU,CHEVELLA(M)---R1972">MPPS DUDDAGU,CHEVELLA(M)---R1972</option>
<option value="MPPS ETHBARPALLY,MOINABAD(M)---R1834">MPPS ETHBARPALLY,MOINABAD(M)---R1834</option>
<option value="MPPS GANDHAMGUDA---RG273">MPPS GANDHAMGUDA---RG273</option>
<option value="MPPS. GHATKESAR.---RG221">MPPS. GHATKESAR.---RG221</option>
<option value="MPPS GIRLS MALKAJGIRI---RG373">MPPS GIRLS MALKAJGIRI---RG373</option>
<option value="MPPS INDIRANAGAR,VSPM.---HG030">MPPS INDIRANAGAR,VSPM.---HG030</option>
<option value="MPPS IRWIN---R1977">MPPS IRWIN---R1977</option>
<option value="MPPS JAGADGIRI NAGAR---RG377">MPPS JAGADGIRI NAGAR---RG377</option>
<option value="MPPS JAIPURI COLONY,UPPAL(M)---H6205">MPPS JAIPURI COLONY,UPPAL(M)---H6205</option>
<option value="MPPS J J NAGAR KEESAR---R1959">MPPS J J NAGAR KEESAR---R1959</option>
<option value="MPPS KAKNOOR.---MB004">MPPS KAKNOOR.---MB004</option>
<option value="M.P.P.S KALAKAL---MG135">M.P.P.S KALAKAL---MG135</option>
<option value="MPPS KANAKAMAMIDI,MOINABAD(M)---R1423">MPPS KANAKAMAMIDI,MOINABAD(M)---R1423</option>
<option value="MPPS,KANDAWADA,CHEVELLA---R1533">MPPS,KANDAWADA,CHEVELLA---R1533</option>
<option value="MPPS KANDLAKOYA---RG270">MPPS KANDLAKOYA---RG270</option>
<option value="MPPS KAPRA---R1899">MPPS KAPRA---R1899</option>
<option value="MPPS KARMANGHAT---RG-398">MPPS KARMANGHAT---RG-398</option>
<option value="MPPS KARMANGHAT.---RG398">MPPS KARMANGHAT.---RG398</option>
<option value="MPPS,  KEESARAGUTTA---RG391">MPPS,  KEESARAGUTTA---RG391</option>
<option value="MPPS KETHIREDDYPALLY,MOINABAD---R9500">MPPS KETHIREDDYPALLY,MOINABAD---R9500</option>
<option value="MPPS KISMATPUR, GANDIPET(M)---RG072">MPPS KISMATPUR, GANDIPET(M)---RG072</option>
<option value="MPPS KOHEDA.---RG202">MPPS KOHEDA.---RG202</option>
<option value="MPPS KONDAMADUGU BIBINAGAR---NG036">MPPS KONDAMADUGU BIBINAGAR---NG036</option>
<option value="MPPS KONDAPUR GHATKESAR---R9512">MPPS KONDAPUR GHATKESAR---R9512</option>
<option value="MPPS KORLAKUNTA.---R1531">MPPS KORLAKUNTA.---R1531</option>
<option value="MPPS KOTHAGUDA SLINGAMPALLY---RG200">MPPS KOTHAGUDA SLINGAMPALLY---RG200</option>
<option value="MPPS KOTHAPALLY,SHANKARPALLY---R9873">MPPS KOTHAPALLY,SHANKARPALLY---R9873</option>
<option value="MPPS KOTHAPET---R2117">MPPS KOTHAPET---R2117</option>
<option value="MPPS LOYAPALLY---RG016">MPPS LOYAPALLY---RG016</option>
<option value="MPPS MACHA BOLLARAM---R2133">MPPS MACHA BOLLARAM---R2133</option>
<option value="MPPS MADHUBAN COLONY RJNR.---RG329">MPPS MADHUBAN COLONY RJNR.---RG329</option>
<option value="MPPS MAILARDEVPALLY---R1057">MPPS MAILARDEVPALLY---R1057</option>
<option value="MPPS MALKARAM---RG027">MPPS MALKARAM---RG027</option>
<option value="MPPS MAMBAPUR.---RG281">MPPS MAMBAPUR.---RG281</option>
<option value="MPPS MAMIDIPALLY---RG012">MPPS MAMIDIPALLY---RG012</option>
<option value="MPPS MANCHIREVULA,RR DIT---R2239">MPPS MANCHIREVULA,RR DIT---R2239</option>
<option value="MPPS MEDPALLY, YACHARAM RR.---RG327">MPPS MEDPALLY, YACHARAM RR.---RG327</option>
<option value="MPPS,MUTHVELLIGUDA---H1829">MPPS,MUTHVELLIGUDA---H1829</option>
<option value="MPPS NAGARAM---RG090">MPPS NAGARAM---RG090</option>
<option value="MPPS,NAKKALAPALLY,MOINABAD---R1478">MPPS,NAKKALAPALLY,MOINABAD---R1478</option>
<option value="M.P.P.S. NARKHODA SHAMSHABAD---RG235">M.P.P.S. NARKHODA SHAMSHABAD---RG235</option>
<option value="MPPS,NARKUDA---RG156">MPPS,NARKUDA---RG156</option>
<option value="MPPS NEHRU NAGAR UPPAL---RG264">MPPS NEHRU NAGAR UPPAL---RG264</option>
<option value="MPPS ,NEREDMET---RG082">MPPS ,NEREDMET---RG082</option>
<option value="MPPS NUTHANKAL---RG347">MPPS NUTHANKAL---RG347</option>
<option value="MPPS OLD ALWAL.---R1974">MPPS OLD ALWAL.---R1974</option>
<option value="MPPS PALGUTTA,CHEVELLA---R1946">MPPS PALGUTTA,CHEVELLA---R1946</option>
<option value="MPPS PILLAIPALLY---NG016">MPPS PILLAIPALLY---NG016</option>
<option value="MPPS POCHARAM---M0045">MPPS POCHARAM---M0045</option>
<option value="MPPS PODDATUR, SHANKARPALLY,RR DIST---R1096">MPPS PODDATUR, SHANKARPALLY,RR DIST---R1096</option>
<option value="MPPS QUBA COLONY---RG307">MPPS QUBA COLONY---RG307</option>
<option value="MPPS QUTHUBUDDINGUDA,MOINABAD---R9666">MPPS QUTHUBUDDINGUDA,MOINABAD---R9666</option>
<option value="MPPS RAGANNAGUDA---RG271">MPPS RAGANNAGUDA---RG271</option>
<option value="M.P.P.S.,RAMPALLY---RG070">M.P.P.S.,RAMPALLY---RG070</option>
<option value="MPPS RGK.NIZAMPET---RG280">MPPS RGK.NIZAMPET---RG280</option>
<option value="MPPS RGK POCHARAM---R9646">MPPS RGK POCHARAM---R9646</option>
<option value="MPPS SAROORNAGAR---H5709">MPPS SAROORNAGAR---H5709</option>
<option value="M.P.P.S SCHOOL, MOHAN NAGAR---RG258">M.P.P.S SCHOOL, MOHAN NAGAR---RG258</option>
<option value="MPPS,SHIVAREDDYGUDA,GHATKESAR---R2096">MPPS,SHIVAREDDYGUDA,GHATKESAR---R2096</option>
<option value="M.P.P.S SINGANNAGUDA---MG136">M.P.P.S SINGANNAGUDA---MG136</option>
<option value="MPPS SURANGAL,MOINABAD(M)---R1081">MPPS SURANGAL,MOINABAD(M)---R1081</option>
<option value="MPPS TALLARAM,CHEVELLA(M)---R9742">MPPS TALLARAM,CHEVELLA(M)---R9742</option>
<option value="MPPS TARANAGAR---RG013">MPPS TARANAGAR---RG013</option>
<option value="MPPS THOLKATTA, MOINABAD(M)---R1815">MPPS THOLKATTA, MOINABAD(M)---R1815</option>
<option value="MPPS THUKKUGUDA.---RG203">MPPS THUKKUGUDA.---RG203</option>
<option value="MPPS UPPAL, BHARATHNAGAR,UPPAL---RG309">MPPS UPPAL, BHARATHNAGAR,UPPAL---RG309</option>
<option value="MPPS URELLA,CHEVELLA(M).DURGA HSC. N.VIDYA NGR CLN---R9743">MPPS URELLA,CHEVELLA(M).DURGA HSC. N.VIDYA NGR CLN---R9743</option>
<option value="MPPS VAMPUGUDA---R1904">MPPS VAMPUGUDA---R1904</option>
<option value="MPPS VEERANNAPET,MOINABAD---R9947">MPPS VEERANNAPET,MOINABAD---R9947</option>
<option value="MPPS VENKAMMAGUDA, SHABAD(M),RR DIST---R1781">MPPS VENKAMMAGUDA, SHABAD(M),RR DIST---R1781</option>
<option value="MPPS YELKAGUDA,MOINABAD---R1931">MPPS YELKAGUDA,MOINABAD---R1931</option>
<option value="MPUPS ALMASGUDA---R9547">MPUPS ALMASGUDA---R9547</option>
<option value="MPUPS ANKIREDDYPALLY,KEESARA---H0819">MPUPS ANKIREDDYPALLY,KEESARA---H0819</option>
<option value="MPUPS CHENGICHERLA---RG004">MPUPS CHENGICHERLA---RG004</option>
<option value="MPUPS DOMMARA POCHAMPALLY---RG365">MPUPS DOMMARA POCHAMPALLY---RG365</option>
<option value="MPUPS EARLAPALLY,CHEVELLA(M)---RG204">MPUPS EARLAPALLY,CHEVELLA(M)---RG204</option>
<option value="MPUPS GODUMAKUNTA---RG378">MPUPS GODUMAKUNTA---RG378</option>
<option value="MPUPS GOPULARAM,SHANKARPALLY(M)---R1743">MPUPS GOPULARAM,SHANKARPALLY(M)---R1743</option>
<option value="MPUPS IBRAHIMPATNAM---RG351">MPUPS IBRAHIMPATNAM---RG351</option>
<option value="MPUPS, KACHAVANI SINGARAM---RG187">MPUPS, KACHAVANI SINGARAM---RG187</option>
<option value="MPUPS, KAVVAGUDA---RG290">MPUPS, KAVVAGUDA---RG290</option>
<option value="MPUPS,MUDIMYAL,CHEVELLA---R2122">MPUPS,MUDIMYAL,CHEVELLA---R2122</option>
<option value="MPUPS MURTHUJAGUDA---RG381">MPUPS MURTHUJAGUDA---RG381</option>
<option value="MPUPS NERRAPALLY (IBP)---R2158">MPUPS NERRAPALLY (IBP)---R2158</option>
<option value="MPUPS PARVATHAPUR---RG219">MPUPS PARVATHAPUR---RG219</option>
<option value="MPUPS PYARARAM,BOMMALARAMARAM---NG020">MPUPS PYARARAM,BOMMALARAMARAM---NG020</option>
<option value="MPUPS THADIPARTHY(V), YACHARAM(M)---RG 388">MPUPS THADIPARTHY(V), YACHARAM(M)---RG 388</option>
<option value="MPUPS,THIMMAREDDYGUDA,SHABAD(M)---R1777">MPUPS,THIMMAREDDYGUDA,SHABAD(M)---R1777</option>
<option value="MPUPS UPPERPALLY---RG102">MPUPS UPPERPALLY---RG102</option>
<option value="M R R HIGH SCHOOL,SUBHASHNAGAR COL,KUSHAIGUDA---R1326">M R R HIGH SCHOOL,SUBHASHNAGAR COL,KUSHAIGUDA---R1326</option>
<option value="MS CREATIVE HIGH SCHOOL, BRINDAVAN COLONY, TOLICHOWKI, HYD---H0728">MS CREATIVE HIGH SCHOOL, BRINDAVAN COLONY, TOLICHOWKI, HYD---H0728</option>
<option value="MS CREATIVE HIGH SCHOOL,HAPPY HOMES COLONY,UPPERPALLY,RJNR.---R2412">MS CREATIVE HIGH SCHOOL,HAPPY HOMES COLONY,UPPERPALLY,RJNR.---R2412</option>
<option value="MS CREATIVE HIGH SCHOOL,MIDHANI X ROAD---HH680">MS CREATIVE HIGH SCHOOL,MIDHANI X ROAD---HH680</option>
<option value="MS CREATIVE HIGH SCHOOL, MURAD NAGAR, MEHDIPATNAM---HH678">MS CREATIVE HIGH SCHOOL, MURAD NAGAR, MEHDIPATNAM---HH678</option>
<option value="MS CREATIVE HIGH SCHOOL,OPP.GOVT PRINTING PRESS,SAIDABAD---HH684">MS CREATIVE HIGH SCHOOL,OPP.GOVT PRINTING PRESS,SAIDABAD---HH684</option>
<option value="MS CREATIVE HIGH SCHOOL,SEETHAPHALMANDI,---R2400">MS CREATIVE HIGH SCHOOL,SEETHAPHALMANDI,---R2400</option>
<option value="MS CREATIVE UPS SHALIBANDA---HH687">MS CREATIVE UPS SHALIBANDA---HH687</option>
<option value="MS FUTURE SCHOOL,MOAZAMPURA, MALLEPALLY---H0727">MS FUTURE SCHOOL,MOAZAMPURA, MALLEPALLY---H0727</option>
<option value="MULAGOLI P.S---M0034">MULAGOLI P.S---M0034</option>
<option value="MUTHANGI P.S---M0016">MUTHANGI P.S---M0016</option>

Here's the converted format for the additional schools:

```html
<option value="NAAGARJUNA MONTESSORI SCHOOL,MEDCHAL---R1999">NAAGARJUNA MONTESSORI SCHOOL,MEDCHAL---R1999</option>
<option value="NAGARJUNA HIGH SCHOOL,IBRAHIMPATNAM---R1275">NAGARJUNA HIGH SCHOOL,IBRAHIMPATNAM---R1275</option>
<option value="NAGARJUNA HIGH SCHOOL,RAIDURG DARGA.---R9544">NAGARJUNA HIGH SCHOOL,RAIDURG DARGA.---R9544</option>
<option value="NAGARJUNA HIGH SCH,SRINIVASAPURAM COLONY,VSPM.---R1498">NAGARJUNA HIGH SCH,SRINIVASAPURAM COLONY,VSPM.---R1498</option>
<option value="NAGARJUNA MODEL SCHOOL,HASTINAPURAM---R1593">NAGARJUNA MODEL SCHOOL,HASTINAPURAM---R1593</option>
<option value="NAGARJUNA SCHOOL SAROORNAGAR---R2354">NAGARJUNA SCHOOL SAROORNAGAR---R2354</option>
<option value="NALANDA GR.HIGH SCHOOL,KULSUMPURA POLICE COLONY.---H733">NALANDA GR.HIGH SCHOOL,KULSUMPURA POLICE COLONY.---H733</option>
<option value="NALANDA GR.SCHOOL,BONGULOOR X ROAD.IBPM---R1267">NALANDA GR.SCHOOL,BONGULOOR X ROAD.IBPM---R1267</option>
<option value="NALANDA PUBLIC SCHOOL---H5881">NALANDA PUBLIC SCHOOL---H5881</option>
<option value="NALANDA VIDYA BHAVAN HIGH SCHOOL,MOTINAGAR.---H1826">NALANDA VIDYA BHAVAN HIGH SCHOOL,MOTINAGAR.---H1826</option>
<option value="NANDIGAMA U.P.S.---M0040">NANDIGAMA U.P.S.---M0040</option>
<option value="NARAYANA CONCEPT SCHOOL---R2115">NARAYANA CONCEPT SCHOOL---R2115</option>
<option value="NARAYANA CONCEPT SCHOOL,DILSUKHNAGAR---R2271">NARAYANA CONCEPT SCHOOL,DILSUKHNAGAR---R2271</option>
<option value="NARAYANA CONCEPT SCHOOL MALAKGIRI---R1687">NARAYANA CONCEPT SCHOOL MALAKGIRI---R1687</option>
<option value="NARAYANA CONCEPT SCHOOL OLD ALWAL,MALKAJGIRI(M),HYD.---R1636">NARAYANA CONCEPT SCHOOL OLD ALWAL,MALKAJGIRI(M),HYD.---R1636</option>
<option value="NARAYANA CONCEPT SCHOOL VANASTHALIPURAM RR DIST---R1752">NARAYANA CONCEPT SCHOOL VANASTHALIPURAM RR DIST---R1752</option>
<option value="NARAYANA CONCEPTS  SCHOOL KUKATPALLY---R1157">NARAYANA CONCEPTS  SCHOOL KUKATPALLY---R1157</option>
<option value="NARAYANA CONCEPTS  SCHOOLS,TARNAKA---HH274">NARAYANA CONCEPTS  SCHOOLS,TARNAKA---HH274</option>
<option value="NARAYANA E TECHNO SCHOOL, ECIL---R1800">NARAYANA E TECHNO SCHOOL, ECIL---R1800</option>
<option value="NARAYANA SCHOOL  ADDAGUTTA SOCIETY,OPP JNTU---R1713">NARAYANA SCHOOL  ADDAGUTTA SOCIETY,OPP JNTU---R1713</option>
<option value="NARAYANA SCHOOL, ATTAPUR---HH254">NARAYANA SCHOOL, ATTAPUR---HH254</option>
<option value="NARAYANA SCHOOL HASTHINAPURAM.---R2003">NARAYANA SCHOOL HASTHINAPURAM.---R2003</option>
<option value="NARRE GUDEM P.S---M0035">NARRE GUDEM P.S---M0035</option>
<option value="NATCO H.SCHOOL,RANGAPUR.---R1670">NATCO H.SCHOOL,RANGAPUR.---R1670</option>
<option value="NAVA JYOTHI HIGH SCHOOL PATWARINAGAR.---R1254">NAVA JYOTHI HIGH SCHOOL PATWARINAGAR.---R1254</option>
<option value="NAVEENA MONTY SCHOOL HASTINAPUR,---R2217">NAVEENA MONTY SCHOOL HASTINAPUR,---R2217</option>
<option value="NAVJIVAN BALIKA VIDYALAYA,RAMKOT---HH681">NAVJIVAN BALIKA VIDYALAYA,RAMKOT---HH681</option>
<option value="NAVYA JYOTHI MODEL HIGH SCHOOL, OPP RTC COLONY, BAGH HAYATHNAGAR---R9842">NAVYA JYOTHI MODEL HIGH SCHOOL, OPP RTC COLONY, BAGH HAYATHNAGAR---R9842</option>
<option value="NAZARENE GRAMMAR HIGH SCHOOL,DABILPUR(V),MEDCHAL(M)---M0123">NAZARENE GRAMMAR HIGH SCHOOL,DABILPUR(V),MEDCHAL(M)---M0123</option>
<option value="NEHRU HIGH SCHOOL---H3704">NEHRU HIGH SCHOOL---H3704</option>
<option value="NEW BRILLIANT SCHOOL,ATTAPUR, HYDERGUDA.---R9765">NEW BRILLIANT SCHOOL,ATTAPUR, HYDERGUDA.---R9765</option>
<option value="NEW  CHAITANYA HIGH SCHOOL,ABDULLAPURMETT.---R9723">NEW  CHAITANYA HIGH SCHOOL,ABDULLAPURMETT.---R9723</option>
<option value="NEW LITTLE LILLY H SCHOOL,JEEDIMETLA VI.QUTBULLAPUR---R1176">NEW LITTLE LILLY H SCHOOL,JEEDIMETLA VI.QUTBULLAPUR---R1176</option>
<option value="NEW LITTLE LILLY SCHOOL - MEDCHAL.---R1031">NEW LITTLE LILLY SCHOOL - MEDCHAL.---R1031</option>
<option value="NEW LITTLE SCHOLARS SCH,KISMATHPUR---R1673">NEW LITTLE SCHOLARS SCH,KISMATHPUR---R1673</option>
<option value="NEW TAKSHASILA HIGH SCHOOL, LB NAGAR---H9910">NEW TAKSHASILA HIGH SCHOOL, LB NAGAR---H9910</option>
<option value="NGRI SCHOOL,NGRI,UPPAL---R1021">NGRI SCHOOL,NGRI,UPPAL---R1021</option>
<option value="NIRAJ PUBLIC SCHOOL, AMEERPET---H9918">NIRAJ PUBLIC SCHOOL, AMEERPET---H9918</option>
<option value="NOBLE HIGH SCHOOL,JANMABHOOMINAGAR JAWAHAR NAGAR.---R1649">NOBLE HIGH SCHOOL,JANMABHOOMINAGAR JAWAHAR NAGAR.---R1649</option>
<option value="NOBLE HIGH SCHOOL,KANDUKUR X ROADS---R1337">NOBLE HIGH SCHOOL,KANDUKUR X ROADS---R1337</option>
<option value="NRUPATUNGA HIGH SCHOOL, BAGH LINGAMPALLY.---H5703">NRUPATUNGA HIGH SCHOOL, BAGH LINGAMPALLY.---H5703</option>
<option value="NSKK HIGH SCHOOL,FEROZGUDA---HH012">NSKK HIGH SCHOOL,FEROZGUDA---HH012</option>
<option value="NSKK HIGH SCHOOL,GAGILLAPUR.---R1966">NSKK HIGH SCHOOL,GAGILLAPUR.---R1966</option>
<option value="NTR MODEL SCHOOL,HIMAYATHNAGAR, MOINABAD (M)---R2188">NTR MODEL SCHOOL,HIMAYATHNAGAR, MOINABAD (M)---R2188</option>
<option value="OASIS SCHOOL OF EXCELLENCE,SHAMSHABAD.---R1612">OASIS SCHOOL OF EXCELLENCE,SHAMSHABAD.---R1612</option>
<option value="OASIS SCHOOL RAI DURG HYDERABD---R1618">OASIS SCHOOL RAI DURG HYDERABD---R1618</option>
<option value="OM SRI MAHANKALI VIDYALAYA,RAMPALLY---R1401">OM SRI MAHANKALI VIDYALAYA,RAMPALLY---R1401</option>
<option value="OSMAN NAGAR P.S---M0090">OSMAN NAGAR P.S---M0090</option>
<option value="OXFORD GRAMMER HIGH SCHOOL. HIMAYATNAGAR.---H5819">OXFORD GRAMMER HIGH SCHOOL. HIMAYATNAGAR.---H5819</option>
<option value="OXFORD HIGH SCHOOL,CHUDIBAZAR---HH311">OXFORD HIGH SCHOOL,CHUDIBAZAR---HH311</option>
<option value="OXFORD INTERNATIOINAL SCHOOL,DAMMAIGUDA---R1561">OXFORD INTERNATIOINAL SCHOOL,DAMMAIGUDA---R1561</option>
<option value="OXFORD TALENT SCHOOL,MEDCHAL.---R1630">OXFORD TALENT SCHOOL,MEDCHAL.---R1630</option>
<option value="PACE SCHOOL, RUMINIPURI COLONY,AS RAO NAGAR---R1034">PACE SCHOOL, RUMINIPURI COLONY,AS RAO NAGAR---R1034</option>
<option value="PALLAVI MODEL SCHOOL,NEAR PAKALAKUNTA,ALWAL---R2333">PALLAVI MODEL SCHOOL,NEAR PAKALAKUNTA,ALWAL---R2333</option>
<option value="PALLAVI PROGRESSIVE HIGH SCHOOL THUMKUNTA.---R1605">PALLAVI PROGRESSIVE HIGH SCHOOL THUMKUNTA.---R1605</option>
<option value="PAPARAYA VIDYALAYA,HIGH SCHOOL,MEDCHAL.---RG159">PAPARAYA VIDYALAYA,HIGH SCHOOL,MEDCHAL.---RG159</option>
<option value="PASHAMILARAM U.P.S.---M0041">PASHAMILARAM U.P.S.---M0041</option>
<option value="PATANCHERU G.P.S---M0018">PATANCHERU G.P.S---M0018</option>
<option value="PATANCHERU U.P.S.---M0042">PATANCHERU U.P.S.---M0042</option>
<option value="PATEL GUDA P.S---M0019">PATEL GUDA P.S---M0019</option>
<option value="PATI U.P.S.---M0043">PATI U.P.S.---M0043</option>
<option value="P.N.M HIGH SCHOOL,KUKATPALLY.P---R1381">P.N.M HIGH SCHOOL,KUKATPALLY.P---R1381</option>
<option value="P OBUL REDDY PUBLIC SCHOOL,AMS RD.25,JUBILEE HILLS.---HH715">P OBUL REDDY PUBLIC SCHOOL,AMS RD.25,JUBILEE HILLS.---HH715</option>
<option value="PRAGATHI MODEL HIGH SCHOOL GANDIMYSAMMA X ROADS D.POCHMPALLY---R2097">PRAGATHI MODEL HIGH SCHOOL GANDIMYSAMMA X ROADS D.POCHMPALLY---R2097</option>
<option value="PRAGATHI MODEL SCHOOL,PATI---M168">PRAGATHI MODEL SCHOOL,PATI---M168</option>
<option value="PRAGATHI VID.MANDIR HIGH SCHOOL,, KUNTLOOR ROAD,HYT.---R9789">PRAGATHI VID.MANDIR HIGH SCHOOL,, KUNTLOOR ROAD,HYT.---R9789</option>
<option value="PRAGATHI VIDYA NIKETAN,AMBERPT---HH237">PRAGATHI VIDYA NIKETAN,AMBERPT---HH237</option>
<option value="PRAGNAN THE SCHOOL, SREE RAMA COLONY,UPPAL.---M007">PRAGNAN THE SCHOOL, SREE RAMA COLONY,UPPAL.---M007</option>
<option value="PRIMARY SCHOOL BACHUPALLY---RG180">PRIMARY SCHOOL BACHUPALLY---RG180</option>
<option value="PRIMARY SCHOOL, BONGULUR---RG326">PRIMARY SCHOOL, BONGULUR---RG326</option>
<option value="PRIMARY SCHOOL CHINTHAL CHERU---M0132">PRIMARY SCHOOL CHINTHAL CHERU---M0132</option>
<option value="PRIMARY SCHOOL GANDICHERU---RG206">PRIMARY SCHOOL GANDICHERU---RG206</option>
<option value="PRIMARY SCHOOL JEEVAGUDA---RG099">PRIMARY SCHOOL JEEVAGUDA---RG099</option>
<option value="PRIMARY SCHOOL,LAXMAPUR---RG011">PRIMARY SCHOOL,LAXMAPUR---RG011</option>
<option value="PRIMARY SCHOOL SAHEBNAGAR---RG237">PRIMARY SCHOOL SAHEBNAGAR---RG237</option>
<option value="PRI.SCHOOL,CHENNAPUR---RG140">PRI.SCHOOL,CHENNAPUR---RG140</option>
<option value="PRIYANKA HIGH SCHOOL,IBRAHIMPATNAM.---R1277">PRIYANKA HIGH SCHOOL,IBRAHIMPATNAM.---R1277</option>
<option value="PRIZE HIGH SCHOOL,YAPRAL---H3802">PRIZE HIGH SCHOOL,YAPRAL---H3802</option>
<option value="PS ALLWYN COLONY PTC---M0026">PS ALLWYN COLONY PTC---M0026</option>
<option value="PS ANDUGULA,MADGUL(M)---R1552">PS ANDUGULA,MADGUL(M)---R1552</option>
<option value="PS ASHOK NAGAR---M0084">PS ASHOK NAGAR---M0084</option>
<option value="PS BHANOOR---M0003">PS BHANOOR---M0003</option>
<option value="PS BOMBAY COLONY---M0086">PS BOMBAY COLONY---M0086</option>
<option value="P.S. DOMMARA POCHAMMAPALLY---RG131">P.S. DOMMARA POCHAMMAPALLY---RG131</option>
<option value="PS EKLASKHANPET---RG253">PS EKLASKHANPET---RG253</option>
<option value="PS GIRLS MEDCHAL---RG135">PS GIRLS MEDCHAL---RG135</option>
<option value="P.S.LAXMAPUR SHAMIRPET---RG366">P.S.LAXMAPUR SHAMIRPET---RG366</option>
<option value="PS, SURGANGAL(V)---RG389">PS, SURGANGAL(V)---RG389</option>
<option value="PS TEMPLE ALWAL---RG208">PS TEMPLE ALWAL---RG208</option>
<option value="PS THIMMAPURAM---NG033">PS THIMMAPURAM---NG033</option>
<option value="PS W/C  AMEENPUR---M0025">PS W/C  AMEENPUR---M0025</option>
<option value="PUDAMI NEIGHBOURHOOD SCHOOL YACHARAM.---R1771">PUDAMI NEIGHBOURHOOD SCHOOL YACHARAM.---R1771</option>
<option value="PUDAMI THE ENGLISH PRIMARIES,ARUTLA---R1695">PUDAMI THE ENGLISH PRIMARIES,ARUTLA---R1695</option>

<option value="RAILWAY GIRLS HIGH SCHOOL,NORTH LALAGUDA---H3803">RAILWAY GIRLS HIGH SCHOOL,NORTH LALAGUDA---H3803</option>
<option value="RAILWAY MIXED  HIGH SCHOOL,SOUTH LALAGUDA.---H3807">RAILWAY MIXED  HIGH SCHOOL,SOUTH LALAGUDA.---H3807</option>
<option value="RAINBOW SCHOOL,SURANGAL, MOINABAD---R2389">RAINBOW SCHOOL,SURANGAL, MOINABAD---R2389</option>
<option value="RAJASREE VIDYA MANDIR HIGH SCHOOL,PEDDA AMBERPET---R9721">RAJASREE VIDYA MANDIR HIGH SCHOOL,PEDDA AMBERPET---R9721</option>
<option value="RAUS SCHOOL,BANDLAGUDA JAGIR.---R1317">RAUS SCHOOL,BANDLAGUDA JAGIR.---R1317</option>
<option value="RAVINDRA BHARATHI SCHOOL,  ATTAPUR---HH536">RAVINDRA BHARATHI SCHOOL,  ATTAPUR---HH536</option>
<option value="RAVINDRA BHARATHI SCHOOL JILLELAGUDA---R2355">RAVINDRA BHARATHI SCHOOL JILLELAGUDA---R2355</option>
<option value="RAVINDRA BHARATHI SCHOOL, MADHURANAGAR, SHAMSHABAD---R2264">RAVINDRA BHARATHI SCHOOL, MADHURANAGAR, SHAMSHABAD---R2264</option>
<option value="RED CROSS GGHS MASABTANK---H8604">RED CROSS GGHS MASABTANK---H8604</option>
<option value="REFAH E AAM HIGH SCHOOL, HARI BOWLI---H2711">REFAH E AAM HIGH SCHOOL, HARI BOWLI---H2711</option>
<option value="RISHI SCHOOL, GHATKESAR---R2382">RISHI SCHOOL, GHATKESAR---R2382</option>
<option value="RLY BOYS HSC. LALAGUDA---HH104">RLY BOYS HSC. LALAGUDA---HH104</option>
<option value="RLY PORTERS P.S CHIKALGUDA---H3104">RLY PORTERS P.S CHIKALGUDA---H3104</option>
<option value="ROCH MEM HIGH SCHOOL,KHAIRATABAD---H8810">ROCH MEM HIGH SCHOOL,KHAIRATABAD---H8810</option>
<option value="ROCKWOODS SCHOOL,VENKATESWARA COLONY,NAGARAM.---R1978">ROCKWOODS SCHOOL,VENKATESWARA COLONY,NAGARAM.---R1978</option>
<option value="ROCKWOODS SCHOOL,YAMNAMPET, GTKR---MD0002">ROCKWOODS SCHOOL,YAMNAMPET, GTKR---MD0002</option>
<option value="R.T.C. HIGH SCHOOL---H4726">R.T.C. HIGH SCHOOL---H4726</option>
<option value="RUDARAM U.P.S.---M0046">RUDARAM U.P.S.---M0046</option>
<option value="RUDRARAM W/S P.S---M0021">RUDRARAM W/S P.S---M0021</option>
<option value="RUGVEDA UPPER PRIMARY SCHOOL, MANCHAL (M)RR. DIST.---R2380">RUGVEDA UPPER PRIMARY SCHOOL, MANCHAL (M)RR. DIST.---R2380</option>
<option value="SACRED HEART CONVENT SCHOOL, PEERZADIGUDA---R2415">SACRED HEART CONVENT SCHOOL, PEERZADIGUDA---R2415</option>
<option value="SACRED HEART HIGH SCHOOL,  SOUTH LALAGUDA---H3801">SACRED HEART HIGH SCHOOL,  SOUTH LALAGUDA---H3801</option>
<option value="SADA SIVA HIGH SCHOOL, FEROZ GUDA.---R1756">SADA SIVA HIGH SCHOOL, FEROZ GUDA.---R1756</option>
<option value="SADHANA HIGH SCHOOL,BANK COLONY, MEDCHAL---R1174">SADHANA HIGH SCHOOL,BANK COLONY, MEDCHAL---R1174</option>
<option value="SAFDARIA GIRLS HIGH SCHOOL,HUMAYUN NAGAR.---H5701">SAFDARIA GIRLS HIGH SCHOOL,HUMAYUN NAGAR.---H5701</option>
<option value="SAGAR GRAMMAR SCHOOL BHARATHNAGAR CLY,UPPAL---R1724">SAGAR GRAMMAR SCHOOL BHARATHNAGAR CLY,UPPAL---R1724</option>
<option value="SAGE SCHOOL, MEDIPALLY---R2178">SAGE SCHOOL, MEDIPALLY---R2178</option>
<option value="SAI GRACE HIGH SCHOOL,DAYANAND NAGAR MSRD---H4804">SAI GRACE HIGH SCHOOL,DAYANAND NAGAR MSRD---H4804</option>
<option value="SAI SIDDARTHA HS DOMMAIGUDA---R1439">SAI SIDDARTHA HS DOMMAIGUDA---R1439</option>
<option value="SAI SINDU GRA.SCHOOL,KG---R1427">SAI SINDU GRA.SCHOOL,KG---R1427</option>
<option value="SAI TEJA VIDYANIKETAN HIGH SCHOOL,ALWAL---R1806">SAI TEJA VIDYANIKETAN HIGH SCHOOL,ALWAL---R1806</option>
<option value="SAI VIKAS GRAMMAR HIGH SCHOOL PARWATHAPUR---R1133">SAI VIKAS GRAMMAR HIGH SCHOOL PARWATHAPUR---R1133</option>
<option value="SANJOE PUBLIC SCHOOL, CHINNATUPRA---R2028">SANJOE PUBLIC SCHOOL, CHINNATUPRA---R2028</option>
<option value="SANKEERTH GRAMMAR HIGH SCHOOL,KOHEDA X RD.---R9837">SANKEERTH GRAMMAR HIGH SCHOOL,KOHEDA X RD.---R9837</option>
<option value="SANTHI NIKETAN UPS,HAYATHNAGAR---H3543">SANTHI NIKETAN UPS,HAYATHNAGAR---H3543</option>
<option value="SANTHOSHI MATHA HIGH SCHOOL,TRIMULAGHERY.---HH120">SANTHOSHI MATHA HIGH SCHOOL,TRIMULAGHERY.---HH120</option>
<option value="SARATHI SCHOOL. HABSIGUDA---R9794">SARATHI SCHOOL. HABSIGUDA---R9794</option>
<option value="SARITHA VIDYANIKETAN  SCHOOL,HAYATHNAGAR.---R9776">SARITHA VIDYANIKETAN  SCHOOL,HAYATHNAGAR.---R9776</option>
<option value="SATYAM GRAMMAR SCHOOL SHAMSHABAD---R1114">SATYAM GRAMMAR SCHOOL SHAMSHABAD---R1114</option>
<option value="SATYAM SCHOOL PEDDAMBERPET.---R2102">SATYAM SCHOOL PEDDAMBERPET.---R2102</option>
<option value="SATYAVANI VIDYA NIKETHAN HIGH SCHOOL, SR NAIK NAGAR, JEEDIMETLA---HH063">SATYAVANI VIDYA NIKETHAN HIGH SCHOOL, SR NAIK NAGAR, JEEDIMETLA---HH063</option>
<option value="S.C. RAILWAY P.SCHOOL KACHIGUD---H5003">S.C. RAILWAY P.SCHOOL KACHIGUD---H5003</option>
<option value="SCR WOMENS ORG H.S. CHIKALGUDA---H3531">SCR WOMENS ORG H.S. CHIKALGUDA---H3531</option>
<option value="SEC-BAD P.S WARASIGUDA---H9999">SEC-BAD P.S WARASIGUDA---H9999</option>
<option value="SECUNDERABAD PUBLIC SCHOOL, WEST MARREDPALLY---H3501">SECUNDERABAD PUBLIC SCHOOL, WEST MARREDPALLY---H3501</option>
<option value="SERENITY MODEL HIGH SCHOOL,KEESARA---R1281">SERENITY MODEL HIGH SCHOOL,KEESARA---R1281</option>
<option value="SERENITY MODEL SCHOOL NAGARAM---R1494">SERENITY MODEL SCHOOL NAGARAM---R1494</option>
<option value="SEVENTH DAY ADVENTIST HIGH SCHOOL, CHAPEL ROAD,ABIDS---HH097">SEVENTH DAY ADVENTIST HIGH SCHOOL, CHAPEL ROAD,ABIDS---HH097</option>
<option value="SEVENTH DAY ADVENTIST HIGH SCHOOL SEBASTIAN ROAD, SECBAD---HH639">SEVENTH DAY ADVENTIST HIGH SCHOOL SEBASTIAN ROAD, SECBAD---HH639</option>
<option value="SHADAN GROUP OF MODERN HIGH SCHOOL, KHAIRATABAD---H8803">SHADAN GROUP OF MODERN HIGH SCHOOL, KHAIRATABAD---H8803</option>
<option value="SHALIVAHANA HIGH SCHOOL, MAILARDEVPALLY, RJNR(M)---R1722">SHALIVAHANA HIGH SCHOOL, MAILARDEVPALLY, RJNR(M)---R1722</option>
<option value="SHANTHI NAGAR PTC P.S---M0022">SHANTHI NAGAR PTC P.S---M0022</option>
<option value="SHANTHINIKETAN HIGH SCHOOL, SHANTHI NAGAR, VANASTHALIPURAM---R1321">SHANTHINIKETAN HIGH SCHOOL, SHANTHI NAGAR, VANASTHALIPURAM---R1321</option>
<option value="SHANTHINIKETAN SCHOOL, ISMAILKHANGUDA, GHATKESAR(M)---R1339">SHANTHINIKETAN SCHOOL, ISMAILKHANGUDA, GHATKESAR(M)---R1339</option>
<option value="SHANTHINIKETHAN CONCEPT SCHOOL MALLIKARJUNA NAGAR VANASTHALIPURAM---R1766">SHANTHINIKETHAN CONCEPT SCHOOL MALLIKARJUNA NAGAR VANASTHALIPURAM---R1766</option>
<option value="SHANTHINIKETHAN CONCEPT SCHOOL,  SACHIVALAYA NAGAR VANASTHALIPURAM---R1767">SHANTHINIKETHAN CONCEPT SCHOOL,  SACHIVALAYA NAGAR VANASTHALIPURAM---R1767</option>
<option value="SHANTHINIKETHAN HIGH SCHOOL, MUNAGANOOR,THORRUR ROAD---R1320">SHANTHINIKETHAN HIGH SCHOOL, MUNAGANOOR,THORRUR ROAD---R1320</option>
<option value="SHANTHINIKETHAN SCHOOL, LECTURERS COLONY, HAYATHNAGAR---R1734">SHANTHINIKETHAN SCHOOL, LECTURERS COLONY, HAYATHNAGAR---R1734</option>
<option value="SHANTHINIKETHAN TALENT SCHOOL, SNEHAPURI COLONY---R2059">SHANTHINIKETHAN TALENT SCHOOL, SNEHAPURI COLONY---R2059</option>
<option value="SHANTINIKETHA HIGH SCHOOL,GOUTHAMNAHAR,PTC.---R9823">SHANTINIKETHA HIGH SCHOOL,GOUTHAMNAHAR,PTC.---R9823</option>
<option value="SHARADA VIDYA NIKETHAN SCHOOL NARSINGI RAJENDRA NAGAR RR.DIST---HH628">SHARADA VIDYA NIKETHAN SCHOOL NARSINGI RAJENDRA NAGAR RR.DIST---HH628</option>
<option value="SHASTHA GRAMMAR SCHOOL,IBPM---R1271">SHASTHA GRAMMAR SCHOOL,IBPM---R1271</option>
<option value="SHILPA GRAMMER H.SCH,MALLAOUR---R1307">SHILPA GRAMMER H.SCH,MALLAOUR---R1307</option>
<option value="SHIRDI SAIBABA HSC. (LALAGUDA)---HH065">SHIRDI SAIBABA HSC. (LALAGUDA)---HH065</option>
<option value="SHISHU VIHAR SCHOOL SHANTI NAGAR PATANCHERU---M0142">SHISHU VIHAR SCHOOL SHANTI NAGAR PATANCHERU---M0142</option>
<option value="SHRADDHA THE SCHOOL---MD0008">SHRADDHA THE SCHOOL---MD0008</option>
<option value="SHREE HANUMAN VYAMSHALA HIGH SCHOOL,SULTANBZR---HH021">SHREE HANUMAN VYAMSHALA HIGH SCHOOL,SULTANBZR---HH021</option>
<option value="SHREE HANUMAN VYAMYAMSHALA P.SCHOOL,SULTANBAZAR.---H5961">SHREE HANUMAN VYAMYAMSHALA P.SCHOOL,SULTANBAZAR.---H5961</option>
<option value="SHUBODAYA VIDYA MANDIR,LOYAPALLY---R1361">SHUBODAYA VIDYA MANDIR,LOYAPALLY---R1361</option>
<option value="SIDDHARTHA PUBLIC SCHOOL, BODUPPAL---R2409">SIDDHARTHA PUBLIC SCHOOL, BODUPPAL---R2409</option>
<option value="SLOKA SCHOOL BHAGYALATHA---R2403">SLOKA SCHOOL BHAGYALATHA---R2403</option>
<option value="SLOKA SCHOOL, MANNEGUDA.---R2414">SLOKA SCHOOL, MANNEGUDA.---R2414</option>
<option value="SMHM GOVT HIGH SCHOOL,LANGERHOUSE,HYD.---HG059">SMHM GOVT HIGH SCHOOL,LANGERHOUSE,HYD.---HG059</option>
<option value="SMHM GOVT.PRIMARY SCHOOL,L.HOUSE.---HG072">SMHM GOVT.PRIMARY SCHOOL,L.HOUSE.---HG072</option>
<option value="S.M.P. MODEL HIGH SCHOOL, SAI RAM NAGAR, HYDERSHAKOTE---R1143">S.M.P. MODEL HIGH SCHOOL, SAI RAM NAGAR, HYDERSHAKOTE---R1143</option>
<option value="SMSM ZPHS THOLKATTA---R1948">SMSM ZPHS THOLKATTA---R1948</option>
<option value="SOW.  RADHABAI PALNITKAR H.S.---H4727">SOW.  RADHABAI PALNITKAR H.S.---H4727</option>
<option value="SPR HIGH SCHOOL, AUSHAPUR---R2420">SPR HIGH SCHOOL, AUSHAPUR---R2420</option>
<option value="SPRING DALES GRAMMAR HIGH SCHOOL, GANESH NAGAR, RJNR(M)---R1003">SPRING DALES GRAMMAR HIGH SCHOOL, GANESH NAGAR, RJNR(M)---R1003</option>
<option value="SPRING DALES HIGH SCHOOL,SOMASUNDARAM ESTATE,SECBAD---H3542">SPRING DALES HIGH SCHOOL,SOMASUNDARAM ESTATE,SECBAD---H3542</option>
<option value="SPRING FIELD HIGH SCHOOL,RAJENDRANAGAR,HYD.---R9566">SPRING FIELD HIGH SCHOOL,RAJENDRANAGAR,HYD.---R9566</option>
<option value="SPRINGS HIGH SCHOOL MOOSAPET---R1287">SPRINGS HIGH SCHOOL MOOSAPET---R1287</option>
<option value="S.P.S  HIGH SCHOOL,KOMPALLY---R1600">S.P.S  HIGH SCHOOL,KOMPALLY---R1600</option>
<option value="S.R.DIGI HIGH SCHOOL, ELECTRONIC COMPLEX, ECIL, KUSHAIGUDA---R1831">S.R.DIGI HIGH SCHOOL, ELECTRONIC COMPLEX, ECIL, KUSHAIGUDA---R1831</option>
<option value="S R DIGI SCHOOL,BAPUJINAGAR,NACHARAM---R2309">S R DIGI SCHOOL,BAPUJINAGAR,NACHARAM---R2309</option>
<option value="S R DIGI SCHOOL  MAHANKALI STREET, IBRAHIMPATNAM, RR.DIST.---R2221">S R DIGI SCHOOL  MAHANKALI STREET, IBRAHIMPATNAM, RR.DIST.---R2221</option>
<option value="SR DIGI SCHOOL,TARNAKA.---HH-623">SR DIGI SCHOOL,TARNAKA.---HH-623</option>
<option value="SREE AKSHARA SCHOOL,ANNAPURNA COLONY,FIZADIGUDA,---R2224">SREE AKSHARA SCHOOL,ANNAPURNA COLONY,FIZADIGUDA,---R2224</option>
<option value="SREE GAYATHRI H.SCH,SHIVARAMPALLY---R1811">SREE GAYATHRI H.SCH,SHIVARAMPALLY---R1811</option>
<option value="SREE MEDHA HIGH SCHOOL,KATEDAN, RJNR---H0216">SREE MEDHA HIGH SCHOOL,KATEDAN, RJNR---H0216</option>
<option value="SREE RAMANUJAN HIGH SCHOOL ,PLOT NO 53,LECTURERS COLONY HAYATHNAGAR---R1863">SREE RAMANUJAN HIGH SCHOOL ,PLOT NO 53,LECTURERS COLONY HAYATHNAGAR---R1863</option>
<option value="SREE SARASWATHI VIDYA NIKETAN, LALGADI MALAKPET---R1964">SREE SARASWATHI VIDYA NIKETAN, LALGADI MALAKPET---R1964</option>
<option value="SREE SHIRIDI SAI VIDYANIKETAN SCHOOL, CHERALAPALLY---R1239">SREE SHIRIDI SAI VIDYANIKETAN SCHOOL, CHERALAPALLY---R1239</option>
<option value="SREE SLOKA SCHOOL JIYAGUDA---HH718">SREE SLOKA SCHOOL JIYAGUDA---HH718</option>
<option value="SREE VAAGDEVI SCHOOL MALLAPUR---R2004">SREE VAAGDEVI SCHOOL MALLAPUR---R2004</option>
<option value="S.R.HIGH SCHOOL MADHURA NAGAR, SHAMSHABAD(M)---R2143">S.R.HIGH SCHOOL MADHURA NAGAR, SHAMSHABAD(M)---R2143</option>

<option value="SRI AKSHARA SCHOOL, MAHESHWARAM---R2057">SRI AKSHARA SCHOOL, MAHESHWARAM---R2057</option>
<option value="SRI AUROBINDO INTERNATIONAL SCHOOL VIDYANAGAR HYD---H4518">SRI AUROBINDO INTERNATIONAL SCHOOL VIDYANAGAR HYD---H4518</option>
<option value="SRI CHAINTANYA SCHOOL,SURYANAGAR COLONY,UPL---MD006">SRI CHAINTANYA SCHOOL,SURYANAGAR COLONY,UPL---MD006</option>
<option value="SRI CHAITANYA HIGH SCHOOL, KUSHAIGUDA.---R2255">SRI CHAITANYA HIGH SCHOOL, KUSHAIGUDA.---R2255</option>
<option value="SRI CHAITANYA HIGH SCHOOL, MEDCHAL.---R2000">SRI CHAITANYA HIGH SCHOOL, MEDCHAL.---R2000</option>
<option value="SRI CHAITANYA HIGH SCHOOL,MG ROAD,PATANCHERU.---M0135">SRI CHAITANYA HIGH SCHOOL,MG ROAD,PATANCHERU.---M0135</option>
<option value="SRI CHAITANYA HIGH SCHOOL UPPAL BUS DEPOT.---H1122">SRI CHAITANYA HIGH SCHOOL UPPAL BUS DEPOT.---H1122</option>
<option value="SRI CHAITANYA SCHOOL, ATTAPUR, RJNR---R2266">SRI CHAITANYA SCHOOL, ATTAPUR, RJNR---R2266</option>
<option value="SRI CHAITANYA SCHOOL,CHILKOOR ROAD, MOINABAD---R1441">SRI CHAITANYA SCHOOL,CHILKOOR ROAD, MOINABAD---R1441</option>
<option value="SRI CHAITANYA SCHOOL, JAMES STREET---HH717">SRI CHAITANYA SCHOOL, JAMES STREET---HH717</option>
<option value="SRI CHAITANYA SCHOOL KANDUKUR---R1363">SRI CHAITANYA SCHOOL KANDUKUR---R1363</option>
<option value="SRI CHAITANYA SCHOOL,LASHKARGUDA---H3515">SRI CHAITANYA SCHOOL,LASHKARGUDA---H3515</option>
<option value="SRI CHAITANYA SCHOOL,LAXMI NGR,BODUPPAL---R2342">SRI CHAITANYA SCHOOL,LAXMI NGR,BODUPPAL---R2342</option>
<option value="SRI CHAITANYA SCHOOL,MEHDIPATNAM---HH585">SRI CHAITANYA SCHOOL,MEHDIPATNAM---HH585</option>
<option value="SRI CHAITANYA SCHOOL NACHARAM---R2394">SRI CHAITANYA SCHOOL NACHARAM---R2394</option>
<option value="SRI CHAITANYA SCHOOL,NALLAKUNTA.---HH597">SRI CHAITANYA SCHOOL,NALLAKUNTA.---HH597</option>
<option value="SRI CHAITANYA SCHOOL PARVATHAPUR---MD 0012">SRI CHAITANYA SCHOOL PARVATHAPUR---MD 0012</option>
<option value="SRI CHAITANYA SCHOOL,RAMANTHAPUR---R2340">SRI CHAITANYA SCHOOL,RAMANTHAPUR---R2340</option>
<option value="SRI CHAITANYA SCHOOL SHAMSHABAD---R2427">SRI CHAITANYA SCHOOL SHAMSHABAD---R2427</option>
<option value="SRI CHAITANYA SCHOOL, THUKKUGUDA.---R2396">SRI CHAITANYA SCHOOL, THUKKUGUDA.---R2396</option>
<option value="SRI CHAITANYA TECHNA SCHOOL,IBP.---R2069">SRI CHAITANYA TECHNA SCHOOL,IBP.---R2069</option>
<option value="SRI CHAITANYA TECHNO SCH.LB.NAGAR---R1619">SRI CHAITANYA TECHNO SCH.LB.NAGAR---R1619</option>
<option value="SRI CHAITANYA TECHNO SCHOOL, ECIL X RDS---R1620">SRI CHAITANYA TECHNO SCHOOL, ECIL X RDS---R1620</option>
<option value="SRI CHAITANYA TECHNO SCHOOL.KUKATPALLY,HYD.---R1660">SRI CHAITANYA TECHNO SCHOOL.KUKATPALLY,HYD.---R1660</option>
<option value="SRI CHAITANYA TECNO H.SCH,ST.NO.9,HIMAYATHNAGAR---HH445">SRI CHAITANYA TECNO H.SCH,ST.NO.9,HIMAYATHNAGAR---HH445</option>
<option value="SRI GURU DATTA H.SCHOOL,NALLAKUNTA.---HH730">SRI GURU DATTA H.SCHOOL,NALLAKUNTA.---HH730</option>
<option value="SRI GYANA SARASWATHI VIDYAMANDIR SCHOOL,PEDDA GOLKONDA SHAMSHABAD.---R1720">SRI GYANA SARASWATHI VIDYAMANDIR SCHOOL,PEDDA GOLKONDA SHAMSHABAD.---R1720</option>
<option value="SRI IRAA THE SCHOOL,LASHKARGUDA,ABDULLAPURMET.---R2362">SRI IRAA THE SCHOOL,LASHKARGUDA,ABDULLAPURMET.---R2362</option>
<option value="SRI KRISHNA MEMORIAL HIGH SCHOOL, BOMMARASIPET---R2157">SRI KRISHNA MEMORIAL HIGH SCHOOL, BOMMARASIPET---R2157</option>
<option value="SRI KRISHNAVANI CONCEPT SCHOOL,SHAMSHABAD.---R1311">SRI KRISHNAVANI CONCEPT SCHOOL,SHAMSHABAD.---R1311</option>
<option value="SRI NARAYANA GLOBAL HIGH SCHOOL,DAMMAIGUDA---R2156">SRI NARAYANA GLOBAL HIGH SCHOOL,DAMMAIGUDA---R2156</option>
<option value="SRINIKETHAN HIGH SCHOOL,MALLAPUR.---R2233">SRINIKETHAN HIGH SCHOOL,MALLAPUR.---R2233</option>
<option value="SRI PRATHIBHA MODEL SCHOOL MEDCHAL---R1126">SRI PRATHIBHA MODEL SCHOOL MEDCHAL---R1126</option>
<option value="SRI SAI CHAITANYA SCHOOL, CHERLAPATELGUDA, IBRAHIMPATNAM---R2187">SRI SAI CHAITANYA SCHOOL, CHERLAPATELGUDA, IBRAHIMPATNAM---R2187</option>
<option value="SRI SAI HIGH SCHOOL, PT COLONY,NEAR UPPAL DEPOT---R9853">SRI SAI HIGH SCHOOL, PT COLONY,NEAR UPPAL DEPOT---R9853</option>
<option value="SRI SAI KIRAN HIGH SCHOOL,SRI KRISHNA NAGAR,YOUSUFGUDA---H8514">SRI SAI KIRAN HIGH SCHOOL,SRI KRISHNA NAGAR,YOUSUFGUDA---H8514</option>
<option value="SRI SAI MODEL HIGH SCHOOL MALLAPUR---R1703">SRI SAI MODEL HIGH SCHOOL MALLAPUR---R1703</option>
<option value="SRI SAI NIKETAN HIGH SCHOOL,SRIKRISHNA NAGAR---HH206">SRI SAI NIKETAN HIGH SCHOOL,SRIKRISHNA NAGAR---HH206</option>
<option value="SRI SAI NIKETAN HSC. ABDULPRMET---R9898">SRI SAI NIKETAN HSC. ABDULPRMET---R9898</option>
<option value="SRI SAI PUBLIC SCHOOL,HABSIGUDA.---H3201">SRI SAI PUBLIC SCHOOL,HABSIGUDA.---H3201</option>
<option value="SRI SAI RAM HIGH SCHOOL,YOUSUFGUDA.---H5822">SRI SAI RAM HIGH SCHOOL,YOUSUFGUDA.---H5822</option>
<option value="SRI SAI SARASWATHI VIDYANIKETHAN SCHOOL,YOUSUFGUDA---H0534">SRI SAI SARASWATHI VIDYANIKETHAN SCHOOL,YOUSUFGUDA---H0534</option>
<option value="SRI SAI SCHOOL HABSHIGUDA---R2254">SRI SAI SCHOOL HABSHIGUDA---R2254</option>
<option value="SRI SAI VANI GRAMMER SCHOOL JODIMETLA X ROAD---R1578">SRI SAI VANI GRAMMER SCHOOL JODIMETLA X ROAD---R1578</option>
<option value="SRI SAI VIDHYA NIKETAN HIGH SCHOOL,PEERJADIGUDA.---R2079">SRI SAI VIDHYA NIKETAN HIGH SCHOOL,PEERJADIGUDA.---R2079</option>
<option value="SRI SAI VIDYALAYA HIGH SCHOOL, SEETHAPHALMANDI,SECUNDERABAD---H3530">SRI SAI VIDYALAYA HIGH SCHOOL, SEETHAPHALMANDI,SECUNDERABAD---H3530</option>
<option value="SRI SARASWATHI SHISHU MANDIR BADANGPET---R1163">SRI SARASWATHI SHISHU MANDIR BADANGPET---R1163</option>
<option value="SRI SARASWATHI SHISHU MANDIR HIGH SCHOOL,HANUMANNAGAR,KUSHAIGUDA.A---R1305">SRI SARASWATHI SHISHU MANDIR HIGH SCHOOL,HANUMANNAGAR,KUSHAIGUDA.A---R1305</option>
<option value="SRI SARASWATHI V MANDIR H SCHOOL,KESAVNAGAR---HH398">SRI SARASWATHI V MANDIR H SCHOOL,KESAVNAGAR---HH398</option>
<option value="SRI SHARADA VIDYAMANDIR,MADHURANAGAR,SMSB.---R9744">SRI SHARADA VIDYAMANDIR,MADHURANAGAR,SMSB.---R9744</option>
<option value="SRI SHIVAJI VIDYAPEETH SCHOOL,THONDAPALLY---R1173">SRI SHIVAJI VIDYAPEETH SCHOOL,THONDAPALLY---R1173</option>
<option value="SRI TRIVENI HIGH SCHOOL,BAPU NAGAR,LANGAR HOUSE---HH627">SRI TRIVENI HIGH SCHOOL,BAPU NAGAR,LANGAR HOUSE---HH627</option>
<option value="SRI TRIVENI SCHOOL CHAMPAPET, SAROORNAGAR---R2276">SRI TRIVENI SCHOOL CHAMPAPET, SAROORNAGAR---R2276</option>
<option value="SRI VAMSHIDHAR H.SCHOOL,NADERGUL.---R2413">SRI VAMSHIDHAR H.SCHOOL,NADERGUL.---R2413</option>
<option value="SRI VANI HIGH SCHOOL,TURKAYAMJAL---R1151">SRI VANI HIGH SCHOOL,TURKAYAMJAL---R1151</option>
<option value="SRI VATSAV PS SAIDABAD---H0206">SRI VATSAV PS SAIDABAD---H0206</option>
<option value="SRI VIDYA NIKETAN HIGH SCHOOL,MANCHAL ROAD.,IBPM---R1268">SRI VIDYA NIKETAN HIGH SCHOOL,MANCHAL ROAD.,IBPM---R1268</option>
<option value="SRI VIDYARANYA AVASA VIDYALAYAM HIGH SCHOOL SHARADHAMAM,BANDLAGUDA JAGIR, RAJENDRANAGAR.---R9788">SRI VIDYARANYA AVASA VIDYALAYAM HIGH SCHOOL SHARADHAMAM,BANDLAGUDA JAGIR, RAJENDRANAGAR.---R9788</option>
<option value="SRI VIDYA SECONDARY SCHOOL,TILAKNAGAR.---HH101">SRI VIDYA SECONDARY SCHOOL,TILAKNAGAR.---HH101</option>
<option value="SRI VIDYA VIKAS HIGH SCHOOL,NAGARAM,MAHESHWARAM---R2017">SRI VIDYA VIKAS HIGH SCHOOL,NAGARAM,MAHESHWARAM---R2017</option>
<option value="SRI VIKAS CONCEPT SCHOOL PEERZADIGUDAP.J GUDA---R1129">SRI VIKAS CONCEPT SCHOOL PEERZADIGUDAP.J GUDA---R1129</option>
<option value="SRI VISWABHARATHI HIGH SCHOOL,RASOOLPURA---H6701">SRI VISWABHARATHI HIGH SCHOOL,RASOOLPURA---H6701</option>
<option value="SRI VIVEKANANDA HIGH SCHOOL, GUMMADIDALA---M161">SRI VIVEKANANDA HIGH SCHOOL, GUMMADIDALA---M161</option>
<option value="SRI VIVEKANANDA VIDYALAYA HIGH SCHOOL, MANSANPALLY X ROADS,MAHESHWARAM---R1069">SRI VIVEKANANDA VIDYALAYA HIGH SCHOOL, MANSANPALLY X ROADS,MAHESHWARAM---R1069</option>
<option value="SRUJANA HIGH SCHOOL,NEW VIJAYAPURI COL.---R1590">SRUJANA HIGH SCHOOL,NEW VIJAYAPURI COL.---R1590</option>
<option value="SSG SCHOOL NEAR SAIBABA TEMPLE,MEDCHAL---R1872">SSG SCHOOL NEAR SAIBABA TEMPLE,MEDCHAL---R1872</option>

<option value="ST ALPHONSA HIGH SCHOOL ,MIG-217,KPHB COLONY.---R1559">ST ALPHONSA HIGH SCHOOL ,MIG-217,KPHB COLONY.---R1559</option>
<option value="ST ALPHONSAS HIGH SCHOOL,S R NAGAR---H8807">ST ALPHONSAS HIGH SCHOOL,S R NAGAR---H8807</option>
<option value="ST ALPHONSOS HIGH SCHOOL,GAJULARAMARAM---R2286">ST ALPHONSOS HIGH SCHOOL,GAJULARAMARAM---R2286</option>
<option value="ST ALPHONSOS SCHOOL,SUCHITRA CIRCLE.---R2285">ST ALPHONSOS SCHOOL,SUCHITRA CIRCLE.---R2285</option>
<option value="ST ALPHONSUS HIGH SCHOOL,KALYAN NAGAR.---H1818">ST ALPHONSUS HIGH SCHOOL,KALYAN NAGAR.---H1818</option>
<option value="ST ANNS GRAMMER H.SCH,PVN COLONY,MIRJALGUDA.---R1509">ST ANNS GRAMMER H.SCH,PVN COLONY,MIRJALGUDA.---R1509</option>
<option value="ST ANNS HIGH SCHOOL,MADINAGUDA.---R1388">ST ANNS HIGH SCHOOL,MADINAGUDA.---R1388</option>
<option value="ST.ANNS HIGH SCHOOL,UMA NAGAR COLONY,MDCL---R2101">ST.ANNS HIGH SCHOOL,UMA NAGAR COLONY,MDCL---R2101</option>
<option value="ST ANNS SCHOOL,KHANAPUR,MANCHAL(M).---R2283">ST ANNS SCHOOL,KHANAPUR,MANCHAL(M).---R2283</option>
<option value="ST ANTHONYS GR H SCHOOL,DAMMAIAGUDA---R1386">ST ANTHONYS GR H SCHOOL,DAMMAIAGUDA---R1386</option>
<option value="ST ANTHONYS HIGH SCHOOL, BAPUNAGAR, LANGER HOUSE---H5515">ST ANTHONYS HIGH SCHOOL, BAPUNAGAR, LANGER HOUSE---H5515</option>
<option value="ST ANTHONYS HIGH SCHOOL,HMT NAGAR,NACHARAM---R2306">ST ANTHONYS HIGH SCHOOL,HMT NAGAR,NACHARAM---R2306</option>
<option value="ST ANTHONYS HIGH SCHOOL JEEDIMETLA---R1153">ST ANTHONYS HIGH SCHOOL JEEDIMETLA---R1153</option>
<option value="ST ANTHONYS HIGH SCHOOL,KOMPALLY.---R2139">ST ANTHONYS HIGH SCHOOL,KOMPALLY.---R2139</option>
<option value="ST ANTHONYS H.S HIMAYATHNGR---H5809">ST ANTHONYS H.S HIMAYATHNGR---H5809</option>
<option value="ST ANTHONYS SCHOOL,GHATKESAR---R1312">ST ANTHONYS SCHOOL,GHATKESAR---R1312</option>
<option value="ST.ARNOLDS HIGH SCHOOL,RC.PURAM---M0104">ST.ARNOLDS HIGH SCHOOL,RC.PURAM---M0104</option>
<option value="ST CLARET HIGH SCHOOL,ATHVELLY.---M0118">ST CLARET HIGH SCHOOL,ATHVELLY.---M0118</option>
<option value="ST GEORGES GIRLS GRAMMAR SCHOOL, KING KOTI ROAD---H6972">ST GEORGES GIRLS GRAMMAR SCHOOL, KING KOTI ROAD---H6972</option>
<option value="ST GEORGES GRAMMAR SCHOOL, ABIDS---H6973">ST GEORGES GRAMMAR SCHOOL, ABIDS---H6973</option>
<option value="ST GREGORIOS PUBLIC SCH.,TAKALLAPALLY,YACHARAM---R2419">ST GREGORIOS PUBLIC SCH.,TAKALLAPALLY,YACHARAM---R2419</option>
<option value="ST JOHNS CHERCH HIGH SCHOOL,E.MARREDPALLY,SEC.---H3809">ST JOHNS CHERCH HIGH SCHOOL,E.MARREDPALLY,SEC.---H3809</option>
<option value="ST.JOSEPH ENGLISH MEDIUM SCHOOL ALIYABAD---R1621">ST.JOSEPH ENGLISH MEDIUM SCHOOL ALIYABAD---R1621</option>
<option value="ST JOSEPH HIGH SCHOOL,LALBAZAR, TIRUMALGIRI---R9965">ST JOSEPH HIGH SCHOOL,LALBAZAR, TIRUMALGIRI---R9965</option>
<option value="ST JOSEPH PUBLIC SCHOOL, - KING KOTI---HH234">ST JOSEPH PUBLIC SCHOOL, - KING KOTI---HH234</option>
<option value="ST JOSEPHS GRAMMER HIGH SCHOOL,SANTOSHNAGAR.---H0827">ST JOSEPHS GRAMMER HIGH SCHOOL,SANTOSHNAGAR.---H0827</option>
<option value="ST JOSEPHS HIGH SCHOOL, GOKHALE NAGAR, RAMANTHAPUR---H9521">ST JOSEPHS HIGH SCHOOL, GOKHALE NAGAR, RAMANTHAPUR---H9521</option>
<option value="ST JOSEPHS HIGH SCHOOL, KAMMAGUDA,YAMJAL---R1306">ST JOSEPHS HIGH SCHOOL, KAMMAGUDA,YAMJAL---R1306</option>
<option value="ST JOSEPHS P S. KING KOTI.---H5882">ST JOSEPHS P S. KING KOTI.---H5882</option>
<option value="ST JOSEPHS SCHOOL, HABSIGUDA---R9650">ST JOSEPHS SCHOOL, HABSIGUDA---R9650</option>
<option value="ST MARKS BOYS TOWN HIGH SCHOOL,JAHANUMA.---H2707">ST MARKS BOYS TOWN HIGH SCHOOL,JAHANUMA.---H2707</option>
<option value="ST MARTINS HS, MADHAV NAGAR,MIYAPUR---R9825">ST MARTINS HS, MADHAV NAGAR,MIYAPUR---R9825</option>
<option value="ST.MARTINS SCHOOL CHINTAL---R2240">ST.MARTINS SCHOOL CHINTAL---R2240</option>
<option value="ST MARY HIGH SCHOOL,NEW NALLAKUNTA---HH671">ST MARY HIGH SCHOOL,NEW NALLAKUNTA---HH671</option>
<option value="ST MARYS BETHANRY CONVENT .VIDYALAYA, NAGARAM.---R9773">ST MARYS BETHANRY CONVENT .VIDYALAYA, NAGARAM.---R9773</option>
<option value="ST MARYS CONVENT SCHOOL PUDUR.---R1120">ST MARYS CONVENT SCHOOL PUDUR.---R1120</option>
<option value="ST.MARYS HIGH SCHOOL,DEVARYAMZAL---R9935">ST.MARYS HIGH SCHOOL,DEVARYAMZAL---R9935</option>
<option value="ST MARYS HIGH SCHOOL, JUBLIEE HILLS, HYDERABD---HH057">ST MARYS HIGH SCHOOL, JUBLIEE HILLS, HYDERABD---HH057</option>
<option value="ST MARYS HIGH SCHOOL,ST.FANCES  STREET,SECBAD---H0538">ST MARYS HIGH SCHOOL,ST.FANCES  STREET,SECBAD---H0538</option>
<option value="ST MARYS VIDYA NIKETHAN HSC, CHAMPAPET---R9768">ST MARYS VIDYA NIKETHAN HSC, CHAMPAPET---R9768</option>
<option value="ST PATRICS HSC. SECBAD---HH020">ST PATRICS HSC. SECBAD---HH020</option>
<option value="ST PAULS GRMR HSC. YAMJALA,KAMMAGUDEM.---R9755">ST PAULS GRMR HSC. YAMJALA,KAMMAGUDEM.---R9755</option>
<option value="ST PAULS  HIGH SCHOOL, HYDERGUDA---H5821">ST PAULS  HIGH SCHOOL, HYDERGUDA---H5821</option>
<option value="ST PETER GRAMMAR SCHOOL,JAYA NAGAR,NEW BOWENPALLY---HH670">ST PETER GRAMMAR SCHOOL,JAYA NAGAR,NEW BOWENPALLY---HH670</option>
<option value="ST.PETERS HIGH SCHOOL,RAVINDRANAGAR,NAGARAM---R2027">ST.PETERS HIGH SCHOOL,RAVINDRANAGAR,NAGARAM---R2027</option>
<option value="ST PETERS MODELS HSC NACHARAM.---R9745">ST PETERS MODELS HSC NACHARAM.---R9745</option>
<option value="ST PETERS SCHOOL,CHENGICHERLA.---R2393">ST PETERS SCHOOL,CHENGICHERLA.---R2393</option>
<option value="ST SAVIO HIGH SCHOOL,MAHESHWARAM---R1658">ST SAVIO HIGH SCHOOL,MAHESHWARAM---R1658</option>
<option value="ST SAVIO HIGH SCHOOL,SHAMSHABAD.---R1131">ST SAVIO HIGH SCHOOL,SHAMSHABAD.---R1131</option>
<option value="ST THERESA HIGH SCHOOL,ARUL COLONY,ECIL---H6713">ST THERESA HIGH SCHOOL,ARUL COLONY,ECIL---H6713</option>
<option value="ST.THOMAS (SPG)CO-ED HIGH SCHOOL SECUNDERABAD---HH651">ST.THOMAS (SPG)CO-ED HIGH SCHOOL SECUNDERABAD---HH651</option>
<option value="STUDENTS H.SCH,TROOPBAZAR---HH346">STUDENTS H.SCH,TROOPBAZAR---HH346</option>
<option value="SUJATHA HSC. CHAPEL ROAD, ABIDS.---HH082">SUJATHA HSC. CHAPEL ROAD, ABIDS.---HH082</option>
<option value="SULTAN UL ULOOM PUBLIC SCHOOL,BANJARAHILLS.RD.NO.3---H1801">SULTAN UL ULOOM PUBLIC SCHOOL,BANJARAHILLS.RD.NO.3---H1801</option>
<option value="SULTHAN PUR U.P.S---M0047">SULTHAN PUR U.P.S---M0047</option>
<option value="SUN RAYS SCHOOL---R2098">SUN RAYS SCHOOL---R2098</option>
<option value="SUPRABHAT MODEL H.SCH,HUBSIGUA---R1440">SUPRABHAT MODEL H.SCH,HUBSIGUA---R1440</option>
<option value="SURYODAYA VIDYA NIKETAN HIGH SCHOOL,AMEERPET,MAHESHWARAM(M)---R1007">SURYODAYA VIDYA NIKETAN HIGH SCHOOL,AMEERPET,MAHESHWARAM(M)---R1007</option>
<option value="S V MODEL SCHOOL CHILKANAGAR,UPPAL---R1215">S V MODEL SCHOOL CHILKANAGAR,UPPAL---R1215</option>
<option value="S V V R CONVENT SCHOOL KANDUKUR X RD RR DIST---R1732">S V V R CONVENT SCHOOL KANDUKUR X RD RR DIST---R1732</option>
<option value="SWEEKAR SPL.SCHOOL FOR DEAF,OLD BWNPLY.---R2278">SWEEKAR SPL.SCHOOL FOR DEAF,OLD BWNPLY.---R2278</option>

<option value="TAGORES HOME NEW ERA HIGH SCHOOL, KUMMARGUDA,SECBAD---H3711">TAGORES HOME NEW ERA HIGH SCHOOL, KUMMARGUDA,SECBAD---H3711</option>
<option value="TAHA HIGH SCHOOL,YOUSUFGUDA---HH623">TAHA HIGH SCHOOL,YOUSUFGUDA---HH623</option>
<option value="TAKSHA SHILA PUBLIC SCHOOL, LALAGUDA.---HH167">TAKSHA SHILA PUBLIC SCHOOL, LALAGUDA.---HH167</option>
<option value="TAKSHASILA HIGH SCHOOL, L B NAGAR---R9767">TAKSHASILA HIGH SCHOOL, L B NAGAR---R9767</option>
<option value="TELANGANA MODEL SCHOOL, CHEVELLA.---RG358">TELANGANA MODEL SCHOOL, CHEVELLA.---RG358</option>
<option value="TELANGANA MODEL SCHOOL, JAKKAPALLY.---M171">TELANGANA MODEL SCHOOL, JAKKAPALLY.---M171</option>
<option value="TEST---SANH">TEST---SANH</option>
<option value="THALIPUR P.S---M0091">THALIPUR P.S---M0091</option>
<option value="THE CITY HIGH SCHOOL BOLLARAM.---R9779">THE CITY HIGH SCHOOL BOLLARAM.---R9779</option>
<option value="THE HYDERABAD MILLENNIUM SCHOOL,SHIVRAMPALLY---R1512">THE HYDERABAD MILLENNIUM SCHOOL,SHIVRAMPALLY---R1512</option>
<option value="THE PROGRESS HIGH SCHOOL,ENGENBOWLI,FALAKNUMA.---HH270">THE PROGRESS HIGH SCHOOL,ENGENBOWLI,FALAKNUMA.---HH270</option>
<option value="THE SECUNDERABAD PUBLIC SCHOOL,PVN COLONY---R2137">THE SECUNDERABAD PUBLIC SCHOOL,PVN COLONY---R2137</option>
<option value="TRINITY MODEL SCHOOL,NARKUDA---R1505">TRINITY MODEL SCHOOL,NARKUDA---R1505</option>
<option value="TRIVENI HIGH SCHOOL,  ASHOK NAGAR, RC PURAM---M0136">TRIVENI HIGH SCHOOL,  ASHOK NAGAR, RC PURAM---M0136</option>
<option value="TRIVENI SCHOOL,ISNAPUR X RDS, MUTHANGI---M0024">TRIVENI SCHOOL,ISNAPUR X RDS, MUTHANGI---M0024</option>
<option value="TRIVENI SCHOOL, J J NAGAR, ALWAL---R1515">TRIVENI SCHOOL, J J NAGAR, ALWAL---R1515</option>
<option value="TRIVENI SCHOOL,  KMG COLONY, CHINTAL---R1513">TRIVENI SCHOOL,  KMG COLONY, CHINTAL---R1513</option>
<option value="TRIVENI SCHOOL, MANIKONDA---H9802">TRIVENI SCHOOL, MANIKONDA---H9802</option>
<option value="TRIVENI SCHOOL,MIYAPUR---R1546">TRIVENI SCHOOL,MIYAPUR---R1546</option>
<option value="TRIVENI SCHOOL,NALLAGANDLA---H1882">TRIVENI SCHOOL,NALLAGANDLA---H1882</option>
<option value="T R R HIGH SCHOOL,IBPM---R1389">T R R HIGH SCHOOL,IBPM---R1389</option>
<option value="TS MODEL SCHOOL ARUTLA---MS004">TS MODEL SCHOOL ARUTLA---MS004</option>
<option value="TS MODEL SCHOOL,BOLLARAM.---MS005">TS MODEL SCHOOL,BOLLARAM.---MS005</option>
<option value="TS MODEL SCHOOL BONGULOOR---MS002">TS MODEL SCHOOL BONGULOOR---MS002</option>
<option value="TS MODEL SCHOOL GUNGAL---MS003">TS MODEL SCHOOL GUNGAL---MS003</option>
<option value="TS MODEL SCHOOL MADHTSUR---R1112">TS MODEL SCHOOL MADHTSUR---R1112</option>
<option value="TS MODEL SCHOOL,MAHESHWARAM(VM)RR.DIST---RG360">TS MODEL SCHOOL,MAHESHWARAM(VM)RR.DIST---RG360</option>
<option value="TS MODEL SCHOOL MAHESWARAM R.R.DIST---RG339">TS MODEL SCHOOL MAHESWARAM R.R.DIST---RG339</option>
<option value="TS MODEL SCHOOL MARRIGUDA---NG38">TS MODEL SCHOOL MARRIGUDA---NG38</option>
<option value="TS MODEL SCHOOL,NEDUNOOR---MS006">TS MODEL SCHOOL,NEDUNOOR---MS006</option>
<option value="T.S MODEL SCHOOL,PALMAKUL---MS008">T.S MODEL SCHOOL,PALMAKUL---MS008</option>
<option value="T.S MODEL SCHOOL,PALMAKUL---RG335">T.S MODEL SCHOOL,PALMAKUL---RG335</option>
<option value="TS MODEL SCHOOL POCHAMPALLY---MS007">TS MODEL SCHOOL POCHAMPALLY---MS007</option>
<option value="TS MODEL SCHOOL,RAMPUR THANDA MANDAL THURKAPALLY---NG035">TS MODEL SCHOOL,RAMPUR THANDA MANDAL THURKAPALLY---NG035</option>
<option value="TS MODEL SCHOOL, SHABAD.---RG333">TS MODEL SCHOOL, SHABAD.---RG333</option>
<option value="TS MODEL SCHOOL VELIMELA---MS001">TS MODEL SCHOOL VELIMELA---MS001</option>
<option value="TSMS GUNDLAMACHNOOR.---M0065">TSMS GUNDLAMACHNOOR.---M0065</option>
<option value="TSRS KEEESARAGUTA---R9609">TSRS KEEESARAGUTA---R9609</option>
<option value="TSSWRS IBRAHIMPATAN---R9636">TSSWRS IBRAHIMPATAN---R9636</option>
<option value="TSSWRS NARSINGI---R9603">TSSWRS NARSINGI---R9603</option>
<option value="TVR MODEL HIGH SCHOOL, APURUPA COLONY,  IDA JEEDIMTLA---R1284">TVR MODEL HIGH SCHOOL, APURUPA COLONY,  IDA JEEDIMTLA---R1284</option>
<option value="UNIQUE HIGH SCHOOL,SURYA NAGAR,IDPL COLONY.---H2704">UNIQUE HIGH SCHOOL,SURYA NAGAR,IDPL COLONY.---H2704</option>
<option value="UNISON SCHOOL,AZADNAGAR---HH621">UNISON SCHOOL,AZADNAGAR---HH621</option>
<option value="UPPER PRIMARY SCHOOL, KAPRA,---R1829">UPPER PRIMARY SCHOOL, KAPRA,---R1829</option>
<option value="UPS BANDLAGUDA RJNR---RG192">UPS BANDLAGUDA RJNR---RG192</option>
<option value="UPS BEERAMGUDA---M0037">UPS BEERAMGUDA---M0037</option>
<option value="UPS BODUPPAL---RG108">UPS BODUPPAL---RG108</option>
<option value="UPS BRAHMANPALLY---RG248">UPS BRAHMANPALLY---RG248</option>
<option value="UPS CHINNA SOLIPET.---RG325">UPS CHINNA SOLIPET.---RG325</option>
<option value="UPS CHIPALAPALLY.---RG318">UPS CHIPALAPALLY.---RG318</option>
<option value="UPS CHOWDARIGUDA---R1982">UPS CHOWDARIGUDA---R1982</option>
<option value="UPS DAMMARI POCHAMPALLY---RG283">UPS DAMMARI POCHAMPALLY---RG283</option>
<option value="U P S, GAJULA RAMARAM---R9967">U P S, GAJULA RAMARAM---R9967</option>
<option value="UPS GIRIMAPUR---RG043">UPS GIRIMAPUR---RG043</option>
<option value="UPS GOLLUR---RG079">UPS GOLLUR---RG079</option>
<option value="UPS JIYAPALLY---NG005">UPS JIYAPALLY---NG005</option>
<option value="UPS KAMALA NAGAR---R1900">UPS KAMALA NAGAR---R1900</option>
<option value="UPS KISTAIPALLY---MG024">UPS KISTAIPALLY---MG024</option>
<option value="UPS, KONDAPUR---HG052">UPS, KONDAPUR---HG052</option>
<option value="UPS KOTHWALGUDA,SMSB---RG245">UPS KOTHWALGUDA,SMSB---RG245</option>
<option value="UPS LAXMINAGAR---RG081">UPS LAXMINAGAR---RG081</option>
<option value="UPS MADINAGUDA.---RG319">UPS MADINAGUDA.---RG319</option>
<option value="UPS MAKTHA ANANTHARAM---NG015">UPS MAKTHA ANANTHARAM---NG015</option>
<option value="UPS MALKAJGIRI---R1958">UPS MALKAJGIRI---R1958</option>
<option value="UPS MALLAPUR, BALAPUR(M), R.R.DIST.---RG268">UPS MALLAPUR, BALAPUR(M), R.R.DIST.---RG268</option>
<option value="UPS MANSANPALLY---RG380">UPS MANSANPALLY---RG380</option>
<option value="UPS MEDCHAL---RG017">UPS MEDCHAL---RG017</option>
<option value="UPS, MUCHINTAL, SHAMSHABAD---RG392">UPS, MUCHINTAL, SHAMSHABAD---RG392</option>
<option value="UPS NAGANPALLY---RG097">UPS NAGANPALLY---RG097</option>
<option value="UPS NALTHOOR,JINNARAM(M).---M179">UPS NALTHOOR,JINNARAM(M).---M179</option>
<option value="UPS NANAKRAMGUDA---RG397">UPS NANAKRAMGUDA---RG397</option>
<option value="UPS NEKNAMPUR---RG303">UPS NEKNAMPUR---RG303</option>
<option value="UPS OOTLA---MG015">UPS OOTLA---MG015</option>
<option value="UPS ORD.FACTORY---MG028">UPS ORD.FACTORY---MG028</option>
<option value="UPS PADAMATISOMARAM---NG034">UPS PADAMATISOMARAM---NG034</option>
<option value="UPS PAHADI SHARIF---RG311">UPS PAHADI SHARIF---RG311</option>
<option value="UPS PATI---MG007">UPS PATI---MG007</option>
<option value="UPS RAVULAPALLY,CHEVELLA---R9993">UPS RAVULAPALLY,CHEVELLA---R9993</option>
<option value="UPS SARASWATHIGUDA---R2116">UPS SARASWATHIGUDA---R2116</option>
<option value="UPS TURKAPALLY,BOLLARAM---MG027">UPS TURKAPALLY,BOLLARAM---MG027</option>
<option value="USHODAYA H.SCHOOL,HYDERGUDA X RD.---R1737">USHODAYA H.SCHOOL,HYDERGUDA X RD.---R1737</option>
<option value="USKEBAVI PS---M0023">USKEBAVI PS---M0023</option>

<option value="VALERIAN GRAMMAR HIGH  SCHOOL BOLLARM,JJ COLONY.---R9593">VALERIAN GRAMMAR HIGH  SCHOOL BOLLARM,JJ COLONY.---R9593</option>
<option value="VARDHANA SCHOOL KEESARA---R9758">VARDHANA SCHOOL KEESARA---R9758</option>
<option value="VARUNS MODEL HIGH SCHOOL HAYATHNAGAR,HAYATNAGAR---R1166">VARUNS MODEL HIGH SCHOOL HAYATHNAGAR,HAYATNAGAR---R1166</option>
<option value="VASAVI PUBLIC SCHOOL HIMAYNAGR---H4891">VASAVI PUBLIC SCHOOL HIMAYNAGR---H4891</option>
<option value="VASHISTA MODEL HIGH SCH. RAGANNAGUDA.---R9955">VASHISTA MODEL HIGH SCH. RAGANNAGUDA.---R9955</option>
<option value="V D P HIGH SCHOOL, SHALIBANDA,HYD.---H2710">V D P HIGH SCHOOL, SHALIBANDA,HYD.---H2710</option>
<option value="VEDIC VIDYALAYA HIGH SCHOOL,SITHAPHALMANDI.---H3819">VEDIC VIDYALAYA HIGH SCHOOL,SITHAPHALMANDI.---H3819</option>
<option value="VELIMALA P.S---M0089">VELIMALA P.S---M0089</option>
<option value="VELOCITY HIGH SCHOOL,MADINAGUDA,RR.DIST---R2356">VELOCITY HIGH SCHOOL,MADINAGUDA,RR.DIST---R2356</option>
<option value="VENKAT RAO MEM.H.S. LALDARWAZA---H2705">VENKAT RAO MEM.H.S. LALDARWAZA---H2705</option>
<option value="VENU KUNTA P.S---M0036">VENU KUNTA P.S---M0036</option>
<option value="VIDYA BODHINI HIGH SCHOOL, CHAMPAPET CHAMPAPET---R1048">VIDYA BODHINI HIGH SCHOOL, CHAMPAPET CHAMPAPET---R1048</option>
<option value="VIDYA DAYINI MODEL SCHOOL,CHAMPAPET---R9541">VIDYA DAYINI MODEL SCHOOL,CHAMPAPET---R9541</option>
<option value="VIDYA KIRAN HIGH SCHOOL, MARUTHI NAGAR,GHATKESAR---R9803">VIDYA KIRAN HIGH SCHOOL, MARUTHI NAGAR,GHATKESAR---R9803</option>
<option value="VIDYANIKETAN SCHOOL, RB NAGAR, SHAMSHABAD---R1981">VIDYANIKETAN SCHOOL, RB NAGAR, SHAMSHABAD---R1981</option>
<option value="VIDYA NIKETHAN HIGH SCHOOL,GANDHINAGAR,L.HOUSE,HYD.---H1828">VIDYA NIKETHAN HIGH SCHOOL,GANDHINAGAR,L.HOUSE,HYD.---H1828</option>
<option value="VIDYANJALI HSC. SERI LINGAMPLY---R9843">VIDYANJALI HSC. SERI LINGAMPLY---R9843</option>
<option value="VIDYA VIKAS HIGH SCHOOL KANAPUR RAJENDRA NAGAR.---RG121">VIDYA VIKAS HIGH SCHOOL KANAPUR RAJENDRA NAGAR.---RG121</option>
<option value="VIGNAN CONCEPT SCHOOL IBPM---R1860">VIGNAN CONCEPT SCHOOL IBPM---R1860</option>
<option value="VIGNAN INTEGRATED SCHOOL,-NADERGUL---R1009">VIGNAN INTEGRATED SCHOOL,-NADERGUL---R1009</option>
<option value="VIGNAN JYOTHI PUBLIC SCHOOL MADURANAGAR---H8891">VIGNAN JYOTHI PUBLIC SCHOOL MADURANAGAR---H8891</option>
<option value="VIJAYA RATNA HIGH SCHOOL---MD0005">VIJAYA RATNA HIGH SCHOOL---MD0005</option>
<option value="VIJAYARATNA HIGH SCHOOL,PEERZADIGUDA.---R2351">VIJAYARATNA HIGH SCHOOL,PEERZADIGUDA.---R2351</option>
<option value="VIJAYA RATNA HIGH SCHOOL, SAINAGAR COLONY, NEAR UPAL DEPOT---R1796">VIJAYA RATNA HIGH SCHOOL, SAINAGAR COLONY, NEAR UPAL DEPOT---R1796</option>
<option value="VIJETHA VIDYALAYA, PANDURANGA NGR---R1367">VIJETHA VIDYALAYA, PANDURANGA NGR---R1367</option>
<option value="VIPS INTERNATIONAL SCH,SHAHEENNAGAR---R1481">VIPS INTERNATIONAL SCH,SHAHEENNAGAR---R1481</option>
<option value="VISHRA THE SCHOOL, BALAPUR X ROADS---H0826">VISHRA THE SCHOOL, BALAPUR X ROADS---H0826</option>
<option value="VISHWA BHARATHI HIGH SCHOOL---R2284">VISHWA BHARATHI HIGH SCHOOL---R2284</option>
<option value="VIVEKA MODEL SCHOOL, CHARIKONDA, AMANGAL(M)---R2184">VIVEKA MODEL SCHOOL, CHARIKONDA, AMANGAL(M)---R2184</option>
<option value="VIVEKANANDA HIGH SCHOOL, MANCHAL.---R1257">VIVEKANANDA HIGH SCHOOL, MANCHAL.---R1257</option>
<option value="VIVEKANANDA HIGH SCHOOL,,MANCHAL---R1272">VIVEKANANDA HIGH SCHOOL,,MANCHAL---R1272</option>
<option value="VIVEKANANDA H.SCH,GANDDIMAISAMMA.---R1880">VIVEKANANDA H.SCH,GANDDIMAISAMMA.---R1880</option>
<option value="VR SERENITY ACADEMIA SCHOOL,KESARA---R1550">VR SERENITY ACADEMIA SCHOOL,KESARA---R1550</option>
<option value="V.V.BOYS HIGH SCHOOLJAMBAGH.---H4707">V.V.BOYS HIGH SCHOOLJAMBAGH.---H4707</option>
<option value="V.V.KANYA SHALA H.S.GOWLIGUDA---H5707">V.V.KANYA SHALA H.S.GOWLIGUDA---H5707</option>
<option value="WESLEY BOYS HIGH SCHOOL, PENDERGHAST ROAD, SEC-BAD.---HH708">WESLEY BOYS HIGH SCHOOL, PENDERGHAST ROAD, SEC-BAD.---HH708</option>
<option value="WISDOM HIGH SCHOOL, SALARJUNG COLONY, GOLKONDA ZONE HYD---HH722">WISDOM HIGH SCHOOL, SALARJUNG COLONY, GOLKONDA ZONE HYD---HH722</option>
<option value="WORD AND DEED H.SCH,HAYATHNAGAR.---R1301">WORD AND DEED H.SCH,HAYATHNAGAR.---R1301</option>
<option value="ZIKRA  HIGH SCHOOL,SOMAJIGUDA---H8526">ZIKRA  HIGH SCHOOL,SOMAJIGUDA---H8526</option>
<option value="ZPHS ABDULLAPUR---RG216">ZPHS ABDULLAPUR---RG216</option>
<option value="ZPHS ADIBATLA---R9624">ZPHS ADIBATLA---R9624</option>
<option value="ZPHS AKULAMYLARAM---RG055">ZPHS AKULAMYLARAM---RG055</option>
<option value="ZPHS ALIABAD---RG164">ZPHS ALIABAD---RG164</option>
<option value="ZPHS ALLAPUR---M154">ZPHS ALLAPUR---M154</option>
<option value="ZPHS ALOOR,CHEVELLA(M)---R1005">ZPHS ALOOR,CHEVELLA(M)---R1005</option>
<option value="ZPHS ALWAL-BOYS---R9579">ZPHS ALWAL-BOYS---R9579</option>
<option value="ZPHS AMDAPUR.---R9866">ZPHS AMDAPUR.---R9866</option>
<option value="ZPHS AMEERPET---RR997">ZPHS AMEERPET---RR997</option>
<option value="ZPHS ANAJPUR---RG021">ZPHS ANAJPUR---RG021</option>
<option value="ZPHS ANANTHARAM---RG352">ZPHS ANANTHARAM---RG352</option>
<option value="ZPHS ANANTHARAM (MDK)---MG003">ZPHS ANANTHARAM (MDK)---MG003</option>
<option value="ZPHS ANJAIAHNAGAR---RG190">ZPHS ANJAIAHNAGAR---RG190</option>
<option value="ZPHS ANKUSHAPUR---R9502">ZPHS ANKUSHAPUR---R9502</option>
<option value="ZPHS ANNARAM---MG029">ZPHS ANNARAM---MG029</option>
<option value="ZPHS ANNOJIGUDA---RG107">ZPHS ANNOJIGUDA---RG107</option>
<option value="ZPHS ARKAPALLY---R9862">ZPHS ARKAPALLY---R9862</option>
<option value="ZPHS ARUTLA---RG362">ZPHS ARUTLA---RG362</option>
<option value="ZPHS ARUTLA -GIRLS---RG028">ZPHS ARUTLA -GIRLS---RG028</option>
<option value="ZPHS ATHVELLI---RG143">ZPHS ATHVELLI---RG143</option>
<option value="ZPHS ATTAPUR RJNR---R9572">ZPHS ATTAPUR RJNR---R9572</option>
<option value="ZPHS AUSHAPUR,GHATKESAR---R1949">ZPHS AUSHAPUR,GHATKESAR---R1949</option>
<option value="ZPHS AZIZ NAGAR---R1041">ZPHS AZIZ NAGAR---R1041</option>
<option value="ZPHS BABBUGUDA---RG005">ZPHS BABBUGUDA---RG005</option>
<option value="ZPHS BACHUPALLY.---RG018">ZPHS BACHUPALLY.---RG018</option>
<option value="ZPHS BADANGPET---R9556">ZPHS BADANGPET---R9556</option>
<option value="ZPHS BAHADURGUDA---R9552">ZPHS BAHADURGUDA---R9552</option>
<option value="ZPHS BAHADURPALLY---RG178">ZPHS BAHADURPALLY---RG178</option>
<option value="ZPHS  BAKARAM---RG181">ZPHS  BAKARAM---RG181</option>
<option value="ZPHS BALAJI NAGAR.---RG247">ZPHS BALAJI NAGAR.---RG247</option>
<option value="ZPHS BALANAGAR---RG261">ZPHS BALANAGAR---RG261</option>
<option value="ZPHS BALAPUR---R9555">ZPHS BALAPUR---R9555</option>
<option value="ZPHS BANDA RAVIRALA---RG124">ZPHS BANDA RAVIRALA---RG124</option>
<option value="ZPHS BATA SINGARAM---R1039">ZPHS BATA SINGARAM---R1039</option>
<option value="ZPHS, BATTUGUDA,BIBINAGAR---NG024">ZPHS, BATTUGUDA,BIBINAGAR---NG024</option>
<option value="ZPHS BEERAMGUDA---MG030">ZPHS BEERAMGUDA---MG030</option>
<option value="ZPHS BHANOOR.---M0052">ZPHS BHANOOR.---M0052</option>
<option value="ZPHS BHEL TOWENSHIP.---M0075">ZPHS BHEL TOWENSHIP.---M0075</option>
<option value="ZPHS BIBINAGAR---NG022">ZPHS BIBINAGAR---NG022</option>
<option value="ZPHS BODUPPAL---RG242">ZPHS BODUPPAL---RG242</option>
<option value="ZPHS BOGARAM---RG095">ZPHS BOGARAM---RG095</option>
<option value="ZPHS BOLLARAM---R9590">ZPHS BOLLARAM---R9590</option>
<option value="ZPHS BOMMALARAMARAM,NALGONDA---NG017">ZPHS BOMMALARAMARAM,NALGONDA---NG017</option>
<option value="ZPHS BOMMARASIPET---RG304">ZPHS BOMMARASIPET---RG304</option>
<option value="ZPHS BONTHAPALLY---MG012">ZPHS BONTHAPALLY---MG012</option>
<option value="ZPHS BOURAMPET---R9912">ZPHS BOURAMPET---R9912</option>
<option value="ZPHS BOYS ,BOWINPALLY---RG058">ZPHS BOYS ,BOWINPALLY---RG058</option>
<option value="ZPHS-BOYS. EDULABAD.---R9504">ZPHS-BOYS. EDULABAD.---R9504</option>
<option value="ZPHS BOYS GHATEKSAR.---R9498">ZPHS BOYS GHATEKSAR.---R9498</option>
<option value="ZPHS BOYS IBRAHIMPATAN---R9629">ZPHS BOYS IBRAHIMPATAN---R9629</option>
<option value="ZPHS(BOYS) MANCHAL---RG353">ZPHS(BOYS) MANCHAL---RG353</option>
<option value="ZPHS BOYS, MEDCHAL.---R9493">ZPHS BOYS, MEDCHAL.---R9493</option>
<option value="ZPHS-BOYS PATANCHERU.---M0055">ZPHS-BOYS PATANCHERU.---M0055</option>
<option value="ZPHS-BOYS TIRMULGHERRY.---R9596">ZPHS-BOYS TIRMULGHERRY.---R9596</option>
<option value="ZPHS(B) POCHAMPALLY---NG026">ZPHS(B) POCHAMPALLY---NG026</option>
<option value="ZPHS BUDWEL---RG171">ZPHS BUDWEL---RG171</option>
<option value="ZPHS CHAMPAPET---R9553">ZPHS CHAMPAPET---R9553</option>
<option value="ZPHS CHANDANAGAR---RG015">ZPHS CHANDANAGAR---RG015</option>

<option value="ZPHS CHARAKONDA---MB012">ZPHS CHARAKONDA---MB012</option>
<option value="ZPHS ,CHARLAPALLY---RG051">ZPHS ,CHARLAPALLY---RG051</option>
<option value="ZPHS CHEERYAL---R9613">ZPHS CHEERYAL---R9613</option>
<option value="ZPHS CHEGOOR---MB006">ZPHS CHEGOOR---MB006</option>
<option value="ZPHS CHENNAREDDY GUDA.---R1857">ZPHS CHENNAREDDY GUDA.---R1857</option>
<option value="ZPHS CHERLAPATELGUDA---R9625">ZPHS CHERLAPATELGUDA---R9625</option>
<option value="ZPHS CHETLAPOTHARAM.---MG022">ZPHS CHETLAPOTHARAM.---MG022</option>
<option value="ZPHS CHILKUR---RG150">ZPHS CHILKUR---RG150</option>
<option value="ZPHS CHINA GOLKONDA---RG172">ZPHS CHINA GOLKONDA---RG172</option>
<option value="ZPHS CHINNA MANGALARAM.---R2121">ZPHS CHINNA MANGALARAM.---R2121</option>
<option value="ZPHS,CHINNARAVULAPALLY,BIBINAGAR,NLG.---NG023">ZPHS,CHINNARAVULAPALLY,BIBINAGAR,NLG.---NG023</option>
<option value="ZPHS CHINTAL CHERUVU---MG018">ZPHS CHINTAL CHERUVU---MG018</option>
<option value="ZPHS CHINTHAPATLA---RG260">ZPHS CHINTHAPATLA---RG260</option>
<option value="ZPHS CHINTULLAH---RG035">ZPHS CHINTULLAH---RG035</option>
<option value="ZPHS DABILPURA---RG174">ZPHS DABILPURA---RG174</option>
<option value="ZPHS DAMARAKUNTA---MG017">ZPHS DAMARAKUNTA---MG017</option>
<option value="ZPHS DAMMAIGUDA---RG091">ZPHS DAMMAIGUDA---RG091</option>
<option value="ZPHS DANADUMAILARAM.---R9626">ZPHS DANADUMAILARAM.---R9626</option>
<option value="ZPHS DARGA HUSSAIN SHAWAR---HH113">ZPHS DARGA HUSSAIN SHAWAR---HH113</option>
<option value="ZPHS DEVARYAMJAL---R9838">ZPHS DEVARYAMJAL---R9838</option>
<option value="ZPHS DEVUNIYERRAVALLY,CHEVELLA(M)---R1604">ZPHS DEVUNIYERRAVALLY,CHEVELLA(M)---R1604</option>
<option value="ZPHS,DODDI,ALWAL. ALWAL---RG322">ZPHS,DODDI,ALWAL. ALWAL---RG322</option>
<option value="ZPHS DOMADUGU---MG006">ZPHS DOMADUGU---MG006</option>
<option value="ZPHS DONTHI---M167">ZPHS DONTHI---M167</option>
<option value="ZPHS DULAPALLY---RG034">ZPHS DULAPALLY---RG034</option>
<option value="ZPHS DUNDIGAL---M0129">ZPHS DUNDIGAL---M0129</option>
<option value="ZPHS EDULANAGULAPALLY---MG021">ZPHS EDULANAGULAPALLY---MG021</option>
<option value="ZPHS EKLASKHANPET---MB007">ZPHS EKLASKHANPET---MB007</option>
<option value="ZPHS ELIMINED---R9627">ZPHS ELIMINED---R9627</option>
<option value="ZPHS FILMNAGAR---HG006">ZPHS FILMNAGAR---HG006</option>
<option value="ZPHS, GACHIBOWLI, SHERLINGAMPALLY---RG393">ZPHS, GACHIBOWLI, SHERLINGAMPALLY---RG393</option>
<option value="ZPHS GAGILLAPUR---RG151">ZPHS GAGILLAPUR---RG151</option>
<option value="ZPHS GAJULARAMARAM---RG032">ZPHS GAJULARAMARAM---RG032</option>
<option value="ZPHS GANDHINAGAR---RG288">ZPHS GANDHINAGAR---RG288</option>
<option value="ZPHS GANESHNAGAR,RJNR---RG341">ZPHS GANESHNAGAR,RJNR---RG341</option>
<option value="ZPHS GATTU IPPALAPALLI,T K PALLY(M)---R1862">ZPHS GATTU IPPALAPALLI,T K PALLY(M)---R1862</option>
<option value="ZPHS GHANAPUR---M176">ZPHS GHANAPUR---M176</option>
<option value="ZPHS GHANPUR,TOOPRAN(M),MEDAK---M0058">ZPHS GHANPUR,TOOPRAN(M),MEDAK---M0058</option>
<option value="ZPHS GHATKESAR---RG300">ZPHS GHATKESAR---RG300</option>
<option value="ZPHS GIRLS,ALOOR,CHEVELLA(M)---R1937">ZPHS GIRLS,ALOOR,CHEVELLA(M)---R1937</option>
<option value="ZPHS-GIRLS, ALWAL.---R9580">ZPHS-GIRLS, ALWAL.---R9580</option>
<option value="ZPHS GIRLS  BOINPALLY---RG059">ZPHS GIRLS  BOINPALLY---RG059</option>
<option value="ZPHS GIRLS EDULABAD---R9998">ZPHS GIRLS EDULABAD---R9998</option>
<option value="ZPHS GIRLS GHATKESAR---R9499">ZPHS GIRLS GHATKESAR---R9499</option>
<option value="ZPHS GIRLS HIGH SCHOOL,MANCHAL---RG046">ZPHS GIRLS HIGH SCHOOL,MANCHAL---RG046</option>
<option value="ZPHS GIRLS IBRAHIMPATNAM---RG382">ZPHS GIRLS IBRAHIMPATNAM---RG382</option>
<option value="ZPHS GIRLS KANDUKUR.---RG394">ZPHS GIRLS KANDUKUR.---RG394</option>
<option value="ZPHS-GIRLS. MALKAJIGIRI---R9683">ZPHS-GIRLS. MALKAJIGIRI---R9683</option>
<option value="ZPHS GIRLS U/M HS,IBPM---RG061">ZPHS GIRLS U/M HS,IBPM---RG061</option>
<option value="ZPHS GIRMAPUR---RG267">ZPHS GIRMAPUR---RG267</option>
<option value="ZPHS GOMARAM---MG020">ZPHS GOMARAM---MG020</option>
<option value="ZPHS GOWDAVELLY---RG193">ZPHS GOWDAVELLY---RG193</option>
<option value="ZPHS(G) POCHAMPALLY---NG029">ZPHS(G) POCHAMPALLY---NG029</option>
<option value="ZPHS (G) THUKKUGUDA---RG395">ZPHS (G) THUKKUGUDA---RG395</option>
<option value="ZPHS GUDUR,KANDUKUR(M)---RG277">ZPHS GUDUR,KANDUKUR(M)---RG277</option>
<option value="ZPHS GUMMADIDALA---R9895">ZPHS GUMMADIDALA---R9895</option>
<option value="ZPHS GUMMADIVELLI---RG197">ZPHS GUMMADIVELLI---RG197</option>
<option value="ZPHS GUNDLA POCHAMPALLY---R9999">ZPHS GUNDLA POCHAMPALLY---R9999</option>
<option value="ZPHS GUNGAL, YACHARAM.---R1753">ZPHS GUNGAL, YACHARAM.---R1753</option>
<option value="ZPHS GUNTHAPALLY---RG255">ZPHS GUNTHAPALLY---RG255</option>
<option value="ZPHS, GURUMURTY NAGAR.---R9969">ZPHS, GURUMURTY NAGAR.---R9969</option>
<option value="ZPHS , HABSIGUDA---RG234">ZPHS , HABSIGUDA---RG234</option>
<option value="ZPHS, HASMATPET.---RG220">ZPHS, HASMATPET.---RG220</option>
<option value="ZPHS HAYATHNAGAR---RG026">ZPHS HAYATHNAGAR---RG026</option>
<option value="ZPHS HIMAYATH NGR---R9879">ZPHS HIMAYATH NGR---R9879</option>
<option value="ZPHS HYDERNAGAR---RG149">ZPHS HYDERNAGAR---RG149</option>
<option value="ZPHS HYDERSHA KOTE---RG205">ZPHS HYDERSHA KOTE---RG205</option>
<option value="ZPHS HYTHABAD---RR998">ZPHS HYTHABAD---RR998</option>
<option value="ZPHS INDRIYALA---NG019">ZPHS INDRIYALA---NG019</option>
<option value="ZPHS INJAPUR---RG025">ZPHS INJAPUR---RG025</option>
<option value="ZPHS INMULNARWA---MB009">ZPHS INMULNARWA---MB009</option>
<option value="ZPHS IRVIN---RG386">ZPHS IRVIN---RG386</option>
<option value="ZPHS ISLAMPUR,MEDAK DIST---M0097">ZPHS ISLAMPUR,MEDAK DIST---M0097</option>
<option value="ZPHS ISNAPUR---R9855">ZPHS ISNAPUR---R9855</option>
<option value="ZPHS JAGATHGIRI NAGAR---RG210">ZPHS JAGATHGIRI NAGAR---RG210</option>
<option value="ZPHS JALALPUR---NG004">ZPHS JALALPUR---NG004</option>
<option value="ZPHS JAMEELAPET---NG001">ZPHS JAMEELAPET---NG001</option>
<option value="ZPHS JANWADA---RG136">ZPHS JANWADA---RG136</option>
<option value="ZPHS JAPAL---RG056">ZPHS JAPAL---RG056</option>
<option value="ZPHS JEEDIMETLA---RG044">ZPHS JEEDIMETLA---RG044</option>
<option value="ZPHS JILLELAGUDA---RG145">ZPHS JILLELAGUDA---RG145</option>
<option value="ZPHS JINNARAM---MG001">ZPHS JINNARAM---MG001</option>
<option value="ZPHS JULOOR---NG009">ZPHS JULOOR---NG009</option>
<option value="ZPHS KAGAZ MADDUR---M177">ZPHS KAGAZ MADDUR---M177</option>
<option value="ZPHS KALAKAL---RG083">ZPHS KALAKAL---RG083</option>
<option value="ZPHS KALLAKAR---R9851">ZPHS KALLAKAR---R9851</option>
<option value="ZPHS KANAKAMAMIDI---R9876">ZPHS KANAKAMAMIDI---R9876</option>
<option value="ZPHS KANDAWADA,CHEVELLA---R1985">ZPHS KANDAWADA,CHEVELLA---R1985</option>
<option value="ZPHS  KANDUKUR---R1851">ZPHS  KANDUKUR---R1851</option>
<option value="ZPHS KANKUNTA, GUMADIDALA(M)---MG025">ZPHS KANKUNTA, GUMADIDALA(M)---MG025</option>
<option value="ZPHS KANUKUNTA---RG282">ZPHS KANUKUNTA---RG282</option>
<option value="ZPHS KAPRA---R9617">ZPHS KAPRA---R9617</option>
<option value="ZPHS KAPSON---HH211">ZPHS KAPSON---HH211</option>
<option value="ZPHS KARMANGHAT---R9550">ZPHS KARMANGHAT---R9550</option>
<option value="ZPHS KAVADIPALLY---RG161">ZPHS KAVADIPALLY---RG161</option>
<option value="ZPHS KEESARA---R9611">ZPHS KEESARA---R9611</option>
<option value="ZPHS KESHAMPET---RG186">ZPHS KESHAMPET---RG186</option>
<option value="ZPHS KESHAWARAM---RG031">ZPHS KESHAWARAM---RG031</option>
<option value="ZPHS KETHIREDDY PALLY---RG144">ZPHS KETHIREDDY PALLY---RG144</option>
<option value="ZPHS KHAJAGUDA---R1941">ZPHS KHAJAGUDA---R1941</option>
<option value="ZPHS KHAJAPURA---RG175">ZPHS KHAJAPURA---RG175</option>
<option value="ZPHS KHANAPUR,TALKONDAPALLY(M)---RG103">ZPHS KHANAPUR,TALKONDAPALLY(M)---RG103</option>
<option value="ZPHS,KISTAREDDYPET, AMEENPUR---M0038">ZPHS,KISTAREDDYPET, AMEENPUR---M0038</option>
<option value="ZPHS KODAKANCHI---MG009">ZPHS KODAKANCHI---MG009</option>
<option value="ZPHS KOHEDA---RG019">ZPHS KOHEDA---RG019</option>
<option value="ZPHS KOLKULPALLY---RG184">ZPHS KOLKULPALLY---RG184</option>
<option value="ZPHS KOLLAPADKAL---RG168">ZPHS KOLLAPADKAL---RG168</option>
<option value="ZPHS  KOLLUR.---M0078">ZPHS  KOLLUR.---M0078</option>
<option value="ZPHS KOLTHUR---RG257">ZPHS KOLTHUR---RG257</option>
<option value="ZPHS KOMPALLY---R9881">ZPHS KOMPALLY---R9881</option>
<option value="ZPHS KONDAKAL---RG330">ZPHS KONDAKAL---RG330</option>
<option value="ZPHS KONDAMADUGU VILLAGE BIBINAGAR---NG025">ZPHS KONDAMADUGU VILLAGE BIBINAGAR---NG025</option>
<option value="ZPHS KONGARAKALAN---R9630">ZPHS KONGARAKALAN---R9630</option>
<option value="ZPHS KONGARA RARVIRALA---RG153">ZPHS KONGARA RARVIRALA---RG153</option>
<option value="ZPHS KORREMUL---R9505">ZPHS KORREMUL---R9505</option>
<option value="ZPHS KOTHAGUDA.---R9963">ZPHS KOTHAGUDA.---R9963</option>
<option value="ZPHS KOTHAPALLY---R2126">ZPHS KOTHAPALLY---R2126</option>
<option value="ZPHS KOTHAPET.---RG207">ZPHS KOTHAPET.---RG207</option>
<option value="ZPHS KOTHAPET, KESHAMPET---R1520">ZPHS KOTHAPET, KESHAMPET---R1520</option>
<option value="ZPHS KOTHUR---MG137">ZPHS KOTHUR---MG137</option>
<option value="ZPHS KOTIKAL---R1138">ZPHS KOTIKAL---R1138</option>
<option value="ZPHS KOTTUR---MB002">ZPHS KOTTUR---MB002</option>
<option value="ZPHS KOTYAL---MG026">ZPHS KOTYAL---MG026</option>
<option value="ZPHS, KOWKOOR.---RG053">ZPHS, KOWKOOR.---RG053</option>
<option value="ZPHS KOYYALAGUDEM---RG299">ZPHS KOYYALAGUDEM---RG299</option>
<option value="ZPHS KUCHARAM---HG020">ZPHS KUCHARAM---HG020</option>
<option value="ZPHS KUKATPALLY VIL.---R1027">ZPHS KUKATPALLY VIL.---R1027</option>
<option value="ZPHS KUNTLOOR,ABDULLAPURMET(M).---RG266">ZPHS KUNTLOOR,ABDULLAPURMET(M).---RG266</option>
<option value="ZPHS KURMEDUA---R1852">ZPHS KURMEDUA---R1852</option>
<option value="ZPHS,KURUMIDDA, YACHARAM---RG331">ZPHS,KURUMIDDA, YACHARAM---RG331</option>
<option value="ZPHS KUSHAIGUDA---R9616">ZPHS KUSHAIGUDA---R9616</option>
<option value="ZPHS LAKADARAM---M0053">ZPHS LAKADARAM---M0053</option>

<option value="ZPHS LALAPET---HH164">ZPHS LALAPET---HH164</option>
<option value="ZPHS LALGADI MALAKPET---R9958">ZPHS LALGADI MALAKPET---R9958</option>
<option value="ZPHS LAXMAPUR---RG014">ZPHS LAXMAPUR---RG014</option>
<option value="ZPHS LEMOOR---RG152">ZPHS LEMOOR---RG152</option>
<option value="ZPHS LINGAMPALLY---R9871">ZPHS LINGAMPALLY---R9871</option>
<option value="ZPHS LOYAPALLY---RG045">ZPHS LOYAPALLY---RG045</option>
<option value="ZPHS MACHA BOLLARAM---RG332">ZPHS MACHA BOLLARAM---RG332</option>
<option value="ZPHS MACHABOLLARAM---R9591">ZPHS MACHABOLLARAM---R9591</option>
<option value="ZPHS MADARAM---MG005">ZPHS MADARAM---MG005</option>
<option value="ZPHS MADGUL---RG367">ZPHS MADGUL---RG367</option>
<option value="ZPHS MADHAPUR---RG310">ZPHS MADHAPUR---RG310</option>
<option value="ZPHS MAHESHWARAM---RG112">ZPHS MAHESHWARAM---RG112</option>
<option value="ZPHS MAILARDEVPALLY.---RG128">ZPHS MAILARDEVPALLY.---RG128</option>
<option value="ZPHS MAJEEDPUR---R1249">ZPHS MAJEEDPUR---R1249</option>
<option value="ZPHS MALKAJIGIRI-BOYS---R9682">ZPHS MALKAJIGIRI-BOYS---R9682</option>
<option value="ZPHS MALKAPUR---RG256">ZPHS MALKAPUR---RG256</option>
<option value="ZPHS MALKARAM---R2146">ZPHS MALKARAM---R2146</option>
<option value="ZPHS MALL---R2113">ZPHS MALL---R2113</option>
<option value="ZPHS MALLAMPET---RG106">ZPHS MALLAMPET---RG106</option>
<option value="ZPHS MALLAPUR---RG057">ZPHS MALLAPUR---RG057</option>
<option value="ZPHS MAMIDIPALLY.---R9558">ZPHS MAMIDIPALLY.---R9558</option>
<option value="ZPHS MANGAMPET.---M0070">ZPHS MANGAMPET.---M0070</option>
<option value="ZPHS MANIKONDA.---RG289">ZPHS MANIKONDA.---RG289</option>
<option value="ZPHS MANKHAL---RG241">ZPHS MANKHAL---RG241</option>
<option value="ZPHS MANOHARABAD,MEDAK DIST---M0096">ZPHS MANOHARABAD,MEDAK DIST---M0096</option>
<option value="ZPHS MANSOORABAD---R2127">ZPHS MANSOORABAD---R2127</option>
<option value="ZPHS MARRIGUDA---NG037">ZPHS MARRIGUDA---NG037</option>
<option value="ZPHS MASAIPET---M162">ZPHS MASAIPET---M162</option>
<option value="ZPHS MEDCHAL-GIRLS---R9494">ZPHS MEDCHAL-GIRLS---R9494</option>
<option value="ZPHS MEDCHAL HARIJANWADA---RG126">ZPHS MEDCHAL HARIJANWADA---RG126</option>
<option value="ZPHS MEDIPALLY---RG047">ZPHS MEDIPALLY---RG047</option>
<option value="ZPHS MEDIPALLY,NAKKARTHA.---RG148">ZPHS MEDIPALLY,NAKKARTHA.---RG148</option>
<option value="ZPHS MEDJIL---M0110">ZPHS MEDJIL---M0110</option>
<option value="ZPHS MEERKHAN PET.---R1864">ZPHS MEERKHAN PET.---R1864</option>
<option value="ZPHS MEKAGUDA,NANDIGAM(M)---R9653">ZPHS MEKAGUDA,NANDIGAM(M)---R9653</option>
<option value="ZPHS MIYAPUR.---RG060">ZPHS MIYAPUR.---RG060</option>
<option value="ZPHS MOOSAPET---RG006">ZPHS MOOSAPET---RG006</option>
<option value="ZPHS, MOULALI---RG087">ZPHS, MOULALI---RG087</option>
<option value="ZPHS MUCHERLA  R.R.DIST---R1876">ZPHS MUCHERLA  R.R.DIST---R1876</option>
<option value="ZPHS MUDUCHINTALAPALLY---RG105">ZPHS MUDUCHINTALAPALLY---RG105</option>
<option value="ZPHS MUNEERABAD(MDCL)---RG030">ZPHS MUNEERABAD(MDCL)---RG030</option>
<option value="ZPHS MUPPIREDDIPALLY---MG004">ZPHS MUPPIREDDIPALLY---MG004</option>
<option value="ZPHS MUTHANGI---M0054">ZPHS MUTHANGI---M0054</option>
<option value="ZPHS NADERGUL---R9557">ZPHS NADERGUL---R9557</option>
<option value="ZPHS NAGARAM,MHRM(M).---RG370">ZPHS NAGARAM,MHRM(M).---RG370</option>
<option value="ZPHS NAGAWARAM---R9615">ZPHS NAGAWARAM---R9615</option>
<option value="ZPHS NAGOLE---R9639">ZPHS NAGOLE---R9639</option>
<option value="ZPHS NALLAVELLY---RG371">ZPHS NALLAVELLY---RG371</option>
<option value="ZPHS NANDIGAMA---MB005">ZPHS NANDIGAMA---MB005</option>
<option value="ZPHS NANDIWANAPARTY.---RG063">ZPHS NANDIWANAPARTY.---RG063</option>
<option value="ZPHS NARKUDA---RG170">ZPHS NARKUDA---RG170</option>
<option value="ZPHS NARSINGI RJNR---R9576">ZPHS NARSINGI RJNR---R9576</option>
<option value="ZPHS NEDUNUR---R1839">ZPHS NEDUNUR---R1839</option>
<option value="ZPHS NEHRU NAGAR---R2140">ZPHS NEHRU NAGAR---R2140</option>
<option value="ZPHS NEREDMET.---R9690">ZPHS NEREDMET.---R9690</option>
<option value="ZPHS NETKO---MB003">ZPHS NETKO---MB003</option>
<option value="ZPHS NIZAMPET---RG285">ZPHS NIZAMPET---RG285</option>
<option value="ZPHS NUTHANKAL---RG348">ZPHS NUTHANKAL---RG348</option>
<option value="ZPHS ORDNANCE FACTORY---MG002">ZPHS ORDNANCE FACTORY---MG002</option>
<option value="ZPHS PADMASHALIPURAM---RG342">ZPHS PADMASHALIPURAM---RG342</option>
<option value="ZPHS PAHADI SHARIEF---RG154">ZPHS PAHADI SHARIEF---RG154</option>
<option value="ZPHS PALMAKUL---RG118">ZPHS PALMAKUL---RG118</option>
<option value="ZPHS PAPIREDDYGUDA---RG368">ZPHS PAPIREDDYGUDA---RG368</option>
<option value="ZPHS PASUMAMULA---RG236">ZPHS PASUMAMULA---RG236</option>
<option value="ZPHS PATANCHERU-GIRLS---M0056">ZPHS PATANCHERU-GIRLS---M0056</option>
<option value="ZPHS PATELGUDA---R9631">ZPHS PATELGUDA---R9631</option>
<option value="ZPHS PEDDAGOTTIMUKKALA---R2029">ZPHS PEDDAGOTTIMUKKALA---R2029</option>
<option value="ZPHS PEDDAGUDEM---NG010">ZPHS PEDDAGUDEM---NG010</option>
<option value="ZPHS PEDDA KANJERLA---M174">ZPHS PEDDA KANJERLA---M174</option>
<option value="ZPHS PEDDAMANGALARAM---RG158">ZPHS PEDDAMANGALARAM---RG158</option>
<option value="ZPHS PEDDAMBERPET---RG001">ZPHS PEDDAMBERPET---RG001</option>
<option value="ZPHS PEDDASHAPUR---RG166">ZPHS PEDDASHAPUR---RG166</option>
<option value="ZPHS PEEPALPAHAD,CHOUTUPPAL---NG018">ZPHS PEEPALPAHAD,CHOUTUPPAL---NG018</option>
<option value="ZPHS PEERJADIGUDA---RG125">ZPHS PEERJADIGUDA---RG125</option>
<option value="ZPHS PENDYAL---RG246">ZPHS PENDYAL---RG246</option>
<option value="ZPHS PENJERLA---RG361">ZPHS PENJERLA---RG361</option>
<option value="ZPHS PERIKARALA THANDA(MDCL)---RG049">ZPHS PERIKARALA THANDA(MDCL)---RG049</option>
<option value="ZPHS PILLAIPALLY---NG002">ZPHS PILLAIPALLY---NG002</option>
<option value="ZPHS PODDATUR,SHANKARPALLY(M)---R9872">ZPHS PODDATUR,SHANKARPALLY(M)---R9872</option>
<option value="ZPHS POLKAMPALLY---R9632">ZPHS POLKAMPALLY---R9632</option>
<option value="ZPHS POODUR---R9492">ZPHS POODUR---R9492</option>
<option value="ZPHS POTHUGAL---RG312">ZPHS POTHUGAL---RG312</option>
<option value="ZPHS PRAGATHINAGAR---R2045">ZPHS PRAGATHINAGAR---R2045</option>
<option value="ZPHS PRATHAP SINGARAM---R9506">ZPHS PRATHAP SINGARAM---R9506</option>
<option value="ZPHS PULIMAMIDI---R1835">ZPHS PULIMAMIDI---R1835</option>
<option value="ZPHS QUTBULLAHPUR QTB MANDAL---RG254">ZPHS QUTBULLAHPUR QTB MANDAL---RG254</option>
<option value="ZPHS QUTBULLAPUR (HYT) MANDAL---RG020">ZPHS QUTBULLAPUR (HYT) MANDAL---RG020</option>
<option value="ZPHS RACHULOOR---R1856">ZPHS RACHULOOR---R1856</option>
<option value="ZPHS RAGANNAGUDA---RG050">ZPHS RAGANNAGUDA---RG050</option>
<option value="ZPHS RAIPOLE.---R9633">ZPHS RAIPOLE.---R9633</option>
<option value="ZPHS RAJBOLLARUM---RG223">ZPHS RAJBOLLARUM---RG223</option>
<option value="ZPHS RAJIV GANDHI NAGAR, GSI, BANDLAGUDA---RG305">ZPHS RAJIV GANDHI NAGAR, GSI, BANDLAGUDA---RG305</option>
<option value="ZPHS RAMACHANDRAPURAM---M0074">ZPHS RAMACHANDRAPURAM---M0074</option>
<option value="ZPHS RAMANTHAPUR---R9648">ZPHS RAMANTHAPUR---R9648</option>
<option value="ZPHS RAMPALLY---R9612">ZPHS RAMPALLY---R9612</option>
<option value="ZPHS RANGAIPALLY,MANOHARABAD(M),MEDAK DIST---M153">ZPHS RANGAIPALLY,MANOHARABAD(M),MEDAK DIST---M153</option>
<option value="ZPHS RANGAPUR MANCHAL MANDAL---RG029">ZPHS RANGAPUR MANCHAL MANDAL---RG029</option>
<option value="ZPHS RAVAL OCL---RG076">ZPHS RAVAL OCL---RG076</option>
<option value="ZPHS REDDYPALLY.---RG163">ZPHS REDDYPALLY.---RG163</option>
<option value="ZPHS RP COLONY, VENKATESHWAR NAGAR,JAGATHGIRIGUTTA---RG111">ZPHS RP COLONY, VENKATESHWAR NAGAR,JAGATHGIRIGUTTA---RG111</option>
<option value="ZPHS RUDRARAM---M0057">ZPHS RUDRARAM---M0057</option>
<option value="ZPHS RUSTAPUR---NG032">ZPHS RUSTAPUR---NG032</option>
<option value="ZPHS SAHEBNAGAR---RG239">ZPHS SAHEBNAGAR---RG239</option>
<option value="ZPHS SAROOR NAGAR---R9551">ZPHS SAROOR NAGAR---R9551</option>
<option value="ZPHS SATAMRAI.---R1228">ZPHS SATAMRAI.---R1228</option>
<option value="ZPHS SHABAD---RG302">ZPHS SHABAD---RG302</option>
<option value="ZPHS SHAMIRPET---RG110">ZPHS SHAMIRPET---RG110</option>
<option value="ZPHS SHAMSHABAD-BOYS---R9749">ZPHS SHAMSHABAD-BOYS---R9749</option>
<option value="ZPHS SHAMSHABAD-GIRLS---R9750">ZPHS SHAMSHABAD-GIRLS---R9750</option>
<option value="ZPHS SHAMSHABADMNDL---R9900">ZPHS SHAMSHABADMNDL---R9900</option>
<option value="ZPHS SHAMSHI GUDA---RG291">ZPHS SHAMSHI GUDA---RG291</option>
<option value="ZPHS SHAMSHIGUDA YELLAMMA BANDA---RG298">ZPHS SHAMSHIGUDA YELLAMMA BANDA---RG298</option>
<option value="ZPHS SHAPURNAGAR---R9814">ZPHS SHAPURNAGAR---R9814</option>
<option value="ZPHS SHERIGUDA---R9634">ZPHS SHERIGUDA---R9634</option>
<option value="ZPHS SHERLINGAMPALLY---RG198">ZPHS SHERLINGAMPALLY---RG198</option>
<option value="ZPHS SHIVAMPET---M175">ZPHS SHIVAMPET---M175</option>
<option value="ZPHS SHIVARAM PALLY---R9569">ZPHS SHIVARAM PALLY---R9569</option>
<option value="ZPHS SHIVNAGAR JINNARAM.---MG016">ZPHS SHIVNAGAR JINNARAM.---MG016</option>
<option value="ZPHS SIDDAPUR.---MB011">ZPHS SIDDAPUR.---MB011</option>
<option value="ZPHS SINGANNAAGUDA---MG033">ZPHS SINGANNAAGUDA---MG033</option>
<option value="ZPHS SOMAJIGUDA---HH137">ZPHS SOMAJIGUDA---HH137</option>
<option value="ZPHS SREERANGAWARAM,MEDCHAL.---R9495">ZPHS SREERANGAWARAM,MEDCHAL.---R9495</option>
<option value="ZPHS SULTHANPUR---M0032">ZPHS SULTHANPUR---M0032</option>
<option value="ZPHS SURARAM COL---R1250">ZPHS SURARAM COL---R1250</option>
<option value="ZPHS SURARAM,QUTHBULLAHPUR---RG328">ZPHS SURARAM,QUTHBULLAHPUR---RG328</option>
<option value="ZPHS TALAKONDAPALLY---R9570">ZPHS TALAKONDAPALLY---R9570</option>
<option value="ZPHS TALLAPALLY---RG356">ZPHS TALLAPALLY---RG356</option>
<option value="ZPHS TANGATOOR,SHANKARPALLY(M), RR DIST---R9628">ZPHS TANGATOOR,SHANKARPALLY(M), RR DIST---R9628</option>
<option value="ZPHS TARAMATIPET---R9896">ZPHS TARAMATIPET---R9896</option>
<option value="ZPHS TELLAPUR---MG031">ZPHS TELLAPUR---MG031</option>
<option value="ZPHS,THALLAPALLIGUDA---RG323">ZPHS,THALLAPALLIGUDA---RG323</option>
<option value="ZPHS THATTIANNARAM---RG073">ZPHS THATTIANNARAM---RG073</option>
<option value="ZPHS THELLAPUR.---M0077">ZPHS THELLAPUR.---M0077</option>
<option value="ZPHS THIMMAPUR---R1840">ZPHS THIMMAPUR---R1840</option>
<option value="ZPHS,THUNKI BOLLARAM.---M165">ZPHS,THUNKI BOLLARAM.---M165</option>
<option value="ZPHS  THURKAPALLY---RG349">ZPHS  THURKAPALLY---RG349</option>
<option value="ZPHS TIMMAPUR---MB001">ZPHS TIMMAPUR---MB001</option>
<option value="ZPHS TONDA PALLY---R9979">ZPHS TONDA PALLY---R9979</option>
<option value="ZPHS TOOPRAN---MG008">ZPHS TOOPRAN---MG008</option>
<option value="ZPHS TORRUR---RG003">ZPHS TORRUR---RG003</option>
<option value="ZPHS TRIMULGHERRY-GIRLS---R9597">ZPHS TRIMULGHERRY-GIRLS---R9597</option>
<option value="ZPHS TRISHUL PARK---R9592">ZPHS TRISHUL PARK---R9592</option>
<option value="ZPHS TUKKU GUDA---R1032">ZPHS TUKKU GUDA---R1032</option>
<option value="ZPHS TUMKUNTA---R9818">ZPHS TUMKUNTA---R9818</option>
<option value="ZPHS TURKALA KANAPUR.---MG011">ZPHS TURKALA KANAPUR.---MG011</option>
<option value="ZPHS TURKAPALLY---RG355">ZPHS TURKAPALLY---RG355</option>
<option value="ZPHS TURKAYAMJAL---RG201">ZPHS TURKAYAMJAL---RG201</option>
<option value="ZPHS UDDAMARRY.---RG086">ZPHS UDDAMARRY.---RG086</option>
<option value="ZPHS U/M DURGA HUSSAIN SHAVALI---RG078">ZPHS U/M DURGA HUSSAIN SHAVALI---RG078</option>
<option value="ZPHS U/M GHATKESAR---RG183">ZPHS U/M GHATKESAR---RG183</option>
<option value="ZPHS (U/M) NTR NAGAR---RG023">ZPHS (U/M) NTR NAGAR---RG023</option>
<option value="ZPHS(U/M) SAROORNAGAR---RG374">ZPHS(U/M) SAROORNAGAR---RG374</option>
<option value="ZPHS U/M SAROORNAGAR,RR.---RG384">ZPHS U/M SAROORNAGAR,RR.---RG384</option>
<option value="ZPHS UPPAL KALAN---R9640">ZPHS UPPAL KALAN---R9640</option>
<option value="ZPHS URELLA,CHEVELLA(M).---R2144">ZPHS URELLA,CHEVELLA(M).---R2144</option>
<option value="ZPHS VAILALA---MG023">ZPHS VAILALA---MG023</option>
<option value="ZPHS VANASTHALIPURAM.---RG138">ZPHS VANASTHALIPURAM.---RG138</option>
<option value="ZPHS VASPUL,MIDJIL(M)---R1910">ZPHS VASPUL,MIDJIL(M)---R1910</option>
<option value="ZPHSVATTINAGULAPALLY---RG272">ZPHSVATTINAGULAPALLY---RG272</option>
<option value="ZPHS VELIMELA---M0076">ZPHS VELIMELA---M0076</option>
<option value="ZPHS VELJAL---M0044">ZPHS VELJAL---M0044</option>
<option value="ZPHS VENKATAPUR---RG196">ZPHS VENKATAPUR---RG196</option>
<option value="ZPHS VENKIRIYAL.---NG006">ZPHS VENKIRIYAL.---NG006</option>
<option value="ZPHS WADIYARAM---M163">ZPHS WADIYARAM---M163</option>
<option value="ZPHS YACHARAM---RG062">ZPHS YACHARAM---RG062</option>
<option value="ZPHS YADGARPALLY---R9614">ZPHS YADGARPALLY---R9614</option>
<option value="ZPHS YAPRAL---R9496">ZPHS YAPRAL---R9496</option>
<option value="ZPPHS BHAGATSING NGR,CHINTAL---RG278">ZPPHS BHAGATSING NGR,CHINTAL---RG278</option>
<option value="ZPPS PONNALA---RG139">ZPPS PONNALA---RG139</option>


             </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Class
                                    </label>
                                    <select
                                        name="course"
                                        value={profileData.parsedbonofideData?.course || ""}
                                        onChange={(e) => handleChange(e, 'parsedbonofideData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    >
                                        <option value="">Select a Class</option>
                                        <option value="FIRST CLASS">FIRST CLASS</option>
                                        <option value="SECOND CLASS">SECOND CLASS</option>
                                        <option value="THIRD CLASS">THIRD CLASS</option>
                                        <option value="FOURTH CLASS">FOURTH CLASS</option>
                                        <option value="FIFTH CLASS">FIFTH CLASS</option>
                                        <option value="SIXTH CLASS">SIXTH CLASS</option>
                                        <option value="SEVENTH CLASS">SEVENTH CLASS</option>
                                        <option value="EIGHT CLASS">EIGHTH CLASS</option>
                                        <option value="NINTH CLASS">NINTH CLASS</option>
                                        <option value="TENTH CLASS">TENTH CLASS</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admission/Hallticket No
                                    </label>
                                    <input
                                        type="text"
                                        name="hallticketNo"
                                        value={profileData.parsedbonofideData?.hallticketNo || ""}
                                        onChange={(e) => handleChange(e, 'parsedbonofideData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 rounded-md px-6"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                    >
                                        <FaSave className="mr-1" />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                                >
                                    <FaUserEdit className="mr-1" />
                                    Edit Information
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SchoolBusPassProfile;
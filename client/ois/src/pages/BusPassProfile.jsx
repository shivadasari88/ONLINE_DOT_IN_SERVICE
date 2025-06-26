import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUniversity, FaSchool, FaUserEdit, FaSave, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const BusPassProfile = () => {
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
    }, [isEditing]);

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
                        const response = await axios.post('/applyBusPass', {
                            latitude,
                            longitude
                        });
                        
                        setStatus("Application submitted successfully" || "N/A");
                        setRemarks("An application reg no has been sent your registered mobile no and download your application from tsrtc.com "|| "N/A");
                        toast.success('Application submitted successfully for Bus Pass');
                    } catch (error) {
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
                        <h1 className="text-2xl font-bold">College Bus Pass Application</h1>
                        <p className="text-gray-300">Verify the details, This data will be considered for automation </p>
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
                                10th Memo Information
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
                                        10th Hall Ticket Number
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
                            </div>
                        </div>

                        {/* Bonafide Data Section */}
                        <div className="space-y-6 pt-8">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                                <FaUniversity className="mr-2 text-gray-700" />
                                College Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        College Name
                                    </label>
                                    <select
                                        name="collegeName"
                                        value={profileData.parsedbonofideData?.collegeName || ""}
                                        onChange={(e) => handleChange(e, 'parsedbonofideData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    >
                                        <option value="">Select a College</option>
<option value="AADHYA DEGREE COLLEGE, ANUPURAM,KAPRA---D5915">AADHYA DEGREE COLLEGE, ANUPURAM,KAPRA---D5915</option>
<option value="AAR MAHAVEER ENGG COLL, BANDLAGUDA KESHAVAGIRI---T3150">AAR MAHAVEER ENGG COLL, BANDLAGUDA KESHAVAGIRI---T3150</option>
<option value="ABHYAAS JUNIOR COLLEGE PEERZADIGUDA---J5874">ABHYAAS JUNIOR COLLEGE PEERZADIGUDA---J5874</option>
<option value="ACE ENG.COLLGE,ANKUSHPUR---T3246">ACE ENG.COLLGE,ANKUSHPUR---T3246</option>
<option value="ACME COLLEGE OF ARTS SCIENCES ,MALAKPET---D0484">ACME COLLEGE OF ARTS SCIENCES ,MALAKPET---D0484</option>
<option value="ADHYA JUNIOR COLLEGE---J5801">ADHYA JUNIOR COLLEGE---J5801</option>
<option value="AGARWAL JR.COLLEGE FOR BOYS,CHARKAMAN---J4790">AGARWAL JR.COLLEGE FOR BOYS,CHARKAMAN---J4790</option>
<option value="AGASTYA JR.COLLEGE,PET BASHEERABAD.---J5883">AGASTYA JR.COLLEGE,PET BASHEERABAD.---J5883</option>
<option value="AIMS COL OF HOTEL MGMT AND CATERING TECH, LB NAGAR---D6126">AIMS COL OF HOTEL MGMT AND CATERING TECH, LB NAGAR---D6126</option>
<option value="AIMS DEGREE COLLEGE---D6225">AIMS DEGREE COLLEGE---D6225</option>
<option value="AKBAR OWAISI JUNIOR COLLEGE---J5903">AKBAR OWAISI JUNIOR COLLEGE---J5903</option>
<option value="AKBAR OWAISI JUNIOR COLLEGE,MOGHAL PURA HYD---J5915">AKBAR OWAISI JUNIOR COLLEGE,MOGHAL PURA HYD---J5915</option>
<option value="AKBAR OWAISI JUNIOR COLLEGE, TALABKATTA,MOGHALPURA HYD---J5916">AKBAR OWAISI JUNIOR COLLEGE, TALABKATTA,MOGHALPURA HYD---J5916</option>
<option value="AKLR GOVT ORIENTAL COLLEGE,NALLAKUNTA.---D5631">AKLR GOVT ORIENTAL COLLEGE,NALLAKUNTA.---D5631</option>
<option value="AKSHADEEP JR.COLLEGE LIC COLONY MP,HYD.---J5770">AKSHADEEP JR.COLLEGE LIC COLONY MP,HYD.---J5770</option>
<option value="AKSHARA DEG.COLLEGE,MEDCHAL---D6027">AKSHARA DEG.COLLEGE,MEDCHAL---D6027</option>
<option value="AKSHARA DEGREE COLLEGE FOR WOMEN---D6207">AKSHARA DEGREE COLLEGE FOR WOMEN---D6207</option>
<option value="AKSHARA INST.OF MANAGEMENT STUDIES,UPPARI GUDA.---P3203">AKSHARA INST.OF MANAGEMENT STUDIES,UPPARI GUDA.---P3203</option>
<option value="AKSHARA JUNIOR COLLEGE,ATTAPUR---J5899">AKSHARA JUNIOR COLLEGE,ATTAPUR---J5899</option>
<option value="AKSHARA JUNIOR COLLEGE,KARMANGHAT---J5792">AKSHARA JUNIOR COLLEGE,KARMANGHAT---J5792</option>
<option value="ALI YAVARJUNG INST HEARING HC,MVIKASNGR---D0486">ALI YAVARJUNG INST HEARING HC,MVIKASNGR---D0486</option>
<option value="ALLIANCE COLLEGE OF HOTEL MANAGEMENT, MOOSAPET, KUKATPALLY---D6155">ALLIANCE COLLEGE OF HOTEL MANAGEMENT, MOOSAPET, KUKATPALLY---D6155</option>
<option value="ALPHORES JR COLLEGE, SHIVAM ROAD, NEW NALLAKUNTA, HYD---J5709">ALPHORES JR COLLEGE, SHIVAM ROAD, NEW NALLAKUNTA, HYD---J5709</option>
<option value="ALPHORES JUNIOR COLLEGE KARMANGHAT---J5377">ALPHORES JUNIOR COLLEGE KARMANGHAT---J5377</option>
<option value="ALPHORES JUNIOR COLLEGE,PAKALA PRIDE,AUSHAPUR,GTKRSAR---J5494">ALPHORES JUNIOR COLLEGE,PAKALA PRIDE,AUSHAPUR,GTKRSAR---J5494</option>
<option value="AL QUARMOSHI INSTIT OF BUSS MAN,JAMALBANDA BARKAS---P0217">AL QUARMOSHI INSTIT OF BUSS MAN,JAMALBANDA BARKAS---P0217</option>
<option value="AMZAD ALI KHAN COLL OF BUSINESS ADMINISTRATION,,RD NO 3 B.HILLS---P3131">AMZAD ALI KHAN COLL OF BUSINESS ADMINISTRATION,,RD NO 3 B.HILLS---P3131</option>
<option value="ANANNTHA LAW COLLEGE, VIVEKANANDA COLONY, KUKATPALLY---D6121">ANANNTHA LAW COLLEGE, VIVEKANANDA COLONY, KUKATPALLY---D6121</option>
<option value="ANAYA DEGREE DOLLEGE,HASTHINAPURAM.---D6210">ANAYA DEGREE DOLLEGE,HASTHINAPURAM.---D6210</option>
<option value="ANISH COLLEGE OF COMMERCE, AS RAO NAGAR---J5615">ANISH COLLEGE OF COMMERCE, AS RAO NAGAR---J5615</option>
<option value="ANISH DEGREE COLLEGE,NACHARAM---D6003">ANISH DEGREE COLLEGE,NACHARAM---D6003</option>
<option value="ANITHA VOC. JR. COLLEGE,PEERZADI GUDA---J5506">ANITHA VOC. JR. COLLEGE,PEERZADI GUDA---J5506</option>
<option value="ANJUMANS OOMER ITI, BAKARAM---T3039">ANJUMANS OOMER ITI, BAKARAM---T3039</option>
<option value="ANNAMACHARYA INST OF TECH AND SC,PIGLIPUR---T3223">ANNAMACHARYA INST OF TECH AND SC,PIGLIPUR---T3223</option>
<option value="ANNAMACHARYA INST. OF TECH. SCI.,PIGLIPURAM,BATASINGARAM.---T3351">ANNAMACHARYA INST. OF TECH. SCI.,PIGLIPURAM,BATASINGARAM.---T3351</option>
<option value="ANNAPURNA ITI, OPP RAMSINGHPURA, KARWAN---T3136">ANNAPURNA ITI, OPP RAMSINGHPURA, KARWAN---T3136</option>
<option value="ANR INDUSTRIAL TRAINING INSTITUTE,PEDDAMBERPET,HAYATNAGAR.---T3373">ANR INDUSTRIAL TRAINING INSTITUTE,PEDDAMBERPET,HAYATNAGAR.---T3373</option>
<option value="ANURAG UNIVERSITY -SCHOOL OF ENGINEERING---T3465">ANURAG UNIVERSITY -SCHOOL OF ENGINEERING---T3465</option>
<option value="ANURAG UNIVERSITY-SCHOOL OF MANAGEMENT---T3468">ANURAG UNIVERSITY-SCHOOL OF MANAGEMENT---T3468</option>
<option value="ANURAG UNIVERSITY-SCHOOL OF PHARMACY---T3466">ANURAG UNIVERSITY-SCHOOL OF PHARMACY---T3466</option>
<option value="ANWARUL ULOOM COLLEGE,NEW MALLEPALLY.---D0491">ANWARUL ULOOM COLLEGE,NEW MALLEPALLY.---D0491</option>
<option value="ANWARUL ULOOM COLLEGE, NEW MALLEPALLY.---P0089">ANWARUL ULOOM COLLEGE, NEW MALLEPALLY.---P0089</option>
<option value="ANWARUL ULOOM COLLEGE OF PHARMACY,NEW MALLEPALLY---P3137">ANWARUL ULOOM COLLEGE OF PHARMACY,NEW MALLEPALLY---P3137</option>
<option value="ANWAR UL ULOOM JR COLLEGE NAMPALLY---J5350">ANWAR UL ULOOM JR COLLEGE NAMPALLY---J5350</option>
<option value="APJ ABDUL KALAM JR.COLLEGE,SHAPOORNAGAR---J5743">APJ ABDUL KALAM JR.COLLEGE,SHAPOORNAGAR---J5743</option>
<option value="APOLLO COLLEGE OF NURSING,JUBILEE HILLS---P3297">APOLLO COLLEGE OF NURSING,JUBILEE HILLS---P3297</option>
<option value="APOLLO COLLEGE OF PHYSIOTHERAPY, JUBILEE HILLS, HYD---D6113">APOLLO COLLEGE OF PHYSIOTHERAPY, JUBILEE HILLS, HYD---D6113</option>
<option value="APOLLO INST.OF MEDICAL SCI.AND RESERCH,J.HILLS---P3287">APOLLO INST.OF MEDICAL SCI.AND RESERCH,J.HILLS---P3287</option>
<option value="APOLLO SCHOOL OF NURSING,JUBILEE HILLS---P3444">APOLLO SCHOOL OF NURSING,JUBILEE HILLS---P3444</option>
<option value="APPOLLO INST.OF HOSP. ADMINISTRATION,JUBILEE HILLS.---P3061">APPOLLO INST.OF HOSP. ADMINISTRATION,JUBILEE HILLS.---P3061</option>
<option value="ARADHANA COLL OF EDUCATION,BANDLAGUDA JAGIR,RJNR.X RDS---P3101">ARADHANA COLL OF EDUCATION,BANDLAGUDA JAGIR,RJNR.X RDS---P3101</option>
<option value="ARADHANA SCHOOL OF BUSINESS MANAGEMENT, KISMATHPURA---P3226">ARADHANA SCHOOL OF BUSINESS MANAGEMENT, KISMATHPURA---P3226</option>
<option value="ARISTOTLE P.G. COLL CHILKUR,MOINABAD---P0828">ARISTOTLE P.G. COLL CHILKUR,MOINABAD---P0828</option>
<option value="A R JR.COLLEGE,SHAMSHERGUNJ,JAHANUMA---J5445">A R JR.COLLEGE,SHAMSHERGUNJ,JAHANUMA---J5445</option>
<option value="ARJUN COLL OF TECH AND SCI,BATASINGARAM.---T3229">ARJUN COLL OF TECH AND SCI,BATASINGARAM.---T3229</option>
<option value="ARK DEGREE AND P.G. COLLEGE,VIDYANAGAR---P3260">ARK DEGREE AND P.G. COLLEGE,VIDYANAGAR---P3260</option>
<option value="ARMY COL.OF DENTAL SCIENCE,ACDS NAGAR---P4002">ARMY COL.OF DENTAL SCIENCE,ACDS NAGAR---P4002</option>
<option value="ARUNODAYA DEGREE COLLEGE,DILSUKHNAGAR,HYD.---D0356">ARUNODAYA DEGREE COLLEGE,DILSUKHNAGAR,HYD.---D0356</option>
<option value="ARYA COL.OF PHARMACY,KANDI---P4021">ARYA COL.OF PHARMACY,KANDI---P4021</option>
<option value="ASHLESHA I.T.I,ALIYABAD X ROAD,SHAMEERPET.---T3405">ASHLESHA I.T.I,ALIYABAD X ROAD,SHAMEERPET.---T3405</option>
<option value="ASPIRE JR.COLLEGE, KUKATPALLY, ADDAGUTTA, HYD.---J5173">ASPIRE JR.COLLEGE, KUKATPALLY, ADDAGUTTA, HYD.---J5173</option>
<option value="AUROBINDO COLL.OF BUSINES MANG,CHINTAPALLIGUDA,IBP.---P3282">AUROBINDO COLL.OF BUSINES MANG,CHINTAPALLIGUDA,IBP.---P3282</option>
<option value="AUROBINDO INST.OF CUMPUTER SCIENCES,CHINTAPALLIGUDA,IBP---P3281">AUROBINDO INST.OF CUMPUTER SCIENCES,CHINTAPALLIGUDA,IBP---P3281</option>
<option value="AURORA HIGHER EDUCATION RESERCH ACADEMY DEPT.ENGTECH UPPAL CAMPUS---T3478">AURORA HIGHER EDUCATION RESERCH ACADEMY DEPT.ENGTECH UPPAL CAMPUS---T3478</option>
<option value="AURORA HIGHER EDUCATIONRESERCH ACADEMY DEPT.MANAGEMENT.UPPAL CAMPUS---P3353">AURORA HIGHER EDUCATIONRESERCH ACADEMY DEPT.MANAGEMENT.UPPAL CAMPUS---P3353</option>
<option value="AURORA PG COLLEGE (MBA),RAMANTHPUR.---P4034">AURORA PG COLLEGE (MBA),RAMANTHPUR.---P4034</option>
<option value="AURORA P.G.COLLEGE(MCA),NAMPALLY, HYD---P3228">AURORA P.G.COLLEGE(MCA),NAMPALLY, HYD---P3228</option>
<option value="AURORAS DEGREE AND PG COLLEGE,CHIKKADPALLY---D0494">AURORAS DEGREE AND PG COLLEGE,CHIKKADPALLY---D0494</option>
<option value="AURORAS DEGREE PG COLLEGE---P3356">AURORAS DEGREE PG COLLEGE---P3356</option>
<option value="AURORAS DESIGN ACADEMY,ROAD NO.1,BANJARA HILLS, HYD.---T3415">AURORAS DESIGN ACADEMY,ROAD NO.1,BANJARA HILLS, HYD.---T3415</option>
<option value="AURORAS DESIGN INSTITUTE, IDP GEN PACK, HABSIGUDA, UPPAL.---T3416">AURORAS DESIGN INSTITUTE, IDP GEN PACK, HABSIGUDA, UPPAL.---T3416</option>
<option value="AURORAS LEGAL SCIENCES ACADEMY, BANDLAGUDA, KHALASA,HYD---D6156">AURORAS LEGAL SCIENCES ACADEMY, BANDLAGUDA, KHALASA,HYD---D6156</option>
<option value="AURORAS PG COLLEGE,CHIKKADPALLY---P0060">AURORAS PG COLLEGE,CHIKKADPALLY---P0060</option>
<option value="AURORAS PG COLLEGE (MBA)---P3357">AURORAS PG COLLEGE (MBA)---P3357</option>
<option value="AURORAS PG COLLEGE (MBA),PANJAGUTTA.---P3229">AURORAS PG COLLEGE (MBA),PANJAGUTTA.---P3229</option>
<option value="AURORAS PG COLLEGE (MCA)---P3358">AURORAS PG COLLEGE (MCA)---P3358</option>
<option value="AURORAS PG COLLEGE(MCA), PEERZADIGUDA---P3315">AURORAS PG COLLEGE(MCA), PEERZADIGUDA---P3315</option>
<option value="AURORAS PG COLLEGE (MCA), RAMANTHAPUR---P3328">AURORAS PG COLLEGE (MCA), RAMANTHAPUR---P3328</option>
<option value="AURORAS PG COLLEGE, PEERZADIGUDA---P3313">AURORAS PG COLLEGE, PEERZADIGUDA---P3313</option>
<option value="AURORAS SCIENTIFIC AND TECHN INST, AUSHAPUR.---T3332">AURORAS SCIENTIFIC AND TECHN INST, AUSHAPUR.---T3332</option>
<option value="AURORAS TECHNOLOGICAL AND RESEARCH INST.PARVATHAPUR---T3110">AURORAS TECHNOLOGICAL AND RESEARCH INST.PARVATHAPUR---T3110</option>
<option value="AVANTHI DEGREE AND PG COLLEGE, BARKATPURA---D0495">AVANTHI DEGREE AND PG COLLEGE, BARKATPURA---D0495</option>
<option value="AVANTHI DEGREE AND PG COLLEGE,NARAYANAGUDA---D6118">AVANTHI DEGREE AND PG COLLEGE,NARAYANAGUDA---D6118</option>
<option value="AVANTHI DEGREE COLL,MOOSARAMBAGH,DSNR.HYD---D0497">AVANTHI DEGREE COLL,MOOSARAMBAGH,DSNR.HYD---D0497</option>
<option value="AVANTHI INSTITUTE OF PHARMACEUTICAL SCIENCE,GUNTHAPALLY---T3431">AVANTHI INSTITUTE OF PHARMACEUTICAL SCIENCE,GUNTHAPALLY---T3431</option>
<option value="AVANTHI INST.OF PHAR.SCI,GUNTHAPALLY---D5800">AVANTHI INST.OF PHAR.SCI,GUNTHAPALLY---D5800</option>
<option value="AVANTHI INSTT OF ENGG TECH. GUNTHAPALLY.---T3210">AVANTHI INSTT OF ENGG TECH. GUNTHAPALLY.---T3210</option>
<option value="AVANTHI PG COLLEGE,MOOSARAMBAGH---P0027">AVANTHI PG COLLEGE,MOOSARAMBAGH---P0027</option>
<option value="AVANTHIS P G RESEARCH ACADEMY GUNTHAPALLY---P3294">AVANTHIS P G RESEARCH ACADEMY GUNTHAPALLY---P3294</option>
<option value="AVANTHIS SCIENTIFIC TECH RESEARCH ACADEMY. GUNTHAPALLY.---T3392">AVANTHIS SCIENTIFIC TECH RESEARCH ACADEMY. GUNTHAPALLY.---T3392</option>
<option value="A.V.COLLEGE OF ARTS, SCI. COMM,GAGANMAHAL.---D0353">A.V.COLLEGE OF ARTS, SCI. COMM,GAGANMAHAL.---D0353</option>
<option value="AV COLLEGE OF ARTS,SCI. COMM. PG CENTRE,GAGANMAHAL---P0026">AV COLLEGE OF ARTS,SCI. COMM. PG CENTRE,GAGANMAHAL---P0026</option>
<option value="AVINASH COLLEGE OF COMMERCE AS RAJU NAGAR..---D6005">AVINASH COLLEGE OF COMMERCE AS RAJU NAGAR..---D6005</option>
<option value="AVINASH COLLEGE OF COMMERCE, BASHEERBAGH.---D5882">AVINASH COLLEGE OF COMMERCE, BASHEERBAGH.---D5882</option>
<option value="AVINASH COLLEGE OF COMMERCE---J5842">AVINASH COLLEGE OF COMMERCE---J5842</option>
<option value="AVINASH COLLEGE OF COMMERCE,KUKATPALLY.---J5841">AVINASH COLLEGE OF COMMERCE,KUKATPALLY.---J5841</option>
<option value="AVINASH COLLEGE OF COMMERCE, L B NAGAR---J5741">AVINASH COLLEGE OF COMMERCE, L B NAGAR---J5741</option>
<option value="AVINASH COLLEGE OF COMMERCE, S.D ROAD, SEC-BAD---D5687">AVINASH COLLEGE OF COMMERCE, S.D ROAD, SEC-BAD---D5687</option>
<option value="AVINASH COLLEGE OF COMMERCE,SD ROAD,SECBAD---J5729">AVINASH COLLEGE OF COMMERCE,SD ROAD,SECBAD---J5729</option>
<option value="AVINASH COL.OF COMMERCE, HNO: 18/MIG1, 19/MIG1, KPHB COLONY, KP VILLAGE---J5673">AVINASH COL.OF COMMERCE, HNO: 18/MIG1, 19/MIG1, KPHB COLONY, KP VILLAGE---J5673</option>
<option value="AVINASH DEGREE COLLEGE, PLOT NO. 59/A,B,C,D, SRINAGAR COLONY, SAROORNAGAR---D6006">AVINASH DEGREE COLLEGE, PLOT NO. 59/A,B,C,D, SRINAGAR COLONY, SAROORNAGAR---D6006</option>
<option value="AVN INSTITUTE OF ENGG AND TECH, KOHEDA ROAD, PATELGUDA---T3305">AVN INSTITUTE OF ENGG AND TECH, KOHEDA ROAD, PATELGUDA---T3305</option>
<option value="AWARE COLL OF MED LAB TECH,SAGAR RD,KARMANGHAT---D5712">AWARE COLL OF MED LAB TECH,SAGAR RD,KARMANGHAT---D5712</option>
<option value="AYATI JUNIOR COLLEGE---J5165">AYATI JUNIOR COLLEGE---J5165</option>
<option value="AZAD COLL OF PHARMACY,MOINABAD---P3138">AZAD COLL OF PHARMACY,MOINABAD---P3138</option>
<option value="AZAM DEGREE COLLEGE HUSSAINI ALAM---D5921">AZAM DEGREE COLLEGE HUSSAINI ALAM---D5921</option>
<option value="AZAM VOC JR COLLEGE, HUSSAINIALAM---J5123">AZAM VOC JR COLLEGE, HUSSAINIALAM---J5123</option>

<option value="BABU JAGJEEVAN RAM VOC JUNIOR COLLEGE---J5900">BABU JAGJEEVAN RAM VOC JUNIOR COLLEGE---J5900</option>
<option value="BABUL REDDY JR COLLEGE,SR NGR---J5151">BABUL REDDY JR COLLEGE,SR NGR---J5151</option>
<option value="BACKSTAGE PASS INST.OF GAMEING ,MADHAPUR.---D6164">BACKSTAGE PASS INST.OF GAMEING ,MADHAPUR.---D6164</option>
<option value="BADDAM BAL REDDY INSTITUTE OF TECHNOLOGY AND BUSINESS SCHOOL BALAPUR---P0818">BADDAM BAL REDDY INSTITUTE OF TECHNOLOGY AND BUSINESS SCHOOL BALAPUR---P0818</option>
<option value="BADDAM BHOOPAL REDDY DEGREE COLLEGE,BALAPUR---D6220">BADDAM BHOOPAL REDDY DEGREE COLLEGE,BALAPUR---D6220</option>
<option value="BADRUKA COLLEGE OF COMMERCE ARTS,H.NO:3-2-847,KACHIGUDA RAILWAY STATION ROAD,HYDERABAD---D6107">BADRUKA COLLEGE OF COMMERCE ARTS,H.NO:3-2-847,KACHIGUDA RAILWAY STATION ROAD,HYDERABAD---D6107</option>
<option value="BADRUKA COLLEGE OF PG CENTRE,KACHIGUDA---P0061">BADRUKA COLLEGE OF PG CENTRE,KACHIGUDA---P0061</option>
<option value="BALAPUR NARAYANA JUNIOR COLLEGE---J5701">BALAPUR NARAYANA JUNIOR COLLEGE---J5701</option>
<option value="BANKATLAL BADRUKA COLLEGE FOR IT, KACHIGUDA---P4036">BANKATLAL BADRUKA COLLEGE FOR IT, KACHIGUDA---P4036</option>
<option value="BETHELHEM VOC.JR.COLLEGE,NALLAKUNTA---J5362">BETHELHEM VOC.JR.COLLEGE,NALLAKUNTA---J5362</option>
<option value="BHAGEERATHA COLLEGE OF DIPLOMA IN EDUCATION MANGALPALLY---D5990">BHAGEERATHA COLLEGE OF DIPLOMA IN EDUCATION MANGALPALLY---D5990</option>
<option value="BHAGEERTHA COLLEGE OF EDUCATION---D6161">BHAGEERTHA COLLEGE OF EDUCATION---D6161</option>
<option value="BHAGYANAGAR SCHOOL OF NURSING, CHINTALKUNTA L.B.NAGAR---T3470">BHAGYANAGAR SCHOOL OF NURSING, CHINTALKUNTA L.B.NAGAR---T3470</option>
<option value="BHAGYARADHI DEG COLLEGE,BESIDE IDPL PETROL BUNK,CHINTAL MAIN ROAD,CHINTAL---D0403">BHAGYARADHI DEG COLLEGE,BESIDE IDPL PETROL BUNK,CHINTAL MAIN ROAD,CHINTAL---D0403</option>
<option value="BHAGYARATHI JR.COLL, HMT ROAD,CHINTAL.---J3341">BHAGYARATHI JR.COLL, HMT ROAD,CHINTAL.---J3341</option>
<option value="BHARATH INSTITUTE OF TECHNOLOGY, MANGALPALLY---P4009">BHARATH INSTITUTE OF TECHNOLOGY, MANGALPALLY---P4009</option>
<option value="BHARAT INIST OF ENG AND TECH, MANGALPALLY---T3123">BHARAT INIST OF ENG AND TECH, MANGALPALLY---T3123</option>
<option value="BHARAT ITI, PHASE-I, IDA JEEDIMETLA---T3042">BHARAT ITI, PHASE-I, IDA JEEDIMETLA---T3042</option>
<option value="BHARAT SCHOOL OF PHARMACY.MANGALPALLY---D5805">BHARAT SCHOOL OF PHARMACY.MANGALPALLY---D5805</option>
<option value="BHASKAR ENGINEERING COLLEGE,YENKAPALLY.---T3362">BHASKAR ENGINEERING COLLEGE,YENKAPALLY.---T3362</option>
<option value="BHASKAR LAW COLLEGE,JBIT CAMPUS,YENKAPALLY.---P3309">BHASKAR LAW COLLEGE,JBIT CAMPUS,YENKAPALLY.---P3309</option>
<option value="BHASKAR MEDICAL COL.,YENKAPALLY---P4000">BHASKAR MEDICAL COL.,YENKAPALLY---P4000</option>
<option value="BHASKAR PHARMACY COLLEGE, YENKAPALLY(V), MOINABAD(M)---P3267">BHASKAR PHARMACY COLLEGE, YENKAPALLY(V), MOINABAD(M)---P3267</option>
<option value="BHAVANS NEW SCIENCE COLLEGE, NARAYANGUDA---D0504">BHAVANS NEW SCIENCE COLLEGE, NARAYANGUDA---D0504</option>
<option value="BHAVANS SRI AUROBINDO JR COLLEGE, SAINIKPURI, SECBAD---J5118">BHAVANS SRI AUROBINDO JR COLLEGE, SAINIKPURI, SECBAD---J5118</option>
<option value="BHAVANS VIVEKANANDA COLLEGE OF SCIENCE HUMANITIES COMMERCE---D 0358">BHAVANS VIVEKANANDA COLLEGE OF SCIENCE HUMANITIES COMMERCE---D 0358</option>
<option value="B J R GOVT DEG.COLLEGE, VITTALWADI.---D0498">B J R GOVT DEG.COLLEGE, VITTALWADI.---D0498</option>
<option value="BJR GOVT JR COLLEGE(GIRLS), RISALA BAZAR,GOLKONDA, HYD.---J4842">BJR GOVT JR COLLEGE(GIRLS), RISALA BAZAR,GOLKONDA, HYD.---J4842</option>
<option value="BONFIRE INST OF DESIGN, BASHEERBAGH---SP192">BONFIRE INST OF DESIGN, BASHEERBAGH---SP192</option>
<option value="BOYS TOWN ITI,JAHANUMA---T3044">BOYS TOWN ITI,JAHANUMA---T3044</option>
<option value="BRIGHT INST OF MNGT,T YAMJAL---P3083">BRIGHT INST OF MNGT,T YAMJAL---P3083</option>
<option value="BRILLIANT GR.SCHOOL,EDU.SOCIETY GRPUP OF INSTITUTIONS.ABDULLAPUR---T3343">BRILLIANT GR.SCHOOL,EDU.SOCIETY GRPUP OF INSTITUTIONS.ABDULLAPUR---T3343</option>
<option value="BRILLIANT INST. OF ENG. TECHNOLOGY,ABDULAPUR VILLAGE.---T3258">BRILLIANT INST. OF ENG. TECHNOLOGY,ABDULAPUR VILLAGE.---T3258</option>
<option value="BRILLIANT JR.COLLEGE,RC.PURAM.---J5169">BRILLIANT JR.COLLEGE,RC.PURAM.---J5169</option>
<option value="BRINDAVAN INST OF TEACHER EDUCATION SHERIGUDA---D5819">BRINDAVAN INST OF TEACHER EDUCATION SHERIGUDA---D5819</option>
<option value="B.R.Y.M PRIVATE ITI,BEERAMGUDA---T3422">B.R.Y.M PRIVATE ITI,BEERAMGUDA---T3422</option>
<option value="BVRIT, BACHUPALLY,HYD.---T3389">BVRIT, BACHUPALLY,HYD.---T3389</option>
       
<option value="CAMBRIDGE JUNIOR COLLEGE---J5675">CAMBRIDGE JUNIOR COLLEGE---J5675</option>
<option value="CAPITAL DEGREE COLLEGE, SHAPUR NAGAR---P0278">CAPITAL DEGREE COLLEGE, SHAPUR NAGAR---P0278</option>
<option value="CARE INST.OF MEDICAL SCI.,COLLEGE OF PHYSIOTHERAPY,RD.NO.1,BANJARA HILLS.BANJARA HILLS---D5804">CARE INST.OF MEDICAL SCI.,COLLEGE OF PHYSIOTHERAPY,RD.NO.1,BANJARA HILLS.BANJARA HILLS---D5804</option>
<option value="CAREER POINT JUNIOR COLLEGE STREET 5 TARNAKA---J5802">CAREER POINT JUNIOR COLLEGE STREET 5 TARNAKA---J5802</option>
<option value="CARRER POINT JUNIOR COLLEGE KUSHAIGUDA---J5779">CARRER POINT JUNIOR COLLEGE KUSHAIGUDA---J5779</option>
<option value="CBIT GANDIPET---P0031">CBIT GANDIPET---P0031</option>
<option value="CBIT---T3001">CBIT---T3001</option>
<option value="CENTRE FOR ECONOMIC AND SOCIAL STUDIES (AIDED)---P3345">CENTRE FOR ECONOMIC AND SOCIAL STUDIES (AIDED)---P3345</option>
<option value="CHAITANYA DEGREE COLLEGE,MADHURA NAGAR,SMSB---D5911">CHAITANYA DEGREE COLLEGE,MADHURA NAGAR,SMSB---D5911</option>
<option value="CHAITANYA DEGREE COLLEGE,MANDUMULA NAGAR, CHEVELLA---D6160">CHAITANYA DEGREE COLLEGE,MANDUMULA NAGAR, CHEVELLA---D6160</option>
<option value="CHAITANYA HUB JUNIOR COLLEGE POOJA MANO HIMAYATHNAGAR,HYD---J5795">CHAITANYA HUB JUNIOR COLLEGE POOJA MANO HIMAYATHNAGAR,HYD---J5795</option>
<option value="CHAITANYA JR COLLEGE TRIVENINAGAR.---J5434">CHAITANYA JR COLLEGE TRIVENINAGAR.---J5434</option>
<option value="CHAITANYA JR.KALASALA---J3306">CHAITANYA JR.KALASALA---J3306</option>
<option value="CHAITANYA JUNIOR COLLEGE SHAMSHABAD---J5328">CHAITANYA JUNIOR COLLEGE SHAMSHABAD---J5328</option>
<option value="CHAITANYA UNIVERSITY DEPT OF AGR  NURSING---P3350">CHAITANYA UNIVERSITY DEPT OF AGR  NURSING---P3350</option>
<option value="CHAITANYA UNIVERSITY DEPT OF ARTS  COMM  SCI---D6229">CHAITANYA UNIVERSITY DEPT OF ARTS  COMM  SCI---D6229</option>
<option value="CHAITANYA UNIVERSITY DEPT OF ENGG---T3475">CHAITANYA UNIVERSITY DEPT OF ENGG---T3475</option>
<option value="CHAITANYA UNIVERSITY DEPT OF MGMT---P3349">CHAITANYA UNIVERSITY DEPT OF MGMT---P3349</option>
<option value="CHAITANYA UNIVERSITY DEPT OF PHARMACY---T3476">CHAITANYA UNIVERSITY DEPT OF PHARMACY---T3476</option>
<option value="CHALLENGER DEGREE COLLEGE MOINABAD---D6238">CHALLENGER DEGREE COLLEGE MOINABAD---D6238</option>
<option value="CHALLENGER JR COLLEGE,SURANGAL ROAD,MOINABAD.---J5746">CHALLENGER JR COLLEGE,SURANGAL ROAD,MOINABAD.---J5746</option>
<option value="CHENNAIS AMIRTA INSTI. OF HOTEL MANAGEMENT, KHAIRATABAD.---D6174">CHENNAIS AMIRTA INSTI. OF HOTEL MANAGEMENT, KHAIRATABAD.---D6174</option>
<option value="CHILKUR BALAJI COL.PHARMACY,AZIZNAGAR---P4011">CHILKUR BALAJI COL.PHARMACY,AZIZNAGAR---P4011</option>
<option value="CIPET,CHERLAPALLY---T3156">CIPET,CHERLAPALLY---T3156</option>
<option value="CIPET---SP085">CIPET---SP085</option>
<option value="CITD BALANAGAR---T3160">CITD BALANAGAR---T3160</option>
<option value="CITY JR. COLLEGE A.C. GUARDS---J6085">CITY JR. COLLEGE A.C. GUARDS---J6085</option>
<option value="CMR COLLEGE OF PHYSIOTHERAPY.KANDLAKOYA MEDCHAL---D6235">CMR COLLEGE OF PHYSIOTHERAPY.KANDLAKOYA MEDCHAL---D6235</option>
<option value="CMR COLL OF ENGGANDTECH KANDLA KOYALA---T3175">CMR COLL OF ENGGANDTECH KANDLA KOYALA---T3175</option>
<option value="CMR COLL OF PHARMACY,KANDLAKOYA---P3139">CMR COLL OF PHARMACY,KANDLAKOYA---P3139</option>
<option value="CMR ENGINEERING COLLEGE, KANDLAKOYA---T3328">CMR ENGINEERING COLLEGE, KANDLAKOYA---T3328</option>
<option value="CMR INSTITUTE OF HEALTH SCIENCES KANDLAKOYA---D6234">CMR INSTITUTE OF HEALTH SCIENCES KANDLAKOYA---D6234</option>
<option value="CMR INSTITUTE OF TECHNOLOGY.,KANDLAKOYA---T3220">CMR INSTITUTE OF TECHNOLOGY.,KANDLAKOYA---T3220</option>
<option value="CMR TECHNICAL COMPUS, KANDLAKOYA, MEDCHAL---T3327">CMR TECHNICAL COMPUS, KANDLAKOYA, MEDCHAL---T3327</option>
<option value="CMS COMMERCE JR.COLLEGE(23015),RP ROAD,SEC.BAD---J5638">CMS COMMERCE JR.COLLEGE(23015),RP ROAD,SEC.BAD---J5638</option>
<option value="CMS COMMERCE JR COLLEGE,SR NAGAR---J5593">CMS COMMERCE JR COLLEGE,SR NAGAR---J5593</option>
<option value="CMS COMMERCE JUNIOR COLELGE,NIZAMPET.---J5832">CMS COMMERCE JUNIOR COLELGE,NIZAMPET.---J5832</option>
<option value="CMS COMMERCE JUNIOR COLLEGE,KAMALANAGAR,ECIL.---J5734">CMS COMMERCE JUNIOR COLLEGE,KAMALANAGAR,ECIL.---J5734</option>
<option value="CMS COMMERCE JUNIOR COLLEGE, NEAR RAVINDRA BHARATHI SCHOOL GADDIANNARAM,SAIDABAD---J5720">CMS COMMERCE JUNIOR COLLEGE, NEAR RAVINDRA BHARATHI SCHOOL GADDIANNARAM,SAIDABAD---J5720</option>
<option value="CMS DEGREE COLLEGE---D0185">CMS DEGREE COLLEGE---D0185</option>
<option value="COGNOS INSTITUTE OF HOTEL MGMT, TARNAKA.---D6170">COGNOS INSTITUTE OF HOTEL MGMT, TARNAKA.---D6170</option>
<option value="COLLEGE OF NURSING,SOMAJIGUDA---D5669">COLLEGE OF NURSING,SOMAJIGUDA---D5669</option>
<option value="COLLEGE OF PHYSIOTHERAPY,KIMS SECBAD.---D5792">COLLEGE OF PHYSIOTHERAPY,KIMS SECBAD.---D5792</option>
<option value="COLLEGE OF VET SCIENCES,RJNR---D5624">COLLEGE OF VET SCIENCES,RJNR---D5624</option>
<option value="COLL.OF HOME SCI.(PROF.JAYASHANKAR .TSAGU,SAIFABAD)---D5614">COLL.OF HOME SCI.(PROF.JAYASHANKAR .TSAGU,SAIFABAD)---D5614</option>
<option value="COLL.OF HORTICULTURE,RJNR---D5878">COLL.OF HORTICULTURE,RJNR---D5878</option>
<option value="CREATIVE MULTIMEDIA COLLEGE OFFINEARTS, DILSUKHNAGAR---D6167">CREATIVE MULTIMEDIA COLLEGE OFFINEARTS, DILSUKHNAGAR---D6167</option>
<option value="CRIMSON INSTITUTE OF TECHONOLOGY---T3212">CRIMSON INSTITUTE OF TECHONOLOGY---T3212</option>
<option value="CRR AAKASH JUNIOR COLLEGE BALAPUR X ROADS---J5466">CRR AAKASH JUNIOR COLLEGE BALAPUR X ROADS---J5466</option>
<option value="CSI EVA MAIR VOCATIONAL JUNIOR COLLEGE,SD ROAD SECBAD---J5391">CSI EVA MAIR VOCATIONAL JUNIOR COLLEGE,SD ROAD SECBAD---J5391</option>
<option value="CSI INSTITUTE OF PG STUDIES EAST MAREDPALL---P3198">CSI INSTITUTE OF PG STUDIES EAST MAREDPALL---P3198</option>
<option value="CSI INST.OF TECHNOLOGY,OPP.ANAND THATRE,SEC.BAD---T3111">CSI INST.OF TECHNOLOGY,OPP.ANAND THATRE,SEC.BAD---T3111</option>
<option value="CSI WESLEY INST.OF TECH. AND SCI.,SECUNDERABAD---T3414">CSI WESLEY INST.OF TECH. AND SCI.,SECUNDERABAD---T3414</option>
<option value="CULINARY ACADEMY OF INDIA,UMANAGAR,BEGUMPET. BEUMPET, HYD.---SP148">CULINARY ACADEMY OF INDIA,UMANAGAR,BEGUMPET. BEUMPET, HYD.---SP148</option>
<option value="CULINARY ACADEMY OF INDIA,UMANAGAR,BEGUMPET.---D0080">CULINARY ACADEMY OF INDIA,UMANAGAR,BEGUMPET.---D0080</option>
<option value="CVR COLLEGE OF ENGINEERING, MANGALPALLY---T3141">CVR COLLEGE OF ENGINEERING, MANGALPALLY---T3141</option>  

<option value="DAKSHA JUNIOR COLLEGE,ALIYABAD---J5872">DAKSHA JUNIOR COLLEGE,ALIYABAD---J5872</option>
<option value="DAKSHIN BHARATH HINDI PRA SABH---D5648">DAKSHIN BHARATH HINDI PRA SABH---D5648</option>
<option value="DATAR VOC JR COLLEGE ABIDS---J5199">DATAR VOC JR COLLEGE ABIDS---J5199</option>
<option value="DAVID MEM.DEG  P.G COLLEGE,TARNAKA---D5759">DAVID MEM.DEG  P.G COLLEGE,TARNAKA---D5759</option>
<option value="DAVID MEM. INSTITUTE OF MANG,TARNAKA---P0067">DAVID MEM. INSTITUTE OF MANG,TARNAKA---P0067</option>
<option value="DAVID MEMORIAL JR.COLL,TARNAKA---J5090">DAVID MEMORIAL JR.COLL,TARNAKA---J5090</option>
<option value="DCMS COLL OF PHYSIOTHERAPY, DARUSALAM---D5665">DCMS COLL OF PHYSIOTHERAPY, DARUSALAM---D5665</option>
<option value="DECCAN COLLEGE OF ENG  TECHNOLOGY,DARUSALAM NAMPALLY.---T3009">DECCAN COLLEGE OF ENG  TECHNOLOGY,DARUSALAM NAMPALLY.---T3009</option>
<option value="DECCAN COLL OF MEDICAL SCIENCE,KANCHANBAGH.---T3025">DECCAN COLL OF MEDICAL SCIENCE,KANCHANBAGH.---T3025</option>
<option value="DECCAN SCHOOL OF MANAGEMENT,DAR-US-SALAM,AGHAPUR.---P0032">DECCAN SCHOOL OF MANAGEMENT,DAR-US-SALAM,AGHAPUR.---P0032</option>
<option value="DECCAN SCHOOL OF PHARMACY, AGAHPURA---T3425">DECCAN SCHOOL OF PHARMACY, AGAHPURA---T3425</option>
<option value="DECCANS NEW CHAITANYA JUNIOR COLLEGE,TARANAKA,SECBAD.---J5733">DECCANS NEW CHAITANYA JUNIOR COLLEGE,TARANAKA,SECBAD.---J5733</option>
<option value="DEEKSHA JR.COLLEGE,ALWAL.---J5854">DEEKSHA JR.COLLEGE,ALWAL.---J5854</option>
<option value="DEEKSHA JR.COLLEGE,BALAJINAGAR,KP.---J5882">DEEKSHA JR.COLLEGE,BALAJINAGAR,KP.---J5882</option>
<option value="DEEKSHA JR COLLEGE LB NAGAR---J5162">DEEKSHA JR COLLEGE LB NAGAR---J5162</option>
<option value="DEEKSHA JR.COLLEGE UPPAL ENCLOVE,KAPRA---J4562">DEEKSHA JR.COLLEGE UPPAL ENCLOVE,KAPRA---J4562</option>
<option value="DEEKSHA JUNIOR COLLEGE, MIYAPUR---J5782">DEEKSHA JUNIOR COLLEGE, MIYAPUR---J5782</option>
<option value="DEEPSHIKHA VOC JUNIOR COLLEGE AMEERPET---J5427">DEEPSHIKHA VOC JUNIOR COLLEGE AMEERPET---J5427</option>
<option value="DELTA JR COLL,OU ROAD,NALLAKUNTA---J5212">DELTA JR COLL,OU ROAD,NALLAKUNTA---J5212</option>
<option value="DEVES MEDICAL COLL.  HOSP.,DEVA NAGAR.---D5900">DEVES MEDICAL COLL.  HOSP.,DEVA NAGAR.---D5900</option>
<option value="DEVI COLL OF MEDICAL LAB TECH---D5698">DEVI COLL OF MEDICAL LAB TECH---D5698</option>
<option value="DEVS COLLEGE OF NURSING, DEVANAGAR.---D6143">DEVS COLLEGE OF NURSING, DEVANAGAR.---D6143</option>
<option value="DHRUVA COLLEGE OF FASHION TECHNOLOGY,MADHAPUR,HYD---D6237">DHRUVA COLLEGE OF FASHION TECHNOLOGY,MADHAPUR,HYD---D6237</option>
<option value="DHRUVA COLL OF MGMT,BEHIND OXYGEN PARK, MEDCHAL.---SP033">DHRUVA COLL OF MGMT,BEHIND OXYGEN PARK, MEDCHAL.---SP033</option>
<option value="DHRUVA DEGREE COLLEGE---D5785">DHRUVA DEGREE COLLEGE---D5785</option>
<option value="DHRUVA JUNIOR COLLEGE, SANTOSH NAGAR---J5869">DHRUVA JUNIOR COLLEGE, SANTOSH NAGAR---J5869</option>
<option value="DIGIQUEST INSTITUTE OF CREATIVE ARTS  DESIGN---D6163">DIGIQUEST INSTITUTE OF CREATIVE ARTS  DESIGN---D6163</option>
<option value="DISTRICT INST. OF EDUCATION.N AND TRG, NEREDMAT.---T3104">DISTRICT INST. OF EDUCATION.N AND TRG, NEREDMAT.---T3104</option>
<option value="DON BOSCO DEG.COLEGEL,ERRAGADDA---D0513">DON BOSCO DEG.COLEGEL,ERRAGADDA---D0513</option>
<option value="DR.B.R.AMBEDKAR COLL,BAGHLINGAMPALLY---P0114">DR.B.R.AMBEDKAR COLL,BAGHLINGAMPALLY---P0114</option>
<option value="DR BR AMBEDKAR COLL OF LAW,BAGHLINGAMPALLY---D0016">DR BR AMBEDKAR COLL OF LAW,BAGHLINGAMPALLY---D0016</option>
<option value="DR BR AMBEDKAR DEG COLL,BAGHLINGAMPALLY---D0514">DR BR AMBEDKAR DEG COLL,BAGHLINGAMPALLY---D0514</option>
<option value="DR.B.R.AMBEDKAR INST.OF MANAGEMENT AND TECH.BAGH LINGAMPALLY,HYD.---P3174">DR.B.R.AMBEDKAR INST.OF MANAGEMENT AND TECH.BAGH LINGAMPALLY,HYD.---P3174</option>
<option value="DR BR AMBEDKAR JR COLLEGE, BAGHLINGAMPALLY---J4670">DR BR AMBEDKAR JR COLLEGE, BAGHLINGAMPALLY---J4670</option>
<option value="DR BRKR GOVT AYURVEDI COL,SR NAGR---P4003">DR BRKR GOVT AYURVEDI COL,SR NAGR---P4003</option>
<option value="DR JINDAL JR COLLEGE,ESAMAIBAZAR,CHADERGHAT.---J4661">DR JINDAL JR COLLEGE,ESAMAIBAZAR,CHADERGHAT.---J4661</option>
<option value="D.R.JUNIOR COLLEGE MIYAPUR,SERILINGAMPALLY,HYD---J5905">D.R.JUNIOR COLLEGE MIYAPUR,SERILINGAMPALLY,HYD---J5905</option>
<option value="DRK INSTITUTE OF SCIENCE AND TECHNOLOGY, BOWRAMPET, QUTHBULLAPUR(M)---T3205">DRK INSTITUTE OF SCIENCE AND TECHNOLOGY, BOWRAMPET, QUTHBULLAPUR(M)---T3205</option>
<option value="DR.NARAYANA COLLEGE OF COMMERCE,OLD ALWAL.---D6177">DR.NARAYANA COLLEGE OF COMMERCE,OLD ALWAL.---D6177</option>
<option value="DR. NARAYANA DEG COLL OF HOTEL MGMT  CATERING TECHNOLOGY,  ALWAL.---D5729">DR. NARAYANA DEG COLL OF HOTEL MGMT  CATERING TECHNOLOGY,  ALWAL.---D5729</option>
<option value="DR. NARAYANA JR.COLLEGE, OLD ALWAL---J5338">DR. NARAYANA JR.COLLEGE, OLD ALWAL---J5338</option>
<option value="DR.PATNAM MAHENDAR REDDY COLLEGE OF PHYSIOTHERAPY---D6236">DR.PATNAM MAHENDAR REDDY COLLEGE OF PHYSIOTHERAPY---D6236</option>
<option value="DR.PATNAM MAHENDER REDDY INST. OF MEDICAL SCIENCES, CHEVELLA---T3464">DR.PATNAM MAHENDER REDDY INST. OF MEDICAL SCIENCES, CHEVELLA---T3464</option>
<option value="DR.V.R.K.COLLEGE OF LAW---D6245">DR.V.R.K.COLLEGE OF LAW---D6245</option>
<option value="DURGA BAI DESHMUKH COLLEGE OF NURSING,VIDYANAGAR,OU ROAD.---D5719">DURGA BAI DESHMUKH COLLEGE OF NURSING,VIDYANAGAR,OU ROAD.---D5719</option>
<option value="DURGABAI DESHMUKH COLLEGE OF PHYSIOTHERAPY,VIDYANAGAR.PHYSIOTHERANY OU---D5615">DURGABAI DESHMUKH COLLEGE OF PHYSIOTHERAPY,VIDYANAGAR.PHYSIOTHERANY OU---D5615</option>
<option value="DURGABAI DESHMUKH GOVT.WOMENS TECHNICAL TRAINING INSTITUTE. AMEERPET---T3434">DURGABAI DESHMUKH GOVT.WOMENS TECHNICAL TRAINING INSTITUTE. AMEERPET---T3434</option>
<option value="DURGABAI DESHMUKH (VOC) TRAINING AND REHABILITATION CENTRE FOR HANDICAPPED, VIDYANAGAR---T3113">DURGABAI DESHMUKH (VOC) TRAINING AND REHABILITATION CENTRE FOR HANDICAPPED, VIDYANAGAR---T3113</option>
<option value="DVM COLLEGE OF COMMERCE, LB NAGAR---D0509">DVM COLLEGE OF COMMERCE, LB NAGAR---D0509</option>
<option value="DVM DEGREE AND PG COLLEGE, LB NAGAR---P3141">DVM DEGREE AND PG COLLEGE, LB NAGAR---P3141</option>

<option value="EDVANTA DEGREE COLLEGE,RTC COLONY, HAYATHNAGAR---D6046">EDVANTA DEGREE COLLEGE,RTC COLONY, HAYATHNAGAR---D6046</option>
<option value="ELITE PARA MEDICAL COLLEGE---SP202">ELITE PARA MEDICAL COLLEGE---SP202</option>
<option value="ELITE VOC JR COLLEGE,HUDA COMPLEX,KOTHAPET.---J5310">ELITE VOC JR COLLEGE,HUDA COMPLEX,KOTHAPET.---J5310</option>
<option value="ELLENKI COLLEGE OF ENG. AND TEC,PATEL GUDA---T3209">ELLENKI COLLEGE OF ENG. AND TEC,PATEL GUDA---T3209</option>
<option value="ENGINEERING COLLEGE,OU---P3044">ENGINEERING COLLEGE,OU---P3044</option>
<option value="ENGINEERING STAFF COLLEGE OF INDIA.GACHIBOWLI---SP086">ENGINEERING STAFF COLLEGE OF INDIA.GACHIBOWLI---SP086</option>
<option value="ESHWARIBAI MEMORIAL COLLEGE OF NURSING, WEST MARREDPALLY , SECBAD---D5707">ESHWARIBAI MEMORIAL COLLEGE OF NURSING, WEST MARREDPALLY , SECBAD---D5707</option>
<option value="ESIC MEDICAL COLLEGE,SANATHNAGAR---P3329">ESIC MEDICAL COLLEGE,SANATHNAGAR---P3329</option>
<option value="ETHAMES DEGREE COLLEGE PUNJAGUTTA X RDS---D6013">ETHAMES DEGREE COLLEGE PUNJAGUTTA X RDS---D6013</option>
<option value="EXCEL COLLEGE OF HOTEL MANAGEMENT, OPP. KAMINENI HOSPI. L.B. NAGAR---D6162">EXCEL COLLEGE OF HOTEL MANAGEMENT, OPP. KAMINENI HOSPI. L.B. NAGAR---D6162</option>
<option value="EXCELLENCIA JR.COLLEGE,NEAR D.MART, LB.NAGAR.---J5649">EXCELLENCIA JR.COLLEGE,NEAR D.MART, LB.NAGAR.---J5649</option>
<option value="EXCELLENCIA JR.COLLEGE, NEAR MIYAPUR PS, MADINAGUDA.---J5731">EXCELLENCIA JR.COLLEGE, NEAR MIYAPUR PS, MADINAGUDA.---J5731</option>
<option value="EXCELLENCIA JUNIOR COLLEGE,DAMMAIGUDA---J5877">EXCELLENCIA JUNIOR COLLEGE,DAMMAIGUDA---J5877</option>
<option value="EXCELLENCIA JUNIOR COLLEGE,PET BHASHEERBAGH(J5876)---J5876">EXCELLENCIA JUNIOR COLLEGE,PET BHASHEERBAGH(J5876)---J5876</option>
<option value="FIITJEE JR COLLEGE, MADINAGUDA,MYTHRINAGAR ARCH,HYD.---J5432">FIITJEE JR COLLEGE, MADINAGUDA,MYTHRINAGAR ARCH,HYD.---J5432</option>
<option value="FIITJEE JUNIOR COLLEGE DSNR---J5431">FIITJEE JUNIOR COLLEGE DSNR---J5431</option>
<option value="FIITJEE JUNIOR COLLEGE KUKATPALLY---J4613">FIITJEE JUNIOR COLLEGE KUKATPALLY---J4613</option>
<option value="FIITJEE JUNIOR COLLEGE,  OPP SECRETARIAT, SAIFABAD---J5313">FIITJEE JUNIOR COLLEGE,  OPP SECRETARIAT, SAIFABAD---J5313</option>
<option value="FIITJEE JUNIOR COLLEGE, VITTALWADI,HYD.---J5448">FIITJEE JUNIOR COLLEGE, VITTALWADI,HYD.---J5448</option>
<option value="FOOTWEAR DSGN  DEVLPMT INST,H.S.DARGA RAIDURGAM---P3343">FOOTWEAR DSGN  DEVLPMT INST,H.S.DARGA RAIDURGAM---P3343</option>
<option value="FSB DEGREE COLLEGE,BALAJINAGAR,KP.---D0602">FSB DEGREE COLLEGE,BALAJINAGAR,KP.---D0602</option>

<option value="">Select a College</option>
<option value="GALAXY DEGREE COLLEGE, SHAH ALI BANDA---D5942">GALAXY DEGREE COLLEGE, SHAH ALI BANDA---D5942</option>
<option value="GALAXY VOC JR COLLEGE, DEWAN DEVDI---J5213">GALAXY VOC JR COLLEGE, DEWAN DEVDI---J5213</option>
<option value="GANDHIAN COLLEGE OF EDUCATION,KUNTLOOR---D5812">GANDHIAN COLLEGE OF EDUCATION,KUNTLOOR---D5812</option>
<option value="GANDHI MEDICAL COLLEGE AND HOSPITAL,SECBAD---D5806">GANDHI MEDICAL COLLEGE AND HOSPITAL,SECBAD---D5806</option>
<option value="GANDHI MEDICAL COLLEGE,BHOIGUDA---T3084">GANDHI MEDICAL COLLEGE,BHOIGUDA---T3084</option>
<option value="GANDHI NATURAPATHIC MED.COL,BEGUMPET---P4004">GANDHI NATURAPATHIC MED.COL,BEGUMPET---P4004</option>
<option value="GATIK JUNIOR COLLEGE---J 5846">GATIK JUNIOR COLLEGE---J 5846</option>
<option value="GAUTHAMI DEG AND PG COLLEGE, IDPL COLONY,CHINTAL---P0167">GAUTHAMI DEG AND PG COLLEGE, IDPL COLONY,CHINTAL---P0167</option>
<option value="GAUTHAMI DEGREE COLLEGE, BESIDE IDPL PETROL BUNK,CHINTAL---D5789">GAUTHAMI DEGREE COLLEGE, BESIDE IDPL PETROL BUNK,CHINTAL---D5789</option>
<option value="GAUTHAMI DEGREE COLLEGE, KUKATPALLY---D0519">GAUTHAMI DEGREE COLLEGE, KUKATPALLY---D0519</option>
<option value="GAUTHAMI JR.COLLEGE BJP OFF.KP.---J4547">GAUTHAMI JR.COLLEGE BJP OFF.KP.---J4547</option>
<option value="GAYATHRI DEGREE COLLEGE,MEDCHAL---D6190">GAYATHRI DEGREE COLLEGE,MEDCHAL---D6190</option>
<option value="GAYATHRI JR.COLLEGE,SHIVARAMPALLY,RJNR---J5757">GAYATHRI JR.COLLEGE,SHIVARAMPALLY,RJNR---J5757</option>
<option value="G B N INST OF PHARMACY,EDULABAD---D5850">G B N INST OF PHARMACY,EDULABAD---D5850</option>
<option value="GEETANJALI DEG COLLEGE, APHB, IDPL, CHINTAL---D6076">GEETANJALI DEG COLLEGE, APHB, IDPL, CHINTAL---D6076</option>
<option value="GEETANJALI JUNIOR COLLEGE, APHB,  IDPL, CHINTAL---J3409">GEETANJALI JUNIOR COLLEGE, APHB,  IDPL, CHINTAL---J3409</option>
<option value="GEETHAJALI JR COLLEGE,NAGENDRANAGAR.---J5677">GEETHAJALI JR COLLEGE,NAGENDRANAGAR.---J5677</option>
<option value="GEETHANJALI COLLEGE OF  ENGG AND TECH,CHEERYAL (V)---T3215">GEETHANJALI COLLEGE OF  ENGG AND TECH,CHEERYAL (V)---T3215</option>
<option value="GEETHANJALI COLLEGE OF PHARMACY, CHEERYAL (V)---D5811">GEETHANJALI COLLEGE OF PHARMACY, CHEERYAL (V)---D5811</option>
<option value="GEETHANJALI DEG COLLEGE, ECIL X ROADS, KUSHAIGUDA---D5967">GEETHANJALI DEG COLLEGE, ECIL X ROADS, KUSHAIGUDA---D5967</option>
<option value="GEETHANJALI JR COLLEGE,ECIL,KUSAHIAGUDA---J5545">GEETHANJALI JR COLLEGE,ECIL,KUSAHIAGUDA---J5545</option>
<option value="GHULAM COL OF EDN, B.HILLS---D5650">GHULAM COL OF EDN, B.HILLS---D5650</option>
<option value="GITAM JR COLLEGE, ECIL X ROAD.---J5505">GITAM JR COLLEGE, ECIL X ROAD.---J5505</option>
<option value="GITAM UNIVERSITY,RUDRARAM---T3289">GITAM UNIVERSITY,RUDRARAM---T3289</option>
<option value="GLAND INST. OF PHAR.SCIENCE, KOTHAPET,MDK---D5891">GLAND INST. OF PHAR.SCIENCE, KOTHAPET,MDK---D5891</option>
<option value="GLOBAAL JR.COLLEGE, ST.NO.6, TARNAKA---J5630">GLOBAAL JR.COLLEGE, ST.NO.6, TARNAKA---J5630</option>
<option value="GLOBAL ACADEMY OF HOTEL MANAGEMENT, NARAYANAGUDA---D6154">GLOBAL ACADEMY OF HOTEL MANAGEMENT, NARAYANAGUDA---D6154</option>
<option value="GLOBAL COLLEGE OF PHARMACY CHILKUR---D5799">GLOBAL COLLEGE OF PHARMACY CHILKUR---D5799</option>
<option value="GLOBAL EDN CENTRE ,CHILKUR,MOINABAD---D5606">GLOBAL EDN CENTRE ,CHILKUR,MOINABAD---D5606</option>
<option value="GLOBAL EDUCATON CENTER,CHILKUR,MOINABAD---P4045">GLOBAL EDUCATON CENTER,CHILKUR,MOINABAD---P4045</option>
<option value="GLOBAL INSTITUTE OF HOTEL MANGAGEMENT, BARKATPURA---D5741">GLOBAL INSTITUTE OF HOTEL MANGAGEMENT, BARKATPURA---D5741</option>
<option value="GLOBAL INST OF ENGG AND TECH CHILKUR---T3233">GLOBAL INST OF ENGG AND TECH CHILKUR---T3233</option>
<option value="GLOBAL INST.OF MANAGEMENT,UPPARIGUDA---P3202">GLOBAL INST.OF MANAGEMENT,UPPARIGUDA---P3202</option>
<option value="GLR NEW MODEL JR COLLEGE, BESIDE RTA OFFICE, UPPAL---J3364">GLR NEW MODEL JR COLLEGE, BESIDE RTA OFFICE, UPPAL---J3364</option>
<option value="GOKARAJU LAILAVATHI WOMENS COLLEGE---D6196">GOKARAJU LAILAVATHI WOMENS COLLEGE---D6196</option>
<option value="GOKARAJU RNGRJ COLLEGE OF PHARMACY,BACHUPALLY---P3108">GOKARAJU RNGRJ COLLEGE OF PHARMACY,BACHUPALLY---P3108</option>
<option value="GOKUL DEGREE COLLEGE NARSINGI---D5758">GOKUL DEGREE COLLEGE NARSINGI---D5758</option>
<option value="GOVERNMENT DEGREE COLLEGE FOR WOMEN,GOLKONDA HYDERABAD.---D6109">GOVERNMENT DEGREE COLLEGE FOR WOMEN,GOLKONDA HYDERABAD.---D6109</option>
<option value="GOVERNMENT DEGREE COLLEGE, MALKAJGIRI---D6030">GOVERNMENT DEGREE COLLEGE, MALKAJGIRI---D6030</option>
<option value="GOVERNMENT ITI,SHAMEERPET---T3438">GOVERNMENT ITI,SHAMEERPET---T3438</option>
<option value="GOVERNMENT POLYTECHNIC COLLEGE FOR WOMEN,BADANGPET.---J3195">GOVERNMENT POLYTECHNIC COLLEGE FOR WOMEN,BADANGPET.---J3195</option>
<option value="GOVERNMENT POLYTECHNIC FOR WOMEN EAST MARREDIPALLY SECUNDERABAD---T3450">GOVERNMENT POLYTECHNIC FOR WOMEN EAST MARREDIPALLY SECUNDERABAD---T3450</option>
<option value="GOVT CITY COLLEGE,NAYAPOOL---D0521">GOVT CITY COLLEGE,NAYAPOOL---D0521</option>
<option value="GOVT CITY COLLEGE,NAYAPOOL---P0105">GOVT CITY COLLEGE,NAYAPOOL---P0105</option>
<option value="GOVT CITY JR.COLLEGE---J4660">GOVT CITY JR.COLLEGE---J4660</option>
<option value="GOVT COLLEGE OF PHYSICAL EDUCATION,GAGANMAHAL---D0688">GOVT COLLEGE OF PHYSICAL EDUCATION,GAGANMAHAL---D0688</option>
<option value="GOVT COL.OF NURSING,GANDHI HOSPITAL---D6082">GOVT COL.OF NURSING,GANDHI HOSPITAL---D6082</option>
<option value="GOVT COMPHN.COLL(IASF), M.TANK---D5639">GOVT COMPHN.COLL(IASF), M.TANK---D5639</option>
<option value="GOVT DEG COLLEGE FOR WOMEN,SANGAREDDY---D5969">GOVT DEG COLLEGE FOR WOMEN,SANGAREDDY---D5969</option>
<option value="GOVT DEGREE COLEGE, SERILINGAMPALLY---D6061">GOVT DEGREE COLLEGE, SERILINGAMPALLY---D6061</option>
<option value="GOVT DEGREE COLLEGE, BADANGPET---D6184">GOVT DEGREE COLLEGE, BADANGPET---D6184</option>
<option value="GOVT.DEGREE COLLEGE,CHANCHALGUDA---D6134">GOVT.DEGREE COLLEGE,CHANCHALGUDA---D6134</option>
<option value="GOVT.DEGREE COLLEGE CHEVELLA.T---D6108">GOVT.DEGREE COLLEGE CHEVELLA.T---D6108</option>
<option value="GOVT.DEGREE COLLEGE,FALAKNUMA,HYD---D6136">GOVT.DEGREE COLLEGE,FALAKNUMA,HYD---D6136</option>
<option value="GOVT DEGREE COLLEGE,GAJWAL---D5959">GOVT DEGREE COLLEGE,GAJWAL---D5959</option>
<option value="GOVT DEGREE COLLEGE IBRAHIMPATNAM---D5868">GOVT DEGREE COLLEGE IBRAHIMPATNAM---D5868</option>
<option value="GOVT DEGREE COLLEGE,KUKTAPALLY---D5871">GOVT DEGREE COLLEGE,KUKTAPALLY---D5871</option>
<option value="GOVT DEGREE COLLEGE MAHESHWARAM---D6226">GOVT DEGREE COLLEGE MAHESHWARAM---D6226</option>
<option value="GOVT.DEGREE COLLEGE, MAHESHWARAM, RR DIST---D-6226">GOVT.DEGREE COLLEGE, MAHESHWARAM, RR DIST---D-6226</option>
<option value="GOVT DEGREE COLLEGE,NEAR MONTHER DIARY, HAYATH NAGAR.---D5863">GOVT DEGREE COLLEGE,NEAR MONTHER DIARY, HAYATH NAGAR.---D5863</option>
<option value="GOVT DEGREE COLLEGE, PATANCHERU.---D5880">GOVT DEGREE COLLEGE, PATANCHERU.---D5880</option>
<option value="GOVT.DEGREE COLLEGE, QUTHBULLAPUR---D6211">GOVT.DEGREE COLLEGE, QUTHBULLAPUR---D6211</option>
<option value="GOVT DEGREE COLLEGE RAJENDRA NAGAR---D6204">GOVT DEGREE COLLEGE RAJENDRA NAGAR---D6204</option>
<option value="GOVT. DEGREE COLLEGE SITHAPHALMANDI.---D6105">GOVT. DEGREE COLLEGE SITHAPHALMANDI.---D6105</option>
<option value="GOVT DEGREE COLLEGE, UPPAL---D6183">GOVT DEGREE COLLEGE, UPPAL---D6183</option>
<option value="GOVT DEGREE COLLEGE(W)BEGUMPET---D0522">GOVT DEGREE COLLEGE(W)BEGUMPET---D0522</option>
<option value="GOVT DEGREE COL(W)HUSSAINIALAM---D0523">GOVT DEGREE COL(W)HUSSAINIALAM---D0523</option>
<option value="GOVT DENTAL COLLEGE  HOSPITAL,AFZALGUNJ---T3145">GOVT DENTAL COLLEGE  HOSPITAL,AFZALGUNJ---T3145</option>
<option value="GOVT DOMESTIC  SCIENCE TRAINING COLLEGE,,E.MARREDPALLY.---T3146">GOVT DOMESTIC  SCIENCE TRAINING COLLEGE,,E.MARREDPALLY.---T3146</option>
<option value="GOVT. GEN AND CHEST HOSPITAL---SP156">GOVT. GEN AND CHEST HOSPITAL---SP156</option>
<option value="GOVT GIRLS VOC. INSTITUTE,EAST MARREDPALLY.---T3132">GOVT GIRLS VOC. INSTITUTE,EAST MARREDPALLY.---T3132</option>
<option value="GOVT.INIST OF PD IN ENT,RPUR---SP095">GOVT.INIST OF PD IN ENT,RPUR---SP095</option>
<option value="GOVT INSTIT OFDIP IN ENGG TECH,EASTMAREDPALLY---T3026">GOVT INSTIT OFDIP IN ENGG TECH,EASTMAREDPALLY---T3026</option>
<option value="GOVT INST.OF ADVANCE STUDY IN EDUCATION.---D0003">GOVT INST.OF ADVANCE STUDY IN EDUCATION.---D0003</option>
<option value="GOVT. INST.OF ADV. STUDIES,MASABTANK.---T3130">GOVT. INST.OF ADV. STUDIES,MASABTANK.---T3130</option>
<option value="GOVT INST. OF ELECTRONICS,EAST MAREDPALLY.---T3029">GOVT INST. OF ELECTRONICS,EAST MAREDPALLY.---T3029</option>
<option value="GOVT INST OF PRINT TECHNOLOGY,MARREDPALLY---T3133">GOVT INST OF PRINT TECHNOLOGY,MARREDPALLY---T3133</option>
<option value="GOVT ITI ALWAL.---T3105">GOVT ITI ALWAL.---T3105</option>
<option value="GOVT ITI, BHONGIR.---T3443">GOVT ITI, BHONGIR.---T3443</option>
<option value="GOVT ITI KHAIRATABAD.---T3439">GOVT ITI KHAIRATABAD.---T3439</option>
<option value="GOVT ITI,MALLEPALLY---T3049">GOVT ITI,MALLEPALLY---T3049</option>
<option value="GOVT ITI MEDCHAL---T3190">GOVT ITI MEDCHAL---T3190</option>
<option value="GOVT ITI,MSRD---T3048">GOVT ITI,MSRD---T3048</option>
<option value="GOVT ITI,OLD CITY---T3046">GOVT ITI,OLD CITY---T3046</option>
<option value="GOVT ITI,PATANCHERU---T3051">GOVT ITI,PATANCHERU---T3051</option>
<option value="GOVT ITI,SANATHNAGAR.---T3047">GOVT ITI,SANATHNAGAR.---T3047</option>
<option value="GOVT ITI SANGAREDDY.---T3187">GOVT ITI SANGAREDDY.---T3187</option>
<option value="GOVT ITI,SECUNDERABAD---T3052">GOVT ITI,SECUNDERABAD---T3052</option>
<option value="GOVT. ITI SHADNAGAR---T3449">GOVT. ITI SHADNAGAR---T3449</option>
<option value="GOVT ITI SHANTHINAGAR---T3457">GOVT ITI SHANTHINAGAR---T3457</option>
<option value="GOVT ITI,TARNAKA---T3050">GOVT ITI,TARNAKA---T3050</option>
<option value="GOVT. ITI VIJAYANAGAR COLONY.---T3458">GOVT. ITI VIJAYANAGAR COLONY.---T3458</option>
<option value="GOVT J.N. POLYTECHNIC COLL,RAMANTHPUR---T3090">GOVT J.N. POLYTECHNIC COLL,RAMANTHPUR---T3090</option>
<option value="GOVT JR COL.FOR BOYS NAMPALLY---J4570">GOVT JR COL.FOR BOYS NAMPALLY---J4570</option>
<option value="GOVT JR COLLEGE,ALIYA,GNFD---J4530">GOVT JR COLLEGE,ALIYA,GNFD---J4530</option>
<option value="GOVT JR.COLLEGE BHEL---J3387">GOVT JR.COLLEGE BHEL---J3387</option>
<option value="GOVT JR.COLLEGE, BOLLARAM---J3350">GOVT JR.COLLEGE, BOLLARAM---J3350</option>
<option value="GOVT JR COLLEGE BOMMALARAMARAM---J5385">GOVT JR COLLEGE BOMMALARAMARAM---J5385</option>
<option value="GOVT JR COLLEGE, BORABANDA,HYD---J5740">GOVT JR COLLEGE, BORABANDA,HYD---J5740</option>
<option value="GOVT.JR.COLLEGE,B.POCHAMPALLY---J5753">GOVT.JR.COLLEGE,B.POCHAMPALLY---J5753</option>
<option value="GOVT JR COLLEGE CHANCHALAGUDA.---J4710">GOVT JR COLLEGE CHANCHALAGUDA.---J4710</option>
<option value="GOVT. JR.COLLEGE,CHEVELLA---J5758">GOVT. JR.COLLEGE,CHEVELLA---J5758</option>
<option value="GOVT JR.COLLEGE FALAKHNUMA---J4730">GOVT JR.COLLEGE FALAKHNUMA---J4730</option>
<option value="GOVT JR COLLEGE FOR GIRLS FALAKNAMA---J5424">GOVT JR COLLEGE FOR GIRLS FALAKNAMA---J5424</option>
<option value="GOVT JR COLLEGE FOR GIRLS MAREDPALLY.---J4990">GOVT JR COLLEGE FOR GIRLS MAREDPALLY.---J4990</option>
<option value="GOVT JR.COLLEGE (G),MISARAM---J5411">GOVT JR.COLLEGE (G),MISARAM---J5411</option>
<option value="GOVT JR.COLLEGE,HAYATHNAGAR.---J3365">GOVT JR.COLLEGE,HAYATHNAGAR.---J3365</option>
<option value="GOVT JR.COLLEGE HUSSAINIALAM---J4740">GOVT JR.COLLEGE HUSSAINIALAM---J4740</option>
<option value="GOVT JR.COLLEGE IBP---J3370">GOVT JR.COLLEGE IBP---J3370</option>
<option value="GOVT JR.COLLEGE KACHIGUDA---J4610">GOVT JR.COLLEGE KACHIGUDA---J4610</option>
<option value="GOVT JR COLLEGE KANDUKUR.---J5441">GOVT JR COLLEGE KANDUKUR.---J5441</option>
<option value="GOVT.JR.COLLEGE,MADGUL,RR.DIST---J5787">GOVT.JR.COLLEGE,MADGUL,RR.DIST---J5787</option>
<option value="GOVT JR COLLEGE,MADHURANAGAR, RAIDURGA.---J5540">GOVT JR COLLEGE,MADHURANAGAR, RAIDURGA.---J5540</option>
<option value="GOVT. JR COLLEGE MANCHAL.---J5724">GOVT. JR COLLEGE MANCHAL.---J5724</option>
<option value="GOVT JR.COLLEGE, MEDCHAL---J3340">GOVT JR.COLLEGE, MEDCHAL---J3340</option>
<option value="GOVT JR.COLLEGE,MULUGU---J5449">GOVT JR.COLLEGE,MULUGU---J5449</option>
<option value="GOVT JR.COLLEGE OLD MALAKPET.---J4690">GOVT JR.COLLEGE OLD MALAKPET.---J4690</option>
<option value="GOVT JR COLLEGE,PATANCHERU---J5142">GOVT JR COLLEGE,PATANCHERU---J5142</option>
<option value="GOVT JR.COLLEGE RAJENDRANAGAR.---J3363">GOVT JR.COLLEGE RAJENDRANAGAR.---J3363</option>
<option value="GOVT JR COLLEGE SANGAREDDY---J5396">GOVT JR COLLEGE SANGAREDDY---J5396</option>
<option value="GOVT JR.COLLEGE SAROORNAGAR---J3366">GOVT JR.COLLEGE SAROORNAGAR---J3366</option>
<option value="GOVT JR.COLLEGE SHAMSHABAD---J3372">GOVT JR.COLLEGE SHAMSHABAD---J3372</option>
<option value="GOVT.JR COLLEGE SITHAPHALMANDI.---J5717">GOVT.JR COLLEGE SITHAPHALMANDI.---J5717</option>
<option value="GOVT JR.COLLEGE SP ROAD---J5040">GOVT JR.COLLEGE SP ROAD---J5040</option>
<option value="GOVT JR COLLEGE VIDYANGR---J5380">GOVT JR COLLEGE VIDYANGR---J5380</option>
<option value="GOVT JR.COLLEGE YACHARAM---J5483">GOVT JR.COLLEGE YACHARAM---J5483</option>
<option value="GOVT JR.COLL, MALAKAJGIRI---J3342">GOVT JR.COLL, MALAKAJGIRI---J3342</option>
<option value="GOVT JR COOLLEGE QUTHBULLAPUR---J5438">GOVT JR COOLLEGE QUTHBULLAPUR---J5438</option>
<option value="GOVT JUNIOR COLLEGE BEERAMGUA,RC PURAM MEDAK DIST---J5416">GOVT JUNIOR COLLEGE BEERAMGUA,RC PURAM MEDAK DIST---J5416</option>
<option value="GOVT JUNIOR COLLEGE JINNARAM MEDAK---J6087">GOVT JUNIOR COLLEGE JINNARAM MEDAK---J6087</option>
<option value="GOVT JUNIOR COLLEGE MAHESHWARAM---J5601">GOVT JUNIOR COLLEGE MAHESHWARAM---J5601</option>
<option value="GOVT.JUNIOR COLLEGE, MEERPET---J5887">GOVT.JUNIOR COLLEGE, MEERPET---J5887</option>
<option value="GOVT JUNIOR VOC COLLEGE---J5656">GOVT JUNIOR VOC COLLEGE---J5656</option>
<option value="GOVT MAHABOOBIA JR COLLEGE FOR GIRLA.,GUNFOUNDRY,ABIDS.---J4870">GOVT MAHABOOBIA JR COLLEGE FOR GIRLA.,GUNFOUNDRY,ABIDS.---J4870</option>
<option value="GOVT MATERNITY HOSPITAL.---SP154">GOVT MATERNITY HOSPITAL.---SP154</option>
<option value="GOVT POLYTECHNIC COLLEGE, SANGAREDDY---T3365">GOVT POLYTECHNIC COLLEGE, SANGAREDDY---T3365</option>
<option value="GOVT POLYTECHNIC COLLEGE,YADAGIRIGUTTA---T3354">GOVT POLYTECHNIC COLLEGE,YADAGIRIGUTTA---T3354</option>
<option value="GOVT. POLYTECHNIC,GIRMAPUR,MEDCHAL. MEDCHAL---T3386">GOVT. POLYTECHNIC,GIRMAPUR,MEDCHAL. MEDCHAL---T3386</option>
<option value="GOVT POLYTECHNIC,GOMARAM---T4032">GOVT POLYTECHNIC,GOMARAM---T4032</option>
<option value="GOVT.POLYTECHNIC,MAHESHWARAM,R.R.DIST.---T3472">GOVT.POLYTECHNIC,MAHESHWARAM,R.R.DIST.---T3472</option>
<option value="GOVT POLYTECHNIC,MASAB TANK.---T3143">GOVT POLYTECHNIC,MASAB TANK.---T3143</option>
<option value="GOVT POLYTECHNIC,VIKARABAD---T3248">GOVT POLYTECHNIC,VIKARABAD---T3248</option>
<option value="GOVT POLYTECHNIC (W),BADANGPET---T3195">GOVT POLYTECHNIC (W),BADANGPET---T3195</option>
<option value="GOVT POLYTECHNIC,ZOOPARK---T3089">GOVT POLYTECHNIC,ZOOPARK---T3089</option>
<option value="GOVT SGM POLYTECHNIC,ABDULLAPURMET---T3091">GOVT SGM POLYTECHNIC,ABDULLAPURMET---T3091</option>
<option value="GOVT TIBBI MEDICAL COLLEGE,CHARMINAR.---T3088">GOVT TIBBI MEDICAL COLLEGE,CHARMINAR.---T3088</option>
<option value="GOVT VOC. JR.COLLEGE,BAZARGHAT, NAMPALLY---J5550">GOVT VOC. JR.COLLEGE,BAZARGHAT, NAMPALLY---J5550</option>
<option value="GOWTHAMI DEGREE COLLEGE,SHAMSHABAD---D5790">GOWTHAMI DEGREE COLLEGE,SHAMSHABAD---D5790</option>
<option value="GOWTHAMI JR COLLEGE, IDPL COLONY, CHINTAL---J5332">GOWTHAMI JR COLLEGE, IDPL COLONY, CHINTAL---J5332</option>
<option value="GOWTHAMI JUNIOUR COLLEGE SHAMSHABAD---J5329">GOWTHAMI JUNIOUR COLLEGE SHAMSHABAD---J5329</option>
<option value="GOWTHAM JR COLLEGE,ECIL X RD.---J6038">GOWTHAM JR COLLEGE,ECIL X RD.---J6038</option>
<option value="GOWTHAM JR.COLLEGE,SHALIBANDA---J5372">GOWTHAM JR.COLLEGE,SHALIBANDA---J5372</option>
<option value="GOWTHAM JR.COLLEGE,TRIMULGHERRY.---J5853">GOWTHAM JR.COLLEGE,TRIMULGHERRY.---J5853</option>
<option value="GOWTHAM JUNIOR COLLEGE RAGHAVENDRA COLONY JDM---J5806">GOWTHAM JUNIOR COLLEGE RAGHAVENDRA COLONY JDM---J5806</option>
<option value="G PULLA REDDY COLLEGE OF PHARMACY,MEHDIPATNAM.---T3430">G PULLA REDDY COLLEGE OF PHARMACY,MEHDIPATNAM.---T3430</option>
<option value="G PULLA REDDY COLL OF PHARMACY,MEHDIPATNAM---D0206">G PULLA REDDY COLL OF PHARMACY,MEHDIPATNAM---D0206</option>
<option value="G PULLA REDDY DEG AND PG COLLEGE ,MEHDIPATNAM.---D0517">G PULLA REDDY DEG AND PG COLLEGE ,MEHDIPATNAM.---D0517</option>
<option value="GREAT INDIA DEG COLLEGE,VENKAT SAI COLONY,KOMPALLY.---D6052">GREAT INDIA DEG COLLEGE,VENKAT SAI COLONY,KOMPALLY.---D6052</option>
<option value="G R I E T,BACHUPALLY---T3134">G R I E T,BACHUPALLY---T3134</option>
<option value="GURUKULA JR.COLL, GHATKESAR---J3330">GURUKULA JR.COLL, GHATKESAR---J3330</option>
<option value="GURUNANAK HOMEOPATHIC MEDICAL COLLEGE  HOSPITAL IBP---P3355">GURUNANAK HOMEOPATHIC MEDICAL COLLEGE  HOSPITAL IBP---P3355</option>
<option value="GURU NANAK INSTITUTE OF TECHNOLOGY,KHANAPUR.---T3324">GURU NANAK INSTITUTE OF TECHNOLOGY,KHANAPUR.---T3324</option>
<option value="GURU NANAK INSTITUTIONS TECHNICAL CAMPUS, AGHAPALLY,MANCHAL(M)---D5816">GURU NANAK INSTITUTIONS TECHNICAL CAMPUS, AGHAPALLY,MANCHAL(M)---D5816</option>
<option value="GURUNANAK UIAH---D6250">GURUNANAK UIAH---D6250</option>
<option value="GURUNANAK UIAHS---D6247">GURUNANAK UIAHS---D6247</option>
<option value="GURUNANAK UICM---D6248">GURUNANAK UICM---D6248</option>
<option value="GURUNANAK UICSA---D6246">GURUNANAK UICSA---D6246</option>
<option value="GURUNANAK UIET---T3479">GURUNANAK UIET---T3479</option>
<option value="GYANAM JUNIOR COLLEGE, SHALIBANDA.---J5800">GYANAM JUNIOR COLLEGE, SHALIBANDA.---J5800</option>
<option value="GYAN DEGREE COLLEGE---D6169">GYAN DEGREE COLLEGE---D6169</option>
<option value="GYAN JUNIOR COLLEGE---J4971">GYAN JUNIOR COLLEGE---J4971</option>
<option value="GYAN JYOTHI COL OF PHARMACY,UPPAL DEPOT---D5827">GYAN JYOTHI COL OF PHARMACY,UPPAL DEPOT---D5827</option>

<option value="HAINDAVI COLLEGE OF HOTEL MANAGEMENT, HIMAYATH NAGAR---D6194">HAINDAVI COLLEGE OF HOTEL MANAGEMENT, HIMAYATH NAGAR---D6194</option>
<option value="HAINDAVI DEG  AND PG COLLEGE, BARKATPURA---D0171">HAINDAVI DEG  AND PG COLLEGE, BARKATPURA---D0171</option>
<option value="HAINDAVI DEG  AND PG COLLEGE, BARKATPURA---P0235">HAINDAVI DEG  AND PG COLLEGE, BARKATPURA---P0235</option>
<option value="HAINDAVI DEG AND PG  COLLEGE, DSNR---D5667">HAINDAVI DEG AND PG  COLLEGE, DSNR---D5667</option>
<option value="HAINDAVI DEG COLLEGE, MAHESH NAGAR, ECIL---D5964">HAINDAVI DEG COLLEGE, MAHESH NAGAR, ECIL---D5964</option>
<option value="HAINDAVI DEGREE COLLEGE, AYODHYANAGAR COLONY, MEHDIPATNAM---D6086">HAINDAVI DEGREE COLLEGE, AYODHYANAGAR COLONY, MEHDIPATNAM---D6086</option>
<option value="HAINDAVI DEGREE COLLEGE, RTC OFFICERS COLONY, CHAMPAPET---D6019">HAINDAVI DEGREE COLLEGE, RTC OFFICERS COLONY, CHAMPAPET---D6019</option>
<option value="HAINDAVI DEGREE COLLEGE, SR NAGAR---D6010">HAINDAVI DEGREE COLLEGE, SR NAGAR---D6010</option>
<option value="HAINDAVI JR COLLEGE, BARKATPURA---J5497">HAINDAVI JR COLLEGE, BARKATPURA---J5497</option>
<option value="HAMSA HOMEOPATHY COL.,HOSP. AND REASERCH CENTER,KSHEERASAGAR,MULUGU(M).---D6146">HAMSA HOMEOPATHY COL.,HOSP. AND REASERCH CENTER,KSHEERASAGAR,MULUGU(M).---D6146</option>
<option value="HAMSTECH COLLEGE OF DESIGN,PUNJAGUTTA.---D6166">HAMSTECH COLLEGE OF DESIGN,PUNJAGUTTA.---D6166</option>
<option value="HAYAATH DEGREE COLLEGE---D6242">HAYAATH DEGREE COLLEGE---D6242</option>
<option value="HAYAATH JUNIOR COLLEGE,CHANDRAYANAGUTTA,HBNAGAR---J5898">HAYAATH JUNIOR COLLEGE,CHANDRAYANAGUTTA,HBNAGAR---J5898</option>
<option value="HAYAATH JUNIOR COLLEGE, SHALIBANDA, CHARMINAR---J5838">HAYAATH JUNIOR COLLEGE, SHALIBANDA, CHARMINAR---J5838</option>
<option value="HEH NIZAMS ALLADIN TECH INST,BOGGULAKUNTA,ABIDS---T3114">HEH NIZAMS ALLADIN TECH INST,BOGGULAKUNTA,ABIDS---T3114</option>
<option value="HELEN KELLER INST.OF RESEARCH AND REH FOR D.CHILDREN,BANK COLONY,RK PURAM.---P3187">HELEN KELLER INST.OF RESEARCH AND REH FOR D.CHILDREN,BANK COLONY,RK PURAM.---P3187</option>
<option value="HELEN KELLERS INST. OF RES. AND REH. FOR THE DIS. CHILDREN,RK PURAM---D5768">HELEN KELLERS INST. OF RES. AND REH. FOR THE DIS. CHILDREN,RK PURAM---D5768</option>
<option value="HELEN KELLERS INST.OF RESEARCH AND REHABILITATION FOR THE DISABLE,RK PURAM.---D6124">HELEN KELLERS INST.OF RESEARCH AND REHABILITATION FOR THE DISABLE,RK PURAM.---D6124</option>
<option value="HIDAYAH DEG.COLLEGE,MURAD NAGAR,MP---D6217">HIDAYAH DEG.COLLEGE,MURAD NAGAR,MP---D6217</option>
<option value="HIDAYAH JUNIOR COLLEGE, ASIFNAGAR---J5803">HIDAYAH JUNIOR COLLEGE, ASIFNAGAR---J5803</option>
<option value="HINDI MAHA VIDYALAYA JR.COLL,NALLAKUNTA---J4630">HINDI MAHA VIDYALAYA JR.COLL,NALLAKUNTA---J4630</option>
<option value="HINDI MAHA VIDYALAYA,NALLAKUNTA---D0527">HINDI MAHA VIDYALAYA,NALLAKUNTA---D0527</option>
<option value="HINDU DEG AND PG COLLEGE FOR WOMEN, SANATHNAGAR---P3217">HINDU DEG AND PG COLLEGE FOR WOMEN, SANATHNAGAR---P3217</option>
<option value="HINDU DEG COLLEGE FOR WOMEN, SANATHNAGAR---D0421">HINDU DEG COLLEGE FOR WOMEN, SANATHNAGAR---D0421</option>
<option value="HINDU JR COLLEGE FOR GIRLS, SANATHNAGAR---J6076">HINDU JR COLLEGE FOR GIRLS, SANATHNAGAR---J6076</option>
<option value="HOLY MARRY COLLEGE OF NURSING---D6243">HOLY MARRY COLLEGE OF NURSING---D6243</option>
<option value="HOLY MARY DEGREE COLLEGE, KPHB COLONY---D6035">HOLY MARY DEGREE COLLEGE, KPHB COLONY---D6035</option>
<option value="HOLY MARY INST OF TECH AND MGMT, BOGARAM---P3232">HOLY MARY INST OF TECH AND MGMT, BOGARAM---P3232</option>
<option value="HOLY MARY INST OF TECH AND SCI AND COLLEGE OF PHARMACY,BOGARAM---P3300">HOLY MARY INST OF TECH AND SCI AND COLLEGE OF PHARMACY,BOGARAM---P3300</option>
<option value="HOLY MARY INST OF TECH AND SCIENCE, BOGARAM---T3018">HOLY MARY INST OF TECH AND SCIENCE, BOGARAM---T3018</option>
<option value="HOLY TRINITY C OF EDU BOGARAM---P3095">HOLY TRINITY C OF EDU BOGARAM---P3095</option>
<option value="H R D DEG COLLEGE,NARAYANGUDA---D0525">H R D DEG COLLEGE,NARAYANGUDA---D0525</option>
<option value="HSB DEGREE COLLEGE  BANJARA HILLS---D6171">HSB DEGREE COLLEGE  BANJARA HILLS---D6171</option>
<option value="HYDERABAD INST OF TECH AND MGMT, GOWDAVELLY(V), MEDCHAL(M)---T4010">HYDERABAD INST OF TECH AND MGMT, GOWDAVELLY(V), MEDCHAL(M)---T4010</option>
<option value="HYDERABAD ITI/ITC,HASTHINAPURAM---T3206">HYDERABAD ITI/ITC,HASTHINAPURAM---T3206</option>
<option value="HYDERABAD-ITI,RAJANNAGUDA---T3053">HYDERABAD-ITI,RAJANNAGUDA---T3053</option>
<option value="HYDERABAD  PRESIDENCY DEG COLL  PG CENTRE,PUPPALGUDA,RJNR---P0822">HYDERABAD  PRESIDENCY DEG COLL  PG CENTRE,PUPPALGUDA,RJNR---P0822</option>
<option value="HYDERABAD SCHOOL OF BUSINESS DEGREE COLLEGE  HABSHIGUDA---D0406">HYDERABAD SCHOOL OF BUSINESS DEGREE COLLEGE  HABSHIGUDA---D0406</option>

<option value="IACG MULTIMEDIA COLLEGE,DILSUKHNAGAR---D6165">IACG MULTIMEDIA COLLEGE,DILSUKHNAGAR---D6165</option>
<option value="I A S E , OU---T3135">I A S E , OU---T3135</option>
<option value="ICAT DESIGN AND MEDIA COLLEGE,KOTHAPET X ROAD.---D6168">ICAT DESIGN AND MEDIA COLLEGE,KOTHAPET X ROAD.---D6168</option>
<option value="I CLASS CDR JR COLLEGE, ST JOHNS ROAD, SECBAD---J5465">I CLASS CDR JR COLLEGE, ST JOHNS ROAD, SECBAD---J5465</option>
<option value="I CREATE DEGREE COLLEGE, KUKATPALLY---D6179">I CREATE DEGREE COLLEGE, KUKATPALLY---D6179</option>
<option value="IDEAL DEG COLL FOR WOMEN,DILSUKHNAGAR---D5704">IDEAL DEG COLL FOR WOMEN,DILSUKHNAGAR---D5704</option>
<option value="IDEAL JR.COLLEGE, DILSUKHNAGAR,HYD.---J3354">IDEAL JR.COLLEGE, DILSUKHNAGAR,HYD.---J3354</option>
<option value="IGNITE JR.COLLEGE,DHULAPALLY.---J5822">IGNITE JR.COLLEGE,DHULAPALLY.---J5822</option>
<option value="IGNITE JUNIOR COLLEGE---J5845">IGNITE JUNIOR COLLEGE---J5845</option>
<option value="IMPULSE JUNIOR COLLEGE  HYDERNAGAR---J5809">IMPULSE JUNIOR COLLEGE  HYDERNAGAR---J5809</option>
<option value="INDIAN INSTIT OF MANG COMM,LAKDIKAPOOL,KHAIRTHABAD.---P0118">INDIAN INSTIT OF MANG COMM,LAKDIKAPOOL,KHAIRTHABAD.---P0118</option>
<option value="INDIAN INSTITUTE OF PACKAGING.SANATHNAGAR.---T3377">INDIAN INSTITUTE OF PACKAGING.SANATHNAGAR.---T3377</option>
<option value="INDIAN INSTT OF HOTEL MGMT AND CULINARY ARTS,HABSIGUDA---D5664">INDIAN INSTT OF HOTEL MGMT AND CULINARY ARTS,HABSIGUDA---D5664</option>
<option value="INDIAN INSTT OF MGMT COMM,LAKDIKAPOOL,HYD.---D0367">INDIAN INSTT OF MGMT COMM,LAKDIKAPOOL,HYD.---D0367</option>
<option value="INDIRA GANDHI PRIYA GOV DEG COLL(W),NAMPALLY---D5622">INDIRA GANDHI PRIYA GOV DEG COLL(W),NAMPALLY---D5622</option>
<option value="INDIRA PRIYADARSHNI GOVT DEG  PG COLLEGE FOR WOMEN, NAMPALLY.---D0535">INDIRA PRIYADARSHNI GOVT DEG  PG COLLEGE FOR WOMEN, NAMPALLY.---D0535</option>
<option value="INDRANI JUNIOR COLLEGE, PEERZADIGUDA---J5815">INDRANI JUNIOR COLLEGE, PEERZADIGUDA---J5815</option>
<option value="INDUS COLLEGE OF COMMERCE, LANCER LANE, SECUNDERABAD---D0560">INDUS COLLEGE OF COMMERCE, LANCER LANE, SECUNDERABAD---D0560</option>
<option value="INFANT JESUS DEGREE COLLEGE,VELANKANNI NAGAR, SHAMSHABAD---D6038">INFANT JESUS DEGREE COLLEGE,VELANKANNI NAGAR, SHAMSHABAD---D6038</option>
<option value="INFANT JESUS JUNIOR COLLEGE, VELANKANNI NAGAR, SHAMSHABAD---J5511">INFANT JESUS JUNIOR COLLEGE, VELANKANNI NAGAR, SHAMSHABAD---J5511</option>
<option value="INSTITUTE OF AGRICULTURE ENG. AND TECH. RAJENDRANAGAR---P3333">INSTITUTE OF AGRICULTURE ENG. AND TECH. RAJENDRANAGAR---P3333</option>
<option value="INSTITUTE OF GENETICS   HOSPITAL FOR GENETICS DISEASES OU BEGUMPET---SP047">INSTITUTE OF GENETICS   HOSPITAL FOR GENETICS DISEASES OU BEGUMPET---SP047</option>
<option value="INSTITUTE OF GENETICS   HOSPITAL FOR GENETICS DISEASES OU BEGUMPET---SP047">INSTITUTE OF GENETICS   HOSPITAL FOR GENETICS DISEASES OU BEGUMPET---SP047</option>
<option value="INSTITUTE OF SCIENCE(JNTU),KP,HYD---P3338">INSTITUTE OF SCIENCE(JNTU),KP,HYD---P3338</option>
<option value="INST. OF AERONAUTIC ENGG COLL,DUNDIGAL---T3024">INST. OF AERONAUTIC ENGG COLL,DUNDIGAL---T3024</option>
<option value="INST.OF HOTEL  MANAGEMENT CATERING TECH,DD COLONY,VIDYANAGAR.---T3127">INST.OF HOTEL  MANAGEMENT CATERING TECH,DD COLONY,VIDYANAGAR.---T3127</option>
<option value="INST.OF  PREVENTIVE MEDICINE PUBLIC HEALTH LABS AND FOOD (H) ADMN.NARAYANAGUDA.---D5710">INST.OF  PREVENTIVE MEDICINE PUBLIC HEALTH LABS AND FOOD (H) ADMN.NARAYANAGUDA.---D5710</option>
<option value="INST OF PREVENTIVE MED,YMCA---SP053">INST OF PREVENTIVE MED,YMCA---SP053</option>
<option value="INST.OF TECH.  MANAGEMENT DEG.COL.GHATKESAR.---D5908">INST.OF TECH.  MANAGEMENT DEG.COL.GHATKESAR.---D5908</option>
<option value="INTERNATIONAL DEGREE COLLEGE, SHAIKPET---D5949">INTERNATIONAL DEGREE COLLEGE, SHAIKPET---D5949</option>
<option value="INTERNATIONAL JR COLLEGE, SHAIKPET---J6035">INTERNATIONAL JR COLLEGE, SHAIKPET---J6035</option>
<option value="IQBALIA JUNIOR COLLEGE,TOLICOWKI---J5600">IQBALIA JUNIOR COLLEGE,TOLICOWKI---J5600</option>
<option value="IRA DEGREE COLLEGE, THUMULAKUNTA, SAROORNAGAR---D6213">IRA DEGREE COLLEGE, THUMULAKUNTA, SAROORNAGAR---D6213</option>
<option value="ISLAMIA COLLEGE OF EDN,CHANDRAYANGUTTA,HYD.---P3092">ISLAMIA COLLEGE OF EDN,CHANDRAYANGUTTA,HYD.---P3092</option>
<option value="ISLAMIA COLLEGE OF LAW,SY.NO.103/15 BANDLAGUDA KHALSA HYD---D6228">ISLAMIA COLLEGE OF LAW,SY.NO.103/15 BANDLAGUDA KHALSA HYD---D6228</option>
<option value="ISL ENGINEERING COLLEGE.CHANDRAYAGUTTA X RD,BANDLAGUDA---T3272">ISL ENGINEERING COLLEGE.CHANDRAYAGUTTA X RD,BANDLAGUDA---T3272</option>
<option value="ISO DEGREE COLLEGE, TARNAKA---D5922">ISO DEGREE COLLEGE, TARNAKA---D5922</option>
<option value="ISO JR.COLLEGE TARNAKA---J5113">ISO JR.COLLEGE TARNAKA---J5113</option>


<option value="JAFERIA TECH INIST DARUSHIFA---T3155">JAFERIA TECH INIST DARUSHIFA---T3155</option>
<option value="JAGRUTHI DEG COLLEGE,SANJAY NAGAR,MALKAJGIRI---D5728">JAGRUTHI DEG COLLEGE,SANJAY NAGAR,MALKAJGIRI---D5728</option>
<option value="JAGRUTHI DEG PG COLLEGE,NARAYANAGUDA.---D0537">JAGRUTHI DEG PG COLLEGE,NARAYANAGUDA.---D0537</option>
<option value="JAGRUTHI JR COLLEGE, SANJAY NAGAR, MALKAJGIRI---J5489">JAGRUTHI JR COLLEGE, SANJAY NAGAR, MALKAJGIRI---J5489</option>
<option value="JAGRUTHI PG COLLEGE OF MANAGEMENT STUDIES, MANGALPALLY---P0832">JAGRUTHI PG COLLEGE OF MANAGEMENT STUDIES, MANGALPALLY---P0832</option>
<option value="JAGRUTHI VOCATIONAL JUNIOR COLLEGE,  MEDCHAL---J5728">JAGRUTHI VOCATIONAL JUNIOR COLLEGE,  MEDCHAL---J5728</option>
<option value="JAHANAVI INSTITUTE OF HOTEL MANAGEMENT, KAWADIGUDA, SEC -BAD.---T3451">JAHANAVI INSTITUTE OF HOTEL MANAGEMENT, KAWADIGUDA, SEC -BAD.---T3451</option>
<option value="JAHNAVI DEGREE AND PG COLLEGE, NARAYANAGUDA---P3264">JAHNAVI DEGREE AND PG COLLEGE, NARAYANAGUDA---P3264</option>
<option value="JAHNAVI DEGREE COLLEGE, MG ROAD,SECBAD---D5745">JAHNAVI DEGREE COLLEGE, MG ROAD,SECBAD---D5745</option>
<option value="JAHNAVI  DEGREE COLLEGE, NARAYANAGUDA---D5689">JAHNAVI  DEGREE COLLEGE, NARAYANAGUDA---D5689</option>
<option value="JAHNAVI DEGREE COLLEGE,PEERZADIGUDA---D6133">JAHNAVI DEGREE COLLEGE,PEERZADIGUDA---D6133</option>
<option value="JAHNAVI JUNIOR COLLEGE,BAGH LINGAMPALLY.---J5568">JAHNAVI JUNIOR COLLEGE,BAGH LINGAMPALLY.---J5568</option>
<option value="JAHNAVI JUNIOR COLLEGE, MG ROAD, SECBAD---J5569">JAHNAVI JUNIOR COLLEGE, MG ROAD, SECBAD---J5569</option>
<option value="JAHNAVI PG COLLEGE, NARAYANAGUDA---P3194">JAHNAVI PG COLLEGE, NARAYANAGUDA---P3194</option>
<option value="JAHNAVI WOMENS DEGREE COLLEGE,NARAYANGUDA---D5746">JAHNAVI WOMENS DEGREE COLLEGE,NARAYANGUDA---D5746</option>
<option value="J B INST. OF ENG. TECH YENKAPALLY---T3118">J B INST. OF ENG. TECH YENKAPALLY---T3118</option>
<option value="JBR ARCHITECTURE COLLEGE,BHASKARNAGAR,YENKAPALLY.---T3380">JBR ARCHITECTURE COLLEGE,BHASKARNAGAR,YENKAPALLY.---T3380</option>
<option value="JEC COLLEGE OF EDUCATION, ALMASGUDA---D6072">JEC COLLEGE OF EDUCATION, ALMASGUDA---D6072</option>
<option value="J.ESHWARI BAI MEMORIAL SCHOOL OF NURSING,WEST MARREDPALLY---T3435">J.ESHWARI BAI MEMORIAL SCHOOL OF NURSING,WEST MARREDPALLY---T3435</option>
<option value="JIMS HOMOEOPATHIC MEDICAL COLLGE,MUCHINTAL,SHAMSHABAD.---D6097">JIMS HOMOEOPATHIC MEDICAL COLLGE,MUCHINTAL,SHAMSHABAD.---D6097</option>
<option value="JJ COLLEGE OF PHARMACY, MAHESWARAM---D5898">JJ COLLEGE OF PHARMACY, MAHESWARAM---D5898</option>
<option value="JNAF COLLEGE OF FINE ARTS,MASABTANK---T3131">JNAF COLLEGE OF FINE ARTS,MASABTANK---T3131</option>
<option value="JN GOVT POLYTECHNIC, RAMANTHA PUR---T3119">JN GOVT POLYTECHNIC, RAMANTHA PUR---T3119</option>
<option value="JNTUH COLLEGE OF ENG,SULTANPUR.---T3385">JNTUH COLLEGE OF ENG,SULTANPUR.---T3385</option>
<option value="JNTU,KUKATPALLY---T3115">JNTU,KUKATPALLY---T3115</option>
<option value="JNTU SCH OF PLANNING AND ARCH,MT---T3103">JNTU SCH OF PLANNING AND ARCH,MT---T3103</option>
<option value="JOGINPALLY B.R ENGINEERING COLLEGE,YENKAPALLY.---T3174">JOGINPALLY B.R ENGINEERING COLLEGE,YENKAPALLY.---T3174</option>
<option value="JOGINPALLY B.R.PHARMACY COLLEGE,YENKAPALLY, MOINABAD,RR DIST---P3266">JOGINPALLY B.R.PHARMACY COLLEGE,YENKAPALLY, MOINABAD,RR DIST---P3266</option>
<option value="JOHN PETER MEM JR.COLL DEAF---J6047">JOHN PETER MEM JR.COLL DEAF---J6047</option>
<option value="JSPS  HOMEO MEDICAL COLLEGE,RAMANTAPUR---T3085">JSPS  HOMEO MEDICAL COLLEGE,RAMANTAPUR---T3085</option>
<option value="JUNAIDS JUNIOR COLLEGE, HUMAYUN NAGAR---J5884">JUNAIDS JUNIOR COLLEGE, HUMAYUN NAGAR---J5884</option>
<option value="JYOTHI VOC. JUNIOR COLLEGE SLNS COLONY---J5382">JYOTHI VOC. JUNIOR COLLEGE SLNS COLONY---J5382</option>

<option value="KAIZEN JUNIOR COLLEGE AS RAO NAGAR KAPRA---J5761">KAIZEN JUNIOR COLLEGE AS RAO NAGAR KAPRA---J5761</option>
<option value="KAKATIYA ITC GANDIMYSAMMA X ROAD.---T3396">KAKATIYA ITC GANDIMYSAMMA X ROAD.---T3396</option>
<option value="KAMINENI ACADEMY OF MEDICAL SCIENCES AND REASEARCH CNETRE,LB NAGAR.---P3289">KAMINENI ACADEMY OF MEDICAL SCIENCES AND REASEARCH CNETRE,LB NAGAR.---P3289</option>
<option value="KAMINENI INSTITUTE OF PARAMEDICAL SCIENCES LB NAGAR R.R. DIST---SP 205">KAMINENI INSTITUTE OF PARAMEDICAL SCIENCES LB NAGAR R.R. DIST---SP 205</option>
<option value="KAMINENI INST OF PARA MED SCIENCES LB NAGAR---D5773">KAMINENI INST OF PARA MED SCIENCES LB NAGAR---D5773</option>
<option value="K.ANJI REDDY VOC.JR.COL,SERLINGAMPALLY.---J5219">K.ANJI REDDY VOC.JR.COL,SERLINGAMPALLY.---J5219</option>
<option value="KARTHIKEYA DEGREE COLLEGE IBPM---D5724">KARTHIKEYA DEGREE COLLEGE IBPM---D5724</option>
<option value="KARTHIKEYA JUNIOR COLLEGE,IBRAHIMPATNAM.---J5567">KARTHIKEYA JUNIOR COLLEGE,IBRAHIMPATNAM.---J5567</option>
<option value="KASIREDDY NARAYANA REDDY COLLEGE OF ENGG AND RESEARCH,ABDULLAPUR METT.---T3257">KASIREDDY NARAYANA REDDY COLLEGE OF ENGG AND RESEARCH,ABDULLAPUR METT.---T3257</option>
<option value="KASTURBA GANDHI DEG  PG COLLEGE(W),WESTMAREDPALLY---D0540">KASTURBA GANDHI DEG  PG COLLEGE(W),WESTMAREDPALLY---D0540</option>
<option value="KASTURBA GANDHI JR.COLLEGE,(W),MAREDPALLY---J5060">KASTURBA GANDHI JR.COLLEGE,(W),MAREDPALLY---J5060</option>
<option value="KEN DEGREE COLLEGE,TRIMULGHERRY---D0541">KEN DEGREE COLLEGE,TRIMULGHERRY---D0541</option>
<option value="KESHAV MEMORIAL COLLEGE OF ENGINEERING KOHEDA ROAD CHINTAPALLYGUDA---T3256">KESHAV MEMORIAL COLLEGE OF ENGINEERING KOHEDA ROAD CHINTAPALLYGUDA---T3256</option>
<option value="KESHAV MEMORIAL COLLEGE OF LAW,NARAYANAGUDA.---D6122">KESHAV MEMORIAL COLLEGE OF LAW,NARAYANAGUDA.---D6122</option>
<option value="KESHAV MEMORIAL ENGINEERING COLLEGE---T3460">KESHAV MEMORIAL ENGINEERING COLLEGE---T3460</option>
<option value="KESHAV MEMORIAL INSTITUTE OF COMMERCE  SCIENCES, NARAYANGUDA---D0370">KESHAV MEMORIAL INSTITUTE OF COMMERCE  SCIENCES, NARAYANGUDA---D0370</option>
<option value="KESHAV MEMORIAL INSTITUTE OF COMMERCE  SCIENCES, NARAYANGUDA, HYD.---P0035">KESHAV MEMORIAL INSTITUTE OF COMMERCE  SCIENCES, NARAYANGUDA, HYD.---P0035</option>
<option value="KESHAV MEMORIAL INSTITUTE OF MANAGEMENT---D6189">KESHAV MEMORIAL INSTITUTE OF MANAGEMENT---D6189</option>
<option value="KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY,NARYANAGUDA---T3240">KESHAV MEMORIAL INSTITUTE OF TECHNOLOGY,NARYANAGUDA---T3240</option>
<option value="KESHAV MEMORIAL JR.COLL,NARAYANAGUDA---J4932">KESHAV MEMORIAL JR.COLL,NARAYANAGUDA---J4932</option>
<option value="KESHAV SMARAK JUNIOR COLLEGE, BARKATHPURA, HIMAYATHNAGAR---J5793">KESHAV SMARAK JUNIOR COLLEGE, BARKATHPURA, HIMAYATHNAGAR---J5793</option>
<option value="K G REDDY COLLEGE ENG  TECH, CHILUKUR---T3330">K G REDDY COLLEGE ENG  TECH, CHILUKUR---T3330</option>
<option value="KGR INSTITUTE OF TECH AND MGMT, RAMPALLY, KEESAR(M)---P3175">KGR INSTITUTE OF TECH AND MGMT, RAMPALLY, KEESAR(M)---P3175</option>
<option value="KIMS B.SC PARAMEDICAL COLLEGE,BEGUMPET,SECBAD---D6244">KIMS B.SC PARAMEDICAL COLLEGE,BEGUMPET,SECBAD---D6244</option>
<option value="KIMS PARAMEDICAL INSTITUTION SECBAD---SP 204">KIMS PARAMEDICAL INSTITUTION SECBAD---SP 204</option>
<option value="KIMS SCHOOL OF NURSING,MINISTERS ROAD,SECBAD---T3428">KIMS SCHOOL OF NURSING,MINISTERS ROAD,SECBAD---T3428</option>
<option value="KINGSTON PG COLLEGE, SATYANARAYA NAGAR COLONY, NAGARAM.---P0719">KINGSTON PG COLLEGE, SATYANARAYA NAGAR COLONY, NAGARAM.---P0719</option>
<option value="KITES JUNIOR COLLEGE (BIE 15162)---J5623">KITES JUNIOR COLLEGE (BIE 15162)---J5623</option>
<option value="KMR JR.COLLEGE,VENGAL RAO NAGAR,HYD.---J5771">KMR JR.COLLEGE,VENGAL RAO NAGAR,HYD.---J5771</option>
<option value="KOMPASS JUNIOR COLLE, HIMAYATH NAGAR---J5816">KOMPASS JUNIOR COLLE, HIMAYATH NAGAR---J5816</option>
<option value="KONERU LAKSHMAIAH EDUCATION FOUNDATION,DEPT OF ARTS, COMM SCI,AZIZNAGAR---D6239">KONERU LAKSHMAIAH EDUCATION FOUNDATION,DEPT OF ARTS, COMM SCI,AZIZNAGAR---D6239</option>
<option value="KONERU LAKSHMAIAH EDUCATION FOUNDATION,DEPT OF ENGG, AZIZNAGAR, MOINABAD---T3454">KONERU LAKSHMAIAH EDUCATION FOUNDATION,DEPT OF ENGG, AZIZNAGAR, MOINABAD---T3454</option>
<option value="KONERU LAKSHMAIAH EDUCATION FOUNDATION, DEPT OF ENGG, BOWRAMPET---T3471">KONERU LAKSHMAIAH EDUCATION FOUNDATION, DEPT OF ENGG, BOWRAMPET---T3471</option>
<option value="KONERU LAKSHMAIAH EDUCTION FOUNDATION,DEPT OF MGMT, BOWRAMPET---P3354">KONERU LAKSHMAIAH EDUCTION FOUNDATION,DEPT OF MGMT, BOWRAMPET---P3354</option>
<option value="K P R INST.OF TECH,EDULABAD---T3278">K P R INST.OF TECH,EDULABAD---T3278</option>
<option value="KPRIT COLLEGE OF ENGINEERING GHANPUR GHATKESAR---P3243">KPRIT COLLEGE OF ENGINEERING GHANPUR GHATKESAR---P3243</option>
<option value="KRANTHI DEGREE COLLEGE,OPP. RAMANTHAPUR  LAKE.,---D5907">KRANTHI DEGREE COLLEGE,OPP. RAMANTHAPUR  LAKE.,---D5907</option>
<option value="KRISHNA INST.OF MEDICAL SCIENCESLTD.SECBAD---D6135">KRISHNA INST.OF MEDICAL SCIENCESLTD.SECBAD---D6135</option>
<option value="KRISHNAVENI JUNIOR COLLEGE, SAGAR COMPLEX SREEPURAM COLONY B.N.REDDY NAGAR---J5406">KRISHNAVENI JUNIOR COLLEGE, SAGAR COMPLEX SREEPURAM COLONY B.N.REDDY NAGAR---J5406</option>
<option value="KRK REDDY COLLEGE OF EDUCATION---D6140">KRK REDDY COLLEGE OF EDUCATION---D6140</option>
<option value="KRK REDDY D ED COLLEGE, ANKIREDDYAPLLY(V), KEESARA(M)---D5977">KRK REDDY D ED COLLEGE, ANKIREDDYAPLLY(V), KEESARA(M)---D5977</option>
<option value="KSHETRA JUNIOR COLLEGE LANGER HOUSE, GOLCONDA HYD---J5477">KSHETRA JUNIOR COLLEGE LANGER HOUSE, GOLCONDA HYD---J5477</option>
<option value="KSHETRA JUNIOR COLLEGE,SAHEBNAGAR VSPM,HYD---J5907">KSHETRA JUNIOR COLLEGE,SAHEBNAGAR VSPM,HYD---J5907</option>
<option value="KSR DEGREE COLLEGE, CHANDRAGIRI COLONY, NEAR KEESARA POLICE STATION---D5963">KSR DEGREE COLLEGE, CHANDRAGIRI COLONY, NEAR KEESARA POLICE STATION---D5963</option>
<option value="KUMUDDINI DEVI SCHOOL OF NURSING KUKATPALLY---D6241">KUMUDDINI DEVI SCHOOL OF NURSING KUKATPALLY---D6241</option>
<option value="KUMUDDINI DEVI COLLEGE OF NURSING KUKATPALLY---D6240">KUMUDDINI DEVI COLLEGE OF NURSING KUKATPALLY---D6240</option>
<option value="K VENKANNA JR COLLEGE-CHINTAL---J5187">K VENKANNA JR COLLEGE-CHINTAL---J5187</option>
<option value="K. VENKANNA JUNIOR COLLEGE NAGARJUNA NAGAR COLONY TARNAKA---J5896">K. VENKANNA JUNIOR COLLEGE NAGARJUNA NAGAR COLONY TARNAKA---J5896</option>
<option value="KVK COLLEGE OF PHARMACY,SURMAIGUDA,ABDULLAPURMET---D5832">KVK COLLEGE OF PHARMACY,SURMAIGUDA,ABDULLAPURMET---D5832</option>
<option value="KVK COLLEGE OF PHARMACY,SURMAIGUDA---D5852">KVK COLLEGE OF PHARMACY,SURMAIGUDA---D5852</option>
<option value="K.V.RANGA REDDY LAW COLLEGE.DOMALGUDA,---D0022">K.V.RANGA REDDY LAW COLLEGE.DOMALGUDA,---D0022</option>
<option value="LAKSHMI VENKATESHWARA PARA MEDICAL INST., MALLIKARJUNA NAGAR---SP200">LAKSHMI VENKATESHWARA PARA MEDICAL INST., MALLIKARJUNA NAGAR---SP200</option>
<option value="LAKSHYA COLLEGE OF COMMERCE AND MANAGEMENT---D6216">LAKSHYA COLLEGE OF COMMERCE AND MANAGEMENT---D6216</option>
<option value="LAKSHYA JR.COLLEGE,SR NAGAR.---J5836">LAKSHYA JR.COLLEGE,SR NAGAR.---J5836</option>
<option value="LAL BAHADUR DEG COLLEGE, MEHDIPATNAM---D0546">LAL BAHADUR DEG COLLEGE, MEHDIPATNAM---D0546</option>
<option value="LAL BAHADUR JR COLLEGE, MEHDIPATNAM---J4625">LAL BAHADUR JR COLLEGE, MEHDIPATNAM---J4625</option>
<option value="LEO ACADEMY OF HOSPITALITY AND TOURISM MGMT, BOMMARASPET, SHAMIRPET(M)---D5897">LEO ACADEMY OF HOSPITALITY AND TOURISM MGMT, BOMMARASPET, SHAMIRPET(M)---D5897</option>
<option value="LITTLE FLOWER DEG COLLEGE,UPPAL X ROADS---D5862">LITTLE FLOWER DEG COLLEGE,UPPAL X ROADS---D5862</option>
<option value="LITTLE FLOWER DEGREE COLLEGE,VERTEX PEARL BUILDING, KAPRA---D0547">LITTLE FLOWER DEGREE COLLEGE,VERTEX PEARL BUILDING, KAPRA---D0547</option>
<option value="LITTLE FLOWER JR COLLEGE, VERTEX PERAL,SRINIVASA NAGAR COLONY,KAPRA---J5120">LITTLE FLOWER JR COLLEGE, VERTEX PERAL,SRINIVASA NAGAR COLONY,KAPRA---J5120</option>
<option value="LITTLE FLOWER JR.COLL UPPAL---J3373">LITTLE FLOWER JR.COLL UPPAL---J3373</option>
<option value="LMA DEGREE COLLEGE,PANJAGUTTA---D6075">LMA DEGREE COLLEGE,PANJAGUTTA---D6075</option>
<option value="LORDS INST OF ENG TECH,HIMAYATSAGAR---T3189">LORDS INST OF ENG TECH,HIMAYATSAGAR---T3189</option>
<option value="LOYOLA ACADEMY DEG  P.G. COLL,OLD ALWAL.---D0548">LOYOLA ACADEMY DEG  P.G. COLL,OLD ALWAL.---D0548</option>
<option value="LOYOLA ACADEMY JR COLLEGE,  OLD ALWAL---J3351">LOYOLA ACADEMY JR COLLEGE,  OLD ALWAL---J3351</option>

<option value="MAA INSTITUTE OF SPEECH  HEARING MAA RESEARCH FOUNDATION, JUBILEE HILLS,HY---D6172">MAA INSTITUTE OF SPEECH  HEARING MAA RESEARCH FOUNDATION, JUBILEE HILLS,HY---D6172</option>
<option value="MADINA VOC JR COL,CRMR---J5225">MADINA VOC JR COL,CRMR---J5225</option>
<option value="MAHARSHI DEGREE COLLEGE,  GANDI MAISAMMA X RDS---D6068">MAHARSHI DEGREE COLLEGE,  GANDI MAISAMMA X RDS---D6068</option>
<option value="MAHARSHI JUNIOR COLLEGE HASTHINAPURAM---J5862">MAHARSHI JUNIOR COLLEGE HASTHINAPURAM---J5862</option>
<option value="MAHATMA GANDHI COLL OF LAW,NTR NAGAR,LB NAGAR.---D0017">MAHATMA GANDHI COLL OF LAW,NTR NAGAR,LB NAGAR.---D0017</option>
<option value="MAHAVEER DEG.COL.FOR ARTS,COM AND SCI.,MAILARDEVPALLY---D6079">MAHAVEER DEG.COL.FOR ARTS,COM AND SCI.,MAILARDEVPALLY---D6079</option>
<option value="MAHAVEER INSTT OF TECH  SCIE,BANDLAGUDA KESHAVAGIRI---T3022">MAHAVEER INSTT OF TECH  SCIE,BANDLAGUDA KESHAVAGIRI---T3022</option>
<option value="MAHBUB DEG COLLEGE, SP ROAD, SECBAD---D0551">MAHBUB DEG COLLEGE, SP ROAD, SECBAD---D0551</option>
<option value="MAHBUB JR.COLLEGE,SD ROAD,SECBAD.B---J5111">MAHBUB JR.COLLEGE,SD ROAD,SECBAD.B---J5111</option>
<option value="MAHBUB JR.COLLEGE,SD ROAD,SECBAD.B---J5111">MAHBUB JR.COLLEGE,SD ROAD,SECBAD.B---J5111</option>
<option value="MALLA REDDY COLLEGE OF ENG AND TECH, MAISAMMAGUDA---T3204">MALLA REDDY COLLEGE OF ENG AND TECH, MAISAMMAGUDA---T3204</option>
<option value="MALLA REDDY COLLEGE OF ENGINEERING,MYSAMMAGUDA.---T3217">MALLA REDDY COLLEGE OF ENGINEERING,MYSAMMAGUDA.---T3217</option>
<option value="MALLA REDDY COLLEGE OF NURSING,SURARAM X ROAD---D6036">MALLA REDDY COLLEGE OF NURSING,SURARAM X ROAD---D6036</option>
<option value="MALLA REDDY COLLEGE OF PHARMACY, MAISAMMAGUDA, DHULAPALLY---P3122">MALLA REDDY COLLEGE OF PHARMACY, MAISAMMAGUDA, DHULAPALLY---P3122</option>
<option value="MALLA REDDY COLL OF ENG FOR WOMEN, MAISAMMAGUDA, DHULAPALLY.---T3263">MALLA REDDY COLL OF ENG FOR WOMEN, MAISAMMAGUDA, DHULAPALLY.---T3263</option>
<option value="MALLA REDDY COLL OF TEACHER EDN,KOMPALLY.---P3094">MALLA REDDY COLL OF TEACHER EDN,KOMPALLY.---P3094</option>
<option value="MALLA REDDY DENTAL COLLEGE FOR WOMEN,SURARAM X RDS---P3302">MALLA REDDY DENTAL COLLEGE FOR WOMEN,SURARAM X RDS---P3302</option>
<option value="MALLA REDDY ENG.COL AND MANG. SCIENCE,KISTAPUR.---T3253">MALLA REDDY ENG.COL AND MANG. SCIENCE,KISTAPUR.---T3253</option>
<option value="MALLA REDDY ENG. COLLEGE ,MAISAMMAGUDA MDCL---T3168">MALLA REDDY ENG. COLLEGE ,MAISAMMAGUDA MDCL---T3168</option>
<option value="MALLA REDDY ENGINEERING COLLEGE FOR WOMEN,MAISAMMAGUDA---T3259">MALLA REDDY ENGINEERING COLLEGE FOR WOMEN,MAISAMMAGUDA---T3259</option>
<option value="MALLA REDDY INSTITUTE OF ENGINEERING  TECHNOLOGY, MAISAMMAGUDA---P3321">MALLA REDDY INSTITUTE OF ENGINEERING  TECHNOLOGY, MAISAMMAGUDA---P3321</option>
<option value="MALLA REDDY INSTITUTE OF MEDICAL SCIENCES---P3272">MALLA REDDY INSTITUTE OF MEDICAL SCIENCES---P3272</option>
<option value="MALLA REDDY INSTITUTE OF PHARAMTICAL  SCIENCES,MYSAMMAGUDA.---P3135">MALLA REDDY INSTITUTE OF PHARAMTICAL  SCIENCES,MYSAMMAGUDA.---P3135</option>
<option value="MALLA REDDY INSTITUTE OF TECHNOLOGY AND SCIENCE,MYSAMMAGUDA---T3214">MALLA REDDY INSTITUTE OF TECHNOLOGY AND SCIENCE,MYSAMMAGUDA---T3214</option>
<option value="MALLA REDDY INSTITUTE OF TECHNOLOGY, MAISAMMAGUDA---T3329">MALLA REDDY INSTITUTE OF TECHNOLOGY, MAISAMMAGUDA---T3329</option>
<option value="MALLA REDDY INST.OF DENTAL SCIENCE,SURARAM MAIN RD.---P3290">MALLA REDDY INST.OF DENTAL SCIENCE,SURARAM MAIN RD.---P3290</option>
<option value="MALLA REDDY INST OF MGMT,MAISAMMAGUDA.---P3114">MALLA REDDY INST OF MGMT,MAISAMMAGUDA.---P3114</option>
<option value="MALLA REDDY MEDICAL COLLEGE FOR WOMEN---P3298">MALLA REDDY MEDICAL COLLEGE FOR WOMEN---P3298</option>
<option value="MALLA REDDY P.G. COLLEGE,MYSAMMAGUDA---P3168">MALLA REDDY P.G. COLLEGE,MYSAMMAGUDA---P3168</option>
<option value="MALLA REDDY PHARMACY COLLEGE, MAISAMMAGUDA, DHULAPALLY, SECBAD---D5813">MALLA REDDY PHARMACY COLLEGE, MAISAMMAGUDA, DHULAPALLY, SECBAD---D5813</option>
<option value="MALLA REDDY UNIVERSITY SCHOOL OF AGRICULTURE---D6200">MALLA REDDY UNIVERSITY SCHOOL OF AGRICULTURE---D6200</option>
<option value="MALLA REDDY UNIVERSITY SCHOOL OF ENGINEERING---T3462">MALLA REDDY UNIVERSITY SCHOOL OF ENGINEERING---T3462</option>
<option value="MALLA REDDY UNIVERSITY SCHOOL OF MANAGEMENT AND COMMERCE---D6201">MALLA REDDY UNIVERSITY SCHOOL OF MANAGEMENT AND COMMERCE---D6201</option>
<option value="MALLAREDDY UNIVERSITY SCHOOL OF PUBLIC POLICY---D6199">MALLAREDDY UNIVERSITY SCHOOL OF PUBLIC POLICY---D6199</option>
<option value="MALLA REDDY UNIVERSITY SCHOOL OF SCIENCES AND ALLIED HEALTH SCIENCES---D6198">MALLA REDDY UNIVERSITY SCHOOL OF SCIENCES AND ALLIED HEALTH SCIENCES---D6198</option>
<option value="MAMATHA TECHNICAL INST, MAMATHA HOSPITAL, HASTHINAPURAM CENTRAL---SP203">MAMATHA TECHNICAL INST, MAMATHA HOSPITAL, HASTHINAPURAM CENTRAL---SP203</option>
<option value="MAM GOVT MODEL JR COLLEGE FOR GIRLS NAMPALLY.---J4860">MAM GOVT MODEL JR COLLEGE FOR GIRLS NAMPALLY.---J4860</option>
<option value="MAM GOVT MODEL JR COLLEGE FOR GIRLS, NAMPALLY.---J5641">MAM GOVT MODEL JR COLLEGE FOR GIRLS, NAMPALLY.---J5641</option>
<option value="MANJEERA DEG COLL,PATANCHERU---D5692">MANJEERA DEG COLL,PATANCHERU---D5692</option>
<option value="MANJEERA JR.COLLEGE,PATANCHERU---J5325">MANJEERA JR.COLLEGE,PATANCHERU---J5325</option>
<option value="MANORAMA ITI, DILSUKHNAGAR.---T3067">MANORAMA ITI, DILSUKHNAGAR.---T3067</option>
<option value="MANPOWER DEVELOPMENT COLLEGE,KUSHAIGUDA---P3251">MANPOWER DEVELOPMENT COLLEGE,KUSHAIGUDA---P3251</option>
<option value="MANTRA SCHOOL OF BUSINESS MGMT,MANSOORABAD, LB NAGAR---P3180">MANTRA SCHOOL OF BUSINESS MGMT,MANSOORABAD, LB NAGAR---P3180</option>
<option value="MARRI LAXMA REDDY INST.TECH. AND MANAGMENT,DUNDIGAL---T3316">MARRI LAXMA REDDY INST.TECH. AND MANAGMENT,DUNDIGAL---T3316</option>
<option value="MASTER MINDS JUNIOR COLLEGE, MOOSARAMBAGH---J5665">MASTER MINDS JUNIOR COLLEGE, MOOSARAMBAGH---J5665</option>
<option value="MASTER MINDS JUNIOR KALASALA, AMEERPET---J5663">MASTER MINDS JUNIOR KALASALA, AMEERPET---J5663</option>
<option value="MASTERS JUNIOR COLLEGE YOUSUF GUDA CHECK POST---J5436">MASTERS JUNIOR COLLEGE YOUSUF GUDA CHECK POST---J5436</option>
<option value="MATRUSRI ENGINEERING COLLEGE---T3340">MATRUSRI ENGINEERING COLLEGE---T3340</option>
<option value="MEDFIN INSTITUTE OF MEDICAL SCIENCES H B NAGAR---SP208">MEDFIN INSTITUTE OF MEDICAL SCIENCES H B NAGAR---SP208</option>
<option value="MEDICITI COLLEGE OF NURSING,GHANPUR---D5854">MEDICITI COLLEGE OF NURSING,GHANPUR---D5854</option>
<option value="MEDICITI INIST OF MED SCIENCES,GHANPUR,MEDCHAL.---P3075">MEDICITI INIST OF MED SCIENCES,GHANPUR,MEDCHAL.---P3075</option>
<option value="MEGHA DEGREE COLLEGE FOR WOMEN,ECIL---D5957">MEGHA DEGREE COLLEGE FOR WOMEN,ECIL---D5957</option>
<option value="MEGHA INST.OF ENG. AND TECH. FOR WOMEN,EDULABAD---T3275">MEGHA INST.OF ENG. AND TECH. FOR WOMEN,EDULABAD---T3275</option>
<option value="MEGHA JR.COLLEGE,RAMANTHPUR---J5369">MEGHA JR.COLLEGE,RAMANTHPUR---J5369</option>
<option value="MEGHA JUNIOR COLLEGE FOR GIRLS ,ECIL X ROAD.---J3345">MEGHA JUNIOR COLLEGE FOR GIRLS ,ECIL X ROAD.---J3345</option>
<option value="MEGHANA DEGREE COLLEGE,DSNR---D5738">MEGHANA DEGREE COLLEGE,DSNR---D5738</option>
<option value="MEGHA W. DEGREE  COLLEGE,RAMANTHAPUR---D5691">MEGHA W. DEGREE  COLLEGE,RAMANTHAPUR---D5691</option>
<option value="MESCO COLLEGE OF PHARMACY, MUSTAIDPURA, KARWAN ROAD---D5700">MESCO COLLEGE OF PHARMACY, MUSTAIDPURA, KARWAN ROAD---D5700</option>
<option value="MESCO INST OF MGMT AND COMP SCI,MUSTAIDPURA---P0039">MESCO INST OF MGMT AND COMP SCI,MUSTAIDPURA---P0039</option>
<option value="MESCO JUNIOR COLLEGE, MUSTAIDPURA, ASIFNAGAR(M)---J5745">MESCO JUNIOR COLLEGE, MUSTAIDPURA, ASIFNAGAR(M)---J5745</option>
<option value="METHODIST COLLEGE OF ENG AND TECH ABIDS---T3251">METHODIST COLLEGE OF ENG AND TECH ABIDS---T3251</option>
<option value="METHODIST DEG. COLLEGE,,KING KOTI.---D0453">METHODIST DEG. COLLEGE,,KING KOTI.---D0453</option>
<option value="M G I T , GANDIPET---T3122">M G I T , GANDIPET---T3122</option>
<option value="MILLATH ITC,SALEEM NAGAR,NEW MALAKPET---T3066">MILLATH ITC,SALEEM NAGAR,NEW MALAKPET---T3066</option>
<option value="MLR INSTITUTE OF PHARMACY DUNDIGAL.---D5798">MLR INSTITUTE OF PHARMACY DUNDIGAL.---D5798</option>
<option value="MLR INSTITUTE OF TECHNOLOGY, DUNDIGAL---T3211">MLR INSTITUTE OF TECHNOLOGY, DUNDIGAL---T3211</option>
<option value="MNJ INSTITUTE OF ONCOLOGY AND REAGIONAL CNACER---SP165">MNJ INSTITUTE OF ONCOLOGY AND REAGIONAL CNACER---SP165</option>
<option value="MNJ INST.OF ONCOLOGY AND REGIONAL CANCER CENTER.HED HILLS.---SP163">MNJ INST.OF ONCOLOGY AND REGIONAL CANCER CENTER.HED HILLS.---SP163</option>
<option value="MNR DEGREE COLLEGE,KUKATPALLY---D0374">MNR DEGREE COLLEGE,KUKATPALLY---D0374</option>
<option value="MNR JR COLLEGE, BHAGYANAGAR COLONY, KUKATPALLY---J3391">MNR JR COLLEGE, BHAGYANAGAR COLONY, KUKATPALLY---J3391</option>
<option value="MNR PG COLLEGE, KUKATPALLY---P0098">MNR PG COLLEGE, KUKATPALLY---P0098</option>
<option value="MNR PG TEACHER EDUCATION COLLEGE, OPP JNTU---P3147">MNR PG TEACHER EDUCATION COLLEGE, OPP JNTU---P3147</option>
<option value="MNR TEACHER EDUCATION COLLEGE, OPP JNTU---D5636">MNR TEACHER EDUCATION COLLEGE, OPP JNTU---D5636</option>
<option value="MODERN INST. PHYSICAL  MEDICINE  REHAB,SIDDIAMBER BAZAR.---D5634">MODERN INST. PHYSICAL  MEDICINE  REHAB,SIDDIAMBER BAZAR.---D5634</option>
<option value="MOGHAL COLL OF EDUCATION,BANDLAGUDA---P3099">MOGHAL COLL OF EDUCATION,BANDLAGUDA---P3099</option>
<option value="MOTHER TERASA PG COLLEGE NFC NAGAR---P0734">MOTHER TERASA PG COLLEGE NFC NAGAR---P0734</option>
<option value="MOTHER TERESA COLLEGE OF PHARMACY NFC NAGAR---D5776">MOTHER TERESA COLLEGE OF PHARMACY NFC NAGAR---D5776</option>
<option value="MOTHER THERESA COLL OF NURSING  ECIL HYDERABAD---D5777">MOTHER THERESA COLL OF NURSING  ECIL HYDERABAD---D5777</option>
<option value="MOTHER THERESA VOCATIONAL JUNIOR COLLEGE ASIF NAGAR MP---J5902">MOTHER THERESA VOCATIONAL JUNIOR COLLEGE ASIF NAGAR MP---J5902</option>
<option value="MOTION JUNIOR COLLEGE, GAFOOR NAGAR,MADHAPUR S.L.PALLY---J5704">MOTION JUNIOR COLLEGE, GAFOOR NAGAR,MADHAPUR S.L.PALLY---J5704</option>
<option value="MOULANA AZAD NAT URDU UNI, GACHIBOWLI---D5654">MOULANA AZAD NAT URDU UNI, GACHIBOWLI---D5654</option>
<option value="MOULANA AZAD N URDU UNIV(POLYTECH),GACHIBOULI---T3282">MOULANA AZAD N URDU UNIV(POLYTECH),GACHIBOULI---T3282</option>
<option value="M R M COLLEGE OF PHARMACY,CHINTHAPALLY GUDA,IBP.---D5866">M R M COLLEGE OF PHARMACY,CHINTHAPALLY GUDA,IBP.---D5866</option>
<option value="MRM INST OF MGMT,CHINTAPALLY GUDA IBPN---P3074">MRM INST OF MGMT,CHINTAPALLY GUDA IBPN---P3074</option>
<option value="M S JR.COLLEGE FOR GIRLS,NLG X ROAD---J5552">M S JR.COLLEGE FOR GIRLS,NLG X ROAD---J5552</option>
<option value="M.S JR COLLEGE - MNDC,MASABTANK---J5193">M.S JR COLLEGE - MNDC,MASABTANK---J5193</option>
<option value="M.S.JR.COLLEGE,NALKONDA X RD---J5304">M.S.JR.COLLEGE,NALKONDA X RD---J5304</option>
<option value="MS JUNIOR COLELGE MEHDIPATNAM---J5807">MS JUNIOR COLELGE MEHDIPATNAM---J5807</option>
<option value="MS JUNIOR COLLEGE,ARAMGHAR X RDS, KATEDHAN, HYD---J5879">MS JUNIOR COLLEGE,ARAMGHAR X RDS, KATEDHAN, HYD---J5879</option>
<option value="MS JUNIOR COLLEGE---J5833">MS JUNIOR COLLEGE---J5833</option>
<option value="M S JUNIOR COLLEGE MOGHALPURA,HYD.---J5393">M S JUNIOR COLLEGE MOGHALPURA,HYD.---J5393</option>
<option value="M.S.JUNIOR COLLEGE,SHALIBANDA---J5536">M.S.JUNIOR COLLEGE,SHALIBANDA---J5536</option>
<option value="MS JUNIOR COLLEGE, TOLICHOUKI.---J5834">MS JUNIOR COLLEGE, TOLICHOUKI.---J5834</option>
<option value="MSS LAW COLLEGE,ESAMAI BAZAR,KACHIGUDA RD.---D5883">MSS LAW COLLEGE,ESAMAI BAZAR,KACHIGUDA RD.---D5883</option>
<option value="MUFFAKHAM  JAH COLLEGE OF ENG. TECH BANJARAHILLS.---T3004">MUFFAKHAM  JAH COLLEGE OF ENG. TECH BANJARAHILLS.---T3004</option>
<option value="MUMTAZ COL.OF ENG. AND TECH,MALAKPET---P3307">MUMTAZ COL.OF ENG. AND TECH,MALAKPET---P3307</option>
<option value="MUMTAZ DEG COLL,MALAKPET---D0556">MUMTAZ DEG COLL,MALAKPET---D0556</option>
<option value="MVSR ENGG COLLEGE,NADERGUL---T3003">MVSR ENGG COLLEGE,NADERGUL---T3003</option>

<option value="NAGARJUNA ITI,OPP KPHB COLONY---T3055">NAGARJUNA ITI,OPP KPHB COLONY---T3055</option>
<option value="NAGARJUNA ITI SAROORNAGAR---T3452">NAGARJUNA ITI SAROORNAGAR---T3452</option>
<option value="NALANADA JR COLLEGE VENGALRAO NAGAR.---J4693">NALANADA JR COLLEGE VENGALRAO NAGAR.---J4693</option>
<option value="NALANDA VOC.JR.COLLEGE,ASHOKNAGAR---J5359">NALANDA VOC.JR.COLLEGE,ASHOKNAGAR---J5359</option>
<option value="NALLA MALLAREDDY ENG. COLLEGE,DIVYANAGAR.---T3221">NALLA MALLAREDDY ENG. COLLEGE,DIVYANAGAR.---T3221</option>
<option value="NALLA NARASIMHA REDDY EDUCATION SOCIETYS---T3290">NALLA NARASIMHA REDDY EDUCATION SOCIETYS---T3290</option>
<option value="NANO JR COLLEGE, SAIRAM COMPLEX,NALLAKUNTA---J5429">NANO JR COLLEGE, SAIRAM COMPLEX,NALLAKUNTA---J5429</option>
<option value="NANO JUNIOR COLLEGE,MADHAPUR,R R DIST---J4893">NANO JUNIOR COLLEGE,MADHAPUR,R R DIST---J4893</option>
<option value="NARASIMHA REDDY ENG COLLEGE,MAISAMMAGUDA---T3238">NARASIMHA REDDY ENG COLLEGE,MAISAMMAGUDA---T3238</option>
<option value="NARAYANA JR COLLEGE(30659),VITTALWADI,NARAYANAGUDA.---J5124">NARAYANA JR COLLEGE(30659),VITTALWADI,NARAYANAGUDA.---J5124</option>
<option value="NARAYANA JR COLLEGE,BESIDE YMCA,NARAYANGUDA.---J5122">NARAYANA JR COLLEGE,BESIDE YMCA,NARAYANGUDA.---J5122</option>
<option value="NARAYANA JR COLLEGE CHAITHAYAPURI---J5467">NARAYANA JR COLLEGE CHAITHAYAPURI---J5467</option>
<option value="NARAYANA JR COLLEGE CHANDANAGAR---J5226">NARAYANA JR COLLEGE CHANDANAGAR---J5226</option>
<option value="NARAYANA JR COLLEGE,CHINTAL---J5653">NARAYANA JR COLLEGE,CHINTAL---J5653</option>
<option value="NARAYANA JR COLLEGE, ECIL X ROADS---J5204">NARAYANA JR COLLEGE, ECIL X ROADS---J5204</option>
<option value="NARAYANA JR COLLEGE, GADDI ANNARAM, DILSUKH NAGAR RR DIST---J5468">NARAYANA JR COLLEGE, GADDI ANNARAM, DILSUKH NAGAR RR DIST---J5468</option>
<option value="NARAYANA JR COLLEGE, GADDIANNARAM---J5528">NARAYANA JR COLLEGE, GADDIANNARAM---J5528</option>
<option value="NARAYANA JR.COLLEGE GADDIANNARAM---J5599">NARAYANA JR.COLLEGE GADDIANNARAM---J5599</option>
<option value="NARAYANA JR COLLEGE,GOTTIPATI TOWER, M.P---J5303">NARAYANA JR COLLEGE,GOTTIPATI TOWER, M.P---J5303</option>
<option value="NARAYANA JR.COLLEGE,GOTTIPATI TOWER,MP.---J5760">NARAYANA JR.COLLEGE,GOTTIPATI TOWER,MP.---J5760</option>
<option value="NARAYANA JR COLLEGE GREEN HILLS COLONY,KOTHAPET.---J5774">NARAYANA JR COLLEGE GREEN HILLS COLONY,KOTHAPET.---J5774</option>
<option value="NARAYANA JR COLLEGE, H.NO.2-22-307/9, BHAGYA NAGAR COLONY, KUKATPALLY---J5554">NARAYANA JR COLLEGE, H.NO.2-22-307/9, BHAGYA NAGAR COLONY, KUKATPALLY---J5554</option>
<option value="NARAYANA JR COLLEGE---J5531">NARAYANA JR COLLEGE---J5531</option>
<option value="NARAYANA JR COLLEGE,JJ NAGAR, ALWAL---J5512">NARAYANA JR COLLEGE,JJ NAGAR, ALWAL---J5512</option>
<option value="NARAYANA JR COLLEGE KUKATPALLY---J6037">NARAYANA JR COLLEGE KUKATPALLY---J6037</option>
<option value="NARAYANA JR COLLEGE MADHAPUR---J5657">NARAYANA JR COLLEGE MADHAPUR---J5657</option>
<option value="NARAYANA JR.COLLEGE,NEAR VEG.MARKET,SHANKERMATT.3-5-1034/B, NARAYANAGUDA---J5355">NARAYANA JR.COLLEGE,NEAR VEG.MARKET,SHANKERMATT.3-5-1034/B, NARAYANAGUDA---J5355</option>
<option value="NARAYANA JR.COLLEGE,NEW NALLAKUNTA.---J5719">NARAYANA JR.COLLEGE,NEW NALLAKUNTA.---J5719</option>
<option value="NARAYANA JR COLLEGE,PET BHASHEERBAD, QUTHBULLAHPUR---J5648">NARAYANA JR COLLEGE,PET BHASHEERBAD, QUTHBULLAHPUR---J5648</option>
<option value="NARAYANA JR COLLEGE,PRASANTHNAGAR, V.PURAM---J5220">NARAYANA JR COLLEGE,PRASANTHNAGAR, V.PURAM---J5220</option>
<option value="NARAYANA JR COLLEGE RAMALAYAM STREET,KP---J5508">NARAYANA JR COLLEGE RAMALAYAM STREET,KP---J5508</option>
<option value="NARAYANA JR COLLEGE SANTHOSHNAGAR---J4544">NARAYANA JR COLLEGE SANTHOSHNAGAR---J4544</option>
<option value="NARAYANA JR COLLEGE, SCIENTIST COLONY, HABSIGUDA---J5370">NARAYANA JR COLLEGE, SCIENTIST COLONY, HABSIGUDA---J5370</option>
<option value="NARAYANA JR COLLEGE SRIKRISHNA NAG.GADDI ANNARAM.---J5470">NARAYANA JR COLLEGE SRIKRISHNA NAG.GADDI ANNARAM.---J5470</option>
<option value="NARAYANA JR.COLLEGE,SRINAGAR CLY ROAD,PANJAGUTTA.---J5725">NARAYANA JR.COLLEGE,SRINAGAR CLY ROAD,PANJAGUTTA.---J5725</option>
<option value="NARAYANA JR COLLEGE SR NAGAR.---J4865">NARAYANA JR COLLEGE SR NAGAR.---J4865</option>
<option value="NARAYANA JR COLLEGE SR NAGAR---J5525">NARAYANA JR COLLEGE SR NAGAR---J5525</option>
<option value="NARAYANA JR COLLEGE,SR.NAGAR---J5526">NARAYANA JR COLLEGE,SR.NAGAR---J5526</option>
<option value="NARAYANA JR.COLLEGE,ST.NO.9.HIMAYATHNAGAR,HYD.---J5726">NARAYANA JR.COLLEGE,ST.NO.9.HIMAYATHNAGAR,HYD.---J5726</option>
<option value="NARAYANA JR COLLEGE, ST.NO.9,TARNAKA.---J5557">NARAYANA JR COLLEGE, ST.NO.9,TARNAKA.---J5557</option>
<option value="NARAYANA JR COLLEGE TARNAKA---J5116">NARAYANA JR COLLEGE TARNAKA---J5116</option>
<option value="NARAYANA JR COLLEGE,VITTALWADI, N.GUDA---J5171">NARAYANA JR COLLEGE,VITTALWADI, N.GUDA---J5171</option>
<option value="NARAYANA JUNIOR COLLEGE---J5824">NARAYANA JUNIOR COLLEGE---J5824</option>
<option value="NARAYANA JUNIOR COLLEGE---J5831">NARAYANA JUNIOR COLLEGE---J5831</option>
<option value="NARAYANA JUNIOR COLLEGE, SR NAGAR---J5843">NARAYANA JUNIOR COLLEGE, SR NAGAR---J5843</option>
<option value="NARAYAN  JUNIOR COLLEGE CHAMPAPET---J5417">NARAYAN  JUNIOR COLLEGE CHAMPAPET---J5417</option>
<option value="NARAYNA JUNIOR COLLEGE---J5827">NARAYNA JUNIOR COLLEGE---J5827</option>
<option value="NAT.INS. EMPOWER.PER.INT.DIS.(DIVYANJAN)---SP025">NAT.INS. EMPOWER.PER.INT.DIS.(DIVYANJAN)---SP025</option>
<option value="NAT.INS. EMPOWER.PER.INT.DIS.(DIVYANJAN)---SP025">NAT.INS. EMPOWER.PER.INT.DIS.(DIVYANJAN)---SP025</option>
<option value="NATIONAL INSTITUTE OF NUTRITION, TARNAKA---P3332">NATIONAL INSTITUTE OF NUTRITION, TARNAKA---P3332</option>
<option value="NATIONAL INST.OF PHARA.EDU.AND RECH,BALANAGAR---P3280">NATIONAL INST.OF PHARA.EDU.AND RECH,BALANAGAR---P3280</option>
<option value="NATIONAL INST. OF TOURISM AND HOSPITALITY MANG.,GACHIBOWLI---D5752">NATIONAL INST. OF TOURISM AND HOSPITALITY MANG.,GACHIBOWLI---D5752</option>
<option value="NATIONAL INSTT OF TOURISM AND HOSPITAL---P3123">NATIONAL INSTT OF TOURISM AND HOSPITAL---P3123</option>
<option value="NATIONAL SKILL TRG INST.RMTP---T3137">NATIONAL SKILL TRG INST.RMTP---T3137</option>
<option value="NATURECURE HOSP. BALKAMPET---T3097">NATURECURE HOSP. BALKAMPET---T3097</option>
<option value="NAVA CHAITANYA DEG COLLEGE, YMCA NARAYANGUDA---D5767">NAVA CHAITANYA DEG COLLEGE, YMCA NARAYANGUDA---D5767</option>
<option value="NAVA CHAITANYA JR COLLEGE,HIMAYATHNAGAR---J5710">NAVA CHAITANYA JR COLLEGE,HIMAYATHNAGAR---J5710</option>
<option value="NAVA CHAITANYA JR COLLEGE,N.GUDA---J4671">NAVA CHAITANYA JR COLLEGE,N.GUDA---J4671</option>
<option value="NAVEENA JR.COLLEGE HASTANAPURM---J6052">NAVEENA JR.COLLEGE HASTANAPURM---J6052</option>
<option value="NAVYA JR COLLEGE MOOSARAMBAGH---J4686">NAVYA JR COLLEGE MOOSARAMBAGH---J4686</option>
<option value="NAWAB SHAH ALAM KHAN COL.OF ENG AND TECH,NEW MALAKPET---T3283">NAWAB SHAH ALAM KHAN COL.OF ENG AND TECH,NEW MALAKPET---T3283</option>
<option value="N B SCIENCE COL. AND PG CENTER,CHAR KAMAN---P4039">N B SCIENCE COL. AND PG CENTER,CHAR KAMAN---P4039</option>
<option value="N.B. SCIENCE COLL,CHARKAMAN.---D0257">N.B. SCIENCE COLL,CHARKAMAN.---D0257</option>
<option value="NB SCIENCE COLLEGE,CHARKAMAN---P0099">NB SCIENCE COLLEGE,CHARKAMAN---P0099</option>
<option value="NEIL GOGTE INST. OF TECHNOLOGY, KACHAVANI SINGARAM, GTKR---T3448">NEIL GOGTE INST. OF TECHNOLOGY, KACHAVANI SINGARAM, GTKR---T3448</option>
<option value="NETAJI INSTITUTE OF ENG.  TECH, TOOPRANPET.---T3358">NETAJI INSTITUTE OF ENG.  TECH, TOOPRANPET.---T3358</option>
<option value="NETAJI INST.OF PHAR.SCIENCE,TOOPRANPET---P4026">NETAJI INST.OF PHAR.SCIENCE,TOOPRANPET---P4026</option>
<option value="NEW CHAITANYA JR COLLEGE, EC EXTENSION, ECIL X ROADS---J5627">NEW CHAITANYA JR COLLEGE, EC EXTENSION, ECIL X ROADS---J5627</option>
<option value="NEW CHAITANYA JR COLLEGE HIMAYATHNAGAR---J5399">NEW CHAITANYA JR COLLEGE HIMAYATHNAGAR---J5399</option>
<option value="NEW CHAITANYA JR COLLEGE TARNAKA---J5170">NEW CHAITANYA JR COLLEGE TARNAKA---J5170</option>
<option value="NEW ERA JR.COLLEGE,CHIKKADPALLY---J5446">NEW ERA JR.COLLEGE,CHIKKADPALLY---J5446</option>
<option value="NEW GOVT DEG AND PG COLLEGE,KHAIRATABAD---D0382">NEW GOVT DEG AND PG COLLEGE,KHAIRATABAD---D0382</option>
<option value="NEW GOVT DEG.PG COLLEGE KHAIRATABAD---D0563">NEW GOVT DEG.PG COLLEGE KHAIRATABAD---D0563</option>
<option value="NEW GOVT JR.COLLEGE MALAKPET.---J4680">NEW GOVT JR.COLLEGE MALAKPET.---J4680</option>
<option value="NEW GOVT JR.COLLEGE,(NAMPALLY), KUKATPALLY.---J6062">NEW GOVT JR.COLLEGE,(NAMPALLY), KUKATPALLY.---J6062</option>
<option value="NEW GOVT JR COLL,YMCA,SEC---J5127">NEW GOVT JR COLL,YMCA,SEC---J5127</option>
<option value="NEW MADINA DEG COLLEGE, SHALIBANDA X RDS---D6026">NEW MADINA DEG COLLEGE, SHALIBANDA X RDS---D6026</option>
<option value="NEW MASTERMINDS JR.COLLEGE,BALAPUR.---J5821">NEW MASTERMINDS JR.COLLEGE,BALAPUR.---J5821</option>
<option value="NEW NOBLE DEG.  P.G COLLEGE,MOOSARAMBAGH---D5876">NEW NOBLE DEG.  P.G COLLEGE,MOOSARAMBAGH---D5876</option>
<option value="NEW NOBLE JR.COLL GADDIANNARAM,DILSUKHNAGAR.---J3392">NEW NOBLE JR.COLL GADDIANNARAM,DILSUKHNAGAR.---J3392</option>
<option value="NEW PAGE DEGREE COLLEGE---D6074">NEW PAGE DEGREE COLLEGE---D6074</option>
<option value="NEW PRAGATHI COL.OF COMMERCE AND SCI.,CHANDANAGAR---D6018">NEW PRAGATHI COL.OF COMMERCE AND SCI.,CHANDANAGAR---D6018</option>
<option value="NEW SCIENCE COLLEGE AMEERPET.---D0567">NEW SCIENCE COLLEGE AMEERPET.---D0567</option>
<option value="NEW SIDDHARTHA DEG.COLLEGE,KMG COLONY,CHINTAL MAIN ROAD.---D5919">NEW SIDDHARTHA DEG.COLLEGE,KMG COLONY,CHINTAL MAIN ROAD.---D5919</option>
<option value="NEW SRI CHAITANYA JR.COLLEGE,TURKAYAMJAL.---J5481">NEW SRI CHAITANYA JR.COLLEGE,TURKAYAMJAL.---J5481</option>
<option value="NEW SRI CHAITANYA JR.KALASALA,TOLICHOWKI,HYD.---J5686">NEW SRI CHAITANYA JR.KALASALA,TOLICHOWKI,HYD.---J5686</option>
<option value="NEW SRI MEDHA DEGREE COLLEGE, RB NAGAR, SHAMSHABAD---D5791">NEW SRI MEDHA DEGREE COLLEGE, RB NAGAR, SHAMSHABAD---D5791</option>
<option value="NEW SRI MEDHA JUNIOR COLLEGE, RB NAGAR, SHAMSHABAD---J5502">NEW SRI MEDHA JUNIOR COLLEGE, RB NAGAR, SHAMSHABAD---J5502</option>
<option value="NEW ST FRANCIS XAVIER JR.COL,BARKATPURA---J5587">NEW ST FRANCIS XAVIER JR.COL,BARKATPURA---J5587</option>
<option value="NEW ST JOSEPHS JR COLLEGE, STREET NO 8, HIMAYATHNAGAR---J4975">NEW ST JOSEPHS JR COLLEGE, STREET NO 8, HIMAYATHNAGAR---J4975</option>
<option value="NICT ITI ,TARNAKA---T3071">NICT ITI ,TARNAKA---T3071</option>
<option value="NIFT MADHAPUR---SP105">NIFT MADHAPUR---SP105</option>
<option value="NIMS COLLEGE OF NURSING P.GUTTA---SP093">NIMS COLLEGE OF NURSING P.GUTTA---SP093</option>
<option value="NIMS COLLEGE OF PARAMEDICAL  ALLIED SCIENCES, PANJAGUTTA---D6214">NIMS COLLEGE OF PARAMEDICAL  ALLIED SCIENCES, PANJAGUTTA---D6214</option>
<option value="NIZAM COLLEGE,LB STADIUM---D5659">NIZAM COLLEGE,LB STADIUM---D5659</option>
<option value="NIZAM COLLEGE---P0351">NIZAM COLLEGE---P0351</option>
<option value="NIZAMS INST.OF MEDICAL SCIENCES,PUNJAGUTTA---P3284">NIZAMS INST.OF MEDICAL SCIENCES,PUNJAGUTTA---P3284</option>
<option value="N.N.M.L.B.VOCATIONAL JUNIOR COLLEGE, NEAR MEHDIPATNAM BUS DEPOT---J5738">N.N.M.L.B.VOCATIONAL JUNIOR COLLEGE, NEAR MEHDIPATNAM BUS DEPOT---J5738</option>
<option value="NOBLE DEG AND PG COLLEGE, MOOSARAMBAGH---D0186">NOBLE DEG AND PG COLLEGE, MOOSARAMBAGH---D0186</option>
<option value="NOBLE P.G COLLEGE,NADARGUL---P3072">NOBLE P.G COLLEGE,NADARGUL---P3072</option>
<option value="NRI JR.COLLEGE BHAGYANAGAR, KP---J5485">NRI JR.COLLEGE BHAGYANAGAR, KP---J5485</option>
<option value="NRI JUNIOR COLLEGE, SRINIVASA COLONY,AMEERPET---J5321">NRI JUNIOR COLLEGE, SRINIVASA COLONY,AMEERPET---J5321</option>
<option value="NRUPATUNGA JR.COLL,KACHIGUDA---J4800">NRUPATUNGA JR.COLL,KACHIGUDA---J4800</option>
<option value="NRUPTUNGA DEGREE COLLEGE, KACHIGUDA---D0569">NRUPTUNGA DEGREE COLLEGE, KACHIGUDA---D0569</option>
<option value="NSKK JR.COLLEGE GAGILAPUR(V), QUTHBULLAPUR(M) RR.DIST.---J6009">NSKK JR.COLLEGE GAGILAPUR(V), QUTHBULLAPUR(M) RR.DIST.---J6009</option>
<option value="NSR  COLLEGE OF EDUCATION,JAMBAGH,KOTI---D0004">NSR  COLLEGE OF EDUCATION,JAMBAGH,KOTI---D0004</option>
<option value="NSR JR COLLEGE,RAILWAY STN.RD,MEDCHAL.---J5590">NSR JR COLLEGE,RAILWAY STN.RD,MEDCHAL.---J5590</option>
<option value="NSTI,VIDYA NAGAR---T3153">NSTI,VIDYA NAGAR---T3153</option>

<option value="OBS DEGREE COLLEGE,SCIENTIST COL,HABSIGUDA---D6203">OBS DEGREE COLLEGE,SCIENTIST COL,HABSIGUDA---D6203</option>
<option value="OMEGA COLLEGE OF PHARMACY,EDULABAD---D5793">OMEGA COLLEGE OF PHARMACY,EDULABAD---D5793</option>
<option value="OMEGA DEGREE COLLEGE, HABSIGUDA---D0520">OMEGA DEGREE COLLEGE, HABSIGUDA---D0520</option>
<option value="OMEGA DEGREE COLLEGE, MAHESH NAGAR, ECIL---D5744">OMEGA DEGREE COLLEGE, MAHESH NAGAR, ECIL---D5744</option>
<option value="OMEGA DEGREE COLLEGE PLOT 216 PEERZAGIDUDA---D6092">OMEGA DEGREE COLLEGE PLOT 216 PEERZAGIDUDA---D6092</option>
<option value="OMEGA ELITE JUNIOR COLLEGE  HABSHIGUDA---J5730">OMEGA ELITE JUNIOR COLLEGE  HABSHIGUDA---J5730</option>
<option value="OMEGA JR.COLLEGE,HABSIGUDA.---J6051">OMEGA JR.COLLEGE,HABSIGUDA.---J6051</option>
<option value="OMEGA JR.COLLEGE HANUMAN NAGAR,BODUPPAL.---J5685">OMEGA JR.COLLEGE HANUMAN NAGAR,BODUPPAL.---J5685</option>
<option value="OMEGA JR COLLEGE,MAHESH NAGAR, ECIL---J5191">OMEGA JR COLLEGE,MAHESH NAGAR, ECIL---J5191</option>
<option value="OMEGA PG COLLEGE MBA---P3341">OMEGA PG COLLEGE MBA---P3341</option>
<option value="OMEGA PG COLLEGE MCA ,EDULABAD---P3164">OMEGA PG COLLEGE MCA ,EDULABAD---P3164</option>
<option value="OS DEGREE COLLEGE,SHAHEEN NAGAR, YERRAKUNTA---D6186">OS DEGREE COLLEGE,SHAHEEN NAGAR, YERRAKUNTA---D6186</option>
<option value="O.S.JUNIOR COLLEGE---J5669">O.S.JUNIOR COLLEGE---J5669</option>
<option value="OSMANIA MEDICAL COLLEGE,KOTI---SP139">OSMANIA MEDICAL COLLEGE,KOTI---SP139</option>
<option value="OSMANIA  MEDICAL COLLEGE,KOTI---T3083">OSMANIA  MEDICAL COLLEGE,KOTI---T3083</option>
<option value="OSMANIA UNIVERSITY P.G.COLLEGE, NARSAPUR.---P3312">OSMANIA UNIVERSITY P.G.COLLEGE, NARSAPUR.---P3312</option>
<option value="OSM DEG.COLLEGE,BANDLAGUDA KHALSA---D5920">OSM DEG.COLLEGE,BANDLAGUDA KHALSA---D5920</option>
<option value="OSM JUNIOR COLLEGE,MOGHULPURA---J5378">OSM JUNIOR COLLEGE,MOGHULPURA---J5378</option>
<option value="OU COLLEGE FOR WOMEN---T3418">OU COLLEGE FOR WOMEN---T3418</option>
<option value="O.U COLLEGE OF PHYSICAL EDUCTION,O.U---P3144">O.U COLLEGE OF PHYSICAL EDUCTION,O.U---P3144</option>
<option value="O U COLLEGE (WOMENS) - KOTI---D5640">O U COLLEGE (WOMENS) - KOTI---D5640</option>
<option value="OWAISI COLLEGE OF NURSING,KANCHANBAGH,HYD.---P3293">OWAISI COLLEGE OF NURSING,KANCHANBAGH,HYD.---P3293</option>
<option value="OWAISI SCH OF NURSING K.BAGH---SP037">OWAISI SCH OF NURSING K.BAGH---SP037</option>
<option value="PADALA RAMA REDDY COLLEGE OF COMMERCE  AND MANAGEMENT, MANCHIREVULA, RJNR(M)---P0271">PADALA RAMA REDDY COLLEGE OF COMMERCE  AND MANAGEMENT, MANCHIREVULA, RJNR(M)---P0271</option>
<option value="PADALA RAMA REDDY LAW COLLEGE,YELLAREDDYGUDA---D0018">PADALA RAMA REDDY LAW COLLEGE,YELLAREDDYGUDA---D0018</option>
<option value="PAGE JR COLLEGE,HIMAYATH NAGAR---J5687">PAGE JR COLLEGE,HIMAYATH NAGAR---J5687</option>
<option value="PAGE JUNIOR COLLEGE, ADITYA COURT,BANJARAHILLS---J5691">PAGE JUNIOR COLLEGE, ADITYA COURT,BANJARAHILLS---J5691</option>
<option value="PAGE JUNIOR COLLEGE---J5794">PAGE JUNIOR COLLEGE---J5794</option>
<option value="PALLAVI ENGINEERING COLLEGE, KUNTLOOR (V) BDULLAPURMET (M) R.R.DIST---T3301">PALLAVI ENGINEERING COLLEGE, KUNTLOOR (V) BDULLAPURMET (M) R.R.DIST---T3301</option>
<option value="PANINEEYA MV INST OF DENTAL SCI. RES.CENTER,KAMALANAGAR,DSNR.---T3196">PANINEEYA MV INST OF DENTAL SCI. RES.CENTER,KAMALANAGAR,DSNR.---T3196</option>
<option value="PANNALA RAM REDDY COL.BUS.MGT,BODUPPAL---P3250">PANNALA RAM REDDY COL.BUS.MGT,BODUPPAL---P3250</option>
<option value="PDS COLLEGE OF B.SC(MLT),PURANI HAVELI,HYD.---D5713">PDS COLLEGE OF B.SC(MLT),PURANI HAVELI,HYD.---D5713</option>
<option value="P.D.S COLLEGE OF PHYSIOTHERAPY,PURANI HAVELI.---D5714">P.D.S COLLEGE OF PHYSIOTHERAPY,PURANI HAVELI.---D5714</option>
<option value="PENDEKANTI INST OF MANAGEMENT,IBRAHIMBAGH---P0042">PENDEKANTI INST OF MANAGEMENT,IBRAHIMBAGH---P0042</option>
<option value="PENDEKANTI LAW COLLEGE CHIKKADPALLY.---D5903">PENDEKANTI LAW COLLEGE CHIKKADPALLY.---D5903</option>
<option value="P.G.COLLEGE OF SCIENCE,SAIFABAD---P0349">P.G.COLLEGE OF SCIENCE,SAIFABAD---P0349</option>
<option value="PG COLL OF LAW,BASHEERBAGH---P3062">PG COLL OF LAW,BASHEERBAGH---P3062</option>
<option value="PGR JUNIOR COLLEGE,VIVEKNAGAR,KP.---J5820">PGR JUNIOR COLLEGE,VIVEKNAGAR,KP.---J5820</option>
<option value="PINEGROVE JR.COLLEGE,TS POLICE ACADAMY,PEERUNCHERU.---J3368">PINEGROVE JR.COLLEGE,TS POLICE ACADAMY,PEERUNCHERU.---J3368</option>
<option value="PINNACLE COLLEGE OF CULINARY ARTS  HOTEL MANAGEMENT, OLD MOOSAPET,KUKATPALLY, HYD---D0081">PINNACLE COLLEGE OF CULINARY ARTS  HOTEL MANAGEMENT, OLD MOOSAPET,KUKATPALLY, HYD---D0081</option>
<option value="PINNACLE DEGREE COLLEGE MOOSAPET KP---D6070">PINNACLE DEGREE COLLEGE MOOSAPET KP---D6070</option>
<option value="PINNACLE INST. OF HOTEL MANG. CATE. TECH,MOOSAPET, KUKATPALLY, HYD---D5764">PINNACLE INST. OF HOTEL MANG. CATE. TECH,MOOSAPET, KUKATPALLY, HYD---D5764</option>
<option value="PINNACLE VOC JR COLLEGE, DHARMAREDDY GUDA, HYDERNAGAR---J5351">PINNACLE VOC JR COLLEGE, DHARMAREDDY GUDA, HYDERNAGAR---J5351</option>
<option value="PIONEER DEGREE COLLEGE,ABIDS JN ROAD---D0571">PIONEER DEGREE COLLEGE,ABIDS JN ROAD---D0571</option>
<option value="PIONEER INSTITUTE OF HOTEL MANG.,RAMNAGAR ROAD,ZASMISTANPUR.---D5727">PIONEER INSTITUTE OF HOTEL MANG.,RAMNAGAR ROAD,ZASMISTANPUR.---D5727</option>
<option value="P J R MEMORIAL SAI TEJA DEG.COLLEGE TUMUKUNTA.O---D5910">P J R MEMORIAL SAI TEJA DEG.COLLEGE TUMUKUNTA.O---D5910</option>
<option value="P N R COLLEGE OF PHARMACY PEDDASHAPUR, SHAMSHABAD---D5836">P N R COLLEGE OF PHARMACY PEDDASHAPUR, SHAMSHABAD---D5836</option>
<option value="PNR MEMORIAL ITI,IDA,JEEDIMETLA---T3059">PNR MEMORIAL ITI,IDA,JEEDIMETLA---T3059</option>
<option value="PONUGOTI MADHAVA RAO LAW COLLEGE, LB NAGAR---D0020">PONUGOTI MADHAVA RAO LAW COLLEGE, LB NAGAR---D0020</option>
<option value="PRAGATHI DEG COLLEGE FOR WOMEN,GADDIANNARAM,DSNR---D0574">PRAGATHI DEG COLLEGE FOR WOMEN,GADDIANNARAM,DSNR---D0574</option>
<option value="PRAGATHI DEGREE COL,KPHB---D5694">PRAGATHI DEGREE COL,KPHB---D5694</option>
<option value="PRAGATHI DEGREE COLLEGE,GADDI ANNARAM,DILSUKHNAGAR---D0599">PRAGATHI DEGREE COLLEGE,GADDI ANNARAM,DILSUKHNAGAR---D0599</option>
<option value="PRAGATHI JR COLLEGE FOR GIRLS.VV NAGAR,KP., VIVEKANANDA NAGAR, KUKATPALLY---J5547">PRAGATHI JR COLLEGE FOR GIRLS.VV NAGAR,KP., VIVEKANANDA NAGAR, KUKATPALLY---J5547</option>
<option value="PRAGATHI JR COLLEGE,GADDIANNRAM, DSNR---J3367">PRAGATHI JR COLLEGE,GADDIANNRAM, DSNR---J3367</option>
<option value="PRAGATHI JR.COLLEGE MIG.210,KPHB---J6061">PRAGATHI JR.COLLEGE MIG.210,KPHB---J6061</option>
<option value="PRAGATHI JUNIOR COLLEGE---J5888">PRAGATHI JUNIOR COLLEGE---J5888</option>
<option value="PRAGATHI JUNIOR COLLEGE---J5893">PRAGATHI JUNIOR COLLEGE---J5893</option>
<option value="PRAGATHI MAHAVIDYALAYA DEG  COLLEGE OF COMMERCE  SCIENCE HANUMANTEKDI KANDASWAMY LANE HYD---D0573">PRAGATHI MAHAVIDYALAYA DEG  COLLEGE OF COMMERCE  SCIENCE HANUMANTEKDI KANDASWAMY LANE HYD---D0573</option>
<option value="PRAGATHI MAHA VIDYALAYA JUNIOR COLLEGE HANMANTEKDI, HYD---J4700">PRAGATHI MAHA VIDYALAYA JUNIOR COLLEGE HANMANTEKDI, HYD---J4700</option>
<option value="PRAGATHI MAHA VIDYLAYA P.G. COLLEGE,HANNUMANTEKDI---P0188">PRAGATHI MAHA VIDYLAYA P.G. COLLEGE,HANNUMANTEKDI---P0188</option>
<option value="PRAGATHI WOMENS DEGREE COLLEGE, CHANDANAGAR.---D5931">PRAGATHI WOMENS DEGREE COLLEGE, CHANDANAGAR.---D5931</option>
<option value="PRAGATHI WOMENS DEGREE COLLEGE,VIVEKANAND  COLONY,KP.---D5671">PRAGATHI WOMENS DEGREE COLLEGE,VIVEKANAND  COLONY,KP.---D5671</option>
<option value="PRAGNA COLLEGE OF EDUCATION,SEETHARAMPET, IBPM(M)---D5853">PRAGNA COLLEGE OF EDUCATION,SEETHARAMPET, IBPM(M)---D5853</option>
<option value="PRAGNYA DEGREE COLLEGE,CHANDANAGAR---D5895">PRAGNYA DEGREE COLLEGE,CHANDANAGAR---D5895</option>
<option value="PRAGNYA WOMENS DEGREE COLLEGE CHANDA NAGAR---D5932">PRAGNYA WOMENS DEGREE COLLEGE CHANDA NAGAR---D5932</option>
<option value="PRANATHI JR.COLLEGE MALAKPET---J4967">PRANATHI JR.COLLEGE MALAKPET---J4967</option>
<option value="PRATHIBHA DEG COLLEGE,,KUKATPALLY---D5715">PRATHIBHA DEG COLLEGE,,KUKATPALLY---D5715</option>
<option value="PRATHIBHA DEGREE COLLEGE FOR WOMEN, KUKATPALLY.---D6090">PRATHIBHA DEGREE COLLEGE FOR WOMEN, KUKATPALLY.---D6090</option>
<option value="PRATHIBHA DEGREE COLLEGE,IBPM---D0758">PRATHIBHA DEGREE COLLEGE,IBPM---D0758</option>
<option value="PRESIDENCY DEGREE COLLEGE FOR COMMERCE AND SCIENCES,JAHANUMA---D6007">PRESIDENCY DEGREE COLLEGE FOR COMMERCE AND SCIENCES,JAHANUMA---D6007</option>
<option value="PRESIDENCY JR COL FOR BOYS AND GIRILS,JAHANUMA---J5493">PRESIDENCY JR COL FOR BOYS AND GIRILS,JAHANUMA---J5493</option>
<option value="PRESTON VOC JR COLLEGE,PHISALBANDA---J6063">PRESTON VOC JR COLLEGE,PHISALBANDA---J6063</option>
<option value="PRINCESS DURRUSHWAR JR.COLL,PURANI HAVELI.---J4724">PRINCESS DURRUSHWAR JR.COLL,PURANI HAVELI.---J4724</option>
<option value="PRINCESS DURUU SHEHVAR COLLEGE OF NURSING.PURANI HAVELLI.---P3317">PRINCESS DURUU SHEHVAR COLLEGE OF NURSING.PURANI HAVELLI.---P3317</option>
<option value="PRINCETON COLL OF PHARMA,KORREMULA---D5860">PRINCETON COLL OF PHARMA,KORREMULA---D5860</option>
<option value="PRINCETON DEG PG COLL,SHARADANAGAR RAMANTHAPUR.---D0578">PRINCETON DEG PG COLL,SHARADANAGAR RAMANTHAPUR.---D0578</option>
<option value="PRINCETON PG COLLEGE OF INF.TECH,(1317),SHARADANAGAR,RAMANTHAPUR.---P3337">PRINCETON PG COLLEGE OF INF.TECH,(1317),SHARADANAGAR,RAMANTHAPUR.---P3337</option>
<option value="PRINCETON PG COLLEGE OF MANAGEMENT(1318),SHARADANAGAR,RAMANTHAPUR---P3336">PRINCETON PG COLLEGE OF MANAGEMENT(1318),SHARADANAGAR,RAMANTHAPUR---P3336</option>
<option value="PRINCETON SCH OF EDUCATION,RAMANTHPUR---D5683">PRINCETON SCH OF EDUCATION,RAMANTHPUR---D5683</option>
<option value="PROF.JAYA SHANKER TELANGANA AGRI.UNIVERSITY,RJNR---D5620">PROF.JAYA SHANKER TELANGANA AGRI.UNIVERSITY,RJNR---D5620</option>
<option value="PS TELUGU UNIV,NAMPALLY---D5617">PS TELUGU UNIV,NAMPALLY---D5617</option>
<option value="PUJYA SHRI MADHAVANJI COLLEGE OF EDUCATION MAHESHWARAM---D5834">PUJYA SHRI MADHAVANJI COLLEGE OF EDUCATION MAHESHWARAM---D5834</option>
<option value="PUJYA SHRI MADHAVANJI DEGREE COLLEGE---D6192">PUJYA SHRI MADHAVANJI DEGREE COLLEGE---D6192</option>
<option value="PULLA REDDY INSTITUTE OF COMPUTERS SCIENCE,DUNDIGAL.---P3162">PULLA REDDY INSTITUTE OF COMPUTERS SCIENCE,DUNDIGAL.---P3162</option>
<option value="PULLA REDDY INSTITUTE OF PHARMACY NEAR DUNDIGAL  A.F.A.---D5837">PULLA REDDY INSTITUTE OF PHARMACY NEAR DUNDIGAL  A.F.A.---D5837</option>
<option value="P V RAM REDDY P.G.COLLEGE,UPPARIGUDA VILL---P3215">P V RAM REDDY P.G.COLLEGE,UPPARIGUDA VILL---P3215</option>


<option value="Q.Q.ITI, OLD CITY(GIRLS),NEW SANTOSHNAGAR.---T3062">Q.Q.ITI, OLD CITY(GIRLS),NEW SANTOSHNAGAR.---T3062</option>
<option value="Q.Q.POLYTECHNIC,OPP.ZOO PARK.---T3144">Q.Q.POLYTECHNIC,OPP.ZOO PARK.---T3144</option>
<option value="RACHANA COLLEGE OF JOURNALISM, NARAYANGUDA---P3286">RACHANA COLLEGE OF JOURNALISM, NARAYANGUDA---P3286</option>
<option value="RACHANA CO OF JOURNALISM N.GUDA---SP060">RACHANA CO OF JOURNALISM N.GUDA---SP060</option>
<option value="RADHEKRISHNA WOMENS COLLEGE,CHARKAMAN---D0584">RADHEKRISHNA WOMENS COLLEGE,CHARKAMAN---D0584</option>
<option value="RAILWAY DEGREE COLLEGE,LALAGUDA---D0585">RAILWAY DEGREE COLLEGE,LALAGUDA---D0585</option>
<option value="RAILWAY J/C, SD---J5131">RAILWAY J/C, SD---J5131</option>
<option value="RAILWAY JR.COLLEGE LALAGUDA---J5030">RAILWAY JR.COLLEGE LALAGUDA---J5030</option>
<option value="RAINBOW INTEGRATED DEGREE COLLEGE PAPAIAH YADAV NAGAR IDPL COLONY---D5933">RAINBOW INTEGRATED DEGREE COLLEGE PAPAIAH YADAV NAGAR IDPL COLONY---D5933</option>
<option value="RAJIV GANDHI AVIATION ACADEMY, OLD BOWENPALLY, SECBAD---SP046">RAJIV GANDHI AVIATION ACADEMY, OLD BOWENPALLY, SECBAD---SP046</option>
<option value="RAMADEVI COLLEGE OF EDU,RAMANTHAPUR---D5861">RAMADEVI COLLEGE OF EDU,RAMANTHAPUR---D5861</option>
<option value="RATNA JR COLLEGE NARAYANGUDA---J4883">RATNA JR COLLEGE NARAYANGUDA---J4883</option>
<option value="R.B.V.R.R. INST OF TECH ABIDS,REDDY HOSTEL PREMISES---P3080">R.B.V.R.R. INST OF TECH ABIDS,REDDY HOSTEL PREMISES---P3080</option>
<option value="RBVRR WOMENS COLLEGE,NARAYANAGUDA---D0581">RBVRR WOMENS COLLEGE,NARAYANAGUDA---D0581</option>
<option value="RBVRR WOMENS COLL OF PHARMACY BARKATHPURA.---D5765">RBVRR WOMENS COLL OF PHARMACY BARKATHPURA.---D5765</option>
<option value="REAH SCH.OF BUS.MGT,KESARAM---P4050">REAH SCH.OF BUS.MGT,KESARAM---P4050</option>
<option value="REGENCY COLLEGE OF HOTEL MGMT   CATERING TECH, ERRAMANZIL, KHAIRATABAD, HYD.---D0079">REGENCY COLLEGE OF HOTEL MGMT   CATERING TECH, ERRAMANZIL, KHAIRATABAD, HYD.---D0079</option>
<option value="RESONANCE JUNIOR COLLEGE GUTTALA BEGUMPET---J5909">RESONANCE JUNIOR COLLEGE GUTTALA BEGUMPET---J5909</option>
<option value="RESONANCE JUNIOR COLLEGE HABSHIGUDA NACHARAM---J5532">RESONANCE JUNIOR COLLEGE HABSHIGUDA NACHARAM---J5532</option>
<option value="RESONANCE JUNIOR COLLEGE---J5856">RESONANCE JUNIOR COLLEGE---J5856</option>
<option value="RESONANCE JUNIOR COLLEGE---J5861">RESONANCE JUNIOR COLLEGE---J5861</option>
<option value="RESONANCE JUNIOR COLLEGE NEAR SHASHI HOSPITAL  SAIDABAD---J5207">RESONANCE JUNIOR COLLEGE NEAR SHASHI HOSPITAL  SAIDABAD---J5207</option>
<option value="RG KEDIA COLLEGE OF COMMERCE,ESAMIYABAZAR---D0582">RG KEDIA COLLEGE OF COMMERCE,ESAMIYABAZAR---D0582</option>
<option value="R.G KEDIA COLLEGE OF COMMERCE,OCHADARGHAT---P3054">R.G KEDIA COLLEGE OF COMMERCE,OCHADARGHAT---P3054</option>
<option value="RGR SIDDHANTHI COLLEGE OF BUSINESS MANG.OPP.TIVOLI GARDENS,SECBAD.---P3154">RGR SIDDHANTHI COLLEGE OF BUSINESS MANG.OPP.TIVOLI GARDENS,SECBAD.---P3154</option>
<option value="R.G.R SIDDHANTHI COLLEGE OF EDUCATION,TIVOLI GARDENS.---D5829">R.G.R SIDDHANTHI COLLEGE OF EDUCATION,TIVOLI GARDENS.---D5829</option>
<option value="RIDDHI INDUSTRIAL TRAINING CENTER,PEERZADIGUDA---T3375">RIDDHI INDUSTRIAL TRAINING CENTER,PEERZADIGUDA---T3375</option>
<option value="RISHI DEGREE COLLEGE,HIMAYATHNAGAR---D0588">RISHI DEGREE COLLEGE,HIMAYATHNAGAR---D0588</option>
<option value="RISHI JUNIOR COLLEGE, GHATKESAR---J5693">RISHI JUNIOR COLLEGE, GHATKESAR---J5693</option>
<option value="RODA MISTRY COLL OF SOC WORK  RES,GACHIBOWLI---D0090">RODA MISTRY COLL OF SOC WORK  RES,GACHIBOWLI---D0090</option>
<option value="ROOTS COLLEGE OF DESIGN, FILM  MEDIA,JUBLEE HILLS,HYD---D6185">ROOTS COLLEGE OF DESIGN, FILM  MEDIA,JUBLEE HILLS,HYD---D6185</option>
<option value="ROOTS DEGREE COLLEGE,RAJBHAVAN RD.,SOMAJIGUDA.---D5954">ROOTS DEGREE COLLEGE,RAJBHAVAN RD.,SOMAJIGUDA.---D5954</option>
<option value="ROYAL DEGREE COLLEGE,CHINTAL---D5693">ROYAL DEGREE COLLEGE,CHINTAL---D5693</option>
<option value="ROYAL EMBASSY JR COLLEGE FOR GIRLS, I.S.SADAN.---J5316">ROYAL EMBASSY JR COLLEGE FOR GIRLS, I.S.SADAN.---J5316</option>
<option value="ROYAL ITC NACHARAM,MALLAPUR---T3171">ROYAL ITC NACHARAM,MALLAPUR---T3171</option>
<option value="ROYAL JR COLLEGE,SR NAGAR---J4983">ROYAL JR COLLEGE,SR NAGAR---J4983</option>
<option value="ROYAL JUNIOR COLLEGE, RETHIBOWLI, MEHDIPATNAM---J5315">ROYAL JUNIOR COLLEGE, RETHIBOWLI, MEHDIPATNAM---J5315</option>
<option value="ROYAL VOC JR COLLEGE,BAHADURPURA---J5392">ROYAL VOC JR COLLEGE,BAHADURPURA---J5392</option>
<option value="RUKMINI COLLEGE OF MANAGEMENT  COMMERCE, AMEERPET---D5971">RUKMINI COLLEGE OF MANAGEMENT  COMMERCE, AMEERPET---D5971</option>
<option value="RV INSTITUTE OF PARAMEDICAL SCIENCES COL. BODUPPAL---SP209">RV INSTITUTE OF PARAMEDICAL SCIENCES COL. BODUPPAL---SP209</option>
<option value="RVM TNST.OF MEDICAL SCIENCES  RESEARCH CENTER LAXMAKKAPALLY, MULUGU---D6193">RVM TNST.OF MEDICAL SCIENCES  RESEARCH CENTER LAXMAKKAPALLY, MULUGU---D6193</option>

<option value="SAANVI DEGREE COLLEG FOR WOMEN,VINAY NAGAR COLONY,SANTHOSHNAGAR---D6004">SAANVI DEGREE COLLEG FOR WOMEN,VINAY NAGAR COLONY,SANTHOSHNAGAR---D6004</option>
<option value="SAANVI JUNIOR COLLEGE FOR GIRLS---J5810">SAANVI JUNIOR COLLEGE FOR GIRLS---J5810</option>
<option value="SADHANA PARA MEDICAL COLLEGE, RAMNAGAR X ROADS---SP141">SADHANA PARA MEDICAL COLLEGE, RAMNAGAR X ROADS---SP141</option>
<option value="SADHANA VOC. JR.COLLEGE,. RAMNAGAR.---J4644">SADHANA VOC. JR.COLLEGE,. RAMNAGAR.---J4644</option>
<option value="SAI CHAITANYA DEG COL,KOMPALLY---D5696">SAI CHAITANYA DEG COL,KOMPALLY---D5696</option>
<option value="SAI CHAITANYA JR COLLEGE,TKRS IKON HOSPITAL LANE,DILSUKHNAGAR---J5695">SAI CHAITANYA JR COLLEGE,TKRS IKON HOSPITAL LANE,DILSUKHNAGAR---J5695</option>
<option value="SAI CHAITANYA JR. COLL NCL CLY.---J5234">SAI CHAITANYA JR. COLL NCL CLY.---J5234</option>
<option value="SAI GAYATRI JR COLLEGE,KHARMANGHAT---J5679">SAI GAYATRI JR COLLEGE,KHARMANGHAT---J5679</option>
<option value="SAIKRUPA ITC. SRIPURAM COLONY,MALAKPET---T3096">SAIKRUPA ITC. SRIPURAM COLONY,MALAKPET---T3096</option>
<option value="SAI SANJEEVINI SCHOOL OF NURSING---D6176">SAI SANJEEVINI SCHOOL OF NURSING---D6176</option>
<option value="SAI SUDHIR DEGREE  PG COLLEGE, ECILX ROADS, HYDERABD---D0594">SAI SUDHIR DEGREE  PG COLLEGE, ECILX ROADS, HYDERABD---D0594</option>
<option value="SAI SUDHIR JUNIOR COLLEGE, ECIL X RD HYD---J5388">SAI SUDHIR JUNIOR COLLEGE, ECIL X RD HYD---J5388</option>
<option value="SAI SUDHIR PG COLLEGE,ECIL X RDS---P0047">SAI SUDHIR PG COLLEGE,ECIL X RDS---P0047</option>
<option value="SAI TEJA DEGREE COLLEGE,KOMPALLY---D5923">SAI TEJA DEGREE COLLEGE,KOMPALLY---D5923</option>
<option value="SAI TEJA JR COLLEGE, KOMPALLY.---J5581">SAI TEJA JR COLLEGE, KOMPALLY.---J5581</option>
<option value="SAI TEJA JR.COLLEGE,TUMKUNTA.---J5398">SAI TEJA JR.COLLEGE,TUMKUNTA.---J5398</option>
<option value="SAKETA DEGREE COLLEGE, GADDIANNARAM, DSNR---D5993">SAKETA DEGREE COLLEGE, GADDIANNARAM, DSNR---D5993</option>
<option value="SAKETA JUNIOR COLLEGE, GADDIANNARAM,DSNR---J3308">SAKETA JUNIOR COLLEGE, GADDIANNARAM,DSNR---J3308</option>
<option value="SAMSKRUTHI INST OF BUSINESS MGMT, MANNEGUDA X ROADS,TURKAYAMZAL(V)---P3259">SAMSKRUTHI INST OF BUSINESS MGMT, MANNEGUDA X ROADS,TURKAYAMZAL(V)---P3259</option>
<option value="SAMSKRUTI COLLEGE OF PHARMACY,KONDAPUR,GHATKESAR.---D5771">SAMSKRUTI COLLEGE OF PHARMACY,KONDAPUR,GHATKESAR.---D5771</option>
<option value="SAMSKRUTI COL. OF ENG. AND TECH KONDAPUR---T3227">SAMSKRUTI COL. OF ENG. AND TECH KONDAPUR---T3227</option>
<option value="SANGHAMITHRA DEGREE COLLEGE---D6151">SANGHAMITHRA DEGREE COLLEGE---D6151</option>
<option value="SANKALP JUNIOR KALASALA, ALMASGUDA---J5873">SANKALP JUNIOR KALASALA, ALMASGUDA---J5873</option>
<option value="SANSKRITI DEGREE COLLEGE, KONDAPUR---D6209">SANSKRITI DEGREE COLLEGE, KONDAPUR---D6209</option>
<option value="SARADA PRIVATE ITI, BALAPUR, SAROORNAGAR(M)---T3080">SARADA PRIVATE ITI, BALAPUR, SAROORNAGAR(M)---T3080</option>
<option value="SARADA PRIVATE ITI, HAYATHNAGAR, RR DIST.---T3436">SARADA PRIVATE ITI, HAYATHNAGAR, RR DIST.---T3436</option>
<option value="SARATH JUNIOR COLLEGE, NEW NALLAKUNTA---J5409">SARATH JUNIOR COLLEGE, NEW NALLAKUNTA---J5409</option>
<option value="SARDAR PATEL DEGREE COLLEGE, PADMARAO NAGAR, SECBAD---D0597">SARDAR PATEL DEGREE COLLEGE, PADMARAO NAGAR, SECBAD---D0597</option>
<option value="SARDAR PATEL PG COLLEGE, PADMARAO NAGAR, SECBAD---P0126">SARDAR PATEL PG COLLEGE, PADMARAO NAGAR, SECBAD---P0126</option>
<option value="SAROJINI DEVI HOSPITAL, MP---SP081">SAROJINI DEVI HOSPITAL, MP---SP081</option>
<option value="SAROJINI NAIDU VANITA PHAR. MAH.VID, BATHAKAMMA KUNTA, TARNAKA,SEC-BAD.---D5605">SAROJINI NAIDU VANITA PHAR. MAH.VID, BATHAKAMMA KUNTA, TARNAKA,SEC-BAD.---D5605</option>
<option value="SATYA ITI, KEESARA(M) MDCL DIST---T3455">SATYA ITI, KEESARA(M) MDCL DIST---T3455</option>
<option value="SATYA SRI ITI,  SNEHAPURI X ROADS---T3099">SATYA SRI ITI,  SNEHAPURI X ROADS---T3099</option>
<option value="SBS DEGREE COLLEGE AMEERPET---D5916">SBS DEGREE COLLEGE AMEERPET---D5916</option>
<option value="SCHOOL OF INFORMATION TECHNOLOGY,JNTUH,KP,HYD---P3339">SCHOOL OF INFORMATION TECHNOLOGY,JNTUH,KP,HYD---P3339</option>
<option value="SCHOOL OF MANAGEMENT STUDIES,JNTUH,KP---P3340">SCHOOL OF MANAGEMENT STUDIES,JNTUH,KP---P3340</option>
<option value="SCHOOL OF NURSING GANDHI HOSPITAL,NEW BHOIGUDA,MUSHEERABAD.---SP135">SCHOOL OF NURSING GANDHI HOSPITAL,NEW BHOIGUDA,MUSHEERABAD.---SP135</option>
<option value="SCHOOL OF OPTOMETRY,SD HOSPITAL,MP---SP112">SCHOOL OF OPTOMETRY,SD HOSPITAL,MP---SP112</option>
<option value="SCHOOL OF PLANNING AND ARCHITECTURE (SPA) JNIAS, ROAD NO.12, BANJARAHILLS, HYD.---T3370">SCHOOL OF PLANNING AND ARCHITECTURE (SPA) JNIAS, ROAD NO.12, BANJARAHILLS, HYD.---T3370</option>
<option value="SCHOOL OF PLANNING  ARCH,JNAFAU, MASAB TANK---T3317">SCHOOL OF PLANNING  ARCH,JNAFAU, MASAB TANK---T3317</option>
<option value="SCIENT INST. OF PHARMACY,IBRAHIMPATNAM.---D5828">SCIENT INST. OF PHARMACY,IBRAHIMPATNAM.---D5828</option>
<option value="SCIENT INST.  OF TECHNOLOGY, IBP.---T3152">SCIENT INST.  OF TECHNOLOGY, IBP.---T3152</option>
<option value="SGM GOVT POLYTEC,ABDULLAPURMET---T3128">SGM GOVT POLYTEC,ABDULLAPURMET---T3128</option>
<option value="SHADAN COLLEGE OF B.SC (MLT) PEERANCHERU---D6128">SHADAN COLLEGE OF B.SC (MLT) PEERANCHERU---D6128</option>
<option value="SHADAN COLLEGE OF EDUCATION,KHAIRTABAD.---D0008">SHADAN COLLEGE OF EDUCATION,KHAIRTABAD.---D0008</option>
<option value="SHADAN COLL OF PHARMACY,PEERAMCHERU.---P3133">SHADAN COLL OF PHARMACY,PEERAMCHERU.---P3133</option>
<option value="SHADAN COL OF ENGG.,PEERANCHERU.---T3109">SHADAN COL OF ENGG.,PEERANCHERU.---T3109</option>
<option value="SHADAN COL.OF NURSING,PEERAMCHERU, HIMAYATHSAGAR---D5753">SHADAN COL.OF NURSING,PEERAMCHERU, HIMAYATHSAGAR---D5753</option>
<option value="SHADAN DEGREE COLL FOR BOYS,KHAIRATABAD.---D0600">SHADAN DEGREE COLL FOR BOYS,KHAIRATABAD.---D0600</option>
<option value="SHADAN INSTITUTE OF MANAGEMENT STUDIES,KHAIRTHABAD.---D6110">SHADAN INSTITUTE OF MANAGEMENT STUDIES,KHAIRTHABAD.---D6110</option>
<option value="SHADAN INSTITUTION OF MEDICAL SCIENCE,HIMAYATH SAGAR.---T3213">SHADAN INSTITUTION OF MEDICAL SCIENCE,HIMAYATH SAGAR.---T3213</option>
<option value="SHADAN INST OF COMPUTER STUDIES FOR BOYS, KHAIRATABAD---P3331">SHADAN INST OF COMPUTER STUDIES FOR BOYS, KHAIRATABAD---P3331</option>
<option value="SHADAN INST OF MSTHRC, COLLEGE OF PHYSIOTHERAPY, PEERANCHERU, RR DIST.---D6116">SHADAN INST OF MSTHRC, COLLEGE OF PHYSIOTHERAPY, PEERANCHERU, RR DIST.---D6116</option>
<option value="SHADAN JR COLLEGE,KHAIRATABAD---J4621">SHADAN JR COLLEGE,KHAIRATABAD---J4621</option>
<option value="SHADAN SCHOOL OF NURSING, PEERANCHERU.---D6187">SHADAN SCHOOL OF NURSING, PEERANCHERU.---D6187</option>
<option value="SHAHEEN JR.COLLEGE, NEW MALAKPET.---J5857">SHAHEEN JR.COLLEGE, NEW MALAKPET.---J5857</option>
<option value="SHAHEEN JR.COLLEGE , SHA ALI BANDA.---J5858">SHAHEEN JR.COLLEGE , SHA ALI BANDA.---J5858</option>
<option value="SHAHEEN JR.COLLEGE, SHIVARAMPALLY.---J5859">SHAHEEN JR.COLLEGE, SHIVARAMPALLY.---J5859</option>
<option value="SHAHEEN JUNIOR COLLEGE---J5860">SHAHEEN JUNIOR COLLEGE---J5860</option>
<option value="SHANKARLAL DHANRAJ SIGNODIA COLLEGE OF ARTS,COMMERCE AND PG CENTER,CHARKAMAN---P0127">SHANKARLAL DHANRAJ SIGNODIA COLLEGE OF ARTS,COMMERCE AND PG CENTER,CHARKAMAN---P0127</option>
<option value="SHANTHI NIKETAN WOMENS COLLEGE, ERRAGADDA---D0603">SHANTHI NIKETAN WOMENS COLLEGE, ERRAGADDA---D0603</option>
<option value="SHARADA JUNIOR COLLEGE,UPPERBASTHI,NAMALAGUNDU,HYD.---J5618">SHARADA JUNIOR COLLEGE,UPPERBASTHI,NAMALAGUNDU,HYD.---J5618</option>
<option value="SHARADA VIDAYALAYA DEG. COLLEGE(W),SHAMSHEERGUNJ---D0604">SHARADA VIDAYALAYA DEG. COLLEGE(W),SHAMSHEERGUNJ---D0604</option>
<option value="SHIPS JR COLLEGE, GOKHALENAGAR, RAMANTHAPUR---J5500">SHIPS JR COLLEGE, GOKHALENAGAR, RAMANTHAPUR---J5500</option>
<option value="SHIVANUJA JUNIOR COLLEGE BHAHADURGUDA---J5791">SHIVANUJA JUNIOR COLLEGE BHAHADURGUDA---J5791</option>
<option value="SHRADDA JR COLLEGE, KEESARA---J5732">SHRADDA JR COLLEGE, KEESARA---J5732</option>
<option value="SHRADDHA VOC.JR.COLLEGE,NEAR 6NO.BUS STOP,SHIVAM RAOD.TILAK NGR---J5218">SHRADDHA VOC.JR.COLLEGE,NEAR 6NO.BUS STOP,SHIVAM RAOD.TILAK NGR---J5218</option>
<option value="SHREE UMA DEGREE AND PG COLLEGE, SARDAR PATEL NAGAR, HYDERNAGAR---D5925">SHREE UMA DEGREE AND PG COLLEGE, SARDAR PATEL NAGAR, HYDERNAGAR---D5925</option>
<option value="SHRI SHAKTHI COLL OF HOTEL MANSAGEMENT,BEGUMPET.---SP029">SHRI SHAKTHI COLL OF HOTEL MANSAGEMENT,BEGUMPET.---SP029</option>
<option value="SHRI.V.D.BAJAJ DEGREE COL. FOR WOMEN, CHANDANAGAR---D5902">SHRI.V.D.BAJAJ DEGREE COL. FOR WOMEN, CHANDANAGAR---D5902</option>
<option value="SIDDARTHA DEG AND PG COLLEGE, VANASTHALIPURAM---P3104">SIDDARTHA DEG AND PG COLLEGE, VANASTHALIPURAM---P3104</option>
<option value="SIDDHARTHA COL.OF PHYSICAL EDUCATION,VINOBHA NAGAR---D6081">SIDDHARTHA COL.OF PHYSICAL EDUCATION,VINOBHA NAGAR---D6081</option>
<option value="SIDDHARTHA DEG COLLEGE FOR WOMEN,DSNR---D5612">SIDDHARTHA DEG COLLEGE FOR WOMEN,DSNR---D5612</option>
<option value="SIDDHARTHA DEG COLLEGE,GADDIANNARAM,DSNR.---D5688">SIDDHARTHA DEG COLLEGE,GADDIANNARAM,DSNR.---D5688</option>
<option value="SIDDHARTHA DEGREE AND PG COLLEGE,KUKATPALLY---D5966">SIDDHARTHA DEGREE AND PG COLLEGE,KUKATPALLY---D5966</option>
<option value="SIDDHARTHA DEGREE AND PG COLLEGE,KUKATPALLY---P3319">SIDDHARTHA DEGREE AND PG COLLEGE,KUKATPALLY---P3319</option>
<option value="SIDDHARTHA DEGREE COLLEGE,MOINABAD.---D6042">SIDDHARTHA DEGREE COLLEGE,MOINABAD.---D6042</option>
<option value="SIDDHARTHA DEGREE COLLEGE, NAGARJUNA NAGAR, AMEERPET---D5930">SIDDHARTHA DEGREE COLLEGE, NAGARJUNA NAGAR, AMEERPET---D5930</option>
<option value="SIDDHARTHA INST. OF COMPUTER SCIENCES,VINOBHANAGAR.---P3181">SIDDHARTHA INST. OF COMPUTER SCIENCES,VINOBHANAGAR.---P3181</option>
<option value="SIDDHARTHA INST.OF TECH AND SCI,KORREMULA---T3266">SIDDHARTHA INST.OF TECH AND SCI,KORREMULA---T3266</option>
<option value="SIDDHARTHA JR COLLEGE, DSNR---J3394">SIDDHARTHA JR COLLEGE, DSNR---J3394</option>
<option value="SIDDHARTHA JUNIOR COLLEGE,MOINABAD.---J5527">SIDDHARTHA JUNIOR COLLEGE,MOINABAD.---J5527</option>
<option value="SIDDHARTHA PRIVATE ITI,CHOWDARIGUDA---T3440">SIDDHARTHA PRIVATE ITI,CHOWDARIGUDA---T3440</option>
<option value="SIDDHARTHA WOMENS DEG COLLEGE, GADDIANNARAM,DSNR---D5670">SIDDHARTHA WOMENS DEG COLLEGE, GADDIANNARAM,DSNR---D5670</option>
<option value="SIDHARTHA INST.OF ENG.  TECH,VINOBHANAGAR,IBP---T3276">SIDHARTHA INST.OF ENG.  TECH,VINOBHANAGAR,IBP---T3276</option>
<option value="SIDHARTHA INST,OF PHARMACY,KORREMULA.---T3424">SIDHARTHA INST,OF PHARMACY,KORREMULA.---T3424</option>
<option value="SIGMA PRIVATE ITI, ISNAPUR.---T3421">SIGMA PRIVATE ITI, ISNAPUR.---T3421</option>
<option value="SINDHU DEG COLLEGE FOR WOMEN,RETHIBOWLI,MEHDIPATNAM---D5722">SINDHU DEG COLLEGE FOR WOMEN,RETHIBOWLI,MEHDIPATNAM---D5722</option>
<option value="SINDHU JR COLLEGE FOR GIRLS, RETHIBOWLI,MEHDIPATNAM---J5347">SINDHU JR COLLEGE FOR GIRLS, RETHIBOWLI,MEHDIPATNAM---J5347</option>
<option value="SIS VOC JR COLLEGE,NLG X RDS.---J5164">SIS VOC JR COLLEGE,NLG X RDS.---J5164</option>
<option value="SIVA SIVANI DEG COLLEGE,KOMPALLY---D5681">SIVA SIVANI DEG COLLEGE,KOMPALLY---D5681</option>
<option value="SIVA SIVANI INST MANAGEMENT, KOMPALY---SP034">SIVA SIVANI INST MANAGEMENT, KOMPALY---SP034</option>
<option value="SIVA SIVANI JR COLLEGE,KOMAPLLY.---J5707">SIVA SIVANI JR COLLEGE,KOMAPLLY.---J5707</option>
<option value="S M ALIS SHANTHI NIKETHAN JR,COL,SALARJUNG COLY.---J5488">S M ALIS SHANTHI NIKETHAN JR,COL,SALARJUNG COLY.---J5488</option>
<option value="SPACE JUNIOR COLLEGE---J5798">SPACE JUNIOR COLLEGE---J5798</option>
<option value="SPANDANA DEG COLLEGE,PANAMA GODOWNS,VANASTHLIPURAM---D5956">SPANDANA DEG COLLEGE,PANAMA GODOWNS,VANASTHLIPURAM---D5956</option>
<option value="SPECTRUM INSTITUTE OF MANAGEMENT AND COMPUTER SCIENCES---D6249">SPECTRUM INSTITUTE OF MANAGEMENT AND COMPUTER SCIENCES---D6249</option>
<option value="SPHOORTHY DEG AND PG COLLEGE,DSNR---D0399">SPHOORTHY DEG AND PG COLLEGE,DSNR---D0399</option>
<option value="SPHOORTHY ENGG COLLEGE,NADARGUL---T3200">SPHOORTHY ENGG COLLEGE,NADARGUL---T3200</option>
<option value="SPOORTHY DEGREE COLLEGE---D6112">SPOORTHY DEGREE COLLEGE---D6112</option>
<option value="SPOORTHY JR COLLEGE,MEDCHAL---J5625">SPOORTHY JR COLLEGE,MEDCHAL---J5625</option>
<option value="SPR DEGREE COLLEGE, SHAMEERPET---D6063">SPR DEGREE COLLEGE, SHAMEERPET---D6063</option>
<option value="SPR JR.COLLEGE,SHAMEERPET.---J5443">SPR JR.COLLEGE,SHAMEERPET.---J5443</option>
<option value="S R COLLEGE DR A S RAO NAGAR---J5612">S R COLLEGE DR A S RAO NAGAR---J5612</option>
<option value="SREE DATTA GROUP OF INSTITUTIONS,SHERIGUDA.---D6132">SREE DATTA GROUP OF INSTITUTIONS,SHERIGUDA.---D6132</option>
<option value="SREE DATTHA INST OF ENG AND SCI , SHERIGUDA---T3208">SREE DATTHA INST OF ENG AND SCI , SHERIGUDA---T3208</option>
<option value="SREE DATTHA INST OF PHARMACY, SHERIGUDA---D5841">SREE DATTHA INST OF PHARMACY, SHERIGUDA---D5841</option>
<option value="SREE GAYATHRI DEG.COLLEGE,IBRAHIMPATNAM.PM---D5663">SREE GAYATHRI DEG.COLLEGE,IBRAHIMPATNAM.PM---D5663</option>
<option value="SREENIDHI INST OF SCI AND TECH,YAMNAMPET---T3094">SREENIDHI INST OF SCI AND TECH,YAMNAMPET---T3094</option>
<option value="SREENIDHI UNIVERSITY SCHOOL OF ENGINEERING  TECH---T3480">SREENIDHI UNIVERSITY SCHOOL OF ENGINEERING  TECH---T3480</option>
<option value="SREENIVASA PARA MEDICAL COLLEGE, SRI SAI COLONY, CHINTAL---SP199">SREENIVASA PARA MEDICAL COLLEGE, SRI SAI COLONY, CHINTAL---SP199</option>
<option value="SREE RATNA COLLEGE OF PHYSIOTHERAPY,UPPAL---D5823">SREE RATNA COLLEGE OF PHYSIOTHERAPY,UPPAL---D5823</option>
<option value="SREE TAPASYA JR COLLEGE, DWARAKANAGAR COLONY,BANDLAGUDA.---J5812">SREE TAPASYA JR COLLEGE, DWARAKANAGAR COLONY,BANDLAGUDA.---J5812</option>
<option value="SREE USHODAYA JR.COLLEGE,SAHEBNAGAR.---J5826">SREE USHODAYA JR.COLLEGE,SAHEBNAGAR.---J5826</option>
<option value="SREE VANI GIRILS JR.COLLEGE MALAKPET---J4681">SREE VANI GIRILS JR.COLLEGE MALAKPET---J4681</option>
<option value="SREE VANI JUNIOR COLLEGE,MALAKPET,HYD.---J5597">SREE VANI JUNIOR COLLEGE,MALAKPET,HYD.---J5597</option>
<option value="SREE VANI WOMEN PG COLLEGE,MALAKPET---P0200">SREE VANI WOMEN PG COLLEGE,MALAKPET---P0200</option>
<option value="SREE VANI WOMENS DEG COLL,MALAKPET---D0200">SREE VANI WOMENS DEG COLL,MALAKPET---D0200</option>
<option value="SREE VARDHAN JUNIOR COLLEGE, BALAJINAGAR, KUKATPALLY---J5430">SREE VARDHAN JUNIOR COLLEGE, BALAJINAGAR, KUKATPALLY---J5430</option>
<option value="SREE VENKATESHWARA DEGREE COLLEGE YMCA---D0531">SREE VENKATESHWARA DEGREE COLLEGE YMCA---D0531</option>
<option value="SREE VENKATESHWARA JR COLLEGE OF COMMERCE,CHAMPAPET---J5591">SREE VENKATESHWARA JR COLLEGE OF COMMERCE,CHAMPAPET---J5591</option>
<option value="SREE VENKATESWARA COMMERCE DEGREE COLLEGE, APAU COLONY, SAIDABAD---D5940">SREE VENKATESWARA COMMERCE DEGREE COLLEGE, APAU COLONY, SAIDABAD---D5940</option>
<option value="SREE VIGNAN JR COLLEGE,MADHURANAGAR---J5312">SREE VIGNAN JR COLLEGE,MADHURANAGAR---J5312</option>
<option value="SREYAS INST OF ENG. AND TECHNOLOGY, BANDLAGUDA, NAGOLE---T3339">SREYAS INST OF ENG. AND TECHNOLOGY, BANDLAGUDA, NAGOLE---T3339</option>
<option value="SRI AADARSH JR COLLEGE  ALWAL.---J5736">SRI AADARSH JR COLLEGE  ALWAL.---J5736</option>
<option value="SRI AADARSH JR.COLLEGE,CHIKKADPALLY---J5819">SRI AADARSH JR.COLLEGE,CHIKKADPALLY---J5819</option>
<option value="SRI AADARSH JR COLLEGE ,SEC.BAD---J5818">SRI AADARSH JR COLLEGE ,SEC.BAD---J5818</option>
<option value="SRI AADARSH JUNIOR COLLEGE KUKATPALLY---J5781">SRI AADARSH JUNIOR COLLEGE KUKATPALLY---J5781</option>
<option value="SRI AADYA JUNIOR COLLEGE---J5823">SRI AADYA JUNIOR COLLEGE---J5823</option>
<option value="SRI AAKASH JR.COLLEGE(58471),KESAVANAGAR,CHAMPAPET---J5764">SRI AAKASH JR.COLLEGE(58471),KESAVANAGAR,CHAMPAPET---J5764</option>
<option value="SRI AAKASH JUNIOR COLLEGE, NARAYANAGUDA.---J5588">SRI AAKASH JUNIOR COLLEGE, NARAYANAGUDA.---J5588</option>
<option value="SRI ABHIDA JUNIOR COLLEGE---J5906">SRI ABHIDA JUNIOR COLLEGE---J5906</option>
<option value="SRI ADARSH DEGREE COLLEGE ECIL X ROADS---D5732">SRI ADARSH DEGREE COLLEGE ECIL X ROADS---D5732</option>
<option value="SRI ADARSH JR COLLEGE,DACHA COMPLEX,  ECIL X RDS.---J5462">SRI ADARSH JR COLLEGE,DACHA COMPLEX,  ECIL X RDS.---J5462</option>
<option value="SRI ADARSH JR COLLEGE ,S.R.NAGAR---J5688">SRI ADARSH JR COLLEGE ,S.R.NAGAR---J5688</option>
<option value="SRI AKSHARA JR COLLEGE(60297),NAGARJUNANAGAR,YELLAREDDYGUDA---J5666">SRI AKSHARA JR COLLEGE(60297),NAGARJUNANAGAR,YELLAREDDYGUDA---J5666</option>
<option value="SRI AMOGHA JR.COLLEGE (CO-ED) S.R.NAGAR, HYD.---J5311">SRI AMOGHA JR.COLLEGE (CO-ED) S.R.NAGAR, HYD.---J5311</option>
<option value="SRI AUROBINDO ITI SAROORNAGAR---T3040">SRI AUROBINDO ITI SAROORNAGAR---T3040</option>
<option value="SRI  AUROBINDO JUNIOR COLLEGE,MP---J5343">SRI  AUROBINDO JUNIOR COLLEGE,MP---J5343</option>
<option value="SRI BALAJI DENTAL COLLEGE,YENKAPALLY---P3304">SRI BALAJI DENTAL COLLEGE,YENKAPALLY---P3304</option>
<option value="SRI BALAJI VENKATESWARA SWAMY JR.COLLEGE,KESAVAAM.JR.COLL---J6050">SRI BALAJI VENKATESWARA SWAMY JR.COLLEGE,KESAVAAM.JR.COLL---J6050</option>
<option value="SRI BHAGAWATHI ITI LINGOJIGUDA,SAROORNAGAR---T3041">SRI BHAGAWATHI ITI LINGOJIGUDA,SAROORNAGAR---T3041</option>
<option value="SRI CHAITANYA BHARATHI JR COL,CHANDANAGAR---J5223">SRI CHAITANYA BHARATHI JR COL,CHANDANAGAR---J5223</option>
<option value="SRI CHAITANYA CO-OP JR.KALASALA,S.R NAGAR.---J5138">SRI CHAITANYA CO-OP JR.KALASALA,S.R NAGAR.---J5138</option>
<option value="SRI CHAITANYA CO-OP JR KALASALA,S.R.NAGAR---J5515">SRI CHAITANYA CO-OP JR KALASALA,S.R.NAGAR---J5515</option>
<option value="SRI CHAITANYA CO-OP JR KALASALA,S.R.NAGAR---J5517">SRI CHAITANYA CO-OP JR KALASALA,S.R.NAGAR---J5517</option>
<option value="SRI CHAITANYA DEG COLLEGE, GHATKESAR---D5877">SRI CHAITANYA DEG COLLEGE, GHATKESAR---D5877</option>
<option value="SRI CHAITANYA JR COLLEGE CHANDANAGAR.---J5349">SRI CHAITANYA JR COLLEGE CHANDANAGAR.---J5349</option>
<option value="SRI CHAITANYA JR.COLLEGE,L.B.NAGAR.---J5851">SRI CHAITANYA JR.COLLEGE,L.B.NAGAR.---J5851</option>
<option value="SRI CHAITANYA JR COLLEGE NARAYANAGUDA---J4561">SRI CHAITANYA JR COLLEGE NARAYANAGUDA---J4561</option>
<option value="SRI CHAITANYA JR COLLEGE,NARAYANAGUDA---J5634">SRI CHAITANYA JR COLLEGE,NARAYANAGUDA---J5634</option>
<option value="SRI CHAITANYA JR COLLEGE,  SHIVA REDDY GUDA, GHATKESAR---J5354">SRI CHAITANYA JR COLLEGE,  SHIVA REDDY GUDA, GHATKESAR---J5354</option>
<option value="SRI CHAITANYA JR COLLEGE,TARNAKA---J5228">SRI CHAITANYA JR COLLEGE,TARNAKA---J5228</option>
<option value="SRI CHAITANYA JR.COLLEGE UPPARPALLY.---J5839">SRI CHAITANYA JR.COLLEGE UPPARPALLY.---J5839</option>
<option value="SRI CHAITANYA JR.KALASALA(152790,MADINAGUDA---J5763">SRI CHAITANYA JR.KALASALA 152790,MADINAGUDA---J5763</option>
<option value="SRI CHAITANYA JR.KALASALA,ATTAPUR---J5373">SRI CHAITANYA JR.KALASALA,ATTAPUR---J5373</option>
<option value="SRI CHAITANYA JR KALASALA, AZIZ BAGH, DD COLONY---J5633">SRI CHAITANYA JR KALASALA, AZIZ BAGH, DD COLONY---J5633</option>
<option value="SRI CHAITANYA JR KALASALA, BALAJI NAGAR, KUKATPALLY---J5459">SRI CHAITANYA JR KALASALA, BALAJI NAGAR, KUKATPALLY---J5459</option>
<option value="SRI CHAITANYA JR KALASALA (CC.27038)NARAYANGUDA---J5471">SRI CHAITANYA JR KALASALA (CC.27038)NARAYANGUDA---J5471</option>
<option value="SRI CHAITANYA JR.KALASALA,DILSHUKNAGAR---J5413">SRI CHAITANYA JR.KALASALA,DILSHUKNAGAR---J5413</option>
<option value="SRI CHAITANYA JR KALASALA ECIL---J6077">SRI CHAITANYA JR KALASALA ECIL---J6077</option>
<option value="SRI CHAITANYA JR KALASALA,ENGINEERS COLONY,YOUSUFGUDA---J4795">SRI CHAITANYA JR KALASALA,ENGINEERS COLONY,YOUSUFGUDA---J4795</option>
<option value="SRI CHAITANYA JR.KALASALA,HABSIGUDA---J5402">SRI CHAITANYA JR.KALASALA,HABSIGUDA---J5402</option>
<option value="SRI CHAITANYA JR KALASALA, HANUMANNAGAR, DSNR---J5412">SRI CHAITANYA JR KALASALA, HANUMANNAGAR, DSNR---J5412</option>
<option value="SRI CHAITANYA JR. KALASALA, HIMAYATHNAGAR X RDS---J5553">SRI CHAITANYA JR. KALASALA, HIMAYATHNAGAR X RDS---J5553</option>
<option value="SRI CHAITANYA JR KALASALA, KPHB COLONY---J5455">SRI CHAITANYA JR KALASALA, KPHB COLONY---J5455</option>
<option value="SRI CHAITANYA JR KALASALA MADHAVI NAGAR, ALWAL---J5419">SRI CHAITANYA JR KALASALA MADHAVI NAGAR, ALWAL---J5419</option>
<option value="SRI CHAITANYA JR.KALASALA,MADINAGUDA---J5765">SRI CHAITANYA JR.KALASALA,MADINAGUDA---J5765</option>
<option value="SRI CHAITANYA JR KALASALA, MANIKONDA---J5439">SRI CHAITANYA JR KALASALA, MANIKONDA---J5439</option>
<option value="SRI CHAITANYA JR KALASALA, NAVEEN COMPLEX, KUKATPALLY---J5456">SRI CHAITANYA JR KALASALA, NAVEEN COMPLEX, KUKATPALLY---J5456</option>
<option value="SRI CHAITANYA JR KALASALA, OPP: IDPL COLONY---J5453">SRI CHAITANYA JR KALASALA, OPP: IDPL COLONY---J5453</option>
<option value="SRI CHAITANYA JR KALASALA RK TOWERS NARAYANGUDA---J5472">SRI CHAITANYA JR KALASALA RK TOWERS NARAYANGUDA---J5472</option>
<option value="SRI CHAITANYA JR KALASALA, SAI VIKRAM TOWERS, BALAJI NAGAR, KUKATPALLY---J5458">SRI CHAITANYA JR KALASALA, SAI VIKRAM TOWERS, BALAJI NAGAR, KUKATPALLY---J5458</option>
<option value="SRI CHAITANYA JR.KALASALA,SHANTHI NAGAR CLY.---J5864">SRI CHAITANYA JR.KALASALA,SHANTHI NAGAR CLY.---J5864</option>
<option value="SRI CHAITANYA JR KALASALA SHIVARAMAKRISHNA COLONY,W. MARREDPALLY.---J5327">SRI CHAITANYA JR KALASALA SHIVARAMAKRISHNA COLONY,W. MARREDPALLY.---J5327</option>
<option value="SRI CHAITANYA JR KALASALA SRINIVASA COMPLEX, KUKATPALLY---J6030">SRI CHAITANYA JR KALASALA SRINIVASA COMPLEX, KUKATPALLY---J6030</option>
<option value="SRI CHAITANYA JR KALASALA,S.R.NAGAR---J5516">SRI CHAITANYA JR KALASALA,S.R.NAGAR---J5516</option>
<option value="SRI CHAITANYA JR KALASALA,VINAY NGR.IS SADAN,---J5322">SRI CHAITANYA JR KALASALA,VINAY NGR.IS SADAN,---J5322</option>
<option value="SRI CHAITANYA JR KALASALA, VIVEK NAGAR, KUKATPALLY---J5457">SRI CHAITANYA JR KALASALA, VIVEK NAGAR, KUKATPALLY---J5457</option>
<option value="SRI CHAITANYA JUNIOR KALASALA BAGH AMBERPET HYD---J5908">SRI CHAITANYA JUNIOR KALASALA BAGH AMBERPET HYD---J5908</option>
<option value="SRI CHAITANYA JUNIOR KALASALA---J 5559">SRI CHAITANYA JUNIOR KALASALA---J 5559</option>
<option value="SRI CHAITANYA JUNIOR KALASALA---J5878">SRI CHAITANYA JUNIOR KALASALA---J5878</option>
<option value="SRI CHAITANYA JUNIOR KALASALA KUKATPALLY---J5894">SRI CHAITANYA JUNIOR KALASALA KUKATPALLY---J5894</option>
<option value="SRI CHAITANYA JUNIOR KALASALA  NIZAMPET ROAD HYDERNAGAR---J5911">SRI CHAITANYA JUNIOR KALASALA  NIZAMPET ROAD HYDERNAGAR---J5911</option>
<option value="SRI CHAITANYA JUNIOR KALASHALA, KUKATPALLY---J5805">SRI CHAITANYA JUNIOR KALASHALA, KUKATPALLY---J5805</option>
<option value="SRI CHAITANYA PANINEEYA MAHAVIDYALAYA JR.COLLEGE,GADDIANNARAM.---J5850">SRI CHAITANYA PANINEEYA MAHAVIDYALAYA JR.COLLEGE,GADDIANNARAM.---J5850</option>
<option value="SRI CHAITANYA TECHNICAL CAMPUS, SHERIGUDA---T3288">SRI CHAITANYA TECHNICAL CAMPUS, SHERIGUDA---T3288</option>
<option value="SRI CHAITANYA TECHNICAL CAMPUS SHERIGUDA---T3404">SRI CHAITANYA TECHNICAL CAMPUS SHERIGUDA---T3404</option>
<option value="SRI CHAITANYA VOC.JR KALASALA,TOLICHOWKI, HYD---J5660">SRI CHAITANYA VOC.JR KALASALA,TOLICHOWKI, HYD---J5660</option>
<option value="SRI CHAITHANYA JR KALASALA,KAMALANAGAR,CHAITANYAPURI.---J5561">SRI CHAITHANYA JR KALASALA,KAMALANAGAR,CHAITANYAPURI.---J5561</option>
<option value="SRI CHAITHANYA JR KALASALA,KAMALANAGAR,ECIL---J5558">SRI CHAITHANYA JR KALASALA,KAMALANAGAR,ECIL---J5558</option>
<option value="SRI CHAITHANYA JR KALASALA,PRABHATNAGAR,CHAITANYAPURI.---J5562">SRI CHAITHANYA JR KALASALA,PRABHATNAGAR,CHAITANYAPURI.---J5562</option>
<option value="SRI CHAITHANYA JUNIOR KALASALA,PARADISE.---J5563">SRI CHAITHANYA JUNIOR KALASALA,PARADISE.---J5563</option>
<option value="SRI CHAKRA COLLEGE OF EDUCATION SHERIGUDA.---D5968">SRI CHAKRA COLLEGE OF EDUCATION SHERIGUDA.---D5968</option>
<option value="SRI CHANDRA DEGREE COLLEGE,KHILWATH,CHARMINAR---D6115">SRI CHANDRA DEGREE COLLEGE,KHILWATH,CHARMINAR---D6115</option>
<option value="SRI CHANDRA JUNIOR COLLEGE CHAMPAPET SRNR HYD---J5910">SRI CHANDRA JUNIOR COLLEGE CHAMPAPET SRNR HYD---J5910</option>
<option value="SRI CHANDRA JUNIOR COLLEGE,CHANDRAYANGUTTA---J5747">SRI CHANDRA JUNIOR COLLEGE,CHANDRAYANGUTTA---J5747</option>
<option value="SRI CHANDRA JUNIOR COLLEGE, KHILWATH,CHARMINAR---J5620">SRI CHANDRA JUNIOR COLLEGE, KHILWATH,CHARMINAR---J5620</option>
<option value="SRI GAYATHRI JUNIOR COLLEGE CHECK POST CHINTAL KUNTA HYD---J5875">SRI GAYATHRI JUNIOR COLLEGE CHECK POST CHINTAL KUNTA HYD---J5875</option>
<option value="SRI GITANJALI JR.COLLEGE, BANDLAGUDA.---J5742">SRI GITANJALI JR.COLLEGE, BANDLAGUDA.---J5742</option>
<option value="SRI GNANA CHAITANYA JR.COLLEGE, BAGH HAYATHNAGAR---J5604">SRI GNANA CHAITANYA JR.COLLEGE, BAGH HAYATHNAGAR---J5604</option>
<option value="SRI INDU CL OF EDUCATION,VANSTHLIPURAM---P3096">SRI INDU CL OF EDUCATION,VANSTHLIPURAM---P3096</option>
<option value="SRI INDU COLLEGE OF ENG AND TECH, SHERIGUDA---T3140">SRI INDU COLLEGE OF ENG AND TECH, SHERIGUDA---T3140</option>
<option value="SRI INDU INST.OF ENG.TECH,SHERIGUDA---T3237">SRI INDU INST.OF ENG.TECH,SHERIGUDA---T3237</option>
<option value="SRI INDU INST. OF MGMT,SHERIGUDA,IBPM---P3116">SRI INDU INST. OF MGMT,SHERIGUDA,IBPM---P3116</option>
<option value="SRI INDU INST OF PHARMACY,SHERIGUDA---P3136">SRI INDU INST OF PHARMACY,SHERIGUDA---P3136</option>
<option value="SRI INDU P.G. COLL VAIDEHINGR---P0840">SRI INDU P.G. COLL VAIDEHINGR---P0840</option>
<option value="SRI K.M.PANDU MEMORIAL GOVT.VOC.JR.COLEGE, QUTHBULLAPUR.---J5892">SRI K.M.PANDU MEMORIAL GOVT.VOC.JR.COLEGE, QUTHBULLAPUR.---J5892</option>
<option value="SRI KRISHNA DEVARAYA ITI,R.C.PURAM---T3057">SRI KRISHNA DEVARAYA ITI,R.C.PURAM---T3057</option>
<option value="SRI  LALITHA ITI, SAFILGUDA---T3064">SRI  LALITHA ITI, SAFILGUDA---T3064</option>
<option value="SRI LEPAKSHI JUNIOR COLLEGE, CHANDANAGAR---J5684">SRI LEPAKSHI JUNIOR COLLEGE, CHANDANAGAR---J5684</option>
<option value="SRI MATHA MEDICAL LAB INS---SP145">SRI MATHA MEDICAL LAB INS---SP145</option>
<option value="SRI MEDHA JUNIOR COLLEGE, ATTAPUR---J5702">SRI MEDHA JUNIOR COLLEGE, ATTAPUR---J5702</option>
<option value="SRI MEDHAVI JR COLLEGE, HASTINAPURAM---J5643">SRI MEDHAVI JR COLLEGE, HASTINAPURAM---J5643</option>
<option value="SRI MEDHAVI JUNIOR COLLEGE,KOUSALYA NAGAR,SAROORNAGAR.---J5555">SRI MEDHAVI JUNIOR COLLEGE,KOUSALYA NAGAR,SAROORNAGAR.---J5555</option>
<option value="SRI MEDHA V JR COLLEGE, ARUL COLONY, KAPRA---J5698">SRI MEDHA V JR COLLEGE, ARUL COLONY, KAPRA---J5698</option>
<option value="SRI MEDHA V JR COLLEGE,RETHIBOWLI.---J5670">SRI MEDHA V JR COLLEGE,RETHIBOWLI.---J5670</option>
<option value="SRI MEDHA V JUNIOR COLLEGE,HABSIGUDA---J5797">SRI MEDHA V JUNIOR COLLEGE,HABSIGUDA---J5797</option>
<option value="SRI NAGARJUNA JUNIOR COLLEGE---J5852">SRI NAGARJUNA JUNIOR COLLEGE---J5852</option>
<option value="SRI NARAYANA COLLEGE OF COMMERCE,MEDIPALLY.---J5848">SRI NARAYANA COLLEGE OF COMMERCE,MEDIPALLY.---J5848</option>
<option value="SRI  NARAYANA JR COLLEGE  R.B. NAGAR SHAMSHABAD---J5451">SRI  NARAYANA JR COLLEGE  R.B. NAGAR SHAMSHABAD---J5451</option>
<option value="SRI NRI JR COLLEGE,CHAITANYA NAGAR,BN REDDY NAGAR.---J5655">SRI NRI JR COLLEGE,CHAITANYA NAGAR,BN REDDY NAGAR.---J5655</option>
<option value="S R INTERNATIONAL INSTITUTE OF TECH.,RAMPALLY DAYARA,KEESARA.---T3361">S R INTERNATIONAL INSTITUTE OF TECH.,RAMPALLY DAYARA,KEESARA.---T3361</option>
<option value="SRI RAAMA JUNIOR COLLEGE GUDIMALKAPUR---J5737">SRI RAAMA JUNIOR COLLEGE GUDIMALKAPUR---J5737</option>
<option value="SRI RAMACHANDRA ITI,MOOSARABAGH.---T3124">SRI RAMACHANDRA ITI,MOOSARABAGH.---T3124</option>
<option value="SRI RAMCHANDRA ARTS  SCIENCE COLLEGE, TILAKNAGAR---P0129">SRI RAMCHANDRA ARTS  SCIENCE COLLEGE, TILAKNAGAR---P0129</option>
<option value="SRI RAM DEGREE COLLEGE, MARGADARSHI COLONY,KOTHPET---D5924">SRI RAM DEGREE COLLEGE, MARGADARSHI COLONY,KOTHPET---D5924</option>
<option value="SRI RAM JUNIOR COLLEGE SAROOR NAGAR---J5772">SRI RAM JUNIOR COLLEGE SAROOR NAGAR---J5772</option>
<option value="SRI SAI CHAITANYA JR COLLEGE,MARKET ST.SEC---J5105">SRI SAI CHAITANYA JR COLLEGE,MARKET ST.SEC---J5105</option>
<option value="SRI SAI DEGREE AND PG COLL,DILSUKHNAGAR---P0050">SRI SAI DEGREE AND PG COLL,DILSUKHNAGAR---P0050</option>
<option value="SRI SAI DEGREE COLLEGE,DILSUKHNAGAR,HYD.---D0614">SRI SAI DEGREE COLLEGE,DILSUKHNAGAR,HYD.---D0614</option>
<option value="SRI SAI VIDYA VIKAS DEG.COLLEGE,SEETHAPHALMANDI.---D5788">SRI SAI VIDYA VIKAS DEG.COLLEGE,SEETHAPHALMANDI.---D5788</option>
<option value="SRI SAI VIDYA VIKAS JR COLLEGE---J5519">SRI SAI VIDYA VIKAS JR COLLEGE---J5519</option>
<option value="SRI SAI VIKAS DEGREE COLLEGE,MARUTHI NAGAR, SAROORNAGAR---D6056">SRI SAI VIKAS DEGREE COLLEGE,MARUTHI NAGAR, SAROORNAGAR---D6056</option>
<option value="SRI SAI VOCATIONAL JR. COLLEGE,GADDIANNARAM.---J5421">SRI SAI VOCATIONAL JR. COLLEGE,GADDIANNARAM.---J5421</option>
<option value="SRI SAI VOCATIONAL JUNIOR COLLEGE SHAMASHABAD---J5384">SRI SAI VOCATIONAL JUNIOR COLLEGE SHAMASHABAD---J5384</option>
<option value="SRI SHARADA VOC. JR COLLEGE,MAHESHWARAM.---J5632">SRI SHARADA VOC. JR COLLEGE,MAHESHWARAM.---J5632</option>
<option value="SRI SRINIVASA JR.COLLEGE,SANTOSHNAGAR---J4543">SRI SRINIVASA JR.COLLEGE,SANTOSHNAGAR---J4543</option>
<option value="SRI SRI VOC. JR COLLEGE,KPHB COLONY.---J5205">SRI SRI VOC. JR COLLEGE,KPHB COLONY.---J5205</option>
<option value="SRI SURYA JUNIOR COLLEGE, OM PLAZA, SR NAGAR---J5766">SRI SURYA JUNIOR COLLEGE, OM PLAZA, SR NAGAR---J5766</option>
<option value="SRI VAGDEVI JR.COLLEGE,BALAPUR X ROAD.---J5855">SRI VAGDEVI JR.COLLEGE,BALAPUR X ROAD.---J5855</option>
<option value="SRI VAISHNAVI JR COLLEGE, NAGARAM---J5186">SRI VAISHNAVI JR COLLEGE, NAGARAM---J5186</option>
<option value="SRI VAISHNAVI JUNIOR COLLEGE, KATEDAN.---J5811">SRI VAISHNAVI JUNIOR COLLEGE, KATEDAN.---J5811</option>
<option value="SRI VASISHTA JR.COLLEGE,MATHRUSRI NAGAR COL,SERLINGAMPALLY.---J5886">SRI VASISHTA JR.COLLEGE,MATHRUSRI NAGAR COL,SERLINGAMPALLY.---J5886</option>
<option value="SRI VASISTHA JR COLLEGE, VANASTALIHILLS---J5678">SRI VASISTHA JR COLLEGE, VANASTALIHILLS---J5678</option>
<option value="SRI VASISTHA JUNIOR COLLEGE,MOOSARAMBAGH,SVNAGAR---J5320">SRI VASISTHA JUNIOR COLLEGE,MOOSARAMBAGH,SVNAGAR---J5320</option>
<option value="SRI VATHSA DEGREE COLLEGE, CHAITANYAPURI X ROADS---D6212">SRI VATHSA DEGREE COLLEGE, CHAITANYAPURI X ROADS---D6212</option>
<option value="SRI VEDA JUNIOR COLLEGE, OPP BAWARCHI, UPPAL DEPOT---J5713">SRI VEDA JUNIOR COLLEGE, OPP BAWARCHI, UPPAL DEPOT---J5713</option>
<option value="SRI VENKATESHWARA COLL OF ARCHITECTURE,MADAPUR---T3159">SRI VENKATESHWARA COLL OF ARCHITECTURE,MADAPUR---T3159</option>
<option value="SRI VENKATESHWARA COLL OF PHARMACY,HI TECH CITY RD,MADAPUR.---T3158">SRI VENKATESHWARA COLL OF PHARMACY,HI TECH CITY RD,MADAPUR.---T3158</option>
<option value="SRI VENKATESHWARA DEGREE COLLEGE OF COMMERCE, KARMANGHAT X ROADS---D6087">SRI VENKATESHWARA DEGREE COLLEGE OF COMMERCE, KARMANGHAT X ROADS---D6087</option>
<option value="SRI VENKATESHWARA ITC LB NAGAR.---T3225">SRI VENKATESHWARA ITC LB NAGAR.---T3225</option>
<option value="SRI VENKATESWARA JR COLLEGE TIRUMALLAGIRI HILLS GADIANARAM---J5498">SRI VENKATESWARA JR COLLEGE TIRUMALLAGIRI HILLS GADIANARAM---J5498</option>
<option value="SRI VIDYA DEGREE COLLEGE CHINTAL QUTBULLAPUR---D6205">SRI VIDYA DEGREE COLLEGE CHINTAL QUTBULLAPUR---D6205</option>
<option value="SRI VIDYA JUNIOR COLLEGE(28144), V.PURAM---J3357">SRI VIDYA JUNIOR COLLEGE(28144), V.PURAM---J3357</option>
<option value="SRI VIDYA JUNIOR COLLEGE , CHINTAL---J5784">SRI VIDYA JUNIOR COLLEGE , CHINTAL---J5784</option>
<option value="SRI VIDYANJALI VOC. JR. COLLEGE, IBRAHIMPATNAM---J5549">SRI VIDYANJALI VOC. JR. COLLEGE, IBRAHIMPATNAM---J5549</option>
<option value="SRI VIGNAN DEG COLLEGE,SHAMSHABAD---D5784">SRI VIGNAN DEG COLLEGE,SHAMSHABAD---D5784</option>
<option value="SRI VIJAYA SAI ITI, GAYATHRINAGAR,DSNR.---T3073">SRI VIJAYA SAI ITI, GAYATHRINAGAR,DSNR.---T3073</option>
<option value="SRI VIVEKANANDA JR COLLEGE, SRINIVASANAGAR COLONY, GHATKESAR---J5813">SRI VIVEKANANDA JR COLLEGE, SRINIVASANAGAR COLONY, GHATKESAR---J5813</option>
<option value="S.R. JR.COLLEGE LAXMI NAGAR.---J5751">S.R. JR.COLLEGE LAXMI NAGAR.---J5751</option>
<option value="S R JR COLLEGE, PEERZADIGUDA.---J5214">S R JR COLLEGE, PEERZADIGUDA.---J5214</option>
<option value="S R  JR COLLEGE, VIKRAMPURI,HABSIGUDA---J5574">S R  JR COLLEGE, VIKRAMPURI,HABSIGUDA---J5574</option>
<option value="SR JUNIOR COLLEG, CHEERYAL, KEESARA(M), MEDCHAL DIST---J5783">SR JUNIOR COLLEG, CHEERYAL, KEESARA(M), MEDCHAL DIST---J5783</option>
<option value="SR JUNIOR COLLEGE BHAGYANAGAR COOPERATIVVE HOUSING SOCIETY KUKATPALLY MEDCHAL DIST---J5828">SR JUNIOR COLLEGE BHAGYANAGAR COOPERATIVVE HOUSING SOCIETY KUKATPALLY MEDCHAL DIST---J5828</option>
<option value="S R JUNIOR COLLEGE(BIE-22118) SR.NAGAR,HYD.---J5356">S R JUNIOR COLLEGE(BIE-22118) SR.NAGAR,HYD.---J5356</option>
<option value="S.R.JUNIOR COLLEGE CHANDANAGAR SERLINGAMPALLY MEDCHAL DIST---J5480">S.R.JUNIOR COLLEGE CHANDANAGAR SERLINGAMPALLY MEDCHAL DIST---J5480</option>
<option value="SR JUNIOR COLLEGE CHINTAL, QUTHBULLAPUR(VM), MDCL---J5530">SR JUNIOR COLLEGE CHINTAL, QUTHBULLAPUR(VM), MDCL---J5530</option>
<option value="S R JUNIOR COLLEGE ,GUDIMALKAPUR, MEHDIPATNAM---J5576">S R JUNIOR COLLEGE ,GUDIMALKAPUR, MEHDIPATNAM---J5576</option>
<option value="SR JUNIOR COLLEGE---J5895">SR JUNIOR COLLEGE---J5895</option>
<option value="S R JUNIOR COLLEGE, MOYYANAGAR,DWARAKANAGAR,---J5582">S R JUNIOR COLLEGE, MOYYANAGAR,DWARAKANAGAR,---J5582</option>
<option value="S.R. JUNIOR COLLEGE,SAI NAGAR,HYDERNAGAR, HYD---J5478">S.R. JUNIOR COLLEGE,SAI NAGAR,HYDERNAGAR, HYD---J5478</option>
<option value="SR JUNIOR COLLEGE TUMMALAKUNTA CHAMPAPET.---J5583">SR JUNIOR COLLEGE TUMMALAKUNTA CHAMPAPET.---J5583</option>
<option value="S R JUNIOR COLLEGE,VIVEKNAGAR,KP---J5577">S R JUNIOR COLLEGE,VIVEKNAGAR,KP---J5577</option>
<option value="S.R.JUNIOR COLLEGE WEST MAREDPALLY---J5613">S.R.JUNIOR COLLEGE WEST MAREDPALLY---J5613</option>
<option value="S R JUNIOR JR COLLEGE,SRI NAGAR COLONY GADDIANNARAM RANGA REDDY---J5475">S R JUNIOR JR COLLEGE,SRI NAGAR COLONY GADDIANNARAM RANGA REDDY---J5475</option>
<option value="SRM COLLEGE OF EDUCATION, GURRAMGUDA.---D5934">SRM COLLEGE OF EDUCATION, GURRAMGUDA.---D5934</option>
<option value="SRM D.ED COLLEGE  GURRAMGUDA.---D5986">SRM D.ED COLLEGE  GURRAMGUDA.---D5986</option>
<option value="SRM DEGREE COLLEGE,SHAMSHABAD.---D6051">SRM DEGREE COLLEGE,SHAMSHABAD.---D6051</option>
<option value="S.S.J.COLL. OF PHARMACY VATTINAGULPALLY.---D5803">S.S.J.COLL. OF PHARMACY VATTINAGULPALLY.---D5803</option>
<option value="SSR ITI, AMEENPUR, PATANCHERU(M)---T3379">SSR ITI, AMEENPUR, PATANCHERU(M)---T3379</option>
<option value="ST ALPHONSA CL OF EDU,MADHURA NAGAR,HYD.---D5618">ST ALPHONSA CL OF EDU,MADHURA NAGAR,HYD.---D5618</option>
<option value="STANLEY COLLEGE OF ENGINEERING  TECHNOLOGY FOR WOMEN ABIDS---T3252">STANLEY COLLEGE OF ENGINEERING  TECHNOLOGY FOR WOMEN ABIDS---T3252</option>
<option value="ST ANNS COLLEGE FOR WOMEN, MP---D5843">ST ANNS COLLEGE FOR WOMEN, MP---D5843</option>
<option value="ST ANNS COLLEGE FOR WOMEN(PG CENTRE,AOUTO), MP---P0201">ST ANNS COLLEGE FOR WOMEN(PG CENTRE,AOUTO), MP---P0201</option>
<option value="ST ANNS DEGREE COLL FOR WOMEN,MALLAPUR.---D0624">ST ANNS DEGREE COLL FOR WOMEN,MALLAPUR.---D0624</option>
<option value="ST ANNS JR COLLEGE BOLARAM---J3314">ST ANNS JR COLLEGE BOLARAM---J3314</option>
<option value="ST ANNS JUNIOR COLLEGE FOR GIRLS,MEHDIPATNAM.---J4662">ST ANNS JUNIOR COLLEGE FOR GIRLS,MEHDIPATNAM.---J4662</option>
<option value="ST ANNS PG COLLEGE FOR WOMEN, MALLAPUR.---P3107">ST ANNS PG COLLEGE FOR WOMEN, MALLAPUR.---P3107</option>
<option value="ST.ANTHONY DEGREE COLLEGE,BALAPUR X RD.---D6182">ST.ANTHONY DEGREE COLLEGE,BALAPUR X RD.---D6182</option>
<option value="ST ANTHONYS ITI,   RC PURAM, MEDAK DIST.---T3167">ST ANTHONYS ITI,   RC PURAM, MEDAK DIST.---T3167</option>
<option value="ST ANTHONYS JR. COLLEGE, KOMPALLY,---J5375">ST ANTHONYS JR. COLLEGE, KOMPALLY,---J5375</option>
<option value="ST FRANCIS COLL FOR WOMEN BEGUMPET---D0091">ST FRANCIS COLL FOR WOMEN BEGUMPET---D0091</option>
<option value="ST FRANCIS JR.COLL FOR WOMEN,SECBAD---J5000">ST FRANCIS JR.COLL FOR WOMEN,SECBAD---J5000</option>
<option value="ST FRANCIS XAVIER DEG COLL,BARKATHPURA---D5658">ST FRANCIS XAVIER DEG COLL,BARKATHPURA---D5658</option>
<option value="ST FRANCIS XAVIER ITC  BALANAGAR---T3102">ST FRANCIS XAVIER ITC  BALANAGAR---T3102</option>
<option value="ST FRANSIS XAVIOUR JR COLLEGE, BARKATPURA---J4786">ST FRANSIS XAVIOUR JR COLLEGE, BARKATPURA---J4786</option>
<option value="ST GEORGES BOYS  JR COLLEGE,ABIDS.---J4666">ST GEORGES BOYS  JR COLLEGE,ABIDS.---J4666</option>
<option value="ST JOHNS CHURCH JR.COLLEGE,SECBAD---J5109">ST JOHNS CHURCH JR.COLLEGE,SECBAD---J5109</option>
<option value="ST JOHNS INST. SCI. AND TECH,TURKAYAMZAL---P0285">ST JOHNS INST. SCI. AND TECH,TURKAYAMZAL---P0285</option>
<option value="ST JOHNS PG COLLEGE AGAPE CENTRE,CHEGICHERLA---P3150">ST JOHNS PG COLLEGE AGAPE CENTRE,CHEGICHERLA---P3150</option>
<option value="ST JOSEPH DEG  PG COLLEGE,KING KOTI---D0629">ST JOSEPH DEG  PG COLLEGE,KING KOTI---D0629</option>
<option value="ST.JOSEPHS DEGREE COLLEGE FOR WOMEN---D6233">ST.JOSEPHS DEGREE COLLEGE FOR WOMEN---D6233</option>
<option value="ST JOSEPHS DEGREE COLLEGE,TOLICHOWKI---D5856">ST JOSEPHS DEGREE COLLEGE,TOLICHOWKI---D5856</option>
<option value="ST JOSEPHS DEGREE COLLEGE,UPPERPALLY, RJNR(M)---D6054">ST JOSEPHS DEGREE COLLEGE,UPPERPALLY, RJNR(M)---D6054</option>
<option value="ST.JOSEPHS JR.COLLEGE(22109),DELUXE COLONY,TOLICHOWKI---J5752">ST.JOSEPHS JR.COLLEGE(22109),DELUXE COLONY,TOLICHOWKI---J5752</option>
<option value="ST JOSEPHS JR.COLLEGE,TRIMULGHERRY.---J5114">ST JOSEPHS JR.COLLEGE,TRIMULGHERRY.---J5114</option>
<option value="ST JOSEPHS JUNIOR COLLEGE, UPPERPALLY, RJNR(M)---J5640">ST JOSEPHS JUNIOR COLLEGE, UPPERPALLY, RJNR(M)---J5640</option>
<option value="ST JOSEPHS PG COLL,KINGKOTI---P3047">ST JOSEPHS PG COLL,KINGKOTI---P3047</option>
<option value="ST MARKS JUNIOR COLLEGE---J5830">ST MARKS JUNIOR COLLEGE---J5830</option>
<option value="ST MARTINS ENGG COLLEGE, DHULAPALLY---T3177">ST MARTINS ENGG COLLEGE, DHULAPALLY---T3177</option>
<option value="ST MARTINS JR COLLEGE,MADHAVANAGAR,MIYAPUR---J5668">ST MARTINS JR COLLEGE,MADHAVANAGAR,MIYAPUR---J5668</option>
<option value="ST MARYS BETHANY COBVENT JR.COLLEGE FOR GIRLS,NAGARAM,KEESARA(M).---J5799">ST MARYS BETHANY COBVENT JR.COLLEGE FOR GIRLS,NAGARAM,KEESARA(M).---J5799</option>
<option value="ST.MARYS CENTENARY COLLEGE OF MANAGEMENT, ST.F STREET,SECUNDERABAD---P3348">ST.MARYS CENTENARY COLLEGE OF MANAGEMENT, ST.F STREET,SECUNDERABAD---P3348</option>
<option value="ST MARYS CENTENARY DEG COLLEGE,ST FRANCIS STREET SECBAD---D0630">ST MARYS CENTENARY DEG COLLEGE,ST FRANCIS STREET SECBAD---D0630</option>
<option value="ST MARYS CENTENARY DEG COLLEGE,ST FRANCIS STREET, SECBAD---D5609">ST MARYS CENTENARY DEG COLLEGE,ST FRANCIS STREET, SECBAD---D5609</option>
<option value="ST MARYS CENTENARY JR COLLEGE, ST FRANCIS STREET, SECBAD---J5091">ST MARYS CENTENARY JR COLLEGE, ST FRANCIS STREET, SECBAD---J5091</option>
<option value="ST MARYS COLLEGE OF PHARMACY,SEC.BAD---D5797">ST MARYS COLLEGE OF PHARMACY,SEC.BAD---D5797</option>

<option value="ST MARYS COLLEGE,YOUSUFGUDA---D5662">ST MARYS COLLEGE,YOUSUFGUDA---D5662</option>
<option value="ST MARYS COL OF EDUCATION,SECBAD---D5824">ST MARYS COL OF EDUCATION,SECBAD---D5824</option>
<option value="ST MARYS ENGG COLLEGE,DESHMUKHI---T3280">ST MARYS ENGG COLLEGE,DESHMUKHI---T3280</option>
<option value="ST MARYS ENGINEERING COLLEGE,NEAR RFC,DESHMUKHI---T3442">ST MARYS ENGINEERING COLLEGE,NEAR RFC,DESHMUKHI---T3442</option>
<option value="ST MARYS GROUP OF INSTITUTIONS,NEAR RFC,DESHMUKHI---P3221">ST MARYS GROUP OF INSTITUTIONS,NEAR RFC,DESHMUKHI---P3221</option>
<option value="ST MARYS INTEGRATED CAMPUS,NEAR RFC,DESHMUKHI---T3292">ST MARYS INTEGRATED CAMPUS,NEAR RFC,DESHMUKHI---T3292</option>
<option value="ST MARYS JR COLLEGE BASHEER BAGH---J4663">ST MARYS JR COLLEGE BASHEER BAGH---J4663</option>
<option value="ST MARYS JR COLLEGE JUBILEE HILLS,GUTTALABEGUMPET. HYD---J4615">ST MARYS JR COLLEGE JUBILEE HILLS,GUTTALABEGUMPET. HYD---J4615</option>
<option value="ST MARYS VIDYADHAYINI JUNIOR COLLEGE MASABTANK---J5897">ST MARYS VIDYADHAYINI JUNIOR COLLEGE MASABTANK---J5897</option>
<option value="ST PATRICKS DEGREE COLLEGE,NALLKUNTA---D0404">ST PATRICKS DEGREE COLLEGE,NALLKUNTA---D0404</option>
<option value="ST PATRICKS JR.COLL OU ROAD,NALLAKUNTA---J4887">ST PATRICKS JR.COLL OU ROAD,NALLAKUNTA---J4887</option>
<option value="ST PAULS COLLEGE OF PHARMACY,SY.NO.603,605,TURKAYAMJAL---D6106">ST PAULS COLLEGE OF PHARMACY,SY.NO.603,605,TURKAYAMJAL---D6106</option>
<option value="ST PAULS DEGREE COLLEGE, STREET NO 8, HIMAYATHNAGAR---D0288">ST PAULS DEGREE COLLEGE, STREET NO 8, HIMAYATHNAGAR---D0288</option>
<option value="ST PETERS ENGINEERING COLLEGE MAISAMMAGUDA,MEDCHAL---T3242">ST PETERS ENGINEERING COLLEGE MAISAMMAGUDA,MEDCHAL---T3242</option>
<option value="ST PIOUS X DEGREE COLLEGE FOR WOMEN,SNEHAPURI COLONY,NACHARAM---D0633">ST PIOUS X DEGREE COLLEGE FOR WOMEN,SNEHAPURI COLONY,NACHARAM---D0633</option>
<option value="ST PIOUS X DEGREE  PG COLLEGE FOR WOMEN,HMT NGR---P0101">ST PIOUS X DEGREE  PG COLLEGE FOR WOMEN,HMT NGR---P0101</option>
<option value="ST VINCENT PG COLLEGE,GHATKESAR---P3073">ST VINCENT PG COLLEGE,GHATKESAR---P3073</option>
<option value="ST XAVIER JUNIOR COLLEGE, ASIF NAGAR, MP---J5849">ST XAVIER JUNIOR COLLEGE, ASIF NAGAR, MP---J5849</option>
<option value="ST XAVIERS PG COLLEGE, GOPANPALLY.RR---P3077">ST XAVIERS PG COLLEGE, GOPANPALLY.RR---P3077</option>
<option value="SUCCESS DEGREE COLLEGE,SANTOSHNAGAR HYD..---D6066">SUCCESS DEGREE COLLEGE,SANTOSHNAGAR HYD..---D6066</option>
<option value="SUCCESS JR COLLEGE,SANTOSHNAGAR,HYD.---J5586">SUCCESS JR COLLEGE,SANTOSHNAGAR,HYD.---J5586</option>
<option value="SUCCESS JUNIOR COLLEGE,CHANDRAYANGUTTA---J4694">SUCCESS JUNIOR COLLEGE,CHANDRAYANGUTTA---J4694</option>
<option value="SULTAN UL ULOOM COLLEGE OF PHARMACY, RD NO 3, BANJARA HILLS---T3142">SULTAN UL ULOOM COLLEGE OF PHARMACY, RD NO 3, BANJARA HILLS---T3142</option>
<option value="SULTAN UL ULOOM JR COLLEGE,  RD NO 3,  BANJARAHILLS---J4972">SULTAN UL ULOOM JR COLLEGE,  RD NO 3,  BANJARAHILLS---J4972</option>
<option value="SULTAN-UL-ULOOM LAW COLLEGE,BANJARA HILLS.---D0021">SULTAN-UL-ULOOM LAW COLLEGE,BANJARA HILLS.---D0021</option>
<option value="SUMAN JR.COLLEGE FOR GIRLS, CHANDANAGAR.---J6078">SUMAN JR.COLLEGE FOR GIRLS, CHANDANAGAR.---J6078</option>
<option value="SUN DEGREE COLLEGE,RAMNAGAR.---D5733">SUN DEGREE COLLEGE,RAMNAGAR.---D5733</option>
<option value="SUN INSTITUTE OF HOTEL MANAGEMENT  CATERING TECHNOLOGY, RAMNAGAR---D5737">SUN INSTITUTE OF HOTEL MANAGEMENT  CATERING TECHNOLOGY, RAMNAGAR---D5737</option>
<option value="SUN PRIDE DEGREE COLLEGE---D5757">SUN PRIDE DEGREE COLLEGE---D5757</option>
<option value="SUN PRIDE INST.OF HOTEL MANG.CATERING TECH. MIYAPUR---D6175">SUN PRIDE INST.OF HOTEL MANG.CATERING TECH. MIYAPUR---D6175</option>
<option value="SUNSHINE DEGREE COLLEGE,CENTRAL EXCEISE COL SAIDABAD COL,HYD---D5685">SUNSHINE DEGREE COLLEGE,CENTRAL EXCEISE COL SAIDABAD COL,HYD---D5685</option>
<option value="SUPRABHATH INST FOR MGMT AND COMPUTER STUDIES, CHEERYAL, KEESARA(M)---P3110">SUPRABHATH INST FOR MGMT AND COMPUTER STUDIES, CHEERYAL, KEESARA(M)---P3110</option>
<option value="SUSRUTA INST OF PHYSICAL MEDICINE  REHABILITATION, OPP FRUIT MARKET,KOTHAPET---D5637">SUSRUTA INST OF PHYSICAL MEDICINE  REHABILITATION, OPP FRUIT MARKET,KOTHAPET---D5637</option>
<option value="SWAMI VIVEKANANDA INSTT OF TECH,MAHABOOB COLL.CAMPUS, SECBAD---T3203">SWAMI VIVEKANANDA INSTT OF TECH,MAHABOOB COLL.CAMPUS, SECBAD---T3203</option>
<option value="SWEEKAR ACADEMY OF REHABILITATION SCIENCES---D5774">SWEEKAR ACADEMY OF REHABILITATION SCIENCES---D5774</option>
<option value="SWEEKAR PG COLL,PICKET,SECBAD.---P3115">SWEEKAR PG COLL,PICKET,SECBAD.---P3115</option>
<option value="SYNERGY DEGREE COLLEGE, ALWAL X ROADS---D6069">SYNERGY DEGREE COLLEGE, ALWAL X ROADS---D6069</option>
<option value="SYO NARAYANA RAMCHANDRAN PATWARI PG COLL.COMMERCE.ESANIA BAZAR,---P0132">SYO NARAYANA RAMCHANDRAN PATWARI PG COLL.COMMERCE.ESANIA BAZAR,---P0132</option>


<option value="UK COLLEGE OF EDUCATION, GODUMAKUNTA---D5809">UK COLLEGE OF EDUCATION, GODUMAKUNTA---D5809</option>
<option value="UNI COLLEGE OF LAW, OU---P3052">UNI COLLEGE OF LAW, OU---P3052</option>
<option value="UNITES VOC JUNIOR COLLEGE, ABOVE SBI, AS RAO NAGAR---J5361">UNITES VOC JUNIOR COLLEGE, ABOVE SBI, AS RAO NAGAR---J5361</option>
<option value="UNIV. COLL.OF COMM, OU CAMPUS---P3040">UNIV. COLL.OF COMM, OU CAMPUS---P3040</option>
<option value="UNIVERSITY COLLEGE EDUCATION, OU CAMPUS.---P3068">UNIVERSITY COLLEGE EDUCATION, OU CAMPUS.---P3068</option>
<option value="UNIVERSITY COLLEGE FOR WOMEN,KOTI---D0211">UNIVERSITY COLLEGE FOR WOMEN,KOTI---D0211</option>
<option value="UNIVERSITY COLLEGE FOR WOMEN---P0134">UNIVERSITY COLLEGE FOR WOMEN---P0134</option>
<option value="UNIVERSITY COLLEGE OF ENGG, (O U)---T3149">UNIVERSITY COLLEGE OF ENGG, (O U)---T3149</option>
<option value="UNIVERSITY COLLEGE OF LAW,OU CAMPUS.---P3038">UNIVERSITY COLLEGE OF LAW,OU CAMPUS.---P3038</option>
<option value="UNIVERSITY COLLEGE OF SCIENCE,OU CAMPUS---P0156">UNIVERSITY COLLEGE OF SCIENCE,OU CAMPUS---P0156</option>
<option value="UNIVERSITY COLL. OF  ARTS  SOCIAL SCIENCE, O.U O U COMPUS---P3041">UNIVERSITY COLL. OF  ARTS  SOCIAL SCIENCE, O.U O U COMPUS---P3041</option>
<option value="UNIVERSITY COLL. OF COM. AND BUSI. MANAGEMENT OU HYD---P3193">UNIVERSITY COLL. OF COM. AND BUSI. MANAGEMENT OU HYD---P3193</option>
<option value="UNIVERSITY COLL OF ENGINEERING,OU CAMPUS.---T3007">UNIVERSITY COLL OF ENGINEERING,OU CAMPUS.---T3007</option>
<option value="UNIVERSITY COLL OF LAW,OU---P3063">UNIVERSITY COLL OF LAW,OU---P3063</option>
<option value="UNIVERSITY COLL OF SCIENCE,OU---P3066">UNIVERSITY COLL OF SCIENCE,OU---P3066</option>
<option value="UNIVERSITY COLL.OF TECH,OU(AUTO)---T3126">UNIVERSITY COLL.OF TECH,OU(AUTO)---T3126</option>
<option value="UNIVERSITY OF HYDERABAD, GACHIBOWLI.---P3043">UNIVERSITY OF HYDERABAD, GACHIBOWLI.---P3043</option>
<option value="UNIVERSITY PG COLLEGE, PARADISE,SECUNDERABAD.---P0350">UNIVERSITY PG COLLEGE, PARADISE,SECUNDERABAD.---P0350</option>
<option value="UNNATHI JUNIOR COLLEGE FOR HEARING HANDICAPPED SECBAD---J5912">UNNATHI JUNIOR COLLEGE FOR HEARING HANDICAPPED SECBAD---J5912</option>
<option value="URBANE JR.COLLEGE(28053),NACHARAM---J5647">URBANE JR.COLLEGE(28053),NACHARAM---J5647</option>
<option value="URBANE JR COLLEGE MADHAPUR---J5136">URBANE JR COLLEGE MADHAPUR---J5136</option>
<option value="VAIBHAV JUNIOR COLLEGE---J5817">VAIBHAV JUNIOR COLLEGE---J5817</option>
<option value="VAISHNAVI SCHOOL OF ARCHITECHTURE  PLANNING,KAVURI HILLS, MADHAPUR---T3319">VAISHNAVI SCHOOL OF ARCHITECHTURE  PLANNING,KAVURI HILLS, MADHAPUR---T3319</option>
<option value="VALLEY OAK JUNIOR COLLEGE---J 5901">VALLEY OAK JUNIOR COLLEGE---J 5901</option>
<option value="VALLEY OAK JUNIOR COLLEGE---J5914">VALLEY OAK JUNIOR COLLEGE---J5914</option>
<option value="VANDANA DEG. COLL, LOTHKUNTA.---D0641">VANDANA DEG. COLL, LOTHKUNTA.---D0641</option>
<option value="VANDANA JR COLLEGE VENKATAPURAM---J6021">VANDANA JR COLLEGE VENKATAPURAM---J6021</option>
<option value="VANITHA DEGREE COLLEGE, CHINTHAL---D5918">VANITHA DEGREE COLLEGE, CHINTHAL---D5918</option>
<option value="VARDHAMAN COLLEGE OF ENGG, KACHARAM, SHAMSHABAD(M)---T3032">VARDHAMAN COLLEGE OF ENGG, KACHARAM, SHAMSHABAD(M)---T3032</option>
<option value="VASAVI COLLEGE OF ENGINEERING,IBRAHIMBAGH. IBRAHIMBAGH---T3005">VASAVI COLLEGE OF ENGINEERING,IBRAHIMBAGH. IBRAHIMBAGH---T3005</option>
<option value="VASAVI JUNIOR COLLEGE HP BUNK IBRAHIMPATNAM---J5185">VASAVI JUNIOR COLLEGE HP BUNK IBRAHIMPATNAM---J5185</option>
<option value="VASAVI (VOC)JUNIOR COLLEGE IBRAHIMPATNAM---J5697">VASAVI (VOC)JUNIOR COLLEGE IBRAHIMPATNAM---J5697</option>
<option value="VASUNDARA DEGREE AND PG COLLEGE (CO ED) MEERPET, HB COLONY, MOULALI---P3220">VASUNDARA DEGREE AND PG COLLEGE (CO ED) MEERPET, HB COLONY, MOULALI---P3220</option>
<option value="VASUNDARA DEGREE COLLEGE(2063),ECIL X ROAD.---D6049">VASUNDARA DEGREE COLLEGE(2063),ECIL X ROAD.---D6049</option>
<option value="VASUNDARA DEGREE  COLLEGE_CO-ED), MANGAPURAM, MOULAL---D5894">VASUNDARA DEGREE  COLLEGE_CO-ED), MANGAPURAM, MOULAL---D5894</option>
<option value="VASUNDARA  JR.COLLEGE FOR GIRLS, ECIL X RD.---J5364">VASUNDARA  JR.COLLEGE FOR GIRLS, ECIL X RD.---J5364</option>
<option value="VASUNDARA JUNIOR COLLEGE ECIL X ROADS---J5723">VASUNDARA JUNIOR COLLEGE ECIL X ROADS---J5723</option>
<option value="VASUNDHARA GIRLS JUNIOR COLLEGE, IBPM---J5341">VASUNDHARA GIRLS JUNIOR COLLEGE, IBPM---J5341</option>
<option value="VASUNDHARA WOMENS DEG COLLEGE, ECIL X RD.---D0642">VASUNDHARA WOMENS DEG COLLEGE, ECIL X RD.---D0642</option>
<option value="VEDA DEGREE COLLEGE,RAJI REDDY NAGAR.---D6059">VEDA DEGREE COLLEGE,RAJI REDDY NAGAR.---D6059</option>
<option value="VERTEX INSTITUTE OF PARAMEDICAL SCIENCES---SP 210">VERTEX INSTITUTE OF PARAMEDICAL SCIENCES---SP 210</option>
<option value="VIDISHA JUNIOR COLLEGE---J5913">VIDISHA JUNIOR COLLEGE---J5913</option>
<option value="VIDYA DAYANI COLL OF INFORMATION TECH,RCI,MALLAPUR.---T3012">VIDYA DAYANI COLL OF INFORMATION TECH,RCI,MALLAPUR.---T3012</option>
<option value="VIDYADAYANI DEG.  PG  COLL,SANTOSHNAGAR.---D0644">VIDYADAYANI DEG.  PG  COLL,SANTOSHNAGAR.---D0644</option>
<option value="VIDYA DAYINI SCHOOL OF MANAGEMENT RCI,MALLAPUR HYD---P3197">VIDYA DAYINI SCHOOL OF MANAGEMENT RCI,MALLAPUR HYD---P3197</option>
<option value="VIDYA JYOTHI INST OF TECH,HIMAYATH NAGAR---T3129">VIDYA JYOTHI INST OF TECH,HIMAYATH NAGAR---T3129</option>
<option value="VIDYAMAYI JR.COLLEGE,KANDUKUR X RD.---J5548">VIDYAMAYI JR.COLLEGE,KANDUKUR X RD.---J5548</option>
<option value="VIDYAPEET JUNIOR COLLEGE,HABSIGUDA---J3338">VIDYAPEET JUNIOR COLLEGE,HABSIGUDA---J3338</option>
<option value="VIGNANA BHARATHI INST OF TECH AUSHAPUR---T3202">VIGNANA BHARATHI INST OF TECH AUSHAPUR---T3202</option>
<option value="VIGNANA BHARATHI JR COLLEGE,CHANDRAPURI COLONY,KAPRA.---J5616">VIGNANA BHARATHI JR COLLEGE,CHANDRAPURI COLONY,KAPRA.---J5616</option>
<option value="VIGNANA BHARATHI JUNIOR COLLEGE ALWAL---J5739">VIGNANA BHARATHI JUNIOR COLLEGE ALWAL---J5739</option>
<option value="VIGNAN DEG. COLLEGE, BANDLAGUDA,RJRN.---D5858">VIGNAN DEG. COLLEGE, BANDLAGUDA,RJRN.---D5858</option>
<option value="VIGNAN DEGREE COLLEGE,---D6025">VIGNAN DEGREE COLLEGE,---D6025</option>
<option value="VIGNAN INST.OF PHAR.SCIENCES,DESHMUKHI---T3347">VIGNAN INST.OF PHAR.SCIENCES,DESHMUKHI---T3347</option>
<option value="VIGNAN INST. TECH.  SCI. DESHMUKHI---T3101">VIGNAN INST. TECH.  SCI. DESHMUKHI---T3101</option>
<option value="VIGNAN JR COLLEGE,ATTAPUR X ROADS, RJNR(M)---J5596">VIGNAN JR COLLEGE,ATTAPUR X ROADS, RJNR(M)---J5596</option>
<option value="VIGNAN JR.COLLEGE,GANDHAMGUDA---J5487">VIGNAN JR.COLLEGE,GANDHAMGUDA---J5487</option>
<option value="VIGNAN JUNIOR COLLEGE,NIZAMPET---J3312">VIGNAN JUNIOR COLLEGE,NIZAMPET---J3312</option>
<option value="VIGNAN JUNIOR COLLEGE,TUKKUGUDA (V)---J5622">VIGNAN JUNIOR COLLEGE,TUKKUGUDA (V)---J5622</option>
<option value="VIGNAN JYOTHI INSTITUTE OF ARTS AND SCIENCE, WEST MARREDPALLY---D5951">VIGNAN JYOTHI INSTITUTE OF ARTS AND SCIENCE, WEST MARREDPALLY---D5951</option>
<option value="VIJAYA BHARTHI COLLEGE OF EDUCATION,HAYATNAGAR---D5831">VIJAYA BHARTHI COLLEGE OF EDUCATION,HAYATNAGAR---D5831</option>
<option value="VIJAYA COLLEGE OF PHARMACY,MUNAGANOOR---D5780">VIJAYA COLLEGE OF PHARMACY,MUNAGANOOR---D5780</option>
<option value="VIJAYA HEALTH CARE ACADEMIC SOC.COL.OF NURSING,GODHUMAKUNTA.---D5807">VIJAYA HEALTH CARE ACADEMIC SOC.COL.OF NURSING,GODHUMAKUNTA.---D5807</option>
<option value="VIJAYANAGAR COLLEGE OF COMMERCE, APHB,VIJAYANAGAR COLONY---D0646">VIJAYANAGAR COLLEGE OF COMMERCE, APHB,VIJAYANAGAR COLONY---D0646</option>
<option value="VIJAYANAGAR JR COLLEGE,VIJAYNAGAR COLONY.---J4982">VIJAYANAGAR JR COLLEGE,VIJAYNAGAR COLONY.---J4982</option>
<option value="VIJAYA P.G. COLLEGE,MUNAGANOOR---P3152">VIJAYA P.G. COLLEGE,MUNAGANOOR---P3152</option>
<option value="VIJAYA RESEARCH IMLS,DSNR---SP083">VIJAYA RESEARCH IMLS,DSNR---SP083</option>
<option value="VIJAYA SCH.OF BUS.MANAGEMENT,SURMAIGUDA---P3176">VIJAYA SCH.OF BUS.MANAGEMENT,SURMAIGUDA---P3176</option>
<option value="VIJAYA SCHOOL OF NURSING,GODUMAKUNTA.---SP132">VIJAYA SCHOOL OF NURSING,GODUMAKUNTA.---SP132</option>
<option value="VIJETHA DEGREE COLLEGE, KPHB---D5686">VIJETHA DEGREE COLLEGE, KPHB---D5686</option>
<option value="VIJETHA JR COLLEGE ALLWYN COLONY BALANAGAR---J3305">VIJETHA JR COLLEGE ALLWYN COLONY BALANAGAR---J3305</option>
<option value="VIJETHA JUNIOR COLLEGE FOR GIRILS MIYAPUR X ROADS---J5689">VIJETHA JUNIOR COLLEGE FOR GIRILS MIYAPUR X ROADS---J5689</option>
<option value="VIJETHA TECH INIST,SAROORNAGAR---SP107">VIJETHA TECH INIST,SAROORNAGAR---SP107</option>
<option value="VIKAS BED COLLEGE KALIKA TEMPLE.HIMAYATH SAGAR ROAD---D5802">VIKAS BED COLLEGE KALIKA TEMPLE.HIMAYATH SAGAR ROAD---D5802</option>
<option value="VIKAS JR COLLEGE,VANASTHALIPURAM---J5520">VIKAS JR COLLEGE,VANASTHALIPURAM---J5520</option>
<option value="VINJEE JR.COLLEGE, OPPR.BJP OFFICE,KP.---J5870">VINJEE JR.COLLEGE, OPPR.BJP OFFICE,KP.---J5870</option>
<option value="VISHNU INSTITUTE OF PHARMACEUTICAL EDUCATION AND REASEARCH.---T3394">VISHNU INSTITUTE OF PHARMACEUTICAL EDUCATION AND REASEARCH.---T3394</option>
<option value="VISHRA JR.KALASALA(CC.58365) TRIVENI NAGAR,MEERPET---J5344">VISHRA JR.KALASALA(CC.58365) TRIVENI NAGAR,MEERPET---J5344</option>
<option value="VISHWA BHARATHI DEG.COLLEGE,HYDERSHAKOT.---D5962">VISHWA BHARATHI DEG.COLLEGE,HYDERSHAKOT.---D5962</option>
<option value="VISHWA BHARATHI JR COLLEGE,SUN CITY,HYDERSHAKOTE.---J5714">VISHWA BHARATHI JR COLLEGE,SUN CITY,HYDERSHAKOTE.---J5714</option>
<option value="VISHWA CHAITANYA JR COLLEGE,TARNAKA---J5102">VISHWA CHAITANYA JR COLLEGE,TARNAKA---J5102</option>
<option value="VISHWA VISHWANI INST.OF SYS.AND MNG.TUMKUNTA---P3173">VISHWA VISHWANI INST.OF SYS.AND MNG.TUMKUNTA---P3173</option>
<option value="VISHWA VISHWANI SCHOOL OF BUSINESS, THUMKUNTA.---D6114">VISHWA VISHWANI SCHOOL OF BUSINESS, THUMKUNTA.---D6114</option>
<option value="VISIONARY DEGREE COLLEGE, KHILWATH---D5873">VISIONARY DEGREE COLLEGE, KHILWATH---D5873</option>
<option value="VISIONARY VOC JR COLLEGE,KHILWATH,CHARMINAR---J5394">VISIONARY VOC JR COLLEGE,KHILWATH,CHARMINAR---J5394</option>
<option value="VISION COL.OF PHARMACEUTICAL SCI.  RESEARCH,BODUPPAL---P3166">VISION COL.OF PHARMACEUTICAL SCI.  RESEARCH,BODUPPAL---P3166</option>
<option value="VISION DEGREE COLLEGE H.NO: 6-51/1 PEERZADIGUDA BUDDHANAGAR UPPAL DEPOT---D6064">VISION DEGREE COLLEGE H.NO: 6-51/1 PEERZADIGUDA BUDDHANAGAR UPPAL DEPOT---D6064</option>
<option value="VISION JUNIOR COLLEGE,PEERZADIGUDA---J5566">VISION JUNIOR COLLEGE,PEERZADIGUDA---J5566</option>
<option value="VISION PG COLLEGE,RNS COLONY BODUPPAL---P3195">VISION PG COLLEGE,RNS COLONY BODUPPAL---P3195</option>
<option value="VISION VOC JR COLLEGE, ASHOK NAGAR,RC PURAM---J5363">VISION VOC JR COLLEGE, ASHOK NAGAR,RC PURAM---J5363</option>
<option value="VISVESVARAYA COLLEGE OF ENGINEERING AND TECHNOLOGY, PATELGUDA, IBPM---T3236">VISVESVARAYA COLLEGE OF ENGINEERING AND TECHNOLOGY, PATELGUDA, IBPM---T3236</option>
<option value="VISWA BHARATHI COLLEGE OF LAW, MUTHANGI---D6180">VISWA BHARATHI COLLEGE OF LAW, MUTHANGI---D6180</option>
<option value="VIVEKANANAD JR.COLLEGE,CHEVELLA---J5401">VIVEKANANAD JR.COLLEGE,CHEVELLA---J5401</option>
<option value="VIVEKANANDA CO-OP JR.COLLEGE,SEETHAPHALMANDI.---SP031">VIVEKANANDA CO-OP JR.COLLEGE,SEETHAPHALMANDI.---SP031</option>
<option value="VIVEKANANDA DEG  P.G COLL,SEETAPHALMANDI.---D0409">VIVEKANANDA DEG  P.G COLL,SEETAPHALMANDI.---D0409</option>
<option value="VIVEKANANDA DEGREE COLLEGE CHEVELLA, RR.DIST---D6091">VIVEKANANDA DEGREE COLLEGE CHEVELLA, RR.DIST---D6091</option>
<option value="VIVEKANANDA DEGREE COLLEGE,KP---D5721">VIVEKANANDA DEGREE COLLEGE,KP---D5721</option>
<option value="VIVEKANANDA GOVT COLLEGE,VIDYANAGAR---J4640">VIVEKANANDA GOVT COLLEGE,VIDYANAGAR---J4640</option>
<option value="VIVEKANANDA GOVT DEG COLL,VIDYANAGAR.---D0652">VIVEKANANDA GOVT DEG COLL,VIDYANAGAR.---D0652</option>
<option value="VIVEKANANDA ITI MOULALI---T3120">VIVEKANANDA ITI MOULALI---T3120</option>
<option value="VIVEKANANDA P.G COLLEGE BOGARAM---P4056">VIVEKANANDA P.G COLLEGE BOGARAM---P4056</option>
<option value="VIVEK VARDHINI SCHOOL OF BUSSINESS MANAGEMENT, JAMBAGH, HYD---P3325">VIVEK VARDHINI SCHOOL OF BUSSINESS MANAGEMENT, JAMBAGH, HYD---P3325</option>
<option value="VMS DEGREE COLLEGE,UPPERPALLY,RJNR.---D6073">VMS DEGREE COLLEGE,UPPERPALLY,RJNR.---D6073</option>
<option value="VNR VIGNAN JOYTI INST.OF ENG.,BACHUPALLY---T3121">VNR VIGNAN JOYTI INST.OF ENG.,BACHUPALLY---T3121</option>
<option value="V.V COLL OF ARTS COMM SCIENCE,JAMBAGH---D0649">V.V COLL OF ARTS COMM SCIENCE,JAMBAGH---D0649</option>
<option value="V V JR.COLLEGE JAMBAGH---J4750">V V JR.COLLEGE JAMBAGH---J4750</option>
<option value="V V SANGHS BASAVESHWARA INST OF IT, BARKATHPURA---P3045">V V SANGHS BASAVESHWARA INST OF IT, BARKATHPURA---P3045</option>

<option value="WESLEY DEG COLL FOR WOMEN,OLD LANCER LANE SECBAD---D0654">WESLEY DEG COLL FOR WOMEN,OLD LANCER LANE SECBAD---D0654</option>
<option value="WESLEY DEGREE COLLEGE (CO-ED), OPP ANAND THEATRE, SECBAD---D0653">WESLEY DEGREE COLLEGE (CO-ED), OPP ANAND THEATRE, SECBAD---D0653</option>
<option value="WESLEY JR.COLL FOR BOYS PG ROAD.SEC---J5010">WESLEY JR.COLL FOR BOYS PG ROAD.SEC---J5010</option>
<option value="WESLEY PG COLLEGE,SECBAD---P3051">WESLEY PG COLLEGE,SECBAD---P3051</option>
<option value="WESTIN COLLEGE OF HOTEL MANAGEMENT,BANDLAGUDA---D5955">WESTIN COLLEGE OF HOTEL MANAGEMENT,BANDLAGUDA---D5955</option>
<option value="WORD AND DEED ITC, KUNTLOOR (V)---T3456">WORD AND DEED ITC, KUNTLOOR (V)---T3456</option>
<option value="WORD  DEED JR.COLLEGE HAYATHNAGAR.---J3328">WORD  DEED JR.COLLEGE HAYATHNAGAR.---J3328</option>
<option value="YASHODA COLLEGE OF NURSING,RTC COL.TIRUMALAGIRI---D5782">YASHODA COLLEGE OF NURSING,RTC COL.TIRUMALAGIRI---D5782</option>
<option value="YASHODA COLLEGE OF PHYSIOTHERAPY, GOWDAVALLY---D6144">YASHODA COLLEGE OF PHYSIOTHERAPY, GOWDAVALLY---D6144</option>
<option value="YASHODA COLL OF NURSING,C-53,RD.16,GREENPARK COL.SAROORNAGARMALAKPET.---D5781">YASHODA COLL OF NURSING,C-53,RD.16,GREENPARK COL.SAROORNAGARMALAKPET.---D5781</option>
<option value="YASHODA INSTITUTE OF PHYSIOTHERAPY GOWDAVELLY---T3453">YASHODA INSTITUTE OF PHYSIOTHERAPY GOWDAVELLY---T3453</option>
<option value="YASHODA LAKSHMI COLLEGE OF NURSING,GOWDAVALLY.---D5775">YASHODA LAKSHMI COLLEGE OF NURSING,GOWDAVALLY.---D5775</option>
<option value="YASHODA LAKSHMI SCHOOL OF NURSING,GOWDAVALLY..---D6008">YASHODA LAKSHMI SCHOOL OF NURSING,GOWDAVALLY..---D6008</option>
<option value="YASHODA SCHOOL OF NURSING GOWDAVELLY.---T3446">YASHODA SCHOOL OF NURSING GOWDAVELLY.---T3446</option>
<option value="YASHODA SCHOOL OF NURSING,GREEN PARK CLY.---T3445">YASHODA SCHOOL OF NURSING,GREEN PARK CLY.---T3445</option>
<option value="YSR ELEMENTARY TEACHER TRAINING INSTITUTION, ANKIREEDDYPALLY(V), KEESARA(M)---D6031">YSR ELEMENTARY TEACHER TRAINING INSTITUTION, ANKIREEDDYPALLY(V), KEESARA(M)---D6031</option>
<option value="YUVA JR.COOLEGE(28189),PRASHANTH NAGAR KHURD, VN.PURAM, HYT.---J5754">YUVA JR.COOLEGE(28189),PRASHANTH NAGAR KHURD, VN.PURAM, HYT.---J5754</option>
<option value="ZEN VOC JR.COLLEGE,KAIRTHABAD.---J5133">ZEN VOC JR.COLLEGE,KAIRTHABAD.---J5133</option>


                <option value="St. MARTINS ENGINEERING COLLEGE">St. MARTINS ENGINEERING COLLEGE</option>
                <option value="ACE ENG.COLLGE,ANKUSHPUR---T3246">ACE ENG.COLLGE,ANKUSHPUR---T3246</option>
                <option value="BVRIT, BACHUPALLY,HYD.---T3389">BVRIT, BACHUPALLY,HYD.---T3389</option>
                <option value="CBIT GANDIPET---P0031">CBIT GANDIPET---P0031</option>
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

            </select>
                    </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course and Year
                                    </label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={profileData.parsedbonofideData?.course || ""}
                                        onChange={(e) => handleChange(e, 'parsedbonofideData')}
                                        disabled={!isEditing}
                                        className={`block w-full rounded-md border ${isEditing ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500' : 'border-transparent bg-gray-50'} py-2 px-3 shadow-sm`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admission/College Hallticket No
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

export default BusPassProfile;
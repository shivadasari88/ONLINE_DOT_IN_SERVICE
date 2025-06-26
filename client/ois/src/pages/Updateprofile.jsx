import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineIdcard } from 'react-icons/ai';
import { FiUpload, FiInfo } from 'react-icons/fi';

export default function UpdateProfile() {
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState({
        email: '',
    });

    const [memo, setMemo] = useState(null);
    const [bonofide, setBonofide] = useState(null);
    const [passPhoto, setPassPhoto] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            switch (name) {
                case 'memo':
                    setMemo(files[0]);
                    break;
                case 'bonofide':
                    setBonofide(files[0]);
                    break;
                case 'passPhoto':
                    setPassPhoto(files[0]);
                    break;
                default:
                    break;
            }
        }
    };

   const updateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Start loading
    
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
    });
    formData.append('memo', memo);
    formData.append('bonofide', bonofide);
    formData.append('passPhoto', passPhoto);

    try {
        const { data } = await axios.post('/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.success('Profile updated successfully!');
        navigate('/services')
    } catch (error) {
        toast.error('Failed to update profile.');
        console.error(error);
    } finally {
        setIsUpdating(false); // Stop loading in both success and error cases
    }
};


    return (
        <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gray-900 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold">Upload Your required documents</h1>
                        <p className="text-gray-300">Keep your information current for seamless service</p>
                    </div>

                    {/* Information Notice */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-6 mt-6 rounded-r">
                        <div className="flex items-start">
                            <FiInfo className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-800">Important Notes</h3>
                                <div className="mt-1 text-sm text-blue-700">
                                    <p>- document's should be uploaded virtically croped images only</p>
                                    <p>- Photos should be below 100KB in size</p>
                                    <p>- All documents are mandatory for faster process if document is not available
                                        go directly to services page to update manually the required fields
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={updateUser} className="p-6 space-y-8">
                        
                        {/* Documents Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                                <AiOutlineIdcard className="mr-2 h-5 w-5 text-gray-700" />
                                Required Documents
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        10th Memo Certificate
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiUpload className="h-8 w-8 text-gray-500 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {memo ? memo.name : 'Click to upload memo'}
                                                </p>
                                            </div>
                                            <input 
                                                type="file" 
                                                name="memo" 
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bonafide Certificate
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiUpload className="h-8 w-8 text-gray-500 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {bonofide ? bonofide.name : 'Click to upload bonafide'}
                                                </p>
                                            </div>
                                            <input 
                                                type="file" 
                                                name="bonofide" 
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Passport Photo
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiUpload className="h-8 w-8 text-gray-500 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {passPhoto ? passPhoto.name : 'Click to upload photo'}
                                                </p>
                                            </div>
                                            <input 
                                                type="file" 
                                                name="passPhoto" 
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-11 rounded-md px-8"
                            >
                                {isUpdating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
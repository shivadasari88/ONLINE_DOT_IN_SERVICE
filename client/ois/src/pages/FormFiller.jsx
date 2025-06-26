import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaLink, FaListUl, FaSpinner } from 'react-icons/fa';

const FormFiller = () => {
    const [url, setUrl] = useState('');
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await axios.post('/api/profile/fill-form', { url });
        setFields(response.data.fields || []);
      } catch (error) {
        console.error('Error scanning form:', error);
        toast.error('Failed to scan the form. Please check the URL and try again.');
      }
      setLoading(false);
    };
  
    return (
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">OIS Form Scanner</h1>
              <p className="text-gray-300">Automatically detect and fill form fields</p>
            </div>

            <div className="p-6 space-y-8">
              {/* URL Input Section */}
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter form page URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="block w-full pl-10 rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-800 h-10 rounded-md px-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <FaSearch className="mr-2" />
                        Scan Form
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <FaListUl className="mr-2 text-gray-700" />
                  Detected Form Fields
                </h2>
                
                {fields.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {fields.map((field, index) => (
                        <li key={index} className="p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {field.label || field.placeholder || field.name || field.id || `Field ${index + 1}`}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {field.tagName.toLowerCase()}{field.type ? ` • ${field.type}` : ''}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {field.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">
                      {loading ? 'Scanning form fields...' : 'No fields detected yet. Enter a URL and click "Scan Form"'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default FormFiller;
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Header */}
      <header className="p-6 bg-white text-blue-600 text-center text-3xl font-extrabold shadow-md">
        Online In Service (O.IS)
      </header>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to O.IS</h1>
        <p className="text-lg text-gray-200 max-w-2xl">
          Automate your application processes with one click! O.IS helps you apply for ePASS scholarships, bus passes, and more—effortlessly.
        </p>
        <button className="mt-6 px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-xl hover:scale-105 transition transform duration-300">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white text-center text-gray-900">
        <h2 className="text-4xl font-bold mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8 px-6">
          <div className="p-6 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-xl shadow-lg hover:scale-105 transition transform duration-300">
            <h3 className="text-2xl font-bold mb-3">Automated Form Filling</h3>
            <p>No more manual entries! We extract data from your documents and fill applications automatically.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-xl shadow-lg hover:scale-105 transition transform duration-300">
            <h3 className="text-2xl font-bold mb-3">Bus Pass Automation</h3>
            <p>Apply for a bus pass with just one click. We handle everything for you!</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-xl shadow-lg hover:scale-105 transition transform duration-300">
            <h3 className="text-2xl font-bold mb-3">Scholarship Applications</h3>
            <p>Seamlessly apply for government scholarships without any hassle.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 text-center bg-gray-100 text-gray-900">
        <h2 className="text-4xl font-bold mb-6">About O.IS</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          O.IS is a smart automation service designed to make government applications hassle-free. We use cutting-edge technology to streamline form submissions, saving you time and effort.
        </p>
      </section>
      
      {/* Footer */}
      <footer className="p-6 bg-white text-blue-600 text-center text-lg font-semibold shadow-inner">
        &copy; {new Date().getFullYear()} O.IS - All Rights Reserved
      </footer>
    </div>
  );
}

import React from 'react';
import ClubInfo from '../components/ClubInfo';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-[#1B365D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Mugher Cement Volleyball Club
            </h1>
            <p className="text-xl mb-8">
              Excellence in Sports, Powered by Partnership
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-[#E31837] text-white px-8 py-3 rounded-full hover:bg-[#C41530] transition-colors duration-200">
                Join Our Team
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-[#1B365D] transition-colors duration-200">
                Watch Matches
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Club Info Section */}
      <ClubInfo />

      {/* Latest News Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1B365D] mb-8 text-center">
            Latest News & Updates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News cards will be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



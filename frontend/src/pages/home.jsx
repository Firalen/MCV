import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 text-center">
            <h1 className="text-4xl font-bold text-white">Welcome to Your Dashboard</h1>
            <p className="text-blue-100 mt-2">You are now logged in!</p>
          </div>
          
          <div className="p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-8">
                This is your protected home page. You can only see this if you're logged in.
              </p>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



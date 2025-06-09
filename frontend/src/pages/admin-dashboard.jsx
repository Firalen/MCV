import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('players');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('players')}
                className={`${
                  activeTab === 'players'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Players
              </button>
              <button
                onClick={() => setActiveTab('fixtures')}
                className={`${
                  activeTab === 'fixtures'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Fixtures
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`${
                  activeTab === 'news'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                News
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === 'players' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Manage Players</h2>
                <button
                  onClick={() => navigate('/admin/players/add')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add New Player
                </button>
                {/* Player list will go here */}
              </div>
            )}

            {activeTab === 'fixtures' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Manage Fixtures</h2>
                <button
                  onClick={() => navigate('/admin/fixtures/add')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add New Fixture
                </button>
                {/* Fixture list will go here */}
              </div>
            )}

            {activeTab === 'news' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Manage News</h2>
                <button
                  onClick={() => navigate('/admin/news/add')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add New Article
                </button>
                {/* News list will go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [retryCount, setRetryCount] = useState(0);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      console.log('Fetching fixtures from:', 'http://localhost:3000/api/fixtures');
      
      const response = await axios.get('http://localhost:3000/api/fixtures', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      console.log('Fixtures response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setFixtures(response.data);
      setError('');
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        error: error.message
      });

      let errorMessage = 'Failed to fetch fixtures. ';
      
      if (error.response) {
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        errorMessage += 'No response received from server. Please check if the backend is running.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      
      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1} of 3`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, [retryCount]);

  const filteredFixtures = selectedStatus === 'all'
    ? fixtures
    : fixtures.filter(fixture => fixture.status === selectedStatus);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Live':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Fixtures</h1>
      
      {/* Status Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Live">Live</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFixtures.map(fixture => (
            <div key={fixture._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <div className="bg-blue-600 text-white p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{fixture.competition}</span>
                  <span className="text-sm font-medium">{fixture.season}</span>
                </div>
                <h3 className="text-xl font-bold text-center">
                  Mugher vs {fixture.opponent}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(fixture.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(fixture.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-semibold text-gray-800">{fixture.venue}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        fixture.status === 'upcoming' ? 'bg-green-500' :
                        fixture.status === 'live' ? 'bg-red-500 animate-pulse' :
                        'bg-gray-500'
                      }`}></span>
                      <p className="font-semibold text-gray-800 capitalize">{fixture.status}</p>
                    </div>
                  </div>

                  {fixture.result && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Result</p>
                      <p className="font-semibold text-gray-800">{fixture.result}</p>
                    </div>
                  )}
                </div>

                {fixture.status === 'upcoming' && (
                  <div className="mt-6">
                    <button
                      onClick={() => handleAddToCalendar(fixture)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Add to Calendar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fixtures;


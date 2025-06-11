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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFixtures.map(fixture => (
            <div key={fixture._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{fixture.opponent}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fixture.status)}`}>
                    {fixture.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {formatDate(fixture.date)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Venue:</span> {fixture.venue}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Competition:</span> {fixture.competition}
                  </p>
                  
                  {(fixture.status === 'Live' || fixture.status === 'Completed') && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-lg font-semibold mb-2">Score</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <span className="block text-sm text-gray-600">Our Team</span>
                          <span className="text-2xl font-bold">{fixture.score.home}</span>
                        </div>
                        <span className="text-gray-400">vs</span>
                        <div className="text-center">
                          <span className="block text-sm text-gray-600">{fixture.opponent}</span>
                          <span className="text-2xl font-bold">{fixture.score.away}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fixtures;


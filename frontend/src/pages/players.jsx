import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [retryCount, setRetryCount] = useState(0);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      console.log('Fetching players from:', 'http://localhost:3000/api/players');
      
      // First check if the server is responding
      try {
        const testResponse = await axios.get('http://localhost:3000/api/test');
        console.log('Server test response:', testResponse.data);
      } catch (testError) {
        console.error('Server test failed:', testError);
        throw new Error('Server is not responding. Please check if the backend is running.');
      }

      const response = await axios.get('http://localhost:3000/api/players', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });

      console.log('Players response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setPlayers(response.data);
      setError('');
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error fetching players:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
        error: error.message
      });

      let errorMessage = 'Failed to fetch players. ';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || error.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += 'No response received from server. Please check if the backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      
      // Retry logic
      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1} of 3`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000); // Wait 2 seconds before retrying
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [retryCount]); // Retry when retryCount changes

  const filteredPlayers = selectedPosition === 'all'
    ? players
    : players.filter(player => player.positions.includes(selectedPosition));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Players</h1>
      
      {/* Position Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Position</label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Positions</option>
          {['Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter', 'Libero', 'Defensive Specialist'].map(position => (
            <option key={position} value={position}>{position}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlayers.map(player => (
            <div key={player._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <div className="relative h-72">
                <img
                  src={`http://localhost:3000${player.image}`}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', player.image);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-2xl font-bold text-white mb-1">{player.name}</h2>
                  <p className="text-white/90">#{player.number}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-gray-600 font-medium">Positions: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {player.positions.map(position => (
                      <span
                        key={position}
                        className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold text-gray-800">{player.age}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="font-semibold text-gray-800">{player.nationality}</p>
                  </div>
                </div>
                
                {/* Stats Section */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Statistics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Kills</p>
                      <p className="font-semibold text-gray-800">{player.stats.kills}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Aces</p>
                      <p className="font-semibold text-gray-800">{player.stats.aces}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Digs</p>
                      <p className="font-semibold text-gray-800">{player.stats.digs}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Blocks</p>
                      <p className="font-semibold text-gray-800">{player.stats.blocks}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Players;




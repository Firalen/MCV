import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/players');
        console.log('Players response:', response.data);
        setPlayers(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching players:', error);
        setError(error.response?.data?.message || 'Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const positions = ['all', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Setter', 'Libero', 'Defensive Specialist'];

  const filteredPlayers = selectedPosition === 'all' 
    ? players 
    : players.filter(player => {
        if (Array.isArray(player.positions)) {
          return player.positions.includes(selectedPosition);
        }
        return player.position === selectedPosition;
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Volleyball Team</h1>
        
        {/* Position Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => setSelectedPosition(position)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedPosition === position
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <div key={player._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105">
              <div className="relative">
                <img 
                  src={player.image ? `http://localhost:3000${player.image}` : 'https://via.placeholder.com/300x400?text=No+Image'} 
                  alt={player.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  #{player.number}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{player.name}</h2>
                <div className="space-y-2">
                  <div className="text-gray-600">
                    {Array.isArray(player.positions) ? (
                      player.positions.map((position, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                          {position}
                        </span>
                      ))
                    ) : (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {player.position}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium">Age:</span> {player.age}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Nationality:</span> {player.nationality}
                  </p>
                  {player.stats && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">Season Stats</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Kills:</span> {player.stats.kills}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Aces:</span> {player.stats.aces}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Digs:</span> {player.stats.digs}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Blocks:</span> {player.stats.blocks}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Players;


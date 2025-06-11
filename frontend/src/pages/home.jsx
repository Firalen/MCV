import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClubInfo from '../components/ClubInfo';
import News from './news';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leagueTable, setLeagueTable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResponse, leagueResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/news'),
          axios.get('http://localhost:3000/api/league')
        ]);
        setNews(newsResponse.data);
        setLeagueTable(leagueResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {/* News Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <p className="mt-4 text-lg text-gray-600">Stay updated with our latest news and events</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                  <div className="relative">
                    {item.image && (
                      <img 
                        src={`http://localhost:3000${item.image}`} 
                        alt={item.title} 
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                        }}
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.category === 'Match Report' ? 'bg-green-100 text-green-800' :
                        item.category === 'Team News' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'Club Update' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'Event' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => navigate(`/news/${item._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* League Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">League Table</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leagueTable.sort((a, b) => a.position - b.position).map((team) => (
                <tr key={team._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{team.teamName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{team.played}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{team.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{team.losses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Team</h2>
            <p className="text-xl text-gray-300 mb-8">
              Whether you're a beginner or an experienced player, we have a place for you in our club.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



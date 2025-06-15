import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddPlayer from '../components/AddPlayer'
import AddFixture from '../components/AddFixture'
import { axiosInstance, API_ENDPOINTS, getImageUrl } from '../config/api'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlayers: 0,
    upcomingFixtures: 0,
    totalNews: 0
  })
  const [players, setPlayers] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [storeItems, setStoreItems] = useState([])
  const [news, setNews] = useState([])
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [editingFixture, setEditingFixture] = useState(null)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [editingNews, setEditingNews] = useState(null)

  // Form states
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    number: '',
    age: '',
    nationality: '',
    image: ''
  })

  const [newFixture, setNewFixture] = useState({
    opponent: '',
    date: '',
    time: '',
    venue: '',
    competition: ''
  })

  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    category: ''
  })
  const [newsImage, setNewsImage] = useState(null)

  const [leagueTable, setLeagueTable] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    teamName: '',
    played: 0,
    wins: 0,
    losses: 0,
    points: 0,
    position: 0
  });

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'players', name: 'Players' },
    { id: 'fixtures', name: 'Fixtures' },
    { id: 'news', name: 'News' },
    { id: 'league', name: 'League' }
  ]

  const fetchStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.STATS);
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }

  const fetchPlayers = async () => {
    try {
      console.log('Fetching players...');
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PLAYERS);
      console.log('Players response:', response.data);
      
      if (response.data) {
        setPlayers(response.data);
        setError(null);
      } else {
        console.error('No data received from players endpoint');
        setError('No player data received');
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view players.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch players. Please try again.');
      }
    }
  }

  const fetchFixtures = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.FIXTURES);
      setFixtures(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError('Failed to fetch fixtures');
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.NEWS);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news articles');
    }
  };

  const fetchLeagueTable = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.LEAGUE);
      setLeagueTable(response.data);
    } catch (error) {
      console.error('Error fetching league table:', error);
      setError('Failed to fetch league table');
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    console.log('Admin component mounted, fetching data...');
    console.log('Current user:', user);
    fetchStats();
    fetchPlayers();
    fetchFixtures();
    fetchNews();
    fetchLeagueTable();
  }, [user]);

  const handlePlayerAdded = (newPlayer) => {
    setPlayers(prevPlayers => [...prevPlayers, newPlayer])
  }

  const handleDeletePlayer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_ENDPOINTS.ADMIN.PLAYERS.replace(':id', id));
      setPlayers(players.filter(player => player._id !== id));
    } catch (error) {
      console.error('Error deleting player:', error);
      setError('Failed to delete player');
    }
  }

  const handleAddFixture = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post(API_ENDPOINTS.ADMIN.FIXTURES, newFixture)
      setNewFixture({
        opponent: '',
        date: '',
        time: '',
        venue: '',
        competition: ''
      })
      fetchStats()
    } catch (err) {
      setError('Error adding fixture')
    }
  }

  const handleUpdateFixture = async (updatedFixture) => {
    try {
      await axiosInstance.put(API_ENDPOINTS.ADMIN.FIXTURES.replace(':id', updatedFixture._id), updatedFixture);
      setFixtures(fixtures.map(fixture => 
        fixture._id === updatedFixture._id ? updatedFixture : fixture
      ));
      setEditingFixture(null);
    } catch (error) {
      console.error('Error updating fixture:', error);
      setError('Failed to update fixture');
    }
  }

  const handleDeleteFixture = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fixture?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_ENDPOINTS.ADMIN.FIXTURES.replace(':id', id));
      setFixtures(fixtures.filter(fixture => fixture._id !== id));
    } catch (error) {
      console.error('Error deleting fixture:', error);
      setError('Failed to delete fixture');
    }
  }

  const handleEditFixture = async (fixture) => {
    setEditingFixture(fixture);
  }

  const handleEditPlayer = async (player) => {
    setEditingPlayer(player);
  }

  const handleUpdatePlayer = async (updatedPlayer) => {
    try {
      const formData = new FormData();
      Object.keys(updatedPlayer).forEach(key => {
        if (key === 'image' && updatedPlayer[key] instanceof File) {
          formData.append('image', updatedPlayer[key]);
        } else if (key === 'positions' || key === 'skills') {
          formData.append(key, JSON.stringify(updatedPlayer[key]));
        } else {
          formData.append(key, updatedPlayer[key]);
        }
      });

      const response = await axiosInstance.put(
        API_ENDPOINTS.ADMIN.PLAYERS.replace(':id', updatedPlayer._id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPlayers(players.map(player => 
        player._id === updatedPlayer._id ? response.data : player
      ));
      setEditingPlayer(null);
    } catch (error) {
      console.error('Error updating player:', error);
      setError('Failed to update player');
    }
  }

  const handleAddStoreItem = async (itemData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.STORE, itemData)
      setStoreItems([...storeItems, response.data])
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add store item')
    }
  }

  const handleUpdateStoreItem = async (id, itemData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.STORE.replace(':id', id), itemData)
      setStoreItems(storeItems.map(item => item._id === id ? response.data : item))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update store item')
    }
  }

  const handleDeleteStoreItem = async (id) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.ADMIN.STORE.replace(':id', id))
      setStoreItems(storeItems.filter(item => item._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete store item')
    }
  }

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newNews.title);
      formData.append('content', newNews.content);
      formData.append('category', newNews.category);
      if (newsImage) {
        formData.append('image', newsImage);
      }

      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.NEWS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNews([...news, response.data]);
      setNewNews({
        title: '',
        content: '',
        category: ''
      });
      setNewsImage(null);
      fetchStats();
    } catch (err) {
      console.error('Error adding news:', err);
      setError(err.response?.data?.message || 'Error adding news');
    }
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setNewNews({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category
    });
  };

  const handleUpdateNews = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newNews.title);
      formData.append('content', newNews.content);
      formData.append('category', newNews.category);
      if (newsImage) {
        formData.append('image', newsImage);
      }

      const response = await axiosInstance.put(
        API_ENDPOINTS.ADMIN.NEWS.replace(':id', editingNews._id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setNews(news.map(item => item._id === editingNews._id ? response.data : item));
      setEditingNews(null);
      setNewNews({
        title: '',
        content: '',
        category: ''
      });
      setNewsImage(null);
    } catch (error) {
      console.error('Error updating news:', error);
      setError(error.response?.data?.message || 'Failed to update news');
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_ENDPOINTS.ADMIN.NEWS.replace(':id', id));
      setNews(news.filter(item => item._id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting news:', error);
      setError(error.response?.data?.message || 'Failed to delete news');
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.LEAGUE, newTeam);
      setLeagueTable([...leagueTable, response.data]);
      setNewTeam({
        teamName: '',
        played: 0,
        wins: 0,
        losses: 0,
        points: 0,
        position: leagueTable.length + 1
      });
    } catch (error) {
      console.error('Error adding team:', error);
      setError(error.response?.data?.message || 'Failed to add team');
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setNewTeam({
      teamName: team.teamName,
      played: team.played,
      wins: team.wins,
      losses: team.losses,
      points: team.points,
      position: team.position
    });
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.ADMIN.LEAGUE.replace(':id', editingTeam._id),
        newTeam
      );
      setLeagueTable(leagueTable.map(team => 
        team._id === editingTeam._id ? response.data : team
      ));
      setEditingTeam(null);
      setNewTeam({
        teamName: '',
        played: 0,
        wins: 0,
        losses: 0,
        points: 0,
        position: 0
      });
    } catch (error) {
      console.error('Error updating team:', error);
      setError(error.response?.data?.message || 'Failed to update team');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await axiosInstance.delete(API_ENDPOINTS.ADMIN.LEAGUE.replace(':id', id));
      setLeagueTable(leagueTable.filter(team => team._id !== id));
    } catch (error) {
      console.error('Error deleting team:', error);
      setError(error.response?.data?.message || 'Failed to delete team');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <div>
            <AddPlayer onPlayerAdded={handlePlayerAdded} />
            <div className="mt-4 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Current Players</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {players.map((player) => (
                  <div key={player._id} className="bg-white p-3 sm:p-4 rounded-lg shadow">
                    <img 
                      src={getImageUrl(player.image)} 
                      alt={player.name} 
                      className="w-full h-32 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                      }}
                    />
                    <h4 className="text-base sm:text-lg font-semibold">{player.name}</h4>
                    <div className="text-gray-600 text-sm">
                      {Array.isArray(player.positions) ? (
                        player.positions.map((position, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs mr-1 mb-1">
                            {position}
                          </span>
                        ))
                      ) : (
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {player.position}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">#{player.number}</p>
                    <div className="mt-3 sm:mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditPlayer(player)}
                        className="bg-indigo-500 text-white px-2 sm:px-3 py-1 rounded text-sm hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player._id)}
                        className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'fixtures':
        return (
          <div>
            <AddFixture />
            <div className="mt-4 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upcoming Fixtures</h3>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 sm:mb-4 text-sm">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center">Loading fixtures...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fixtures.map((fixture) => (
                        <tr key={fixture._id}>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{fixture.opponent}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                            {new Date(fixture.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{fixture.venue}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              fixture.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                              fixture.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {fixture.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">{fixture.competition}</td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                            {fixture.score ? `${fixture.score.home} - ${fixture.score.away}` : 'TBD'}
                          </td>
                          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditFixture(fixture)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFixture(fixture._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      case 'news':
        return (
          <div className="space-y-8">
            {/* Add/Edit News Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                {editingNews ? 'Edit News Article' : 'Add News Article'}
              </h3>
              <form onSubmit={editingNews ? handleUpdateNews : handleAddNews} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newNews.title}
                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newNews.category}
                        onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Match Report">Match Report</option>
                        <option value="Team News">Team News</option>
                        <option value="Club Update">Club Update</option>
                        <option value="Event">Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewsImage(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        required={!editingNews}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 h-48 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  {editingNews && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNews(null);
                        setNewNews({
                          title: '',
                          content: '',
                          category: ''
                        });
                        setNewsImage(null);
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {editingNews ? 'Update News' : 'Add News'}
                  </button>
                </div>
              </form>
            </div>

            {/* News List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">News Articles</h3>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {news.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      {item.image && (
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.title} 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                          }}
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditNews(item)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'league':
        return (
          <div className="space-y-8">
            {/* Add/Edit Team Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h3>
              <form onSubmit={editingTeam ? handleUpdateTeam : handleAddTeam} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                      type="text"
                      value={newTeam.teamName}
                      onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="number"
                      value={newTeam.position}
                      onChange={(e) => setNewTeam({ ...newTeam, position: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Games Played</label>
                    <input
                      type="number"
                      value={newTeam.played}
                      onChange={(e) => setNewTeam({ ...newTeam, played: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wins</label>
                    <input
                      type="number"
                      value={newTeam.wins}
                      onChange={(e) => setNewTeam({ ...newTeam, wins: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Losses</label>
                    <input
                      type="number"
                      value={newTeam.losses}
                      onChange={(e) => setNewTeam({ ...newTeam, losses: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                    <input
                      type="number"
                      value={newTeam.points}
                      onChange={(e) => setNewTeam({ ...newTeam, points: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  {editingTeam && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeam(null);
                        setNewTeam({
                          teamName: '',
                          played: 0,
                          wins: 0,
                          losses: 0,
                          points: 0,
                          position: 0
                        });
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {editingTeam ? 'Update Team' : 'Add Team'}
                  </button>
                </div>
              </form>
            </div>

            {/* League Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">League Table</h3>
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <button
                            onClick={() => handleEditTeam(team)}
                            className="text-indigo-600 hover:text-indigo-800 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Users</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Players</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalPlayers}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Upcoming Fixtures</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.upcomingFixtures}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">News Articles</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalNews}</p>
            </div>
          </div>
        )
    }
  }

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-8 overflow-x-auto">
        <div className="flex border-b min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-8">
        {renderTabContent()}
      </div>

      {editingFixture && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-2 sm:p-0">
          <div className="relative top-4 sm:top-20 mx-auto p-3 sm:p-5 border w-full sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-2 sm:mt-3">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Edit Fixture</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFixture(editingFixture);
              }}>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Opponent</label>
                  <input
                    type="text"
                    value={editingFixture.opponent}
                    onChange={(e) => setEditingFixture({...editingFixture, opponent: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Date</label>
                  <input
                    type="date"
                    value={new Date(editingFixture.date).toISOString().split('T')[0]}
                    onChange={(e) => setEditingFixture({...editingFixture, date: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Venue</label>
                  <select
                    value={editingFixture.venue}
                    onChange={(e) => setEditingFixture({...editingFixture, venue: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                  </select>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Status</label>
                  <select
                    value={editingFixture.status}
                    onChange={(e) => setEditingFixture({...editingFixture, status: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Competition</label>
                  <input
                    type="text"
                    value={editingFixture.competition}
                    onChange={(e) => setEditingFixture({...editingFixture, competition: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Score</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={editingFixture.score?.home || 0}
                      onChange={(e) => setEditingFixture({
                        ...editingFixture,
                        score: { ...editingFixture.score, home: parseInt(e.target.value) }
                      })}
                      className="shadow appearance-none border rounded w-1/2 py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                      type="number"
                      value={editingFixture.score?.away || 0}
                      onChange={(e) => setEditingFixture({
                        ...editingFixture,
                        score: { ...editingFixture.score, away: parseInt(e.target.value) }
                      })}
                      className="shadow appearance-none border rounded w-1/2 py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingFixture(null)}
                    className="bg-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingPlayer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full p-2 sm:p-0">
          <div className="relative top-4 sm:top-20 mx-auto p-3 sm:p-5 border w-full sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-2 sm:mt-3">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Edit Player</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePlayer(editingPlayer);
              }}>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Name</label>
                  <input
                    type="text"
                    value={editingPlayer.name}
                    onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Number</label>
                  <input
                    type="number"
                    value={editingPlayer.number}
                    onChange={(e) => setEditingPlayer({...editingPlayer, number: parseInt(e.target.value)})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Age</label>
                  <input
                    type="number"
                    value={editingPlayer.age}
                    onChange={(e) => setEditingPlayer({...editingPlayer, age: parseInt(e.target.value)})}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Positions</label>
                  <div className="space-y-2">
                    {[
                      'Outside Hitter',
                      'Middle Blocker',
                      'Opposite Hitter',
                      'Setter',
                      'Libero',
                      'Defensive Specialist'
                    ].map((position) => (
                      <label key={position} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingPlayer.positions?.includes(position)}
                          onChange={(e) => {
                            const newPositions = e.target.checked
                              ? [...(editingPlayer.positions || []), position]
                              : (editingPlayer.positions || []).filter(p => p !== position);
                            setEditingPlayer({...editingPlayer, positions: newPositions});
                          }}
                          className="mr-2"
                        />
                        {position}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Statistics</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Kills</label>
                      <input
                        type="number"
                        value={editingPlayer.stats?.kills || 0}
                        onChange={(e) => setEditingPlayer({
                          ...editingPlayer,
                          stats: { ...editingPlayer.stats, kills: parseInt(e.target.value) || 0 }
                        })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Aces</label>
                      <input
                        type="number"
                        value={editingPlayer.stats?.aces || 0}
                        onChange={(e) => setEditingPlayer({
                          ...editingPlayer,
                          stats: { ...editingPlayer.stats, aces: parseInt(e.target.value) || 0 }
                        })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Digs</label>
                      <input
                        type="number"
                        value={editingPlayer.stats?.digs || 0}
                        onChange={(e) => setEditingPlayer({
                          ...editingPlayer,
                          stats: { ...editingPlayer.stats, digs: parseInt(e.target.value) || 0 }
                        })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Blocks</label>
                      <input
                        type="number"
                        value={editingPlayer.stats?.blocks || 0}
                        onChange={(e) => setEditingPlayer({
                          ...editingPlayer,
                          stats: { ...editingPlayer.stats, blocks: parseInt(e.target.value) || 0 }
                        })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">Image</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditingPlayer({...editingPlayer, image: file});
                      }
                    }}
                    className="shadow appearance-none border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {editingPlayer.image && typeof editingPlayer.image === 'string' && (
                    <img
                      src={getImageUrl(editingPlayer.image)}
                      alt="Current player"
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingPlayer(null)}
                    className="bg-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin


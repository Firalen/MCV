import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddPlayer from '../components/AddPlayer'

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
    image: '',
    category: ''
  })

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'players', name: 'Players' },
    { id: 'fixtures', name: 'Fixtures' },
    { id: 'store', name: 'Store' },
    { id: 'news', name: 'News' },
    { id: 'users', name: 'Users' }
  ]

  const fetchStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      // Ensure token is set in headers
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      console.log('Axios headers:', axios.defaults.headers.common);
      
      const response = await axios.get('http://localhost:3000/api/admin/stats');
      console.log('Stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        headers: error.config?.headers
      });
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setError('Authentication required');
        return;
      }

      // Set the authorization header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Fetching players with config:', config);
      
      const response = await axios.get('http://localhost:3000/api/admin/players', config);
      console.log('Players response:', response.data);
      
      if (response.data) {
        setPlayers(response.data);
        setError(null); // Clear any previous errors
      } else {
        console.error('No data received from players endpoint');
        setError('No player data received');
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        headers: error.config?.headers,
        url: error.config?.url
      });
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        // Optionally redirect to login
        navigate('/login');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view players.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch players. Please try again.');
      }
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    console.log('Admin component mounted, fetching data...');
    console.log('Current user:', user);
    fetchStats();
    fetchPlayers();
  }, [user]);

  const handlePlayerAdded = (newPlayer) => {
    setPlayers(prevPlayers => [...prevPlayers, newPlayer])
  }

  const handleDeletePlayer = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/players/${id}`)
      setPlayers(players.filter(player => player._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete player')
    }
  }

  const handleAddFixture = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/api/admin/fixtures', newFixture)
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

  const handleUpdateFixture = async (id, fixtureData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/admin/fixtures/${id}`, fixtureData)
      setFixtures(fixtures.map(fixture => fixture._id === id ? response.data : fixture))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update fixture')
    }
  }

  const handleDeleteFixture = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/fixtures/${id}`)
      setFixtures(fixtures.filter(fixture => fixture._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete fixture')
    }
  }

  const handleAddStoreItem = async (itemData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/admin/store', itemData)
      setStoreItems([...storeItems, response.data])
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add store item')
    }
  }

  const handleUpdateStoreItem = async (id, itemData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/admin/store/${id}`, itemData)
      setStoreItems(storeItems.map(item => item._id === id ? response.data : item))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update store item')
    }
  }

  const handleDeleteStoreItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/store/${id}`)
      setStoreItems(storeItems.filter(item => item._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete store item')
    }
  }

  const handleAddNews = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/api/admin/news', newNews)
      setNewNews({
        title: '',
        content: '',
        image: '',
        category: ''
      })
      fetchStats()
    } catch (err) {
      setError('Error adding news')
    }
  }

  const handleUpdateNews = async (id, newsData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/admin/news/${id}`, newsData)
      setNews(news.map(item => item._id === id ? response.data : item))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update news')
    }
  }

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/news/${id}`)
      setNews(news.filter(item => item._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete news')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <div>
            <AddPlayer onPlayerAdded={handlePlayerAdded} />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Current Players</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map(player => (
                  <div key={player._id} className="bg-white p-4 rounded-lg shadow">
                    <img src={player.image} alt={player.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h4 className="text-lg font-semibold">{player.name}</h4>
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
                    <p className="text-gray-600">#{player.number}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleDeletePlayer(player._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
            <form onSubmit={handleAddFixture} className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Add New Fixture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Opponent"
                  value={newFixture.opponent}
                  onChange={(e) => setNewFixture({ ...newFixture, opponent: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="date"
                  value={newFixture.date}
                  onChange={(e) => setNewFixture({ ...newFixture, date: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="time"
                  value={newFixture.time}
                  onChange={(e) => setNewFixture({ ...newFixture, time: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={newFixture.venue}
                  onChange={(e) => setNewFixture({ ...newFixture, venue: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Competition"
                  value={newFixture.competition}
                  onChange={(e) => setNewFixture({ ...newFixture, competition: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Fixture
              </button>
            </form>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Upcoming Fixtures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixtures.map(fixture => (
                  <div key={fixture._id} className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold">{fixture.opponent}</h4>
                    <p className="text-gray-600">{new Date(fixture.date).toLocaleDateString()}</p>
                    <p className="text-gray-600">{fixture.time}</p>
                    <p className="text-gray-600">{fixture.venue}</p>
                    <p className="text-gray-600">{fixture.competition}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleDeleteFixture(fixture._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
      case 'news':
        return (
          <div>
            <form onSubmit={handleAddNews} className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Add News Article</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
                <textarea
                  placeholder="Content"
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  className="w-full border p-2 rounded h-32"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newNews.image}
                  onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newNews.category}
                  onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add News
              </button>
            </form>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">News Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map(item => (
                  <div key={item._id} className="bg-white p-4 rounded-lg shadow">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-gray-600">{item.category}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleDeleteNews(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Total Players</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalPlayers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Fixtures</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.upcomingFixtures}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">News Articles</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalNews}</p>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium ${
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

      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default Admin


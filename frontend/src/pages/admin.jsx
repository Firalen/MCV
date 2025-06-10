import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AddPlayer from '../components/AddPlayer'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('players')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlayers: 0,
    upcomingFixtures: 0,
    storeItems: 0
  })
  const [players, setPlayers] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [storeItems, setStoreItems] = useState([])
  const [news, setNews] = useState([])
  const { user } = useAuth()
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
    { id: 'overview', name: 'Overview' },
    { id: 'players', name: 'Players' },
    { id: 'fixtures', name: 'Fixtures' },
    { id: 'store', name: 'Store' },
    { id: 'news', name: 'News' },
    { id: 'settings', name: 'Settings' }
  ]

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchData()
  }, [activeTab, user])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')

      switch (activeTab) {
        case 'players':
          const response = await axios.get('http://localhost:3000/players', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setPlayers(response.data)
          break
        case 'fixtures':
          const fixturesRes = await axios.get('http://localhost:3000/fixtures', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setFixtures(fixturesRes.data)
          break
        case 'store':
          const storeRes = await axios.get('http://localhost:3000/store', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setStoreItems(storeRes.data)
          break
        case 'news':
          const newsRes = await axios.get('http://localhost:3000/news', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setNews(newsRes.data)
          break
        default:
          // Fetch overview stats
          const [overviewUsers, overviewPlayers, overviewFixtures, overviewStore] = await Promise.all([
            axios.get('http://localhost:3000/users', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:3000/players', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:3000/fixtures', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get('http://localhost:3000/store', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ])
          
          setStats({
            totalUsers: overviewUsers.data.length,
            totalPlayers: overviewPlayers.data.length,
            upcomingFixtures: overviewFixtures.data.filter(f => f.status === 'Upcoming').length,
            storeItems: overviewStore.data.length
          })
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login')
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access this page')
      } else {
        setError(error.response?.data?.message || 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerAdded = (newPlayer) => {
    setPlayers([...players, newPlayer])
  }

  const handleDeletePlayer = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/players/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlayers(players.filter(player => player._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete player')
    }
  }

  const handleAddFixture = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/fixtures', newFixture, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewFixture({
        opponent: '',
        date: '',
        time: '',
        venue: '',
        competition: ''
      })
      fetchData()
    } catch (err) {
      setError('Error adding fixture')
    }
  }

  const handleUpdateFixture = async (id, fixtureData) => {
    try {
      const response = await axios.put(`http://localhost:3000/fixtures/${id}`, fixtureData)
      setFixtures(fixtures.map(fixture => fixture._id === id ? response.data : fixture))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update fixture')
    }
  }

  const handleDeleteFixture = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/fixtures/${id}`)
      setFixtures(fixtures.filter(fixture => fixture._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete fixture')
    }
  }

  const handleAddStoreItem = async (itemData) => {
    try {
      const response = await axios.post('http://localhost:3000/store', itemData)
      setStoreItems([...storeItems, response.data])
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add store item')
    }
  }

  const handleUpdateStoreItem = async (id, itemData) => {
    try {
      const response = await axios.put(`http://localhost:3000/store/${id}`, itemData)
      setStoreItems(storeItems.map(item => item._id === id ? response.data : item))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update store item')
    }
  }

  const handleDeleteStoreItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/store/${id}`)
      setStoreItems(storeItems.filter(item => item._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete store item')
    }
  }

  const handleAddNews = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/news', newNews, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewNews({
        title: '',
        content: '',
        image: '',
        category: ''
      })
      fetchData()
    } catch (err) {
      setError('Error adding news')
    }
  }

  const handleUpdateNews = async (id, newsData) => {
    try {
      const response = await axios.put(`http://localhost:3000/news/${id}`, newsData)
      setNews(news.map(item => item._id === id ? response.data : item))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update news')
    }
  }

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/news/${id}`)
      setNews(news.filter(item => item._id !== id))
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete news')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Add New Player</h2>
              </div>
              <div className="p-6">
                <AddPlayer onPlayerAdded={handlePlayerAdded} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Players List</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.nationality}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => handleDeletePlayer(player._id)}
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
            </div>
          </div>
        )

      case 'fixtures':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Fixtures Management</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Fixture
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opponent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fixtures.map((fixture) => (
                    <tr key={fixture._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fixture.opponent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(fixture.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fixture.venue}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {fixture.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'store':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Store Management</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {storeItems.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ETB {item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                          item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Generate Report
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  )
}

export default Admin


import React, { useState } from 'react'

const Players = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Players' },
    { id: 'outside', name: 'Outside Hitters' },
    { id: 'middle', name: 'Middle Blockers' },
    { id: 'opposite', name: 'Opposite Hitters' },
    { id: 'setter', name: 'Setters' },
    { id: 'libero', name: 'Liberos' }
  ]

  const players = [
    {
      id: 1,
      name: "Abebe Kebede",
      number: 10,
      position: "Outside Hitter",
      category: "outside",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e5e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      stats: {
        kills: 156,
        aces: 18,
        digs: 45
      }
    },
    {
      id: 2,
      name: "Tadesse Alemu",
      number: 8,
      position: "Setter",
      category: "setter",
      image: "https://images.unsplash.com/photo-1577223194256-6c9364293b43?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      stats: {
        assists: 412,
        aces: 12,
        blocks: 8
      }
    },
    {
      id: 3,
      name: "Solomon Teklu",
      number: 4,
      position: "Middle Blocker",
      category: "middle",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      stats: {
        blocks: 45,
        kills: 78,
        aces: 5
      }
    },
    {
      id: 4,
      name: "Dawit Mamo",
      number: 1,
      position: "Libero",
      category: "libero",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e5e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      stats: {
        digs: 178,
        receptions: 245,
        aces: 3
      }
    }
  ]

  const filteredPlayers = activeCategory === 'all' 
    ? players 
    : players.filter(player => player.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Squad</h1>
          <p className="text-lg text-gray-600">Meet the talented players representing Mugher Volleyball Club</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Players Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-64">
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    #{player.number}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{player.name}</h3>
                <p className="text-gray-600 mb-4">{player.position}</p>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  {Object.entries(player.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{value}</p>
                      <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Join Team Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to Join Our Team?</h2>
          <p className="text-gray-600 mb-6">We're always looking for talented players to join our squad</p>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Players


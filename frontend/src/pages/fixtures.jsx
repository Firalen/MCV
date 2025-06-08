import React, { useState } from 'react'

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState('upcoming')

  const fixtures = {
    upcoming: [
      {
        id: 1,
        date: "April 15, 2024",
        time: "15:00",
        homeTeam: "Mugher Volleyball Club",
        awayTeam: "Addis United",
        venue: "Mugher Stadium",
        competition: "National Volleyball League"
      },
      {
        id: 2,
        date: "April 22, 2024",
        time: "16:30",
        homeTeam: "Ethio Stars",
        awayTeam: "Mugher Volleyball Club",
        venue: "Addis Ababa Stadium",
        competition: "National Volleyball League"
      },
      {
        id: 3,
        date: "April 29, 2024",
        time: "15:00",
        homeTeam: "Mugher Volleyball Club",
        awayTeam: "Dire Dawa United",
        venue: "Mugher Stadium",
        competition: "National Volleyball League"
      }
    ],
    past: [
      {
        id: 4,
        date: "April 1, 2024",
        homeTeam: "Mugher Volleyball Club",
        awayTeam: "Hawassa City",
        score: "3-1",
        venue: "Mugher Stadium",
        competition: "National Volleyball League"
      },
      {
        id: 5,
        date: "March 25, 2024",
        homeTeam: "Jimma Aba Jifar",
        awayTeam: "Mugher Volleyball Club",
        score: "2-3",
        venue: "Jimma Stadium",
        competition: "National Volleyball League"
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fixtures & Results</h1>
          <p className="text-lg text-gray-600">Stay updated with our upcoming matches and past results</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-white p-1 shadow-md">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Upcoming Matches
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Past Results
            </button>
          </div>
        </div>

        {/* Fixtures List */}
        <div className="space-y-4">
          {fixtures[activeTab].map((fixture) => (
            <div
              key={fixture.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span>{fixture.competition}</span>
                    <span>•</span>
                    <span>{fixture.venue}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 text-right">
                      <span className="font-semibold text-gray-900">{fixture.homeTeam}</span>
                    </div>
                    {activeTab === 'upcoming' ? (
                      <div className="px-4 py-2 bg-blue-100 rounded-lg text-blue-600 font-medium">
                        {fixture.time}
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900 font-medium">
                        {fixture.score}
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">{fixture.awayTeam}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    Buy Tickets
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                    Match Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Download */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Never Miss a Match</h2>
          <p className="text-gray-600 mb-6">Download our fixture calendar to stay updated with all matches</p>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Calendar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Fixtures


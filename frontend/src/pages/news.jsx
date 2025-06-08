import React from 'react'

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: "Mugher City FC Wins Championship",
      date: "March 15, 2024",
      content: "Mugher City FC secured their first championship title in a thrilling final match..."
    },
    {
      id: 2,
      title: "New Stadium Announcement",
      date: "March 10, 2024",
      content: "The club has announced plans for a state-of-the-art stadium expansion..."
    },
    {
      id: 3,
      title: "Transfer Window Updates",
      date: "March 5, 2024",
      content: "Mugher City FC has completed several key signings during the transfer window..."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest News</h1>
          <p className="text-lg text-gray-600">Stay updated with the latest happenings at Mugher City FC</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {item.date}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group">
                  Read More
                  <svg 
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default News


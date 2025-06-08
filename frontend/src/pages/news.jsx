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
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{item.date}</p>
                <p className="text-gray-600">{item.content}</p>
                <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
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


import React from 'react'

const Fans = () => {
  const fanEvents = [
    {
      id: 1,
      title: "Fan Meet & Greet",
      date: "April 15, 2024",
      location: "Mugher Stadium",
      description: "Meet your favorite players and get autographs!",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e5e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 2,
      title: "Fan Zone Opening",
      date: "April 20, 2024",
      location: "City Center",
      description: "Join us for the grand opening of our new fan zone!",
      image: "https://images.unsplash.com/photo-1577223194256-6c9364293b43?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: 3,
      title: "Season Ticket Holder Party",
      date: "April 25, 2024",
      location: "Club House",
      description: "Exclusive event for our season ticket holders.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ]

  const fanBenefits = [
    {
      id: 1,
      title: "Exclusive Content",
      icon: "🎥",
      description: "Get access to behind-the-scenes content and player interviews"
    },
    {
      id: 2,
      title: "Match Day Experience",
      icon: "🎫",
      description: "Special discounts on match tickets and merchandise"
    },
    {
      id: 3,
      title: "Fan Community",
      icon: "👥",
      description: "Join our vibrant community of passionate supporters"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fan Zone</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our passionate community of supporters and be part of the Mugher Volleyball Club family
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {fanBenefits.map((benefit) => (
            <div 
              key={benefit.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Events Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upcoming Fan Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fanEvents.map((event) => (
              <div 
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      {event.date}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-2">📍 {event.location}</p>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group">
                    Learn More
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

        {/* Join Section */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Become a Member</h2>
          <p className="mb-6">Join our fan community and get exclusive benefits!</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
            Join Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Fans


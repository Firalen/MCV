import React, { useState } from 'react';

const Fans = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample fan photos data - you can replace these with your actual photos
  const fanPhotos = [
    {
      id: 1,
      category: 'matches',
      imageUrl: 'https://images.unsplash.com/photo-1577223194256-276b4f3f1254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      title: 'Match Day Support',
      description: 'Our amazing fans showing their support during the championship match'
    },
    {
      id: 2,
      category: 'events',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      title: 'Fan Meet & Greet',
      description: 'Annual fan appreciation event'
    },
    {
      id: 3,
      category: 'community',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      title: 'Community Day',
      description: 'Fans participating in our community outreach program'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'matches', name: 'Match Photos' },
    { id: 'events', name: 'Events' },
    { id: 'community', name: 'Community' }
  ];

  const filteredPhotos = selectedCategory === 'all' 
    ? fanPhotos 
    : fanPhotos.filter(photo => photo.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Fan Community</h1>
          <p className="text-xl text-gray-600">Join our vibrant community of passionate volleyball fans</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map(photo => (
            <div 
              key={photo.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-200 hover:scale-105"
            >
              <div className="relative h-64">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {photo.title}
                </h3>
                <p className="text-gray-600">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Moments</h2>
          <p className="text-gray-600 mb-6">
            Have photos from our matches or events? Share them with our community!
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200">
            Submit Your Photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fans;


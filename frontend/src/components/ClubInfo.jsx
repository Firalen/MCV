import React, { useState } from 'react';
import Image from "../assets/mugherhis.jpg";
import Image1 from "../assets/champions.jpg";

const ClubInfo = () => {
  const [activeTab, setActiveTab] = useState('history');

  const tabs = [
    { id: 'history', label: 'Club History' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'partnership', label: 'Mugher Cement Partnership' },
    { id: 'gallery', label: 'Photo Gallery' }
  ];

  const achievements = [
    {
      year: '2025',
      title: 'Premier League Winner',
      description: 'Won the Ethiopian National Volleyball League',
      image: Image1
    },
    {
      year: '2022',
      title: 'East African Cup',
      description: 'Champions of the East African Volleyball Tournament',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      year: '2021',
      title: 'Regional League',
      description: 'Dominant performance in the Regional League',
      image: 'https://images.unsplash.com/photo-1577223194256-276b4f3f1254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const galleryImages = [
    {
      id: 1,
      category: 'trophies',
      title: 'Championship Trophy 2023',
      image: 'https://images.unsplash.com/photo-1577223194256-276b4f3f1254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      category: 'team',
      title: 'Team Celebration',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      category: 'players',
      title: 'Star Player in Action',
      image: 'https://images.unsplash.com/photo-1577223194256-276b4f3f1254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      category: 'trophies',
      title: 'Regional Cup 2022',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      category: 'team',
      title: 'Team Training Session',
      image: 'https://images.unsplash.com/photo-1577223194256-276b4f3f1254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      category: 'players',
      title: 'Championship Moment',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const content = {
    history: {
      title: 'Our Rich History',
      description: 'Founded in 1985, our volleyball club has been a cornerstone of Ethiopian sports excellence. Starting as a small community team, we have grown into one of the nation\'s premier volleyball institutions.',
      image: 'https://images.unsplash.com/photo-1577223194256-276b4f3f1254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    partnership: {
      title: 'Mugher Cement Partnership',
      description: 'Our long-standing partnership with Mugher Cement has been instrumental in our success. Together, we have:',
      benefits: [
        'State-of-the-art training facilities',
        'Professional coaching staff',
        'Youth development programs',
        'Community outreach initiatives'
      ]
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mugher Cement Volleyball Club
          </h2>
          <p className="text-xl text-gray-600">
            Excellence in Sports, Powered by Partnership
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Display */}
        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
          {activeTab === 'history' && (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {content.history.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {content.history.description}
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src={Image}
                  alt="Club History"
                  className="rounded-lg shadow-md w-full h-64 object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform duration-200 hover:scale-105"
                  >
                    <div className="relative h-48">
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full">
                        {achievement.year}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {achievement.title}
                      </h4>
                      <p className="text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'partnership' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.partnership.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {content.partnership.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.partnership.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm flex items-start"
                  >
                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 mt-1">
                      ✓
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Photo Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md transform transition-transform duration-200 hover:scale-105"
                  >
                    <div className="relative h-64">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h4 className="text-white font-semibold">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubInfo;
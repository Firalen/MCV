import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fans = () => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFans = async () => {
      try {
        const response = await axios.get('http://localhost:3000/fans');
        setFans(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch fans');
        setLoading(false);
      }
    };

    fetchFans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading fans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fans</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fans.map((fan) => (
            <div key={fan._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{fan.name}</h2>
                <p className="text-gray-600 mb-2">Email: {fan.email}</p>
                <p className="text-gray-600">Member since: {new Date(fan.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fans;


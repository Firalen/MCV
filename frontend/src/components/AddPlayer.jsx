import React, { useState } from 'react';
import axios from 'axios';

const AddPlayer = ({ onPlayerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: '',
    age: '',
    nationality: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const positions = [
    'Outside Hitter',
    'Middle Blocker',
    'Opposite Hitter',
    'Setter',
    'Libero',
    'Defensive Specialist'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('number', formData.number);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('image', formData.image);

      const response = await axios.post('http://localhost:3000/api/admin/players', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        onPlayerAdded(response.data);
        // Reset form
        setFormData({
          name: '',
          position: '',
          number: '',
          age: '',
          nationality: '',
          image: null
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#1B365D] mb-6">Add New Player</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Position</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
          >
            <option value="">Select Position</option>
            {positions.map(position => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Jersey Number</label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            min="1"
            max="99"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="16"
            max="45"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Player Photo</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            required
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B365D]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#1B365D] text-white py-2 px-4 rounded-md hover:bg-[#2B466D] transition-colors duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding Player...' : 'Add Player'}
        </button>
      </form>
    </div>
  );
};

export default AddPlayer; 
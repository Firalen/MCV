import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddPlayer = ({ onPlayerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    positions: [],
    number: '',
    age: '',
    nationality: '',
    image: null,
    imagePreview: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Check authentication on component mount
    console.log('AddPlayer mounted:', { 
      currentUser: user 
    });
    
    if (!user) {
      setError('Please log in to continue');
    } else if (user.role !== 'admin') {
      setError('Admin access required');
    }
  }, [user]);

  const positions = [
    'Outside Hitter',
    'Middle Blocker',
    'Opposite Hitter',
    'Setter',
    'Libero',
    'Defensive Specialist'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: imageUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user || user.role !== 'admin') {
        setError('Admin access required');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.positions[0] || '');
      formDataToSend.append('positions', JSON.stringify(formData.positions));
      formDataToSend.append('number', formData.number);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('nationality', formData.nationality);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Sending request to add player:', {
        userRole: user?.role,
        formData: {
          ...Object.fromEntries(formDataToSend),
          positions: formData.positions
        }
      });

      const response = await axios.post('http://localhost:3000/api/admin/players', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Player added successfully:', response.data);

      if (response.data) {
        onPlayerAdded(response.data);
        // Reset form
        setFormData({
          name: '',
          positions: [],
          number: '',
          age: '',
          nationality: '',
          image: null,
          imagePreview: null
        });
        setError('');
      }
    } catch (err) {
      console.error('Error adding player:', err);
      if (err.response?.status === 401) {
        setError('Please log in to continue');
      } else if (err.response?.status === 403) {
        setError('Admin access required');
      } else {
        setError(err.response?.data?.message || 'Error adding player');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Player</h2>
      
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Position(s)</label>
          <div className="grid grid-cols-2 gap-2">
            {positions.map(position => (
              <label key={position} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="positions"
                  value={position}
                  checked={formData.positions.includes(position)}
                  onChange={(e) => {
                    const newPositions = e.target.checked
                      ? [...formData.positions, position]
                      : formData.positions.filter(p => p !== position);
                    setFormData(prev => ({
                      ...prev,
                      positions: newPositions
                    }));
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{position}</span>
              </label>
            ))}
          </div>
          {formData.positions.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select at least one position</p>
          )}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Player Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.imagePreview && (
            <div className="mt-2">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Adding Player...' : 'Add Player'}
        </button>
      </form>
    </div>
  );
};

export default AddPlayer; 
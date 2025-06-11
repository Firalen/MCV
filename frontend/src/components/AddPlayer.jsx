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
    imagePreview: null,
    stats: {
      kills: 0,
      aces: 0,
      digs: 0,
      blocks: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    } else if (type === 'checkbox') {
      const position = value;
      setFormData(prev => ({
        ...prev,
        positions: checked
          ? [...prev.positions, position]
          : prev.positions.filter(p => p !== position)
      }));
    } else if (name.startsWith('stats.')) {
      const statField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statField]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!user || user.role !== 'admin') {
        setError('Admin access required');
        return;
      }

      console.log('Submitting form with positions:', formData.positions);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      
      // Ensure positions is an array and append each position
      if (Array.isArray(formData.positions)) {
        formData.positions.forEach(position => {
          formDataToSend.append('positions', position);
        });
      } else {
        throw new Error('Positions must be an array');
      }

      formDataToSend.append('number', formData.number);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('stats', JSON.stringify(formData.stats));

      console.log('Form data being sent:', {
        name: formData.name,
        positions: formData.positions,
        number: formData.number,
        age: formData.age,
        nationality: formData.nationality,
        stats: formData.stats
      });

      const response = await axios.post('http://localhost:3000/api/admin/players', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Player added successfully!');
      setFormData({
        name: '',
        positions: [],
        number: '',
        age: '',
        nationality: '',
        image: null,
        imagePreview: null,
        stats: {
          kills: 0,
          aces: 0,
          digs: 0,
          blocks: 0
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Error adding player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Player</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Positions</label>
          <div className="grid grid-cols-2 gap-2">
            {positions.map(position => (
              <label key={position} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="positions"
                  value={position}
                  checked={formData.positions.includes(position)}
                  onChange={handleChange}
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
          <label className="block text-sm font-medium text-gray-700">Number</label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            min="1"
            max="99"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="16"
            max="45"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
            className="mt-1 block w-full"
          />
          {formData.imagePreview && (
            <div className="mt-2">
              <img src={formData.imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Statistics</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Kills</label>
              <input
                type="number"
                name="kills"
                value={formData.stats?.kills || 0}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Aces</label>
              <input
                type="number"
                name="aces"
                value={formData.stats?.aces || 0}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Digs</label>
              <input
                type="number"
                name="digs"
                value={formData.stats?.digs || 0}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Blocks</label>
              <input
                type="number"
                name="blocks"
                value={formData.stats?.blocks || 0}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Adding Player...' : 'Add Player'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayer; 
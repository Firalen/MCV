import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddFixture = () => {
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    venue: 'Home',
    status: 'Upcoming',
    competition: '',
    score: {
      home: 0,
      away: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('score.')) {
      const scoreField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        score: {
          ...prev.score,
          [scoreField]: parseInt(value) || 0
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

      console.log('Submitting fixture:', formData);

      const response = await axios.post('http://localhost:3000/api/admin/fixtures', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Fixture added successfully!');
      setFormData({
        opponent: '',
        date: '',
        venue: 'Home',
        status: 'Upcoming',
        competition: '',
        score: {
          home: 0,
          away: 0
        }
      });
    } catch (error) {
      console.error('Error submitting fixture:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Error adding fixture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Fixture</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Opponent</label>
          <input
            type="text"
            name="opponent"
            value={formData.opponent}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Venue</label>
          <select
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Home">Home</option>
            <option value="Away">Away</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Competition</label>
          <input
            type="text"
            name="competition"
            value={formData.competition}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Score</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Home</label>
              <input
                type="number"
                name="score.home"
                value={formData.score.home}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Away</label>
              <input
                type="number"
                name="score.away"
                value={formData.score.away}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            {loading ? 'Adding Fixture...' : 'Add Fixture'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFixture; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/news/${id}`);
        setNews(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news article');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">News article not found</h2>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Home
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {news.image && (
            <div className="relative h-96">
              <img
                src={`http://localhost:3000${news.image}`}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  news.category === 'Match Report' ? 'bg-green-100 text-green-800' :
                  news.category === 'Team News' ? 'bg-blue-100 text-blue-800' :
                  news.category === 'Club Update' ? 'bg-purple-100 text-purple-800' :
                  news.category === 'Event' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {news.category}
                </span>
              </div>
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-8">
              <span>{new Date(news.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 whitespace-pre-line">{news.content}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail; 
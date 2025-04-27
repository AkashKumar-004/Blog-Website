import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
const InputField = ({ label, value, onChange, placeholder, error, textarea, rows = 3 }) => {
  const baseClass =
    'w-full p-4 rounded-lg border border-gray-300 bg-gray-800 text-gray-200 shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-xl hover:ring-indigo-300';

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
          rows={rows}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className={baseClass}
          value={value}
          onChange={onChange}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const Blog = ({ setShowForm }) => {
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [username, setUsername] = useState('');
  const { token, role } = useSelector((state) => state.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [detailedSummary, setDetailedSummary] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setMessage('❌ Failed to fetch user profile.');
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleTagChange = async (e) => {
    setTags(e.target.value);
    if (e.target.value.length >= 5) {
      setLoadingTags(true);
      try {
        const response = await axios.post('http://localhost:5000/api/ai/generate-tags', {
          content: e.target.value,
        });
        setSuggestedTags(response.data.tags || []);
      } catch (err) {
        console.error('Error fetching tag suggestions:', err);
        setSuggestedTags([]);
      } finally {
        setLoadingTags(false);
      }
    } else {
      setSuggestedTags([]);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!title) errors.title = 'Title is required';
    else if (title.length < 5) errors.title = 'Title must be at least 5 characters';

    if (!content) errors.content = 'Content is required';
    else if (content.length < 20) errors.content = 'Content must be at least 20 characters';

    if (!tags) errors.tags = 'Tags are required';

    if (!category) errors.category = 'Category is required';

    if (!imageUrl) errors.imageUrl = 'Image URL is required';
    else if (!/^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\/\w\.-]*)*\/?$/.test(imageUrl)) {
      errors.imageUrl = 'Invalid URL format';
    }

    if (!detailedSummary) errors.detailedSummary = 'Detailed summary is required';
    else if (detailedSummary.length < 10) errors.detailedSummary = 'Summary must be at least 10 characters';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
  
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 40000, // Timeout set to 40 seconds
      };
  
      const blogData = {
        title,
        content,
        tags: tags.split(',').map((tag) => tag.trim()),
        category,
        imageUrl,
        detailedSummary,
        username,
      };
  
      console.log('Posting blog with data:', blogData);
  
      const response = await axios.post('http://localhost:5000/api/blogs', blogData, config);
  
      if (response.status === 200) {
        setMessage('✅ Blog posted successfully!');
        setTitle('');
        setContent('');
        setTags('');
        setCategory('');
        setImageUrl('');
        setDetailedSummary('');
        setErrors({});
      } else {
        setMessage('✅ Blog posted successfully!');
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      if (err.response) {
        console.error('Error response:', err.response);
        setMessage(`❌ ${err.response.data.message || err.response.data.error || 'An unknown error occurred.'}`);
      } else if (err.code === 'ECONNABORTED') {
        setMessage('❌ The request timed out. Please try again later.');
      } else {
        setMessage('❌ An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleGenerateSummary = async () => {
    if (!content || content.length < 200) {
      setMessage('🛑 Please provide more detailed content (at least 200 characters) to generate a summary.');
      return;
    }

    setLoadingSummary(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/ai/generate-summary', {
        content,
      });

      const generatedSummary = response.data.summary;
      setDetailedSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setMessage('❌ Failed to generate summary. Try again later.');
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!token || role !== 'creator') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-red-500 font-semibold">🚫 You must be logged in as a creator to write a blog.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-md">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 bg-gray-800 text-gray-200 px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 animate-pulse"
      >
        <span className="text-xl">←</span>
        <span className="font-semibold">Home</span>
      </button>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-200 mb-4">📝 New Blog Post</h2>
          <p className="text-sm text-gray-400 mb-6">Craft your thoughts. Inspire the world.</p>
        </div>

        {message && (
          <div className={`text-center text-sm font-medium ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" error={errors.title} />
          <InputField label="Content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Blog content..." textarea rows={6} error={errors.content} />
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={handleTagChange}
                className="w-full p-4 rounded-lg border border-gray-300 bg-gray-800 text-gray-200 shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-xl hover:ring-indigo-300"
                placeholder="Enter tags (comma separated)"
              />
              {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
            </div>

            <InputField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Blog category" error={errors.category} />
          </div>

          <InputField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" error={errors.imageUrl} />

          <div className="flex justify-between items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Detailed Summary</label>
              <textarea
                value={detailedSummary}
                onChange={(e) => setDetailedSummary(e.target.value)}
                className="w-full p-4 rounded-lg border border-gray-300 bg-gray-800 text-gray-200 shadow-md resize-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 hover:shadow-xl hover:ring-indigo-300"
                rows={4}
                placeholder="Enter a brief summary"
              />
              {errors.detailedSummary && <p className="text-red-500 text-sm mt-1">{errors.detailedSummary}</p>}
            </div>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={loadingSummary}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm"
            >
              {loadingSummary ? 'Generating...' : 'Generate AI Summary'}
            </button>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Blog;

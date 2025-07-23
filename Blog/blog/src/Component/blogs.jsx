import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AIField = ({ label, value, onChange, onGenerate, loading, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
    <div className="flex gap-2">
      <textarea
        className="flex-1 p-4 rounded-lg border bg-gray-800 text-gray-200"
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        onClick={onGenerate}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg h-fit"
      >
        {loading ? 'Generating...' : `Generate ${label}`}
      </button>
    </div>
  </div>
);

const Blog = () => {
  const { token, role } = useSelector((state) => state.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [summary, setSummary] = useState('');

  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Track submit button loading

  const API_URL = import.meta.env.VITE_API_URL;

  const generateContent = async () => {
    setLoadingContent(true);
    try {
      const res = await axios.post(`${API_URL}/api/ai/generate-content`, { title });
      setContent(res.data.content || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContent(false);
    }
  };

  const generateImage = async () => {
    setLoadingImage(true);
    try {
      const res = await axios.post(`${API_URL}/api/ai/generate-image`, { title, content });
      setImageUrl(res.data.imageUrl || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingImage(false);
    }
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.post(`${API_URL}/api/ai/generate-summary`, { content });
      setSummary(res.data.summary || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Disable submit button and show loading state
    setLoadingSubmit(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const body = {
        title,
        content,
        category,
        tags: tags.split(',').map((t) => t.trim()),
        imageUrl,
        detailedSummary: summary,
      };

      await axios.post(`${API_URL}/api/blogs`, body, config);
      alert('✅ Blog submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Blog submission failed.');
    } finally {
      // Re-enable submit button after response
      setLoadingSubmit(false);
    }
  };

  if (!token || role !== 'creator') {
    return (
      <div className="text-red-500 text-center mt-10">🚫 Only creators can write blogs.</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full space-y-6 bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center">🤖 AI Blog Writer</h1>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full p-4 rounded-lg border bg-gray-800 text-gray-200"
            required
          />
        </div>

        <AIField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onGenerate={generateContent}
          loading={loadingContent}
          placeholder="Click to generate content using AI"
          required
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 rounded-lg border bg-gray-800 text-gray-200"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="flex-1 p-4 rounded-lg border bg-gray-800 text-gray-200"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 p-4 rounded-lg border bg-gray-800 text-gray-200"
              placeholder="Auto-generated image"
              required
            />
            <button
              type="button"
              onClick={generateImage}
              className="bg-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              disabled={loadingImage}
            >
              {loadingImage ? '...' : 'AI'}
            </button>
          </div>
        </div>

        <AIField
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onGenerate={generateSummary}
          loading={loadingSummary}
          placeholder="Click to generate summary from content"
          required
        />

        <button
          type="submit"
          className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl text-white text-lg font-semibold transition"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'Submitting...' : 'Post Blog 🚀'}
        </button>
      </form>
    </div>
  );
};

export default Blog;

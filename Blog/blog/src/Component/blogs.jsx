import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AIField = ({ label, value, onChange, onGenerate, loading, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
    <div className="flex gap-2">
      <textarea
        className="flex-1 p-4 rounded-xl border border-gray-700 bg-[#1e1e2f] text-gray-200 focus:ring-2 focus:ring-purple-500"
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        onClick={onGenerate}
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
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
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
      setLoadingSubmit(false);
    }
  };

  if (!token || role !== 'creator') {
    return (
      <div className="text-red-500 text-center mt-10">🚫 Only creators can write blogs.</div>
    );
  }

  return (
    
    <div className="min-h-screen  bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-12 flex items-center justify-center">
      <Link
  to="/"
  className="absolute top-24 left-20 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition duration-300 ease-in-out border border-cyan-400"
>
  ⬅ Back to Home
</Link>


      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full space-y-8 bg-[#1a1a2e]/80 p-10 rounded-3xl shadow-[0_0_30px_#00000080] border border-gray-700 backdrop-blur"
      >
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-sm">🪄 AI Blog Writer</h1>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full p-4 rounded-xl border border-gray-700 bg-[#1e1e2f] text-gray-200 focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* AI-generated Content */}
        <AIField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onGenerate={generateContent}
          loading={loadingContent}
          placeholder="Click to generate content using AI"
        />

        {/* Category and Tags */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-700 bg-[#1e1e2f] text-gray-200 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-700 bg-[#1e1e2f] text-gray-200 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        {/* Image + Generate */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 p-4 rounded-xl border border-gray-700 bg-[#1e1e2f] text-gray-200"
              placeholder="Auto-generated image"
              required
            />
            <button
              type="button"
              onClick={generateImage}
              className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-xl text-sm text-white shadow-lg transition hover:opacity-90"
              disabled={loadingImage}
            >
              {loadingImage ? '...' : 'AI'}
            </button>
          </div>
        </div>

        {/* AI Summary */}
        <AIField
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onGenerate={generateSummary}
          loading={loadingSummary}
          placeholder="Click to generate summary from content"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl text-white text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-[0_0_12px_2px_rgba(16,185,129,0.5)]"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? 'Submitting...' : 'Post Blog 🚀'}
        </button>
      </form>
    </div>
  );
};

export default Blog;

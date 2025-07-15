import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const token = useSelector((state) => state.user.token);
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/${id}`);
      setBlog(response.data);
      setLikes(response.data.likes.length);

      const userLiked = response.data.likes.includes(localStorage.getItem('userId'));
      setLiked(userLiked);
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  const handleLike = async () => {
    if (!token || liked) return;
    try {
      const response = await axios.post(
        `${API_URL}/api/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(response.data.likes.length);
      setLiked(true);
      localStorage.setItem(`liked_blog_${id}`, 'true');
    } catch (error) {
      console.error('Error liking blog:', error.response ? error.response.data : error.message);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const text = `Check out this blog: ${blog.title}`;
    navigator.share
      ? navigator.share({ text: `${text} - ${shareUrl}` })
      : window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)} ${encodeURIComponent(shareUrl)}`, '_blank');
  };

  useEffect(() => { fetchBlog(); }, [id]);

  if (!blog) return <div className="loading text-white text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] flex justify-center items-center relative px-4">

     
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 text-white rounded-xl shadow-lg font-semibold transition-transform duration-300"
        >
          ← Back to Home
        </button>
      </div>

      <div className="max-w-3xl w-full bg-[#1e1e2f] p-10 rounded-2xl shadow-2xl animate-fadeIn">
        <h1 className="text-5xl font-extrabold text-center text-white mb-8 tracking-wide animate-fadeIn">{blog.title}</h1>

        <div className="relative">
          <img
            src={blog.imageUrl || 'https://via.placeholder.com/500'}
            alt={blog.title}
            className="w-full h-80 object-cover rounded-xl shadow-lg transform transition duration-500 animate-fadeIn"
          />
        </div>

        <div className="mt-6 text-lg text-gray-300 leading-relaxed mb-8 animate-fadeIn">{blog.content}</div>

        <div className="text-gray-500 text-sm mb-6">
          <p>Category: <span className="text-gray-300 font-semibold">{blog.category}</span></p>
          <p>Tags: <span className="text-gray-400">{blog.tags.join(', ')}</span></p>
        </div>

        <div className="flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={liked}
              className={`flex items-center text-lg ${liked ? 'text-gray-500' : 'text-purple-500'} transition-all duration-300`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
                  14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                  11.54L12 21.35z"
                />
              </svg>
              {liked ? 'Liked' : 'Like'}
            </button>
            <span className="ml-2 text-gray-400 text-lg">{likes} {likes === 1 ? 'like' : 'likes'}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center text-lg text-green-400 hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

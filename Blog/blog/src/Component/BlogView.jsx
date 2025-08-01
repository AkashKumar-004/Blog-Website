import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const BlogView = () => {
  const navigate=useNavigate('/login');
  const { blogId } = useParams(); 
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]); 
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); 
    } else {
      setShowLoginModal(true); 
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!isLoggedIn) {
        setError('Please log in to view blogs.');
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/blogs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to fetch blogs');
      }
    };

    fetchBlogs();
  }, [isLoggedIn]);

  useEffect(() => {
    let temp = blogs;
    if (searchTerm) {
      temp = temp.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredBlogs(temp);
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogin = () => {
    
    setShowLoginModal(false);
    navigate('/login');
  };

  return (

<div className="relative min-h-screen bg-[#121212] text-white">
  {!isLoggedIn && (
    <div className="absolute inset-0 bg-black bg-opacity-40 z-0 overflow-hidden">
      <div className="space-stone-animation absolute inset-0 w-full h-full bg-transparent"></div>
    </div>
  )}

  {showLoginModal && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1E1E1E] p-12 rounded-3xl shadow-xl transform backdrop-blur-lg"
        style={{
          transform: 'rotateY(10deg)',
          boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Log in to view this blog</h2>
        <button
          onClick={handleLogin}
          className="w-full py-3 px-6 bg-[#4EA8DE] text-white rounded-lg hover:bg-[#3A90C9] transition"
        >
          Log In
        </button>
        <p className="mt-4 text-center text-sm text-gray-300">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )}

  <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-8 z-10 relative">
    {currentBlogs.length > 0 ? (
      currentBlogs.map((blog) => (
        <motion.div
          key={blog._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl shadow-md overflow-hidden bg-[#1E1E1E] border border-[#2C2C2C] backdrop-blur-md"
        >
          <img
            src={blog.imageUrl?.trim()}
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <div className="text-xs bg-emerald-600 text-white w-fit px-2 py-1 rounded-full mb-3">
              {blog.tags?.[0] || 'General'}
            </div>
            <h2 className="text-lg font-bold mb-2 text-white">{blog.title}</h2>
            <p className="text-sm font-light text-gray-300 mb-5">
              {blog.content.slice(0, 120)}...
            </p>
            <Link
              to={`/blogs/${blog._id}`}
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:underline"
            >
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      ))
    ) : (
      <p className="text-center col-span-full text-gray-400">No blogs found for the search term.</p>
    )}
  </div>

  {totalPages > 1 && (
    <div className="flex justify-center space-x-4 py-5 z-10 relative bg-transparent">
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-full text-white transition duration-300 
      ${
        currentPage === 1
          ? 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'
          : 'bg-[#4EA8DE] hover:shadow-[0_0_10px_2px_rgba(78,168,222,0.7)] hover:scale-105'
      }`}
  >
    Previous
  </button>

  <span className="flex items-center text-gray-400 font-medium">
    {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-full text-white transition duration-300 
      ${
        currentPage === totalPages
          ? 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'
          : 'bg-[#4EA8DE] hover:shadow-[0_0_10px_2px_rgba(78,168,222,0.7)] hover:scale-105'
      }`}
  >
    Next
  </button>
</div>

  )}
</div>
  );
};

export default BlogView;

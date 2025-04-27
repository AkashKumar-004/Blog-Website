import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserBlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.token);
  const username = useSelector((state) => state.user.user.username);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/blogs`);
        const userBlogs = response.data.filter((blog) => blog.username === username);
        setBlogs(userBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBlogs();
    }
  }, [username]);

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`${API_URL}/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h3 className="text-3xl font-semibold text-white mb-6">My Blogs</h3>
      {loading ? (
        <div className="text-center text-gray-300">Loading...</div>
      ) : blogs.length > 0 ? (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h4 className="text-2xl font-bold text-gray-100 mb-2">{blog.title}</h4>
              <p className="text-gray-400 mb-2"><strong>Category:</strong> {blog.category}</p>
              <p className="text-gray-300 mb-4"><strong>Description:</strong> {blog.description}</p>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap">{blog.content}</p>

              <div className="flex gap-4">
               
                <Link
                  to={`/blogs/edit/${blog._id}`}
                  className="px-5 py-2 bg-teal-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-teal-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-md transition duration-300 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">You have not created any blogs yet.</p>
      )}
    </div>
  );
};

export default UserBlogsSection;

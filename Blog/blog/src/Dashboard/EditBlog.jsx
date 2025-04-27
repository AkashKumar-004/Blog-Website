import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditBlog = () => {
  const { id } = useParams(); 
  const token = useSelector((state) => state.user.token); 
  const username = useSelector((state) => state.user.user.username); 
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlogData({
          title: res.data.title,
          content: res.data.content,
          category: res.data.category,
          tags: res.data.tags,
          imageUrl: res.data.imageUrl,
        });
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
  
      setBlogData({ ...blogData, tags: value.split(',').map(tag => tag.trim()) });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const updatedBlogData = {
      ...blogData,
      username: username, 
    };

    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, updatedBlogData, {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      alert('Blog updated successfully!');
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Update failed');
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading blog data...</div>;

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 shadow-xl rounded-3xl w-full max-w-lg p-8 transform transition-all scale-95 hover:scale-100 duration-300 ease-out">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Edit Your Blog ✍️</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            required
          />
          <InputField
            label="Category"
            name="category"
            value={blogData.category}
            onChange={handleChange}
          />
          <InputField
            label="Tags (comma separated)"
            name="tags"
            value={blogData.tags.join(', ')}
            onChange={handleChange}
          />
          <InputField
            label="Image URL"
            name="imageUrl"
            value={blogData.imageUrl}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Content</label>
            <textarea
              name="content"
              value={blogData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              className="w-full h-40 border-2 border-gray-600 text-white bg-gray-700 rounded-lg p-3 resize-none shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 mt-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-gray-600 text-white shadow-lg transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-xl transition-all transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border-2 border-gray-600 text-white bg-gray-700 p-3 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
      placeholder={label}
    />
  </div>
);

export default EditBlog;

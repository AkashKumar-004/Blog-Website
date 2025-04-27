import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Profile = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (token && !user) {
      fetchUserProfile();
    }
  }, [token, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsEditing(false); 
  };

  const handleEditClick = () => {
    setIsEditing(true); 
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 min-h-screen py-12">
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Profile Information</h2>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-lg font-medium text-white">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-4 mt-2 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              disabled={!isEditing}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-lg font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 mt-2 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              disabled={!isEditing}
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-lg font-medium text-white">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-4 mt-2 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              disabled={!isEditing}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditClick}
                className="px-8 py-4 bg-indigo-700 text-white rounded-lg shadow-lg transition duration-200 transform hover:bg-indigo-800 focus:outline-none"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-teal-600 text-white rounded-lg shadow-lg transition duration-200 transform hover:bg-teal-700 focus:outline-none"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-4 bg-gray-500 text-white rounded-lg shadow-lg transition duration-200 transform hover:bg-gray-600 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

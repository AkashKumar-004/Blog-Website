import React, { useState } from 'react';
import ProfileSection from './Profile';
import UserBlogsSection from './UserBlogsSection';
import RecommendedBlogsSection from './RecommendedBlogsSection';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('profile'); 

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#121212] via-[#1c1c1c] to-[#181818]">
     
      <div className="w-64 bg-gradient-to-r from-[#242424] to-[#333333] text-white p-8 space-y-6 shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gradient">Dashboard</h2>
        <ul className="space-y-4">
          <li
            onClick={() => handleSectionClick('profile')}
            className="cursor-pointer p-3 rounded-md text-xl transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white text-gray-400 hover:shadow-lg"
          >
            Profile
          </li>
          <li
            onClick={() => handleSectionClick('myBlogs')}
            className="cursor-pointer p-3 rounded-md text-xl transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white text-gray-400 hover:shadow-lg"
          >
            My Blogs
          </li>
          <li
            onClick={() => handleSectionClick('recommended')}
            className="cursor-pointer p-3 rounded-md text-xl transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white text-gray-400 hover:shadow-lg"
          >
            Recommended Blogs
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-8">
          
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'myBlogs' && <UserBlogsSection />}
          {activeSection === 'recommended' && <RecommendedBlogsSection />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

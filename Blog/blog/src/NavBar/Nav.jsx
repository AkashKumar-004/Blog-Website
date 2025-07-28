import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../Redux/userSlice';
import { setSearchTerm } from '../Redux/SearchSlice';

const Navbar = ({ isLoggedIn }) => {
  const { role } = useSelector((state) => state.user); 
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <nav className="bg-[#1C1C1C] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white">BLOG</Link>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search blogs..."
            className="px-4 py-2 border border-[#333333] rounded-md w-72 bg-[#121212] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4EA8DE]"
          />

          <div className="space-x-8 font-medium text-[17px]">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>

                {role === 'creator' && (
                  <Link to="/blogs" className="text-gray-300 hover:text-white">Write a Blog</Link>
                )}
                <button onClick={handleLogout} className="text-red-400 hover:text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                <Link to="/signup" className="text-gray-300 hover:text-white">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

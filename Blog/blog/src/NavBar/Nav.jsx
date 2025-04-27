import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../Redux/userSlice';
import { setSearchTerm } from '../Redux/SearchSlice';

const Navbar = ({ isLoggedIn }) => {
  const { role } = useSelector((state) => state.user); 
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <nav className="bg-white text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-700">BLOG</Link>

          {/* Search bar */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search blogs..."
            className="px-4 py-2 border rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Navbar Links */}
          <div className="space-x-8 font-medium text-[17px]">
            {isLoggedIn ? (
              <>
                {/* Dashboard Link */}
                <Link to="/dashboard" className="text-gray-700">Dashboard</Link>

                {role === 'creator' && (
                  <Link to="/blogs" className="text-gray-700">Write a Blog</Link>
                )}
                <button onClick={handleLogout} className="text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700">Login</Link>
                <Link to="/signup" className="text-gray-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

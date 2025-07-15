import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Component/Login';
import Signup from './Component/Signup';
import Blogs from './Component/blogs';
import BlogView from './Component/BlogView';
import Navbar from './NavBar/Nav';
import { useState, useEffect } from 'react';
import BlogDetails from './Component/BlogDetail';
import DashboardPage from './Dashboard/DashboardPage';
import { useSelector } from 'react-redux';
import EditBlog from './Dashboard/EditBlog';
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const token = useSelector((state) => state.user.token) || localStorage.getItem('token'); 

  const isLoggedIn = !!token;  

  useEffect(() => {
  }, [token]);

  return (
    <BrowserRouter>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<BlogView searchTerm={searchTerm} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogview" element={<BlogView searchTerm={searchTerm} />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/blogs/edit/:id" element={<EditBlog />} />
      </Routes>
    </BrowserRouter>
  );
}

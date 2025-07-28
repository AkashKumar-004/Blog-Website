import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleLogin = async () => {
    let valid = true;

    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!isValidPassword(password)) {
      setPasswordError('Password must be 8+ chars, include uppercase, lowercase, and a number');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      dispatch(setUser({ token: res.data.token, user: res.data.user }));
      localStorage.setItem('token', res.data.token);
      navigate('/');
      alert('Logged in successfully!');
    } catch (err) {
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const nav = () => navigate('/signup');

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md transform transition-all hover:scale-105 hover:rotate-[1deg] hover:shadow-3xl">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-md tracking-wide">
          Welcome Back
        </h2>
        <div className="flex flex-col space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailError('')}
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
          />
          {emailError && <p className="text-sm text-red-400">{emailError}</p>}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordError('')}
              className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-3 rounded-lg font-bold tracking-wider shadow-md transform transition-all hover:scale-105 hover:shadow-2xl hover:rotate-1 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        <p className="text-center text-gray-300 mt-6">
          Don't have an account?
          <button
            onClick={nav}
            className="text-purple-400 hover:text-purple-300 ml-1 font-semibold transition duration-200 underline-offset-2 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'reader',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const isValidUsername = (username) => username.length >= 3;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === 'username' && !isValidUsername(value)) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (name === 'email' && !isValidEmail(value)) {
      newErrors.email = 'Invalid email format';
    } else if (name === 'password' && !isValidPassword(value)) {
      newErrors.password = 'Password must be 8+ characters, include upper, lower, and number';
    } else {
      newErrors[name] = '';
    }

    setErrors(newErrors);
  };

  const handleSignup = async () => {
    let newErrors = {};

    if (!isValidUsername(form.username)) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!isValidEmail(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!isValidPassword(form.password)) {
      newErrors.password = 'Password must be 8+ characters, include upper, lower, and number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.post(`${API_URL}/api/auth/signup`, form);
      alert('Signup successful! You can log in now.');
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  const nav = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-pulse bg-gradient-to-br from-gray-800/20 to-gray-900/20 blur-2xl"></div>
      </div>

      <div className="relative z-10 w-[360px] rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl shadow-black/70 transform scale-100 hover:scale-105 transition-all duration-500">
        <h2 className="text-4xl font-extrabold text-white text-center mb-8 tracking-wider">
          Create Account
        </h2>

        <div className="flex flex-col gap-5">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`bg-black/40 w-full rounded-lg border px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gray-700 ${
              errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
            } transition-all`}
            placeholder="Username"
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`bg-black/40 w-full rounded-lg border px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gray-700 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
            } transition-all`}
            placeholder="Email"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-black/40 w-full rounded-lg border px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
              } transition-all`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="bg-black/40 w-full rounded-lg border border-gray-600 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all"
          >
            <option value="reader">Reader</option>
            <option value="creator">Creator</option>
          </select>

          <button
            onClick={handleSignup}
            className="w-full mt-4 rounded-lg bg-gradient-to-tr from-gray-700 to-gray-600 py-3 text-white font-semibold uppercase tracking-wide hover:from-gray-600 hover:to-gray-500 transition-all duration-300 active:scale-95"
          >
            Register
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Have an account?{' '}
            <button
              type="button"
              onClick={nav}
              className="text-cyan-400 font-bold hover:underline transition-all"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

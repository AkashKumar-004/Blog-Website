const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Import the route for AI summary generation
const aiRoutes = require('./Vectors/aiRoutes'); // Assuming this file is named aiRoutes.js

// Other routes (e.g., auth, blog, profile, dashboard, etc.)
const authRoutes = require('./Routes/userRoutes');
const blogRoutes = require('./Routes/blogRoute');
const profileRoutes = require('./Routes/profileRoutes');
const dashboardRoutes = require('./Routes/dashboardroute');

app.use('/api/ai', aiRoutes); // Mount the aiRoutes at /api/ai
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));

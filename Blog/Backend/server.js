const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Only ONE cors configuration
// app.use(cors({
//   origin: 'https://blog-website-dun-gamma.vercel.app',
//   credentials: true
// }));
app.use(cors());
// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const aiRoutes = require('./Vectors/aiRoutes');
const authRoutes = require('./Routes/userRoutes');
const blogRoutes = require('./Routes/blogRoute');
const profileRoutes = require('./Routes/profileRoutes');
const dashboardRoutes = require('./Routes/dashboardroute');

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);

const Port=process.env.PORT||5001; 
app.listen(Port, () => console.log(`Server running on port ${Port}`));
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));

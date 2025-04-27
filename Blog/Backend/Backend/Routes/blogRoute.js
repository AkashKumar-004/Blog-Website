const express = require('express');
const router = express.Router();
const { createBlog, getRecommendations, updateBlog, deleteBlog } = require('../Controller/blogController');
const verifyToken = require('../Routes/middleware/verifyToken');
const Blog=require('../Model/blogSchema')
const { generateContentVector } = require('../services/generateVector'); 
// Create a blog (protected)
router.post('/', verifyToken, createBlog);

// Get blog recommendations (based on AI similarity)
router.get('/recommendations', getRecommendations);

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Get a specific blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog by ID:', err);
    res.status(500).json({ message: 'Error fetching blog' });
  }
});

// Add like to a blog
router.post('/:id/like', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).select('username author likes');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const userId = req.user.id;

    if (blog.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this blog' });
    }

    blog.likes.push(userId);
    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error liking blog:', err);
    res.status(500).json({ message: 'Error liking blog' });
  }
});

// Update a blog (protected)
router.put('/:id', verifyToken, updateBlog);

// Delete a blog (protected)
router.delete('/:id', verifyToken, deleteBlog);

module.exports = router;

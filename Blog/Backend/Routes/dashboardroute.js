const express = require('express');
const router = express.Router();
const Blog = require('../Model/blogSchema');
const User = require('../Model/userSchema');
const verifyToken = require('../Routes/middleware/verifyToken');

router.get('/liked', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'likedBlogs',
      populate: { path: 'author', select: 'username email' },
    });
    res.json(user.likedBlogs || []);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching liked blogs', error: err });
  }
});

router.get('/recommended', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    const interests = user.interests; 

    const blogs = await Blog.find({
      tags: { $in: interests },
    }).limit(5);

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recommended blogs', error: err });
  }
});

router.get('/user-blogs', verifyToken, async (req, res) => {
    try {

      const blogs = await Blog.find({ author: req.user.id }); 
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user blogs', error: err });
    }
  });
  
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
      interests: user.interests,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err });
  }
});

module.exports = router;

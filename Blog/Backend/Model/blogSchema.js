const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  detailedSummary: {
    type: String,
    default: '',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
 
  },
  username: {
    type: String,
    required:true,
  },
  contentVector: {
    type: [Number],  
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blogs', blogSchema);

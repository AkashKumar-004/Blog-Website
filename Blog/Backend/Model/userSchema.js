const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['reader', 'creator'], default: 'reader' },
  interests: [String],
});

module.exports = mongoose.model('User', userSchema);

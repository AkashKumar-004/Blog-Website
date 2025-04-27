const express = require('express');
const { check, validationResult } = require('express-validator');
const profileController = require('../controllers/profileController');
const verifyToken = require('../middleware/verifyToken'); 

const router = express.Router();

router.get('/profile', verifyToken, profileController.getProfile);

router.put(
  '/profile',
  verifyToken,
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('password', 'Password must be 8 or more characters').optional().isLength({ min: 8 }),
  ],
  profileController.updateProfile
);

module.exports = router;

const express = require('express');
const { check, validationResult } = require('express-validator');
const profileController = require('../Controller/profileController');
const verifyToken = require('../Routes/middleware/verifyToken'); 

const router = express.Router();

router.get('/', verifyToken, profileController.getProfile);  

router.put(
  '/',
  verifyToken,
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('password', 'Password must be 8 or more characters').optional().isLength({ min: 8 }),
  ],
  profileController.updateProfile
);


module.exports = router;

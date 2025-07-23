const express = require('express');
const router = express.Router();

const { generateBlogImage, generateSummary, generateContent } = require('../Controller/aiController'); // Adjust the path

router.post('/generate-image', generateBlogImage);
router.post('/generate-summary', generateSummary);
router.post('/generate-content', generateContent);

module.exports = router;

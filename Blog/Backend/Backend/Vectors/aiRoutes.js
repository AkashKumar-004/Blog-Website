const express = require('express');
const router = express.Router();
const { generateSummary } = require('../Controller/aiController');

router.post('/generate-summary', generateSummary);

module.exports = router;

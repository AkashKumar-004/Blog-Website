const axios = require('axios');
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const generateSummary = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  if (content.length < 50) {
    return res.status(400).json({ message: 'Content should be at least 50 characters for summarization.' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn', 
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 80000,
      }
    );
    if (response.data.error && response.data.error.includes('currently loading')) {
      console.warn('Model is loading. Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000)); 
      
      const retryResponse = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        { inputs: content },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 80000,
        }
      );

      const summary = retryResponse.data[0]?.summary_text || 'Could not generate a meaningful summary. Please try again with more content.';
      return res.json({ summary });
    }

    const summary = response.data[0]?.summary_text || 'Could not generate a meaningful summary. Please try again with more content.';
    res.json({ summary });

  } catch (err) {
    console.error('Hugging Face AI Error:', err?.response?.data || err.message);

    const status = err?.response?.status || 500;

    if (status === 503) {
      return res.status(503).json({ message: 'Hugging Face service temporarily unavailable. Please try again in a few minutes.' });
    }

    const errorMessage = err?.response?.data?.error || 'An error occurred while generating the summary.';
    res.status(500).json({ message: 'Error generating summary', details: errorMessage });
  }
};

module.exports = {
  generateSummary,
};

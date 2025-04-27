// services/generateVector.js
const axios = require('axios');

const generateContentVector = async (content) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/embeddings',  // or your specific endpoint
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer YOUR_HUGGINGFACE_API_TOKEN`,
        },
      }
    );

    const embedding = response.data.embedding;  // depends on Hugging Face model format
    return embedding;
  } catch (error) {
    console.error('Error generating content vector:', error.response?.data || error.message);
    return [];
  }
};

module.exports = { generateContentVector };

const axios = require('axios');

const generateEmbedding = async (text) => {
  const AI_MODEL_API_URL = 'https://api.huggingface.co/your-model-endpoint';  

  try {
    const response = await axios.post(AI_MODEL_API_URL, {
      text: text,
      headers: {
        'Authorization': 'Bearer ' 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Embedding generation failed');
  }
};

const axios = require('axios');

async function generateContentVector(content) {
  try {
    const response = await axios.post('https://api.openai.com/v1/embeddings', {
      model: 'text-embedding-ada-002', 
      input: content,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    return response.data.data[0].embedding;
  } catch (err) {
    console.error('Error generating content vector:', err);
    return [];
  }
}

module.exports = { generateContentVector };

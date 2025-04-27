const axios = require('axios');

// Function to process the blog content and generate a content vector (embedding)
async function generateContentVector(content) {
  try {
    const response = await axios.post('https://api.openai.com/v1/embeddings', {
      model: 'text-embedding-ada-002',  // Use OpenAI's embedding model (or replace with another service)
      input: content,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    // Return the embedding vector
    return response.data.data[0].embedding;
  } catch (err) {
    console.error('Error generating content vector:', err);
    return [];
  }
}

module.exports = { generateContentVector };

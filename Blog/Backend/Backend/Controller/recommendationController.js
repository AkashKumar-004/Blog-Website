const Blog = require('../Model/blogSchema');
const { generateContentVector } = require('../aiProcessing');

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, index) => sum + (val * vecB[index]), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + (val * val), 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + (val * val), 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

async function getRecommendations(req, res) {
  try {
    const userId = req.user.id;
    const userBlogs = await Blog.find({ likes: userId });  
    
    if (userBlogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found for recommendations' });
    }

    const userVector = userBlogs[userBlogs.length - 1].contentVector;

    const allBlogs = await Blog.find();

    const recommendedBlogs = allBlogs
      .map(blog => ({
        blog,
        similarity: cosineSimilarity(userVector, blog.contentVector),
      }))
      .sort((a, b) => b.similarity - a.similarity)  
      .slice(0, 5); 

    res.json(recommendedBlogs.map(item => item.blog));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recommendations', error: err.message });
  }
}

module.exports = { getRecommendations };

const cosineSimilarity = (vec1, vec2) => {
    const dotProduct = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
    const normA = Math.sqrt(vec1.reduce((sum, value) => sum + value ** 2, 0));
    const normB = Math.sqrt(vec2.reduce((sum, value) => sum + value ** 2, 0));
    return dotProduct / (normA * normB); // Cosine similarity formula
  };
  
  const getRecommendations = async (userProfile, allBlogs) => {
    const userInteractions = userProfile.interactedBlogs; // List of blog IDs user interacted with
    const userEmbeddings = userInteractions.map(blogId => {
      const blog = allBlogs.find(b => b._id.toString() === blogId);
      return blog ? blog.embedding : null;
    }).filter(Boolean);
  
    const recommendations = [];
  
    allBlogs.forEach(blog => {
      const similarityScores = userEmbeddings.map(embedding => cosineSimilarity(embedding, blog.embedding));
      const avgSimilarity = similarityScores.reduce((sum, score) => sum + score, 0) / similarityScores.length;
  
      if (avgSimilarity > 0.7) {  // Threshold for recommending content
        recommendations.push({ blog, avgSimilarity });
      }
    });
  
    recommendations.sort((a, b) => b.avgSimilarity - a.avgSimilarity); // Sort by similarity score
  
    return recommendations.slice(0, 5); // Return top 5 recommended blogs
  };
  
  module.exports = { getRecommendations };
  
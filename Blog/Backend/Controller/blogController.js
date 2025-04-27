const Blog = require('../Model/blogSchema');

const createBlog = async (req, res) => {
  try {
    const { title, content, tags, category, summary, imageUrl } = req.body;
    const { id, username } = req.user;

    const newBlog = new Blog({
      title,
      content,
      tags,
      category,
      summary,
      imageUrl,
      author: id,
      username: username,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ message: 'Server error creating blog', error: err.message });
  }
};

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, index) => sum + (val * vecB[index]), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + (val * val), 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + (val * val), 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

const getRecommendations = async (req, res) => {
  try {
    const { blogId } = req.query;

    if (!blogId) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }

    const currentBlog = await Blog.findById(blogId);
    if (!currentBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const allBlogs = await Blog.find();
    const currentEmbedding = currentBlog.embedding;

    const recommendedBlogs = allBlogs
      .map(blog => ({
        blog,
        similarity: cosineSimilarity(currentEmbedding, blog.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    res.status(200).json(recommendedBlogs.map(item => item.blog));
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ message: 'Error fetching recommendations', error: err.message });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, category, summary, imageUrl } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.category = category || blog.category;
    blog.summary = summary || blog.summary;
    blog.imageUrl = imageUrl || blog.imageUrl;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params; 

  try {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Error deleting blog' });
  }
};


module.exports = { createBlog, getRecommendations, updateBlog, deleteBlog };

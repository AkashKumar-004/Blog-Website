import React, { useState } from 'react';
import axios from 'axios';  

const BlogComponent = () => {
  const [blogContent, setBlogContent] = useState('');  
  const [summary, setSummary] = useState(''); 
  const API_URL = import.meta.env.VITE_API_URL;
  const handleContentChange = (e) => {
    setBlogContent(e.target.value); 
  };

  const handleGenerateSummary = async () => {
    if (!blogContent) {
      alert('Content is required to generate a summary');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/ai/generate-summary`, {
        content: blogContent
      });
      const generatedSummary = response.data.summary;
      setSummary(generatedSummary); 
      console.log('Generated summary:', generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  return (
    <div>
      <h2>Write your blog</h2>

      <textarea
        value={blogContent}
        onChange={handleContentChange}  
        placeholder="Write your blog content here..."
        rows="10"
        cols="50"
      />

      <button onClick={handleGenerateSummary}>Generate Summary</button>

      {summary && (
        <div>
          <h3>Generated Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default BlogComponent;

import { GoogleGenAI, Modality } from '@google/genai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const generateBlogImage = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const prompt = `Create a cinematic AI-generated 3D image for a blog titled "${title}". 
  The theme is: ${content.slice(0, 200)}...`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(part => part.inlineData);

    if (!imagePart) {
      return res.status(500).json({ error: "No image generated." });
    }

    const imageData = imagePart.inlineData.data;
    const base64Image = `data:image/png;base64,${imageData}`;
    // console.log(base64Image);
    res.status(200).json({ imageUrl: base64Image });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

export const generateSummary = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Summarize the following content in 8 sentences:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    console.log("Generated Summary:", summary);

    return res.status(200).json({ summary });
  } catch (err) {
    console.error("Error generating summary:", err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const generateContent = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write an original blog post based on this title: "${title}". The blog should be detailed, informative, and engaging.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return res.status(200).json({ content });
  } catch (err) {
    console.error("Error generating content:", err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

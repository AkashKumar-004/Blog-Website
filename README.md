# 📚 Blog Website

A full-stack blog platform featuring AI-powered summarization and AI-powered content generation and AI-powered Image generation. Built with a React front‑end, Node.js/Express back‑end, MongoDB, and Google Gemini-API integrations.

---

## 🔗 Live Demo  
[View it here →](https://blog-website-pi-plum.vercel.app/)

---

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (or your chosen styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **AI Integrations**:
  - **Google Gemini-API** – Content summarization & Summary Generation and Image Generation.
---

## 🛠️ Quick Start

### 1. Clone the repo
bash
- git clone https://github.com/AkashKumar-004/Blog-Website.git
- cd Blog

### 2. FrontEnd Setup
- cd blog/blog
- npm install
- cp .env.example .env
### Edit .env:
- VITE_API_URL=http:"Your URL"
- npm run dev

### 3. Backend Setup
- cd ../backend
- npm install
- cp .env.example .env
### Inside .env, include:
- MONGO_URI= "Your MongoDB connection URI"
- JWT_SECRET="Your JWT secret"
- GOOGLE_API_KEY="Your GOOGLE API key"
- PORT="Your Port Number"

### 4. Build Run Commend
- npm run dev
---

### 4. Features
- User registration + JWT-based authentication
- Create, edit, delete blog posts
- Auto-generated summarization ,content generation & image Generaton via GenAi from Gemini Google
- AI-powered idea assistance via ChatGPT
- Clean, responsive UI
---



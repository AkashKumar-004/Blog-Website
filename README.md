# Navigate into the directory for Frontend
cd blog/blog
# Navigate into the directory for Frontend
cd blog/backend

# Install dependencies
npm install
#--install the necessary dependencies

# Set up environment variables
cp .env.example .env

# Fill the .env file with your configuration for Backend
MONGO_URI=MONGO DB_URL

JWT_SECRET=your_secret_key_here

HUGGINGFACE_API_KEY=your_API_KRY_Here

PORT = YOUR_PORT

# Fill the .env file with your configuration for FrontEnd
 VITE_API_URL = Your_Backend_URL

# Start the development server
npm run dev

Check Out The Live Page 

https://blog-website-pi-plum.vercel.app/

#AI Tools Used
Tool :	Purpose
Hugging Face :	Content Summarization & Tag Suggestions
ChatGPT	Idea : generation and error debugging

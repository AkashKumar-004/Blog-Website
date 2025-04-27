# Clone the repo
git clone https://github.com/your-username/your-repo.git

# Navigate into the directory for Frontend
cd blog/blog/blog
# Navigate into the directory for Frontend
cd blog/blog/backend

# Install dependencies
npm install
#--install the necessary dependencies

# Set up environment variables
cp .env.example .env
# Fill the .env file with your configuration
MONGO_URI=MONGO DB_URL
JWT_SECRET=your_secret_key_here
HUGGINGFACE_API_KEY=your_API_KRY_Here
# Start the development server
npm run dev

#AI Tools Used
Tool :	Purpose
Hugging Face :	Content Summarization & Tag Suggestions
ChatGPT	Idea : generation and error debugging

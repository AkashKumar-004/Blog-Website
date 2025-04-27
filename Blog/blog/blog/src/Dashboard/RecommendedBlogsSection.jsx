const RecommendedBlogsSection = () => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Blogs</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold">Blog Title 1</h4>
            <p className="text-sm text-gray-600">Short description about the blog...</p>
            <button className="text-blue-500 mt-2 hover:underline">Read More</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold">Blog Title 2</h4>
            <p className="text-sm text-gray-600">Short description about the blog...</p>
            <button className="text-blue-500 mt-2 hover:underline">Read More</button>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold">Blog Title 3</h4>
            <p className="text-sm text-gray-600">Short description about the blog...</p>
            <button className="text-blue-500 mt-2 hover:underline">Read More</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RecommendedBlogsSection;
  
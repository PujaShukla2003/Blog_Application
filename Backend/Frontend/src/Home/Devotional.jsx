import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Devotional() {
  const { blogs } = useAuth();
  const DevotionalBlogs = blogs?.filter((blog) => blog.category === "Devotion");

  return (
    <div>
      <div className="container mx-auto my-12 p-4">
        <h1 className="text-2xl font-bold mb-6">Devotional</h1>
        <p className="text-center mb-8">
          The concept of gods varies widely across different cultures, religions, and belief systems
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {DevotionalBlogs && DevotionalBlogs.length > 0 ? (
            DevotionalBlogs.map((blog, index) => (
              <Link
                key={index}
                to={`/blog/${blog.id}`}
                className="relative rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 group"
              >
                <img
                  src={blog?.blogImage?.url}
                  alt={blog?.title}
                  className="w-full h-48 object-cover"
                />

                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75 group-hover:opacity-100 transition duration-300"></div>

                
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-xl font-bold group-hover:text-yellow-500 transition-colors duration-300">
                    {blog.title}
                  </h1>
                  <p className="text-sm text-gray-200">{blog.category}</p>
                </div>
              </Link>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Devotional;

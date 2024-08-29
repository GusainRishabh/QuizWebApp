import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    axios.get('/posts.json')
      .then(response => {
        setBlogPosts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        toast.error("Failed to load blog posts");
      });
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-900 text-gray-300 p-10">
        <h1 className="text-center text-4xl mb-8 text-white border-b-2 border-gray-700 pb-4" style={{marginTop:'15px'}}>My Blogs</h1>
        <div className="max-w-4xl mx-auto">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
              <div className="mb-4 text-gray-500">
                <p className="text-sm">{post.date}</p>
                <p className="text-sm italic">by {post.author}</p>
              </div>
              <p className="text-gray-300">{post.content}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;

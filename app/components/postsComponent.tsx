"use client"

import { useState } from 'react';

interface Post {
  title: string;
  content: string;
  author: string;
}

export default function PostsComponent() {
  const [author, setAuthor] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/data?author=${author}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-32">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Fetch Posts</h2>

      <select


        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select an author</option>
        <option value="alice">alice</option>
        <option value="bob">bob</option>
        <option value="luc">luc</option>
      </select>

      <button
        onClick={fetchPosts}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
      >
        Fetch Posts
      </button>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Content</th>
            <th className="py-3 px-4 text-left">Author</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {posts.map((post, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{post.title}</td>
              <td className="py-3 px-4">{post.content}</td>
              <td className="py-3 px-4">{post.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

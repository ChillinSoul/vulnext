"use client";

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  content: string;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    // Fetch comments from API
    fetch('/api/comments')
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const submitComment = () => {
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment }),
    })
      .then((res) => res.json())
      .then((newComment) => {
        setComments([newComment, ...comments]);
        setComment('');
      });
  };

  const deleteComment = (id: string) => {
    fetch(`/api/comments?id=${id}`, {
      method: 'DELETE',
    }).then(() => {
      setComments(comments.filter((c) => c.id !== id));
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Comments</h2>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
        placeholder="Leave a comment"
      />

      <button onClick={submitComment} className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Comment
      </button>

      <div className="mt-4">
        {comments.map((c) => (
          <div key={c.id} className="p-2 bg-gray-100 my-2 rounded-md">
            <div dangerouslySetInnerHTML={{ __html: c.content }}></div> {/* Vulnerable to XSS */}
            <button
              onClick={() => deleteComment(c.id)}
              className="text-red-500 text-sm hover:underline mt-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
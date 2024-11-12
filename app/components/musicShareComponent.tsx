"use client"

import { useState } from 'react';

interface AudioPost {
    title: string;
    artist: string;
    audioUrl: string;
}

export default function MusicShareComponent() {
    const [artist, setArtist] = useState('');
    const [audioPosts, setAudioPosts] = useState<AudioPost[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const uploadAudio = async () => {
        if (!file || artist.trim() === '') {
            alert('Please select a file and set the artist.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('artist', artist);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setAudioPosts(prev => [...prev, data]);
            } else {
                throw new Error(data.error || "An unknown error occurred");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert(error.message);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-16">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Share Your Music</h2>

            <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full p-2 mb-4 border rounded-md"
            />

            <input
                type="text"
                placeholder="Artist Name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={uploadAudio}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
                Upload Audio
            </button>

            <div className="w-full mt-6">
                {audioPosts.map((post, index) => (
                    <div key={index} className="mb-4 border-b border-gray-200 py-2">
                        <h3 className="text-lg text-gray-700">{post.title} - {post.artist}</h3>
                        <audio controls src={post.audioUrl} className="w-full mt-2"></audio>
                    </div>
                ))}
            </div>
        </div>
    );
}

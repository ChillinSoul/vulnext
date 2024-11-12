'use client';
import React, { useState } from 'react';

const ScriptUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a shell script to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error uploading script:', error);
      setMessage('An error occurred while uploading the script.');
    }
  };

  return (
    <div className="mt-16 mx-40 rounded-lg shadow-md p-8">
      <h1 className="text-lg font-bold">Automation Script Manager</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full p-2 border rounded-md mb-2"
        accept=".sh"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload Script
      </button>
      <div className="mt-4">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ScriptUploader;

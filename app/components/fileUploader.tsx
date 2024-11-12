'use client';
import React, { useState } from 'react';

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
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
      if (data.fileUrl) {
        setFileUrl(data.fileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred while uploading the file.');
    }
  };

  return (
    <div className="mt-16 mx-40 rounded-lg shadow-md p-8">
  <h1 className="text-lg font-bold">File Storage System</h1>

  <input
    type="file"
    onChange={handleFileChange}
    className="w-full p-2 border rounded-md mb-2"
  />

  <button
    onClick={handleUpload}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Upload File
  </button>

  <div className="mt-4">
    <p>{message}</p>
    {fileUrl && (
      <p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View Uploaded File
        </a>
      </p>
    )}
  </div>
</div>
  );
};

export default FileUploader;
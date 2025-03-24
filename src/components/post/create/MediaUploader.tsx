"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface MediaUploaderProps {
  onMediaUpload: (url: string, type: string, publicId: string) => void; // Thêm publicId
  onFileSelect: (file: File | null) => void;
  onClose: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onMediaUpload,
  onFileSelect,
  onClose,
}) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      setUploading(true);
      onFileSelect(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/test-cloudinary", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          onMediaUpload(
            data.url,
            file.type.startsWith("video/") ? "video" : "image",
            data.public_id // Truyền publicId
          );
        } else {
          console.error("Upload failed:", response);
          alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading media:", error);
        alert("Error uploading media. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onMediaUpload, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".svg"],
      "video/*": [".mp4", ".webm", ".ogg"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center py-6 px-8 rounded-xl cursor-pointer focus:outline-none"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <i className="fa fa-times"></i>
      </button>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-pink-500 text-center">
          <i className="fa fa-cloud-upload-alt mr-2"></i> Drop the file here...
        </p>
      ) : (
        <>
          <i className="fa fa-cloud-upload-alt fa-2x text-gray-500 mb-2"></i>
          <p className="text-gray-700 text-center">
            Drag and drop an image or video here, or click to select
          </p>
        </>
      )}
      {uploading && <p className="text-gray-500">Uploading...</p>}
    </div>
  );
};

export default MediaUploader;

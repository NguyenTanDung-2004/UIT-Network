"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface MediaUploaderProps {
  onMediaSelect: (file: File, previewUrl: string, type: string) => void;
  onFileSelect: (file: File | null) => void;
  onClose: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onMediaSelect,
  onFileSelect,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      if (rejectedFiles && rejectedFiles.length > 0) {
        console.error("File rejected:", rejectedFiles);
        setError("Invalid file type selected.");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) {
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "image";

      onMediaSelect(file, previewUrl, type);
    },
    [onMediaSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".svg", ".webp"],
      "video/*": [".mp4", ".webm", ".ogg", ".mov"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="relative flex flex-col items-center justify-center py-6 px-8 rounded-xl cursor-pointer focus:outline-none border-2 border-dashed border-gray-400 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none z-10 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Close uploader"
      >
        <i className="fa fa-times"></i>
      </button>
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="text-pink-500">
            <i className="fa fa-cloud-upload-alt mr-2"></i> Drop file here...
          </p>
        ) : (
          <>
            <i className="fa fa-cloud-upload-alt fa-2x text-gray-500 dark:text-gray-400 mb-2"></i>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Drag & drop or click to select image/video
            </p>
          </>
        )}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default MediaUploader;

"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileUpload: (fileInfo: {
    name: string;
    size: number;
    url: string;
    type: string;
  }) => void; // Sửa kiểu dữ liệu
  onFileSelect: (file: File | null) => void;
  onClose: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
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
        const response = await fetch("/api/file-upload", {
          method: "POST",
          body: formData,
        });

        console.log("Response Status:", response.status);

        if (response.ok) {
          const data = await response.json();
          onFileUpload({
            // Truyền đối tượng fileInfo
            name: file.name,
            size: file.size,
            url: data.url,
            type: file.type,
          });
        } else {
          console.error("Upload failed. Status:", response.status);
          try {
            const errorData = await response.json();
            console.error("Upload failed. Error Data:", errorData);
            alert(
              `Upload failed. Status: ${response.status}. Message: ${
                errorData.error || "Unknown error"
              }`
            );
          } catch (jsonError) {
            console.error("Failed to parse error JSON:", jsonError);
            alert(
              `Upload failed. Status: ${response.status}. Could not parse error message.`
            );
          }
        }
      } catch (error: any) {
        console.error("Error uploading file:", error);
        alert(`Error uploading file: ${error.message || "Unknown error"}`);
      } finally {
        setUploading(false);
      }
    },
    [onFileUpload, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center py-6 px-8 rounded-xl cursor-pointer focus:outline-none border-2 border-dashed border-gray-400"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-pink-500 text-center">
          <i className="fas fa-cloud-upload-alt mr-2"></i>
          Drop the file here ...
        </p>
      ) : (
        <>
          <i className="fas fa-cloud-upload-alt fa-2x text-gray-500 mb-2"></i>
          <p className="text-gray-700 text-center dark:text-gray-400 text-sm">
            Drag and drop a file here, or click to select a file (PDF, DOCX,
            DOC)
          </p>
        </>
      )}
      {uploading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Uploading...</p>
      )}
    </div>
  );
};

export default FileUploader;

"use client";

import React, { useState, useCallback } from "react";
import EmojiPicker from "./EmojiPicker";
import MediaUploader from "./MediaUploader";
import FileUploader from "./FileUploader";

export interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}
interface CreatePostModalProps {
  onClose: () => void;
  onPost: (
    content: string,
    mediaList?: { url: string; type: string }[],
    file?: UploadedFile
  ) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onPost,
}) => {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [mediaList, setMediaList] = useState<{ url: string; type: string }[]>(
    []
  );
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prevContent) => prevContent + emoji);
    setShowEmojiPicker(false);
  };

  const handleMediaUpload = (url: string, type: string) => {
    setMediaList((prevList) => [...prevList, { url, type }]);
  };

  const handleDeleteMedia = async (indexToRemove: number) => {
    const mediaToDelete = mediaList[indexToRemove];

    if (!mediaToDelete) return;

    try {
      const response = await fetch(
        `/api/test-cloudinary?url=${encodeURIComponent(mediaToDelete.url)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Xóa thành công khỏi Cloudinary, cập nhật state
        setMediaList((prevList) =>
          prevList.filter((_, index) => index !== indexToRemove)
        );
      } else {
        console.error("Failed to delete media from Cloudinary");
        alert("Failed to delete media from Cloudinary");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Error deleting media");
    }
  };

  const handleFileUpload = (fileInfo: UploadedFile) => {
    setUploadedFile(fileInfo);
    setFileUrl(fileInfo.url);
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handlePost = () => {
    onPost(content, mediaList, uploadedFile || undefined);
    onClose();
  };

  const handleDeleteFile = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!uploadedFile) return;

    try {
      const response = await fetch("/api/file-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: uploadedFile.url }),
      });

      if (response.ok) {
        setUploadedFile(null);
        setFileUrl(undefined);
      } else {
        console.error("Failed to delete file");
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return "/images/files/pdf-icon.png";
    } else if (
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword"
    ) {
      return "/images/files/file-icon.png";
    } else {
      return "/images/files/file-icon.png";
    }
  };

  const handleViewFile = () => {
    if (uploadedFile) {
      window.open(uploadedFile.url, "_blank");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80  flex items-center justify-center z-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh] dark:bg-gray-800 dark:shadow-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Create a post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          <textarea
            value={content}
            onChange={handleInputChange}
            placeholder="Share some what you are thinking?"
            className="w-full h-20 p-3 border rounded-lg resize-none  focus:outline-none focus:ring-2 focus:ring-pink-200 text-[15px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 "
          />

          {/* Display selected image or video */}
          {mediaList.length > 0 &&
            mediaList.map((media, index) => (
              <div
                key={index}
                className="mt-3 rounded-lg overflow-hidden relative"
              >
                {media.type === "image" && (
                  <img
                    src={media.url}
                    alt="Uploaded Image"
                    className="w-full object-cover"
                  />
                )}
                {media.type === "video" && (
                  <video
                    src={media.url}
                    controls
                    className="w-full object-cover"
                  />
                )}
                <button
                  onClick={() => handleDeleteMedia(index)}
                  className="absolute top-1 right-1 bg-white bg-opacity-50 text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70 focus:outline-none transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-opacity-80"
                  aria-label="Delete media"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            ))}

          {uploadedFile ? (
            // Hiển thị thông tin file và nút xóa
            <div
              className="mt-3 border rounded-md shadow-sm p-3 w-full flex items-center justify-between cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              onClick={handleViewFile}
            >
              <div className="flex items-center">
                <img
                  src={getFileIcon(uploadedFile.type)}
                  alt="File Icon"
                  className="w-8 h-8 mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeleteFile}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex flex-col gap-2 dark:border-gray-700">
          {showMediaUploader && (
            <div className="rounded-xl border-2 border-dashed border-gray-400 p-4 dark:border-gray-600">
              <MediaUploader
                onMediaUpload={handleMediaUpload}
                onFileSelect={handleFileSelect}
                onClose={() => setShowMediaUploader(false)}
              />
            </div>
          )}

          {showFileUploader && (
            <div className="">
              <FileUploader
                onFileUpload={(fileInfo) =>
                  handleFileUpload(fileInfo as UploadedFile)
                }
                onFileSelect={handleFileSelect}
                onClose={() => setShowFileUploader(false)}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowEmojiPicker(true)}
              className=" text-gray-500 hover:text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300"
            >
              <i className="far fa-smile text-lg"></i>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowMediaUploader(true);
                  setShowFileUploader(false);
                }}
                className="text-gray-500 hover:text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="far fa-image text-lg"></i>
              </button>

              <button
                onClick={() => {
                  setShowFileUploader(true);
                  setShowMediaUploader(false);
                }}
                className="text-gray-500 hover:text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="fa fa-paperclip text-lg"></i>
              </button>
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            className="mt-3 bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-3xl focus:outline-none"
          >
            Post
          </button>
        </div>

        {/* Emoji Picker Modal */}
        {showEmojiPicker && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 dark:bg-gray-900 dark:bg-opacity-50">
            <div className="bg-white rounded-lg p-4 dark:bg-gray-700">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none dark:bg-gray-500 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;

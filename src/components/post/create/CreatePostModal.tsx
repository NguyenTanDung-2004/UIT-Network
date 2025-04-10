"use client";

import React, { useState, useCallback, useEffect } from "react";
import EmojiPicker from "./EmojiPicker";
import MediaUploader from "./MediaUploader";
import FileUploader from "./FileUploader";
import { useToast } from "@/hooks/use-toast";

export interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}

interface SelectedMedia {
  id: string;
  file: File;
  previewUrl: string;
  type: string;
}

interface CreatePostModalProps {
  onClose: () => void;
  onPost: (
    content: string,
    mediaList?: { url: string; type: string }[], // URL cuối cùng từ Cloudinary
    file?: UploadedFile // File từ FileUploader
  ) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onPost,
}) => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);

  // State mới cho media đã chọn (chưa upload)
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);

  // State cho FileUploader (giữ nguyên)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    setError(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prevContent) => prevContent + emoji);
    setShowEmojiPicker(false);
  };

  // Hàm xử lý khi media được chọn từ MediaUploader
  const handleMediaSelect = (file: File, previewUrl: string, type: string) => {
    const newMedia: SelectedMedia = {
      id: crypto.randomUUID(),
      file,
      previewUrl,
      type,
    };
    setSelectedMedia((prevList) => [...prevList, newMedia]);
    setError(null);
  };

  // Hàm xóa media đã chọn khỏi danh sách preview
  const handleDeleteSelectedMedia = (idToRemove: string) => {
    const mediaToDelete = selectedMedia.find(
      (media) => media.id === idToRemove
    );
    if (mediaToDelete) {
      URL.revokeObjectURL(mediaToDelete.previewUrl);
      setSelectedMedia((prevList) =>
        prevList.filter((media) => media.id !== idToRemove)
      );
    }
  };

  // --- FileUploader---
  const handleFileUpload = (fileInfo: UploadedFile) => {
    setUploadedFile(fileInfo);
    setShowFileUploader(false);
    setShowMediaUploader(false);
    setSelectedMedia([]);
  };

  const handleFileSelect = (file: File | null) => {};

  const handleDeleteFile = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!uploadedFile) return;
    const tempFileUrl = uploadedFile.url;
    setUploadedFile(null); // Remove from UI first
    try {
      const response = await fetch("/api/file-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tempFileUrl }),
      });
      if (!response.ok) {
        console.error("Failed to delete file");
        setError("Failed to delete file.");
        toast({
          title: "Error",
          description: "Failed to delete the attached file.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "File Removed",
          description: "The attached file has been removed.",
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Error deleting file.");
      toast({
        title: "Error",
        description: "An error occurred while deleting the file.",
        variant: "destructive",
      });
    }
  };
  // --- FileUploader ---

  // Hàm xử lý khi nhấn nút Post
  const handlePost = async () => {
    if (!content.trim() && selectedMedia.length === 0 && !uploadedFile) {
      setError("Cannot create an empty post.");
      return;
    }

    setIsPosting(true);
    setError(null);

    let finalMediaList: { url: string; type: string }[] = [];

    try {
      if (selectedMedia.length > 0) {
        const uploadPromises = selectedMedia.map(async (media) => {
          const formData = new FormData();
          formData.append("file", media.file);
          const response = await fetch("/api/test-cloudinary", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error(`Upload failed for ${media.file.name}`);
          }
          const data = await response.json();
          if (!data.url) {
            throw new Error(`API response missing URL for ${media.file.name}`);
          }

          // Trả về URL từ Cloudinary và type
          return { url: data.url, type: media.type };
        });
        finalMediaList = await Promise.all(uploadPromises);
      }
      onPost(
        content,
        finalMediaList.length > 0 ? finalMediaList : undefined,
        uploadedFile || undefined
      );

      toast({
        title: "Post Created",
        description: "Your post has been successfully created.",
        variant: "default",
      });

      // Cleanup và đóng modal
      selectedMedia.forEach((media) => URL.revokeObjectURL(media.previewUrl));
      onClose();
    } catch (uploadError: any) {
      console.error("Error during post creation:", uploadError);
      setError(
        `Post failed: ${uploadError.message || "Could not upload media."}`
      );

      toast({
        title: "Post Failed",
        description: uploadError.message || "Could not upload media.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    return () => {
      selectedMedia.forEach((media) => URL.revokeObjectURL(media.previewUrl));
    };
  }, [selectedMedia]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") return "/images/files/pdf-icon.png";
    if (type.includes("wordprocessingml") || type === "application/msword")
      return "/images/files/docx-icon.png";
    if (type.includes("spreadsheetml") || type === "application/vnd.ms-excel")
      return "/images/files/xlsx-icon.png";
    return "/images/files/file-icon.png";
  };

  const handleViewFile = () => {
    if (uploadedFile) window.open(uploadedFile.url, "_blank");
  };

  const openMediaUploader = () => {
    if (!uploadedFile) {
      // Chỉ mở nếu không có file
      setShowMediaUploader(true);
      setShowFileUploader(false);
      setShowEmojiPicker(false);
    } else {
      setError("Remove the attached file to add media.");
    }
  };
  const closeMediaUploader = () => setShowMediaUploader(false);

  const openFileUploader = () => {
    if (selectedMedia.length === 0 && !uploadedFile) {
      // Chỉ mở nếu không có media/file
      setShowFileUploader(true);
      setShowMediaUploader(false);
      setShowEmojiPicker(false);
    } else if (selectedMedia.length > 0) {
      setError("Remove added media to attach a file.");
    } else {
      setError("A file is already attached.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg flex flex-col max-h-[90vh] dark:bg-gray-800 dark:shadow-gray-700">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Create a post
          </h2>
          <button
            onClick={onClose}
            disabled={isPosting}
            className="text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <textarea
            value={content}
            onChange={handleInputChange}
            placeholder="Share what you are thinking?"
            className="w-full h-20 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 text-[15px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            disabled={isPosting}
          />

          {/* Media Previews */}
          {selectedMedia.length > 0 && (
            <div
              className={`mt-3 grid gap-2 ${
                selectedMedia.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {selectedMedia.map((media) => (
                <div
                  key={media.id}
                  className="rounded-lg overflow-hidden relative aspect-video bg-gray-200 dark:bg-gray-700 group"
                >
                  {media.type === "image" && (
                    <img
                      src={media.previewUrl}
                      alt={`Preview ${media.file.name}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {media.type === "video" && (
                    <video
                      src={media.previewUrl}
                      controls
                      className="w-full h-full object-cover"
                      playsInline
                    />
                  )}
                  <button
                    onClick={() => handleDeleteSelectedMedia(media.id)}
                    disabled={isPosting}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-70 focus:outline-none transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    aria-label="Remove media"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media Uploader (Conditional Render) */}
          {showMediaUploader && (
            <div className="mt-3">
              <MediaUploader
                onMediaSelect={handleMediaSelect}
                onFileSelect={handleFileSelect}
                onClose={closeMediaUploader}
              />
            </div>
          )}

          {/* File Uploader Display */}
          {uploadedFile && (
            <div
              className="mt-3 border rounded-md shadow-sm p-3 w-full flex items-center justify-between cursor-pointer dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={handleViewFile}
            >
              <div className="flex items-center overflow-hidden mr-2">
                <img
                  src={getFileIcon(uploadedFile.type)}
                  alt="File Icon"
                  className="w-8 h-8 mr-2 flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeleteFile}
                disabled={isPosting}
                className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t dark:border-gray-700">
          {showFileUploader && (
            <div className="mb-3">
              <FileUploader
                onFileUpload={handleFileUpload}
                onFileSelect={handleFileSelect}
                onClose={() => setShowFileUploader(false)}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-3">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isPosting}
                className="text-gray-500 hover:text-gray-700 rounded-md disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <i className="far fa-smile text-lg"></i>
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-10">
                  <div className="bg-white rounded-lg shadow-lg p-2 dark:bg-gray-700">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openMediaUploader}
                disabled={isPosting || !!uploadedFile}
                className="text-gray-500 hover:text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Add image or video"
              >
                <i className="far fa-image text-lg"></i>
              </button>
              <button
                onClick={openFileUploader}
                disabled={
                  isPosting || selectedMedia.length > 0 || !!uploadedFile
                }
                className="text-gray-500 hover:text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Attach file"
              >
                <i className="fa fa-paperclip text-lg"></i>
              </button>
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            disabled={
              isPosting ||
              (!content.trim() && selectedMedia.length === 0 && !uploadedFile)
            }
            className="w-full bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transition-opacity"
          >
            {isPosting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

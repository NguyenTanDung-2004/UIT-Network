import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}
interface PostProps {
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    fullContent?: string;
    date: string;
    time: string;
    mediaList?: { url: string; type: string }[];
    likes: number;
    comments: number;
    shares: number;
    file?: UploadedFile;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false); // State quản lý người dùng đã like post chưa
  const [isShared, setIsShared] = useState(false); // State quản lý người dùng đã share post chưa
  const [showMoreOptions, setShowMoreOptions] = useState(false); // State cho setting of post
  const [isExpanded, setIsExpanded] = useState(false); // State cho viewmore
  const [likesCount, setLikesCount] = useState(post.likes); // State cho số lượt like
  const [sharesCount, setSharesCount] = useState(post.shares); // State cho số lượt share
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1); // Cập nhật số lượt like
  };

  const handleShare = () => {
    setIsShared(!isShared);
    setSharesCount(isShared ? sharesCount - 1 : sharesCount + 1); // Cập nhật số lượt share
  };

  // Lấy icon file dựa trên loại file
  const getFileIcon = (fileUrl: string): string => {
    if (fileUrl.endsWith(".pdf")) {
      return "/images/files/pdf-icon.png";
    } else if (fileUrl.endsWith(".doc") || fileUrl.endsWith(".docx"))
      return "/images/files/docx-icon.png";
    else {
      return "/images/files/file-icon.png";
    }
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // show media
  const openMediaViewer = (index: number) => {
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
  };
  const closeMediaViewer = () => {
    setShowMediaViewer(false);
  };
  const gotoPreviousMedia = () => {
    setCurrentMediaIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };
  const gotoNextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      Math.min((post.mediaList?.length || 0) - 1, prevIndex + 1)
    );
  };
  const limitedMediaList = post.mediaList?.slice(0, 4);
  const hasMoreMedia = (post.mediaList?.length || 0) > 4;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative dark:bg-gray-800 dark:shadow-gray-700">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Link href={`/profile/${post.author.id}`}>
            <div className="w-10 h-10 relative rounded-full overflow-hidden border dark:border-gray-700">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="ml-2">
            <Link href={`/profile/${post.author.id}`}>
              <span className="font-medium text-gray-900 block dark:text-gray-300">
                {post.author.name}
              </span>
            </Link>
            <span className="text-gray-500 text-sm dark:text-gray-400">
              {post.date} {post.time}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>
        {showMoreOptions && (
          <div className="absolute right-4 mt-5 w-36 bg-white text-[#7b7b7b] border rounded-md shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] z-10 dark:bg-gray-700 dark:border-gray-600 dark:shadow-[0px_0px_14px_0px_rgba(0,0,0,0.4)] dark:text-gray-300">
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300">
              <i className="fas fa-bookmark w-5 text-center mr-3"></i>
              <span>Save post</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300">
              <i className="fas fa-flag w-5 text-center mr-3"></i>
              <span>Report</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300">
              <i className="fas fa-eye-slash w-5 text-center mr-3"></i>
              <span>Hide</span>
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-300">
          {post.content === ""
            ? post.fullContent
            : isExpanded
            ? post.fullContent || post.content
            : post.content}
          {post.content !== "" && post.fullContent && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-primary hover:text-opacity-90 ml-1"
            >
              Read more
            </button>
          )}
        </p>
      </div>

      {/* Post Media */}
      {post.mediaList && post.mediaList.length > 0 && (
        <div
          className={`grid gap-2 mb-3 ${
            post.mediaList.length === 1
              ? "grid-cols-1"
              : post.mediaList.length === 2
              ? "grid-cols-2"
              : post.mediaList.length === 3
              ? "grid-cols-3 grid-rows-2"
              : "grid-cols-2"
          }`}
        >
          {limitedMediaList?.map((media, index) => (
            <div
              key={index}
              className={`relative overflow-hidden cursor-pointer rounded-md border ${
                (post.mediaList?.length || 0) === 3
                  ? index === 0
                    ? "col-span-2 row-span-2 aspect-[16/9]"
                    : "aspect-[16/9]"
                  : "aspect-[16/9]"
              }`}
              onClick={() => openMediaViewer(index)}
            >
              <div
                className={` ${
                  hasMoreMedia && index === 3 ? " opacity-30" : ""
                }`}
              >
                {media.type === "image" ? (
                  <Image
                    src={media.url}
                    alt={`Post media ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : media.type === "video" ? (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
              {hasMoreMedia && index === 3 && (
                <div className="absolute inset-0 flex items-center justify-center text-black  dark:text-white text-2xl font-bold">
                  + {(post.mediaList?.length || 0) - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post File*/}
      {post.file && (
        <div
          className="mt-3 border rounded-sm shadow-sm p-3 w-full flex items-center gap-4 cursor-pointer dark:bg-gray-700 dark:border-gray-600"
          onClick={() => window.open(post.file?.url, "_blank")}
        >
          <div className="flex items-center">
            <img
              src={getFileIcon(post.file.type)}
              alt="File"
              className="w-8 h-8 "
            />
          </div>
          <div>
            <p className="text-sm font-medium dark:text-gray-300">
              {post.file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(post.file.size)}
            </p>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
        {/* like */}
        <button
          onClick={handleLike}
          className={`flex items-center ${
            isLiked ? "text-primary dark:" : "text-gray-400"
          } hover:text-opacity-80 `}
        >
          <div
            className={`py-2 px-3 rounded-3xl ${
              isLiked ? "bg-pink-200" : ""
            } transition-colors duration-200`}
          >
            <i className={`${isLiked ? "fas" : "far"} fa-thumbs-up mr-2`}></i>
            <span>{isLiked ? "Liked" : "Like"}</span>
          </div>
          <span
            className={`ml-1 ${
              isLiked
                ? "bg-pink-200 text-primary px-2 py-1 rounded-full"
                : "text-gray-400"
            }`}
          >
            {likesCount} {/* Hiển thị số lượt like từ state */}
          </span>
        </button>

        {/* cmt */}
        <button className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <div className="p-2 rounded-md">
            <i className="far fa-comment-alt mr-2"></i>
            <span>Comment</span>
          </div>
          <span className="ml-1 text-gray-400">{post.comments}</span>
        </button>

        {/* share */}
        <button
          onClick={handleShare}
          className={`flex items-center ${
            isShared ? "text-primary" : "text-gray-400"
          } hover:text-opacity-80 `}
        >
          <div
            className={`py-2 px-3 rounded-3xl ${
              isShared ? "bg-pink-200" : ""
            } transition-colors duration-200`}
          >
            <i className={`fas fa-share mr-2`}></i>
            <span>{isShared ? "Shared" : "Share"}</span>
          </div>
          <span
            className={`ml-1 ${
              isShared
                ? "bg-pink-200 text-primary px-2 py-1 rounded-full"
                : "text-gray-400"
            }`}
          >
            {sharesCount}
          </span>
        </button>
      </div>

      {showMediaViewer && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={closeMediaViewer}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
          {currentMediaIndex > 0 && (
            <button
              onClick={gotoPreviousMedia}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100"
            >
              <i className="fas fa-chevron-left text-2xl"></i>
            </button>
          )}
          {currentMediaIndex < (post.mediaList?.length || 0) - 1 && (
            <button
              onClick={gotoNextMedia}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100"
            >
              <i className="fas fa-chevron-right text-2xl"></i>
            </button>
          )}
          <div className="relative w-4/5 h-4/5">
            {post.mediaList && post.mediaList[currentMediaIndex] ? (
              post.mediaList[currentMediaIndex].type === "image" ? (
                <Image
                  src={post.mediaList[currentMediaIndex].url}
                  alt="Post media"
                  fill
                  className="object-contain"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <video
                  src={post.mediaList[currentMediaIndex].url}
                  controls
                  className="w-full h-full object-contain"
                  style={{ objectFit: "contain" }}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <p>No media to display</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

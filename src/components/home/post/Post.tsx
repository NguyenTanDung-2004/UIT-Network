import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    images?: string[];
    likes: number;
    comments: number;
    shares: number;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes); // State cho số lượt like
  const [sharesCount, setSharesCount] = useState(post.shares); // State cho số lượt share

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1); // Cập nhật số lượt like
  };

  const handleShare = () => {
    setIsShared(!isShared);
    setSharesCount(isShared ? sharesCount - 1 : sharesCount + 1); // Cập nhật số lượt share
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Link href={`/profile/${post.author.id}`}>
            <div className="w-10 h-10 relative rounded-full overflow-hidden border">
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
              <span className="font-medium text-gray-900 block">
                {post.author.name}
              </span>
            </Link>
            <span className="text-gray-500 text-sm">
              {post.date} {post.time}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>
        {showMoreOptions && (
          <div className="absolute right-4 mt-5 w-36 bg-white text-[#7b7b7b] border rounded-md shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] z-10">
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100">
              <i className="fas fa-bookmark w-5 text-center mr-3"></i>
              <span>Save post</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100">
              <i className="fas fa-flag w-5 text-center mr-3"></i>
              <span>Report</span>
            </button>
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100">
              <i className="fas fa-eye-slash w-5 text-center mr-3"></i>
              <span>Hide</span>
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-gray-800">
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

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div
          className={`grid gap-2 mb-3 ${
            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[16/9] rounded-md overflow-hidden"
            >
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center pt-2 border-t">
        {/* like */}
        <button
          onClick={handleLike}
          className={`flex items-center ${
            isLiked ? "text-primary" : "text-gray-500"
          } hover:text-primary`}
        >
          <div
            className={`py-2 px-3 rounded-3xl ${
              isLiked ? "bg-pink-100" : ""
            } transition-colors duration-200`}
          >
            <i className={`${isLiked ? "fas" : "far"} fa-thumbs-up mr-2`}></i>
            <span>{isLiked ? "Liked" : "Like"}</span>
          </div>
          <span
            className={`ml-1 ${
              isLiked
                ? "bg-pink-100 text-primary px-2 py-1 rounded-full"
                : "text-gray-400"
            }`}
          >
            {likesCount} {/* Hiển thị số lượt like từ state */}
          </span>
        </button>

        {/* cmt */}
        <button className="flex items-center text-gray-500 hover:text-gray-700">
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
            isShared ? "text-primary" : "text-gray-500"
          } hover:text-primary`}
        >
          <div
            className={`py-2 px-3 rounded-3xl ${
              isShared ? "bg-pink-100" : ""
            } transition-colors duration-200`}
          >
            <i className={`fas fa-share mr-2`}></i>
            <span>{isShared ? "Shared" : "Share"}</span>
          </div>
          <span
            className={`ml-1 ${
              isShared
                ? "bg-pink-100 text-primary px-2 py-1 rounded-full"
                : "text-gray-400"
            }`}
          >
            {sharesCount} {/* Hiển thị số lượt share từ state */}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Post;

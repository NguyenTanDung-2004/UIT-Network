"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DetailPostModal from "./detail/DetailPostModal";
import MediaViewerModal from "../profile/media/MediaViewerModal";
import { useUser } from "@/contexts/UserContext";
import { getIsLiked, likePost } from "@/services/postService";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

export interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}

export interface AuthorInfo {
  id: string;
  name: string;
  avatar: string;
}

interface GroupInfo {
  id: string;
  name: string;
  isJoined: boolean;
}

interface PageInfo {
  isFollowing: boolean;
}

interface PostOriginPage {
  type: "page";
  pageInfo: PageInfo;
}

interface PostOriginGroup {
  type: "group";
  groupInfo: GroupInfo;
}

export type PostOrigin = PostOriginPage | PostOriginGroup;

export interface PostDataType {
  id: string;
  author: AuthorInfo;
  origin?: PostOrigin;
  content: string;
  fullContent?: string;
  date: string;
  time: string;
  mediaList?: { url: string; type: string }[];
  likes: number;
  comments: number;
  shares: number;
  file?: UploadedFile;
  // commentData?: CommentType[]; // Loại bỏ prop này, DetailPostModal sẽ tự fetch
}

interface PostProps {
  post: PostDataType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = useUser();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [sharesCount, setSharesCount] = useState(post.shares);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const initialIsFollowing =
    post.origin?.type === "page" ? post.origin.pageInfo.isFollowing : false;
  const initialIsJoined =
    post.origin?.type === "group" ? post.origin.groupInfo.isJoined : false;

  const [isFollowingPage, setIsFollowingPage] = useState(initialIsFollowing);
  const [isJoinedGroup, setIsJoinedGroup] = useState(initialIsJoined);

  const currentUserAvatar = user?.avtURL || DEFAULT_AVATAR;

  useEffect(() => {
    let isMounted = true;
    if (user?.id && post.id) {
      const fetchIsLikedStatus = async () => {
        try {
          const likedStatus = await getIsLiked(post.id, user.id);
          if (isMounted) {
            setIsLiked(likedStatus);
          }
        } catch (err) {
          console.error("Failed to fetch like status:", err);
        }
      };
      fetchIsLikedStatus();
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id, post.id]);

  const handleLike = async () => {
    if (!user?.id) {
      console.warn("User not logged in. Cannot like post.");
      return;
    }

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await likePost(post.id);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleShare = () => {
    setIsShared(!isShared);
    setSharesCount(isShared ? sharesCount - 1 : sharesCount + 1);
  };

  const handleFollowToggle = () => {
    if (post.origin?.type === "page") {
      console.log("Toggle follow for page:", post.author.id);
      setIsFollowingPage(!isFollowingPage);
    }
  };

  const handleJoinToggle = () => {
    if (post.origin?.type === "group") {
      console.log("Toggle join for group:", post.origin.groupInfo.id);
      setIsJoinedGroup(!isJoinedGroup);
    }
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.includes("pdf")) return "/images/files/pdf-icon.png";
    if (fileType.includes("doc") || fileType.includes("docx"))
      return "/images/files/docx-icon.png";
    return "/images/files/file-icon.png";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const openMediaViewer = (index: number) => {
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
  };
  const closeMediaViewer = () => setShowMediaViewer(false);

  const limitedMediaList = post.mediaList?.slice(0, 4);
  const hasMoreMedia = (post.mediaList?.length || 0) > 4;

  const renderPostHeader = () => {
    if (post.origin?.type === "page") {
      return (
        <div className="flex items-center">
          <Link href={`/pages/${post.author.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border dark:border-gray-700">
              <Image
                src={post.author.avatar || DEFAULT_AVATAR}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="ml-2 flex-grow min-w-0">
            <div className="flex items-center space-x-2">
              <Link href={`/pages/${post.author.id}`}>
                <span className="font-medium text-gray-900 dark:text-gray-300 truncate hover:text-primary">
                  {post.author.name}
                </span>
              </Link>
              <span className="text-gray-400 dark:text-gray-500">·</span>
              <button
                onClick={handleFollowToggle}
                className={`text-sm font-medium ${
                  isFollowingPage
                    ? "text-gray-500 dark:text-gray-400"
                    : "text-primary hover:text-opacity-80"
                }`}
              >
                {isFollowingPage ? "Following" : "Follow"}
              </button>
            </div>
            <span className="text-gray-500 text-sm dark:text-gray-400 block">
              {post.date} {post.time}
            </span>
          </div>
        </div>
      );
    } else if (post.origin?.type === "group") {
      const groupOrigin = post.origin as PostOriginGroup;
      return (
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Link href={`/groups/${groupOrigin.groupInfo.id}`}>
              <span className="font-medium text-gray-900 dark:text-gray-300 hover:text-primary">
                {groupOrigin.groupInfo.name}
              </span>
            </Link>
            <span className="text-gray-400 dark:text-gray-500">·</span>
            <button
              onClick={handleJoinToggle}
              className={`text-sm font-medium ${
                isJoinedGroup
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-primary hover:text-opacity-80"
              }`}
            >
              {isJoinedGroup ? "Joined" : "Join"}
            </button>
          </div>
          <div className="flex items-center">
            <Link
              href={`/profiles/${post.author.id}`}
              className="flex-shrink-0"
            >
              <div className="w-8 h-8 relative rounded-full overflow-hidden border dark:border-gray-700">
                <Image
                  src={post.author.avatar || DEFAULT_AVATAR}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="ml-2">
              <Link href={`/profiles/${post.author.id}`}>
                <span className="font-medium text-gray-700 text-sm dark:text-gray-400 hover:text-primary">
                  {post.author.name}
                </span>
              </Link>
              <span className="text-gray-500 text-xs dark:text-gray-500 block">
                {post.date} {post.time}
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <Link href={`/profiles/${post.author.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border dark:border-gray-700">
              <Image
                src={post.author.avatar || DEFAULT_AVATAR}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="ml-2">
            <Link href={`/profiles/${post.author.id}`}>
              <span className="font-medium text-gray-900 block dark:text-gray-300 hover:text-primary">
                {post.author.name}
              </span>
            </Link>
            <span className="text-gray-500 text-sm dark:text-gray-400">
              {post.date} {post.time}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative dark:bg-gray-800 dark:shadow-gray-700">
      <div className="flex justify-between items-start mb-3">
        {renderPostHeader()}
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0 ml-2"
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>
        {showMoreOptions && (
          <div className="absolute right-4 mt-8 w-36 bg-white text-[#7b7b7b] border rounded-md shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] z-10 dark:bg-gray-700 dark:border-gray-600 dark:shadow-[0px_0px_14px_0px_rgba(0,0,0,0.4)] dark:text-gray-300">
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
              <i className="fas fa-bookmark w-5 text-center mr-3"></i> Save
            </button>
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
              <i className="fas fa-flag w-5 text-center mr-3"></i> Report
            </button>
            <button className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
              <i className="fas fa-eye-slash w-5 text-center mr-3"></i> Hide
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-gray-800 dark:text-gray-300">
          {isExpanded || !post.fullContent || post.content.length < 200
            ? post.fullContent || post.content
            : `${post.content}...`}
          {!isExpanded && post.fullContent && post.content.length >= 200 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-primary hover:text-opacity-90 ml-1 font-medium"
            >
              Read more
            </button>
          )}
        </p>
      </div>

      {post.mediaList && post.mediaList.length > 0 && (
        <div
          className={`grid gap-1 mb-3 ${
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
              className={`relative overflow-hidden cursor-pointer rounded-md border dark:border-gray-700 ${
                post.mediaList?.length === 3 && index === 0
                  ? "col-span-2 row-span-2"
                  : ""
              }`}
              style={{
                aspectRatio:
                  post.mediaList?.length === 3 && index === 0
                    ? "auto"
                    : "16 / 10",
              }}
              onClick={() => openMediaViewer(index)}
            >
              <div
                className={`w-full h-full ${
                  hasMoreMedia && index === 3 ? " opacity-40" : ""
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
                  />
                ) : null}
              </div>
              {hasMoreMedia && index === 3 && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-black bg-opacity-50">
                  +{(post.mediaList?.length || 0) - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {post.file && (
        <div
          className="mt-3 border rounded-md shadow-sm p-3 w-full flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
          onClick={() => window.open(post.file?.url, "_blank")}
        >
          <img
            src={getFileIcon(post.file.type)}
            alt="File"
            className="w-8 h-8 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium dark:text-gray-300 truncate">
              {post.file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(post.file.size)}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700 mt-3">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 text-sm font-medium ${
            isLiked
              ? "text-primary dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <i className={`${isLiked ? "fas" : "far"} fa-thumbs-up`}></i>
          <span>
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </span>
        </button>

        <button
          onClick={() => setIsDetailModalOpen(true)} // Mở modal khi click vào nút Comments
          className="flex items-center space-x-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <i className="far fa-comment-alt"></i>
          <span>Comments</span>
        </button>

        <button
          onClick={handleShare}
          className={`flex items-center space-x-1.5 text-sm font-medium ${
            isShared
              ? "text-primary dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <i className="fas fa-share"></i>
          <span>
            {sharesCount} {sharesCount === 1 ? "Share" : "Shares"}
          </span>
        </button>
      </div>

      {showMediaViewer && post.mediaList && (
        <MediaViewerModal
          isOpen={showMediaViewer}
          onClose={closeMediaViewer}
          mediaList={post.mediaList}
          startIndex={currentMediaIndex}
        />
      )}

      {isDetailModalOpen && (
        <DetailPostModal
          post={post} // Pass the entire post object
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          currentUserAvatar={currentUserAvatar}
        />
      )}
    </div>
  );
};

export default Post;

import React from "react";
import Image from "next/image";
import { Post } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

interface PostReviewItemProps {
  post: Post;
  groupId: string;
  onApprove?: (postId: string) => void;
  onReject?: (postId: string) => void;
}

const PostReviewItem: React.FC<PostReviewItemProps> = ({
  post,
  groupId,
  onApprove,
  onReject,
}) => {
  const renderMedia = (mediaArray: Post["media"]) => {
    if (!mediaArray || mediaArray.length === 0) return null;
    const firstMedia = mediaArray[0];

    if (firstMedia.typeId === 2) {
      return (
        <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden">
          <Image
            src={firstMedia.url}
            alt="Post media preview"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      );
    }
    // Add video/file previews if needed, similar to the full Post component
    // For now, return null for other types
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3 border border-gray-200 dark:border-gray-700">
      {/* Post Author Info */}
      <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border dark:border-gray-700">
          <Image
            src={post.authorAvatar}
            alt={`${post.authorName} avatar`}
            fill={true}
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {post.authorName}
            {post.postType.value === "anonymous" && (
              <span className="ml-1 text-xs italic text-gray-500 dark:text-gray-400">
                (Anonymous)
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(post.createdDate), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="text-sm text-gray-800 dark:text-gray-200 space-y-3">
        <p>{post.caption}</p>
        {renderMedia(post.media)}
      </div>

      {/* Actions / Status */}
      {post.status === "PENDING" && (
        <div className="flex space-x-3 justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onApprove?.(post.postId)}
            className="px-4 py-1 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => onReject?.(post.postId)}
            className="px-4 py-1 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
      {post.status !== "PENDING" && (
        <div
          className={`text-xs font-semibold text-right pt-3 border-t border-gray-200 dark:border-gray-700 ${
            post.status === "APPROVED"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {post.status}
        </div>
      )}
    </div>
  );
};

export default PostReviewItem;

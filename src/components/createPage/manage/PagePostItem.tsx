import React from "react";
import Image from "next/image";
import { PagePost } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

interface PagePostItemProps {
  post: PagePost;
  pageId: string;
  onRemove?: (postId: string) => void;
}

const PagePostItem: React.FC<PagePostItemProps> = ({
  post,
  pageId,
  onRemove,
}) => {
  const renderMedia = (mediaArray: PagePost["media"]) => {
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
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3 border border-gray-200 dark:border-gray-700">
      {/* Post Author/Page Info */}
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

      {/* Action */}
      <div className="flex space-x-3 justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onRemove?.(post.postId)}
          className="px-4 py-1 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default PagePostItem;

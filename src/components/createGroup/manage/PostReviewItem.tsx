import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/mockData";

interface PostReviewItemProps {
  post: Post;
  groupId: string;
  onApprove?: (postId: string) => void;
  onReject?: (postId: string) => void;
  processing?: boolean; // Thêm prop processing để disable nút
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const PostReviewItem: React.FC<PostReviewItemProps> = ({
  post,
  groupId,
  onApprove,
  onReject,
  processing = false, // Mặc định là false
}) => {
  const renderMedia = (mediaArray: Post["media"]) => {
    if (!mediaArray || mediaArray.length === 0) return null;
    const firstMedia = mediaArray[0];

    if (firstMedia.typeId === 2) {
      // Image
      return (
        <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden">
          <Image
            src={firstMedia.url || DEFAULT_AVATAR} // Thêm fallback
            alt="Post media preview"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      );
    } else if (firstMedia.typeId === 3) {
      // Video
      return (
        <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden">
          <video
            src={firstMedia.url || ""} // Thêm fallback
            controls
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (
      firstMedia.typeId === 1 &&
      firstMedia.name &&
      firstMedia.sizeValue
    ) {
      // File
      // Tùy chọn hiển thị file, có thể dùng icon và tên file
      const getFileIcon = (fileName: string): string => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (ext === "pdf") return "/images/files/pdf-icon.png";
        if (["doc", "docx"].includes(ext || ""))
          return "/images/files/docx-icon.png";
        if (["xls", "xlsx"].includes(ext || ""))
          return "/images/files/xlsx-icon.png";
        if (["ppt", "pptx"].includes(ext || ""))
          return "/images/files/pptx-icon.png";
        if (["zip", "rar"].includes(ext || ""))
          return "/images/files/zip-icon.png";
        return "/images/files/file-icon.png";
      };

      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
      };

      return (
        <div className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50 dark:bg-gray-700">
          <img
            src={getFileIcon(firstMedia.name)}
            alt="file icon"
            className="w-8 h-8"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {firstMedia.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(firstMedia.sizeValue)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border dark:border-gray-700">
          <Image
            src={post.authorAvatar || DEFAULT_AVATAR}
            alt={`${post.authorName} avatar`}
            fill={true}
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {post.authorName}
            {post.postType?.value === "anonymous" && ( // Optional chaining added
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

      <div className="text-sm text-gray-800 dark:text-gray-200 space-y-3">
        <p>{post.caption}</p>
        {renderMedia(post.media)}
      </div>

      {post.status === "PENDING" && (
        <div className="flex space-x-3 justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onApprove?.(post.postId)}
            disabled={processing}
            className="px-4 py-1 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve
          </button>
          <button
            onClick={() => onReject?.(post.postId)}
            disabled={processing}
            className="px-4 py-1 text-sm font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

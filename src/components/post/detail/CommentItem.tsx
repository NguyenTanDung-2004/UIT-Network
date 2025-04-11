import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Định nghĩa kiểu dữ liệu cho một comment
export interface CommentType {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string; // Ví dụ: "15 hours ago" hoặc một đối tượng Date
  likes: number;
  replies?: CommentType[]; // Mảng các comment trả lời (có thể lồng nhau)
}

interface CommentItemProps {
  comment: CommentType;
  isReply?: boolean;
  onReply?: (authorName: string, commentId: string) => void; // Hàm callback khi nhấn nút Reply
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply = false,
  onReply,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLikeComment = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    // TODO: Gọi API để like/unlike comment
  };

  // Hàm xử lý text để hiển thị tag @mention màu hồng
  const renderCommentText = (text: string) => {
    const words = text.split(/(\s+)/); // Tách chữ và khoảng trắng
    return words.map((word, index) => {
      if (word.startsWith("@")) {
        return (
          <span key={index} className="text-primary font-medium">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <div className={`flex ${isReply ? "ml-10 mt-2" : "mt-4"}`}>
      <Link href={`/profile/${comment.author.id}`} className="flex-shrink-0">
        <div className="w-8 h-8 relative rounded-full overflow-hidden border dark:border-gray-600">
          <Image
            src={comment.author.avatar}
            alt={comment.author.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      {/* Comment Content */}
      <div className="ml-2 flex-grow">
        <div className="bg-gray-100 rounded-xl px-3 py-2 dark:bg-gray-700">
          <Link href={`/profile/${comment.author.id}`}>
            <span className="font-semibold text-sm text-gray-900 block dark:text-gray-200">
              {comment.author.name}
            </span>
          </Link>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            {renderCommentText(comment.text)}
          </p>
        </div>
        {/* Actions (Like, Reply, Time) */}
        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          <button
            onClick={handleLikeComment}
            className={`font-medium hover:underline ${
              isLiked ? "text-primary" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            onClick={() => onReply && onReply(comment.author.name, comment.id)}
            className="font-medium hover:underline"
          >
            Reply
          </button>
          <span>{comment.timestamp}</span>
          {likesCount > 0 && (
            <div className="flex items-center">
              <i className="fas fa-thumbs-up text-primary text-xs"></i>
              <span className="ml-1">{likesCount}</span>
            </div>
          )}
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply={true}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

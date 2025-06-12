import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
  replies?: CommentType[];
  isReply?: boolean;
}

interface CommentItemProps {
  comment: CommentType;
  onReply?: (authorName: string, commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLikeComment = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const renderCommentText = (text: string) => {
    const words = text.split(/(\s+)/);
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
    <div className={`flex ${comment.isReply ? "ml-10 mt-2" : "mt-4"}`}>
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
      </div>
    </div>
  );
};

export default CommentItem;

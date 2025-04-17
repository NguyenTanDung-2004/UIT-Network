import React from "react";
import Image from "next/image";
import { Message } from "@/types/chats/ChatData";

interface ChatMessageItemProps {
  message: Message;
  isSender: boolean;
  isGroup: boolean;
  onMediaClick: (url: string, type: "image" | "video") => void;
}

const formatTime = (date: Date): string => {
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

const getFileIcon = (fileType?: string): string => {
  if (!fileType) return "/images/files/file-icon.png";
  const lowerType = fileType.toLowerCase();
  if (lowerType.includes("pdf")) return "/images/files/pdf-icon.png";
  if (lowerType.includes("doc") || lowerType.includes("wordprocessingml"))
    return "/images/files/docx-icon.png";
  if (lowerType.includes("txt") || lowerType.includes("plain"))
    return "/images/files/txt-icon.png";
  return "/images/files/file-icon.png";
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isSender,
  isGroup,
  onMediaClick,
}) => {
  const alignment = isSender ? "items-end" : "items-start";
  const bubbleColor = isSender
    ? "bg-mainChat text-white"
    : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100";
  const bubbleRadius = isSender
    ? "rounded-l-lg rounded-br-lg"
    : "rounded-r-lg rounded-bl-lg";

  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <img
            src={message.mediaUrl}
            alt="Sent Image"
            className="max-w-xs md:max-w-sm rounded-lg cursor-pointer object-cover"
            onClick={() =>
              message.mediaUrl && onMediaClick(message.mediaUrl, "image")
            }
          />
        );
      case "video":
        return (
          <video
            src={message.mediaUrl}
            controls // Hiển thị controls mặc định cho video
            className="max-w-xs md:max-w-sm rounded-lg cursor-pointer"
            onClick={(e) => {
              // Mở viewer khi click vào video, không phải controls
              if (e.target === e.currentTarget && message.mediaUrl) {
                onMediaClick(message.mediaUrl, "video");
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        );
      case "file":
        return (
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 p-2 rounded-lg ${
              isSender
                ? "hover:bg-pink-600"
                : "hover:bg-gray-300 dark:hover:bg-gray-500"
            } transition-colors`}
          >
            <img
              src={getFileIcon(message.fileType)}
              alt="file icon"
              className="w-6 h-6 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs opacity-80">
                {formatFileSize(message.fileSize)}
              </p>
            </div>
          </a>
        );
      case "text":
      default:
        return (
          <p className="text-sm break-words whitespace-pre-wrap">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex flex-col ${alignment} mb-3`}>
      {isGroup && !isSender && message.senderName && (
        <div className="flex items-center mb-1 ml-10">
          <Image
            src={message.senderAvatar || "/default-avatar.png"}
            width={20}
            height={20}
            alt={message.senderName}
            className="w-5 h-5 rounded-full mr-1.5"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {message.senderName}
          </span>
        </div>
      )}
      <div
        className={`flex ${
          isSender ? "flex-row-reverse" : "flex-row"
        } items-end max-w-[75%]`}
      >
        <div className={`px-3 py-2 ${bubbleColor} ${bubbleRadius} shadow-sm`}>
          {renderContent()}
        </div>
      </div>
      <span
        className={`text-[11px] mt-1 ${
          isSender ? "mr-1 text-right" : "ml-1 text-left"
        } text-gray-400 dark:text-gray-500`}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};

export default ChatMessageItem;

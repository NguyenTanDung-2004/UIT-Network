import React from "react";
import Image from "next/image";
import { Message } from "@/types/chats/ChatData";
import { getFileIcon, formatFileSize } from "@/utils/ViewFilesUtils";

interface ChatMessageItemProps {
  message: Message;
  isSender: boolean;
  isGroup: boolean;
  onMediaClick: (url: string, type: "image" | "video") => void;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const formatTime = (date: Date): string => {
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
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

  const renderContentText = (text: string) => {
    const parts = text.split(/(@AIAssist)/g); // Tách chuỗi theo "@AIAssist"
    return (
      <p className="text-sm break-words whitespace-pre-wrap">
        {parts.map((part, index) =>
          part === "@AIAssist" ? (
            <span key={index} className="font-bold text-black dark:text-white">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </p>
    );
  };

  const renderMessageContentAndMedia = () => {
    return (
      <>
        {message.content &&
          message.content.trim() !== "" &&
          renderContentText(message.content)}

        {message.mediaUrl &&
          (message.type === "image" || message.type === "video") && (
            <div
              className={`mt-2 ${
                message.content && message.content.trim() !== ""
                  ? ""
                  : "max-w-xs"
              } relative rounded-lg overflow-hidden cursor-pointer`}
              onClick={() =>
                message.mediaUrl &&
                onMediaClick(
                  message.mediaUrl,
                  message.type as "image" | "video"
                )
              }
            >
              {message.type === "image" ? (
                <Image
                  src={message.mediaUrl}
                  alt="Chat media"
                  width={200}
                  height={150}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <video
                  src={message.mediaUrl}
                  controls={false}
                  className="w-full h-auto max-h-[150px] object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {message.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          )}

        {message.mediaUrl && message.type === "file" && (
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 flex items-center gap-2 p-2 rounded-lg ${
              isSender
                ? "hover:bg-pink-600"
                : "hover:bg-gray-300 dark:hover:bg-gray-500"
            } transition-colors`}
          >
            <Image
              src={getFileIcon(message.fileType || "")}
              alt="File icon"
              width={24}
              height={24}
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {message.fileName || "File"}
              </p>
              <p className="text-xs opacity-80">
                {formatFileSize(message.fileSize)}
              </p>
            </div>
          </a>
        )}
      </>
    );
  };

  return (
    <div className={`flex flex-col ${alignment} mb-3`}>
      {isGroup && !isSender && message.senderName && (
        <div className="flex items-center mb-1">
          <Image
            src={message.senderAvatar || DEFAULT_AVATAR}
            width={20}
            height={20}
            alt={message.senderName}
            className="w-5 h-5 rounded-full mr-1.5 object-cover"
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
          {renderMessageContentAndMedia()}
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

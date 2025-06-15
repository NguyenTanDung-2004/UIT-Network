import React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";

interface ChatListItemProps {
  id: string;
  type: "person" | "group";
  avatar: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  isActive: boolean;
  isOnline: boolean;
  onClick: (id: string, type: "person" | "group") => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  type,
  avatar,
  name,
  unread,
  isActive,
  isOnline,
  onClick,
}) => {
  console.log("ChatListItem rendered:", { id, unread });
  return (
    <button
      onClick={() => onClick(id, type)}
      className={`w-full flex items-center p-3 text-left rounded-lg transition-colors duration-150 focus:outline-none ${
        isActive
          ? "bg-primary/10 dark:bg-primary/20"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="w-10 h-10 flex-shrink-0 mr-3 relative">
        <div className="rounded-full overflow-hidden absolute inset-0 border">
          <Image
            src={avatar}
            alt={`${name}'s avatar`}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full "></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <p
            className={`text-sm font-semibold truncate ${
              isActive
                ? "text-primary dark:text-primary-light"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p
            className={`text-xs truncate ${
              unread && !isActive
                ? "font-semibold text-gray-700 dark:text-gray-300"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {}
          </p>
          {unread && (
            <span className="ml-2 flex-shrink-0 w-2.5 h-2.5 bg-primary rounded-full"></span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatListItem;

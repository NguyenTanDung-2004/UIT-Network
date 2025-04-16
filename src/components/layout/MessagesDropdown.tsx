import React from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

interface MessagePreviewData {
  id: string;
  avatar: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  read: boolean;
}

interface MessagesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
  messages: MessagePreviewData[];
  newCount: number;
}

const MessagesDropdown: React.FC<MessagesDropdownProps> = ({
  isOpen,
  onClose,
  onExpand,
  messages,
  newCount,
}) => {
  if (!isOpen) return null;

  const formatTimestamp = (date: Date): string => {
    try {
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return formatDistanceToNowStrict(date, { addSuffix: false })
          .replace(" minutes", "m")
          .replace(" minute", "m")
          .replace(" hours", "h")
          .replace(" hour", "h")
          .replace(" seconds", "s")
          .replace(" second", "s");
      } else if (diffHours < 48) {
        return "1d";
      } else {
        // Show dd/mm/yyyy for older messages
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] overflow-hidden z-50 dark:bg-[#2b2d2e] dark:shadow-[0px_0px_14px_0px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        <div className="flex items-center">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Chats
          </h3>
          {newCount > 0 && (
            <span className="ml-3 px-2 py-0.5 bg-pink-100 text-primary rounded-full text-xs font-medium ">
              {newCount} new
            </span>
          )}
        </div>
        <button
          onClick={onExpand}
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none"
          aria-label="Expand messages view"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.length > 0 ? (
          messages.map((item) => (
            <div
              key={item.id}
              className={`flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                !item.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => {
                console.log("Clicked chat :", item.id);
              }}
            >
              <div className="flex-shrink-0 mr-3">
                <Image
                  src={item.avatar}
                  alt={`${item.name}'s Avatar`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-grow overflow-hidden">
                <p
                  className={`text-sm font-medium text-gray-800 dark:text-gray-200 truncate ${
                    !item.read ? "font-bold" : ""
                  }`}
                >
                  {item.name}
                </p>
                <p
                  className={`text-xs text-gray-600 dark:text-gray-400 truncate ${
                    !item.read
                      ? "font-semibold text-gray-700 dark:text-gray-300"
                      : ""
                  }`}
                >
                  {item.lastMessage}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0 text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatTimestamp(item.timestamp)}
                </p>
                {!item.read && (
                  <span className="mt-1 block w-2 h-2 bg-primary rounded-full ml-auto"></span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No new chats.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesDropdown;

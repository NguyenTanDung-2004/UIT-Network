import React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation";

interface NotificationItemData {
  id: string;
  avatar: string;
  content: React.ReactNode;
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
  onClearAll: () => void;
  notifications: NotificationItemData[];
  newCount: number;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  onViewAll,
  onClearAll,
  notifications,
  newCount,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const formatTimestamp = (date: Date): string => {
    try {
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        return formatDistanceToNowStrict(date, { addSuffix: false });
      } else if (diffHours < 48) {
        return "1d";
      } else {
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "numeric",
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
            Notifications
          </h3>
          {newCount > 0 && (
            <span className="ml-3 px-2 py-0.5 bg-pink-100 text-primary rounded-full text-xs font-medium ">
              {newCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:underline focus:outline-none font-med"
        >
          Clear all
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                !item.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => router.push("/notifications")}
            >
              <div className="flex-shrink-0 mr-3">
                <Image
                  src={item.avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                  {item.content}
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
            No new notifications.
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t dark:border-gray-700">
          <button
            onClick={onViewAll}
            className="w-full py-3 text-center text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;

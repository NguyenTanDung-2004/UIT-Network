import React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/navigation"; // Keep if onClick navigates

interface NotificationItemData {
  id: string;
  avatar: string;
  content: React.ReactNode;
  timestamp: Date;
  read: boolean;
  link?: string;
}

interface NotificationCardProps {
  notification: NotificationItemData;
  onClick?: (id: string, link?: string) => void;
}

const formatTimestamp = (date: Date): string => {
  try {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) {
      return formatDistanceToNowStrict(date, { addSuffix: false });
    } else if (diffHours < 48) {
      return "1d";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date";
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(notification.id, notification.link);
    } else if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div
      key={notification.id}
      className={`flex items-start p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150 rounded-md ${
        !notification.read
          ? "bg-ghostWhite dark:bg-blue-900/15"
          : "bg-white dark:bg-gray-800"
      }`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mr-4">
        <Image
          src={notification.avatar}
          alt="User Avatar"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          {notification.content}
        </p>
        <p className="text-xs text-primary dark:text-primary-light mt-1">
          {formatTimestamp(notification.timestamp)}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0 self-center">
        {!notification.read && (
          <span
            className="block w-2.5 h-2.5 bg-primary rounded-full"
            title="Unread"
          ></span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;

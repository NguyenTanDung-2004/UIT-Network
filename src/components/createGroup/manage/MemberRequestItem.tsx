import React from "react";
import Image from "next/image";
import { User } from "@/lib/mockData";

interface MemberRequestItemProps {
  user: User;
  groupId: string;
  type: "member" | "request";
  onAccept?: (userId: string) => void;
  onReject?: (userId: string) => void;
  onRemove?: (userId: string) => void;
}

const MemberRequestItem: React.FC<MemberRequestItemProps> = ({
  user,
  groupId,
  type,
  onAccept,
  onReject,
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt={`${user.name} avatar`}
            fill={true}
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.name}
            {user.status === "admin" && (
              <span className="ml-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                (Admin)
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex space-x-2 flex-shrink-0">
        {type === "request" && (
          <>
            <button
              onClick={() => onAccept?.(user.id)}
              className="px-4 py-1 text-sm font-medium  rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => onReject?.(user.id)}
              className="px-4 py-1 text-sm font-medium  rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600"
            >
              Reject
            </button>
          </>
        )}
        {type === "member" &&
          user.status !== "admin" && ( // Prevent removing admin in mock
            <button
              onClick={() => onRemove?.(user.id)}
              className="px-4 py-1 text-sm font-medium  rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600"
            >
              Remove
            </button>
          )}
      </div>
    </div>
  );
};

export default MemberRequestItem;

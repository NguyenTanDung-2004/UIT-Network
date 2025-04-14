"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

export interface GroupData {
  id: string;
  name: string;
  avatar?: string;
  stats?: string; // Combined string like "13K members · 2 posts/day"
  isJoined: boolean;
}

interface GroupCardProps {
  group: GroupData;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const handleAction = () => {
    console.log("Action for group:", group.id, "isJoined:", group.isJoined);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between space-x-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Link href={`/groups/${group.id}`} className="flex-shrink-0">
          {/* Groups often use square or rounded-lg avatars */}
          <div className="w-14 h-14 relative rounded-lg overflow-hidden cursor-pointer">
            <Image
              src={group.avatar || DEFAULT_AVATAR}
              alt={group.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        </Link>
        <div className="min-w-0">
          <Link href={`/groups/${group.id}`} className="cursor-pointer">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-primary dark:hover:text-primary">
              {group.name}
            </h4>
          </Link>
          {group.stats && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {group.stats}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={handleAction}
          className={`min-w-32 px-5 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 ${
            group.isJoined
              ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
              : "bg-pink-100 text-primary hover:bg-pink-200   hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80"
          }`}
        >
          {group.isJoined ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;

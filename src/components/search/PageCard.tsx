"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface PageData {
  id: string;
  name: string;
  avatar?: string;
  descriptionLines: string[]; // Array of strings for description lines
  isFollowing: boolean;
}

interface PageCardProps {
  page: PageData;
}

const PageCard: React.FC<PageCardProps> = ({ page }) => {
  const handleAction = () => {
    console.log("Action for page:", page.id, "isFollowing:", page.isFollowing);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between space-x-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Link href={`/pages/${page.id}`} className="flex-shrink-0">
          <div className="w-14 h-14 relative rounded-full overflow-hidden cursor-pointer">
            <Image
              src={page.avatar || DEFAULT_AVATAR}
              alt={page.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        </Link>
        <div className="min-w-0">
          <Link href={`/pages/${page.id}`} className="cursor-pointer">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-pink-500 dark:hover:text-pink-400">
              {page.name}
            </h4>
          </Link>
          {page.descriptionLines && page.descriptionLines.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-0.5 mt-1">
              {page.descriptionLines.map((line, index) => (
                <p key={index} className="truncate">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={handleAction}
          className={`px-5 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 ${
            page.isFollowing
              ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
              : "bg-pink-100 dark:bg-pink-800/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/50"
          }`}
        >
          {page.isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default PageCard;

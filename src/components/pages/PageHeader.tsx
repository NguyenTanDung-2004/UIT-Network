"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MessagesSquare } from "lucide-react";
import { PageHeaderData } from "@/types/pages/PageData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface PageHeaderProps {
  pageData: PageHeaderData;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageData }) => {
  const [isFollowing, setIsFollowing] = useState(pageData.isFollowing);

  useEffect(() => {
    setIsFollowing(pageData.isFollowing);
  }, [pageData.isFollowing]);

  const handleFollowAction = () => {
    setIsFollowing((prev) => !prev);
    console.log("Follow action clicked, new state:", !isFollowing);
  };

  const handleChatAction = () => {
    console.log("Chat action clicked");
  };

  const renderActionButtons = () => {
    return (
      <div className="flex items-center space-x-2">
        {/* <button
          onClick={handleChatAction}
          className="gap-2 min-w-28 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200    bg-primary text-white hover:bg-opacity-80"
        >
          <MessagesSquare size={16} className="mr-1.5" />
          Chat
        </button> */}

        <button
          onClick={handleFollowAction}
          className={`min-w-28 px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 ${
            isFollowing
              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
              : "bg-primary text-white hover:bg-opacity-80"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-t-lg">
      <div className="h-48 md:h-64 lg:h-80 w-full relative group">
        <Image
          src={pageData.coverPhoto}
          alt="Cover photo"
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-lg"
        />
      </div>

      <div className="px-4 md:px-8 pb-4 relative">
        <div className="absolute left-4 md:left-8 transform -mt-8 md:-mt-12 lg:-mt-16">
          <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative group bg-gray-200 dark:bg-gray-700">
            <Image
              src={pageData.avatar || DEFAULT_AVATAR}
              alt={pageData.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        <div className="pt-3 md:pt-4 mb-20 pb-1 flex flex-col md:flex-row justify-between items-center md:items-end space-y-3 md:space-y-0">
          <div className="text-center md:text-left w-full md:w-auto mt-2 md:mt-0 md:ml-44 lg:ml-48 xl:ml-52">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {pageData.name}
            </h1>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

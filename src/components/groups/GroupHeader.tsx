"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Lock, Users, UserPlus, Check, MessagesSquare } from "lucide-react";
import { GroupHeaderData } from "@/types/groups/GroupData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface GroupHeaderProps {
  groupData: GroupHeaderData;
}

const formatMemberCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toString();
};

const GroupHeader: React.FC<GroupHeaderProps> = ({ groupData }) => {
  const [isJoined, setIsJoined] = useState(groupData.isJoined);

  useEffect(() => {
    setIsJoined(groupData.isJoined);
  }, [groupData.isJoined]);

  const handleJoinAction = () => {
    setIsJoined((prev) => !prev);
    console.log("Join action clicked, new state:", !isJoined);
  };
  const handleChatAction = () => {
    console.log("Chat action clicked");
  };

  const renderActionButtons = () => {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleChatAction}
          className="gap-2 min-w-28 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200    bg-primary text-white hover:bg-opacity-80"
        >
          <MessagesSquare size={16} className="mr-1.5" />
          Chat
        </button>
        <button
          onClick={handleJoinAction}
          className={`min-w-28 px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 flex items-center justify-center gap-1.5 ${
            isJoined
              ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
              : "bg-primary text-white hover:bg-opacity-80"
          }`}
        >
          {isJoined ? (
            <>
              <Check size={16} /> Joined
            </>
          ) : (
            <>
              <UserPlus size={16} /> Join Group
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-t-lg">
      <div className="h-48 md:h-64 lg:h-80 w-full relative group">
        <Image
          src={groupData.coverPhoto || "/placeholder-cover.jpg"}
          alt="Cover photo"
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-lg bg-gray-300 dark:bg-gray-600"
        />
      </div>
      <div className="px-4 md:px-8 pt-4 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end space-y-3 md:space-y-0">
          <div className="text-center md:text-left w-full md:w-auto">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {groupData.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 dark:text-gray-400 mt-1.5 space-x-2">
              {groupData.isPrivate ? (
                <Lock size={14} className="text-gray-400 dark:text-gray-500" />
              ) : (
                <Users size={14} className="text-gray-400 dark:text-gray-500" />
              )}
              <span>
                {groupData.isPrivate ? "Private Group" : "Public Group"}
              </span>
              {/* <span className="font-bold text-gray-600 dark:text-gray-300">
                ·
              </span>
              <span>{formatMemberCount(groupData.memberCount)} members</span> */}
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;

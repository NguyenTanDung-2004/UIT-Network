"use client";

import React from "react";
import Image from "next/image";
import {
  Camera,
  Edit,
  UserPlus,
  MessagesSquare,
  UserCheck,
  UserX,
} from "lucide-react";
import { ProfileHeaderData } from "@/types/profile/ProfileData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface ProfileHeaderProps {
  profileData: ProfileHeaderData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const handleFriendAction = () => {
    console.log("Friend action clicked", profileData.friendshipStatus);
  };

  const handleChatAction = () => {
    console.log("Chat action clicked");
  };

  const renderActionButtons = () => {
    if (profileData.friendshipStatus === "self") {
      return (
        <button className="min-w-28 flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          <Edit size={16} className="mr-1.5" />
          Edit profile
        </button>
      );
    }

    let friendButtonText = "Add Friend";
    let friendButtonIcon = <UserPlus size={16} className="mr-2" />;
    let friendButtonStyle =
      " duration-200 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500";

    let isFriendActionDisabled = false;

    switch (profileData.friendshipStatus) {
      case "friend":
        friendButtonText = "Friend";
        friendButtonIcon = <UserCheck size={16} className="mr-2" />;
        friendButtonStyle =
          "duration-200 bg-primary text-white hover:bg-opacity-80";
        break;
      case "pending_sent":
        friendButtonText = "Request Sent";
        friendButtonIcon = <UserX size={16} className="mr-2" />;
        friendButtonStyle =
          "duration-200 bg-pink-100 text-primary hover:bg-pink-200   hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80";

        break;
      case "pending_received":
        friendButtonText = "Respond";
        friendButtonIcon = <UserPlus size={16} className="mr-2" />;
        friendButtonStyle =
          "duration-200 bg-pink-100 text-primary hover:bg-pink-200   hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80";

        break;
      case "not_friend":
        break;
      default:
        break;
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleFriendAction}
          className={`gap-2 min-w-32 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${friendButtonStyle}`}
        >
          {friendButtonIcon}
          {friendButtonText}
        </button>
        <button
          onClick={handleChatAction}
          className="gap-2 min-w-32 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200    bg-primary text-white hover:bg-opacity-80"
        >
          <MessagesSquare size={16} className="mr-1.5" />
          Chat
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-t-lg">
      <div className="h-48 md:h-64 lg:h-80 w-full relative group">
        <Image
          src={profileData.coverPhoto}
          alt="Cover photo"
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-lg"
        />
        {profileData.friendshipStatus === "self" && (
          <button className="absolute bottom-3 right-3 bg-black bg-opacity-40 text-white p-1.5 rounded-full hover:bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Camera size={18} />
          </button>
        )}
      </div>

      <div className="px-4 md:px-8 pb-4 relative">
        <div className="absolute left-4 md:left-8 transform -mt-8 md:-mt-12 lg:-mt-16">
          <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative group bg-gray-200 dark:bg-gray-700">
            <Image
              src={profileData.avatar || DEFAULT_AVATAR}
              alt={profileData.name}
              layout="fill"
              objectFit="cover"
            />
            {profileData.friendshipStatus === "self" && (
              <button className="absolute bottom-1 right-1 bg-black bg-opacity-40 text-white p-1 rounded-full hover:bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="pt-3 md:pt-4 mb-20 pb-1 flex flex-col md:flex-row justify-between items-center md:items-end space-y-3 md:space-y-0">
          <div className="text-center md:text-left w-full md:w-auto mt-2 md:mt-0 md:ml-44 lg:ml-48 xl:ml-52">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {profileData.name}
            </h1>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profileData.followerCount} followers · {profileData.friendCount}{" "}
              friends
            </p> */}
          </div>
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

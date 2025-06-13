"use client";

import React, { useState, useEffect } from "react";
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
import { FriendshipStatus } from "@/types/profile/FriendData"; // Import FriendshipStatus
import { useUser } from "@/contexts/UserContext"; // Import useUser
import {
  getFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "@/services/friendService"; // Import các hàm API
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface ProfileHeaderProps {
  profileData: ProfileHeaderData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const { user } = useUser(); // Lấy thông tin người dùng hiện tại
  const [currentFriendshipStatus, setCurrentFriendshipStatus] = useState<
    FriendshipStatus | "loading" | "error"
  >("loading");

  const router = useRouter();
  useEffect(() => {
    let isMounted = true;
    if (user?.id && profileData.id) {
      if (user.id === profileData.id) {
        setCurrentFriendshipStatus("self");
        return;
      }

      setCurrentFriendshipStatus("loading");
      getFriendshipStatus(user.id, profileData.id)
        .then((status) => {
          if (isMounted) {
            setCurrentFriendshipStatus(status);
          }
        })
        .catch((err) => {
          console.error("Error fetching friendship status:", err);
          if (isMounted) {
            setCurrentFriendshipStatus("error");
          }
        });
    } else {
      setCurrentFriendshipStatus("not_friend"); // Default if user not logged in or ID missing
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id, profileData.id]);

  const handleFriendAction = async () => {
    if (
      !user?.id ||
      currentFriendshipStatus === "loading" ||
      currentFriendshipStatus === "error" ||
      currentFriendshipStatus === "self"
    ) {
      console.warn("Invalid state or user for friend action.");
      return;
    }

    const currentUserId = user.id;
    const otherUserId = profileData.id;

    try {
      const prevStatus = currentFriendshipStatus; // Lưu trạng thái trước để rollback
      setCurrentFriendshipStatus("loading"); // Hiển thị loading

      switch (prevStatus) {
        case "not_friend":
          await sendFriendRequest(currentUserId, otherUserId);
          setCurrentFriendshipStatus("pending_sent");
          break;
        case "pending_sent":
          await cancelFriendRequest(currentUserId, otherUserId); // Hủy yêu cầu đã gửi
          setCurrentFriendshipStatus("not_friend");
          break;
        case "pending_received":
          // Chấp nhận yêu cầu
          await acceptFriendRequest(currentUserId, otherUserId); // otherUserId là người gửi, currentUserId là người nhận
          setCurrentFriendshipStatus("friend");
          break;
        case "friend":
          await removeFriend(currentUserId, otherUserId);
          setCurrentFriendshipStatus("not_friend");
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Friend action failed:", err);
      setCurrentFriendshipStatus("error"); // Hoặc khôi phục trạng thái trước đó: setCurrentFriendshipStatus(prevStatus);
    }
  };

  const handleDeclineRequest = async () => {
    if (!user?.id || currentFriendshipStatus !== "pending_received") {
      console.warn("Invalid state or user for decline action.");
      return;
    }
    const currentUserId = user.id;
    const otherUserId = profileData.id;

    try {
      setCurrentFriendshipStatus("loading");
      await cancelFriendRequest(otherUserId, currentUserId); // Current user (receiver) declines other user's request
      setCurrentFriendshipStatus("not_friend");
    } catch (err) {
      console.error("Decline request failed:", err);
      setCurrentFriendshipStatus("error");
    }
  };

  const handleChatAction = () => {
    router.push(`/chat/${profileData.id}`);
  };

  const renderActionButtons = () => {
    if (currentFriendshipStatus === "loading") {
      return (
        <div className="flex justify-center items-center h-full min-w-[120px]">
          <ClipLoader size={20} color="#FF69B4" />
        </div>
      );
    }

    if (currentFriendshipStatus === "error") {
      return (
        <button
          onClick={() => setCurrentFriendshipStatus("loading")} // Retry button
          className="min-w-28 flex items-center bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Error
        </button>
      );
    }

    if (currentFriendshipStatus === "self") {
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
    let showDeclineButton = false;

    switch (currentFriendshipStatus) {
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
          "duration-200 bg-pink-100 text-primary hover:bg-pink-200 dark:bg-primary dark:text-white dark:hover:bg-opacity-80";
        break;
      case "pending_received":
        friendButtonText = "Accept"; // Thay đổi thành Accept
        friendButtonIcon = <UserPlus size={16} className="mr-2" />;
        friendButtonStyle =
          "duration-200 bg-primary text-white hover:bg-opacity-80";
        showDeclineButton = true; // Hiển thị nút Decline
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

        {showDeclineButton && (
          <button
            onClick={handleDeclineRequest}
            className="gap-2 min-w-32 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            <UserX size={16} className="mr-1.5" />
            Decline
          </button>
        )}

        <button
          onClick={handleChatAction}
          className="gap-2 min-w-32 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 bg-primary text-white hover:bg-opacity-80"
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
        {currentFriendshipStatus === "self" && (
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
            {currentFriendshipStatus === "self" && (
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

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare, UserPlus, Check, Clock, UserX } from "lucide-react";
import { Follower } from "@/types/profile/FriendData";

interface FollowerCardProps {
  follower: Follower;
  profileId: string;
  isOwnProfile: boolean;
}

const FollowerCard: React.FC<FollowerCardProps> = ({
  follower,
  profileId,
  isOwnProfile,
}) => {
  const handleChat = () => console.log(`Chat with ${follower.id}`);
  const handleAction = () =>
    console.log(
      `Action for ${follower.id}, status: ${follower.friendshipStatus}`
    );
  const handleUnfollow = () => console.log(`Unfollow ${follower.id}`); // This usually means removing them from *your* following list if they follow you, or simply 'Remove Follower'

  const renderActionButton = () => {
    if (!isOwnProfile || follower.friendshipStatus === "self") return null; // Don't show actions on others' profiles or for self

    switch (follower.friendshipStatus) {
      case "not_friend":
        return (
          <button
            onClick={handleAction}
            className="text-xs font-medium text-primary hover:text-primary-dark flex items-center"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Add Friend
          </button>
        );
      case "pending_received":
        return (
          <button
            onClick={handleAction}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Check className="w-3.5 h-3.5 mr-1" /> Respond
          </button>
        );
      case "pending_sent":
        return (
          <button
            disabled
            className="text-xs font-medium text-gray-500 flex items-center cursor-not-allowed"
          >
            <Clock className="w-3.5 h-3.5 mr-1" /> Request Sent
          </button>
        );
      case "friend":
        return (
          <button
            onClick={handleChat}
            className="flex items-center text-xs font-medium text-primary hover:text-primary-dark"
          >
            <MessagesSquare className="w-3.5 h-3.5 mr-1" /> Chat
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col h-full">
      <Link href={`/profiles/${follower.id}`} className="block mb-3">
        <Image
          src={follower.avatar}
          alt={follower.name}
          width={80}
          height={80}
          className="w-full aspect-square object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow px-4 ">
        <Link href={`/profiles/${follower.id}`} className="hover:underline">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {follower.name}
          </h4>
        </Link>
      </div>
      <div className="flex px-4 mb-3  items-center justify-between mt-4  space-x-2">
        {renderActionButton()}
        {isOwnProfile && follower.friendshipStatus !== "self" && (
          <button
            onClick={handleUnfollow}
            className="text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-400 flex items-center"
          >
            <UserX className="w-3.5 h-3.5 mr-1" /> Remove
          </button>
        )}
        {!isOwnProfile && follower.friendshipStatus === "friend" && (
          <button
            onClick={handleChat}
            className="flex items-center text-xs font-medium text-primary hover:text-primary-dark"
          >
            <MessagesSquare className="w-3.5 h-3.5 mr-1" /> Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default FollowerCard;

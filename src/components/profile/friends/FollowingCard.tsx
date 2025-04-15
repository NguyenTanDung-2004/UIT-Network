import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare } from "lucide-react";
import { FollowingItem } from "@/types/profile/FriendData";

interface FollowingCardProps {
  item: FollowingItem;
  profileId: string;
  isOwnProfile: boolean;
}

const FollowingCard: React.FC<FollowingCardProps> = ({
  item,
  profileId,
  isOwnProfile,
}) => {
  const handleChat = () => console.log(`Chat with ${item.id}`);
  const handleUnfollow = () => console.log(`Unfollow ${item.type} ${item.id}`);

  const linkUrl =
    item.type === "user" ? `/profiles/${item.id}` : `/pages/${item.id}`; // Adjust page URL structure if needed

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col h-full">
      <Link href={linkUrl} className="block mb-3">
        <Image
          src={item.avatar}
          alt={item.name}
          width={80}
          height={80}
          className="w-full aspect-square object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow px-4">
        <Link href={linkUrl} className="hover:underline">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {item.name}
          </h4>
        </Link>
        {/* Optional: Add follower count for page or mutual friends for user */}
      </div>
      <div className="flex px-4 mb-3  items-center justify-between mt-4 space-x-2">
        {item.type === "user" && (
          <button
            onClick={handleChat}
            className="flex items-center text-xs font-medium text-primary hover:text-primary-dark"
          >
            <MessagesSquare className="w-3.5 h-3.5 mr-1" /> Chat
          </button>
        )}
        {isOwnProfile && (
          <button
            onClick={handleUnfollow}
            className="text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-400 flex items-center ml-auto"
          >
            Unfollow
          </button>
        )}
      </div>
    </div>
  );
};

export default FollowingCard;

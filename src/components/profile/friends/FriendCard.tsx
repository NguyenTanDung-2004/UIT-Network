import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare, MoreHorizontal } from "lucide-react";
import FriendActionDropdown from "./FriendActionDropdown";
import { Friend } from "@/types/profile/FriendData";

interface FriendCardProps {
  friend: Friend;
  profileId: string;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, profileId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChat = () => console.log(`Chat with ${friend.id}`);
  const handleUnfriend = () => console.log(`Unfriend ${friend.id}`);
  const handleUnfollow = () => console.log(`Unfollow ${friend.id}`);
  const handleBlock = () => console.log(`Block ${friend.id}`);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col h-full">
      <Link href={`/profiles/${friend.id}`} className="block mb-3">
        <Image
          src={friend.avatar}
          alt={friend.name}
          width={80}
          height={80}
          className="w-full aspect-square object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow px-4">
        <Link href={`/profiles/${friend.id}`} className="hover:underline">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {friend.name}
          </h4>
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {friend.followerCount} followers
        </p>
      </div>
      <div className="flex px-4 mb-3 items-center justify-between mt-auto ">
        <button
          onClick={handleChat}
          className="flex items-center text-xs font-medium text-primary hover:text-primary-dark"
        >
          <MessagesSquare className="w-3.5 h-3.5 mr-1" />
          Chat
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <FriendActionDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onUnfriend={handleUnfriend}
            onUnfollow={handleUnfollow}
            onBlock={handleBlock}
          />
        </div>
      </div>
    </div>
  );
};

export default FriendCard;

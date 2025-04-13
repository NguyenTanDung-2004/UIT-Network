"use client";

import React from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  followers: number;
  avatar: string;
}
interface SuggestionCardProps {
  user: User;
  onAddFriend: () => void;
  onRemove: () => void;
}

export default function SuggestionCard({
  user,
  onAddFriend,
  onRemove,
}: SuggestionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 h-80 flex flex-col">
      <div className="h-48 relative overflow-hidden flex-shrink-0">
        <Image
          src={
            user.avatar ||
            "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
          }
          alt={user.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
        />
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between -mt-1.5">
        <div>
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {user.followers} followers
          </p>
        </div>
        <div className="space-y-1.5 mt-auto">
          <button
            onClick={onAddFriend}
            className="w-full px-3 py-1.5 text-sm font-medium rounded bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Add Friend
          </button>
          <button
            onClick={onRemove}
            className="w-full px-3 py-1.5 text-sm font-medium rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

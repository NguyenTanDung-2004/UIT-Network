"use client";

import React from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  followers: number;
  avatar: string;
}

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
  actions?: React.ReactNode;
}

export default function UserListItem({
  user,
  isSelected,
  onClick,
  actions,
}: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-150 ease-in-out cursor-pointer
        ${
          isSelected ? "bg-gray-100" : "bg-white dark:bg-gray-800"
        } hover:bg-gray-100
      `}
    >
      <Image
        src={
          user.avatar ||
          "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
        }
        alt={user.name}
        width={56}
        height={56}
        className="rounded-full mr-3 flex-shrink-0"
      />

      <div className="flex-1 min-w-0 mr-2">
        <div className="cursor-pointer" onClick={onClick}>
          <p className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate leading-tight">
            {user.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.followers} followers
          </p>
        </div>

        {actions && (
          <div className="mt-2 flex items-center flex-shrink-0 space-x-2 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

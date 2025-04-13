"use client";

import React, { useState } from "react";
import UserListItem from "@/components/friends/UserListItem";
import ProfilePreview from "@/components/friends/ProfilePreview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const friendRequests = [
  {
    id: "1",
    name: "Tấn Dũng",
    followers: 3,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "2",
    name: "Trà Giang",
    followers: 3,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "3",
    name: "Phan Nguyễn Trà Giang",
    followers: 3,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "4",
    name: "Tấn Dũng",
    followers: 3,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "5",
    name: "Trà Giang",
    followers: 3,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "6",
    name: "Phan Nguyễn Trà Giang",
    followers: 3,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  // Add more items to test scrolling
  {
    id: "7",
    name: "User 7",
    followers: 5,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "8",
    name: "User 8",
    followers: 2,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "9",
    name: "User 9",
    followers: 8,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "10",
    name: "User 10",
    followers: 1,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
];

interface User {
  id: string;
  name: string;
  followers: number;
  avatar: string;
}

export default function FriendRequestsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleConfirm = (userId: string) => {
    console.log("Confirm friend from list:", userId);
    if (selectedUserId === userId) setSelectedUserId(null);
  };

  const handleDelete = (userId: string) => {
    console.log("Delete request from list:", userId);
    if (selectedUserId === userId) setSelectedUserId(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-full pb-4 md:pb-0 overflow-hidden">
      <div className="w-full mb-2 md:w-80 flex-shrink-0 border-r-0 md:border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center sticky top-0 md:relative bg-white dark:bg-gray-800 z-10">
          <Link
            href="/friends"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Back to Friends"
          >
            <ArrowLeft size={22} />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 -mb-1">
              Friends
            </p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
              Friend Requests
            </h2>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto flex-shrink-0">
            {friendRequests.length} requests
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-md">
          {friendRequests.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isSelected={selectedUserId === user.id}
              onClick={() => handleSelectUser(user.id)}
              actions={
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm(user.id);
                    }}
                    className="w-32 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-opacity-80 transition-colors whitespace-nowrap"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                    className="w-32 py-2 text-sm font-semibold rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors whitespace-nowrap"
                  >
                    Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      </div>

      <div
        className={`flex-1 w-full bg-gray-50 dark:bg-gray-900 md:h-full md:overflow-y-auto ${
          selectedUserId === null
            ? "hidden md:flex md:items-center md:justify-center"
            : "block p-4 mt-4 border-t border-gray-200 md:mt-0 md:border-t-0"
        }`}
      >
        {selectedUserId ? (
          <ProfilePreview userId={selectedUserId} />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
            <Image
              src="/images/profiles/view-profile.png"
              alt="Select profile"
              width={150}
              height={150}
              className="mx-auto mb-4 opacity-50"
            />
            <p>Select the person to preview their profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

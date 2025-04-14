"use client";
import React from "react";
import Link from "next/link";
import FriendRequestCard from "@/components/friends/FriendRequestCard";
import SuggestionCard from "@/components/friends/SuggestionCard";

const friendRequests = [
  {
    id: "1",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  },
  {
    id: "2",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
  {
    id: "3",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
  {
    id: "4",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
  {
    id: "5",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
  {
    id: "6",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
  {
    id: "7",
    name: "Phan Giang",
    followers: 293,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
];

const suggestions = [
  {
    id: "6",
    name: "Người Lạ 1",
    followers: 150,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
  {
    id: "7",
    name: "Người Lạ 2",
    followers: 99,
    avatar:
      "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  },
];

const FriendsHomePage = () => {
  const handleConfirm = (userId: string) =>
    console.log("Confirm friend:", userId);
  const handleDelete = (userId: string) =>
    console.log("Delete request/suggestion:", userId);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Friend Requests
          </h2>
          <Link
            href="/friends/requests"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {friendRequests.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {friendRequests.slice(0, 5).map((user) => (
              <FriendRequestCard
                key={user.id}
                user={user}
                onConfirm={() => handleConfirm(user.id)}
                onDelete={() => handleDelete(user.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No new friend requests.
          </p>
        )}
      </section>

      {/* Suggestions Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Suggestions
          </h2>
          <Link
            href="/friends/suggestions"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {suggestions.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {suggestions.slice(0, 5).map(
              (
                user // Chỉ hiển thị 5 suggestion đầu
              ) => (
                <SuggestionCard // Sử dụng SuggestionCard nếu khác FriendRequestCard
                  key={user.id}
                  user={user}
                  onAddFriend={() => console.log("Add friend:", user.id)} // Khác nút Confirm
                  onRemove={() => console.log("Remove suggestion:", user.id)} // Khác nút Delete
                />
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No suggestions right now.
          </p>
        )}
      </section>
    </div>
  );
};

export default FriendsHomePage;

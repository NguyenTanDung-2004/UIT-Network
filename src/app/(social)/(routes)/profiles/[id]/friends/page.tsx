"use client";
import React, { useState, useEffect, useMemo, use } from "react";
import { useParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import FriendCard from "@/components/profile/friends/FriendCard";
// Import other card types if needed on this specific page (unlikely for 'All Friends')

import { ProfileHeaderData } from "@/types/profile/ProfileData"; // Assume exists
import { Friend } from "@/types/profile/FriendData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const getMockHeaderData = (id: string): ProfileHeaderData => ({
  id: id,
  name: id === "me" ? "Phan Nguyễn Trà Giang" : "Nguyễn Tấn Dũng",
  avatar: DEFAULT_AVATAR,
  coverPhoto: "",
  followerCount: id === "me" ? 19 : 2,
  friendCount: id === "me" ? 200 : 12,
  friendshipStatus: id === "me" ? "self" : "friend",
});

const getMockFriendsData = (
  id: string
): {
  friends: Friend[];
  counts: { all: number; following: number; joined: number };
} => {
  const count = 10;
  const mockFriends: Friend[] = Array.from({ length: count }).map((_, i) => ({
    id: `friend-${id}-${i}`,
    name: `Trần Nguyễn Hồng Thắm ${i + 1}`,
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample-2.jpg",
    followerCount: Math.floor(Math.random() * 100),
    profileUrl: `/profiles/friend-${id}-${i}`,
  }));
  return {
    friends: mockFriends,
    counts: { all: count, following: 15, joined: 5 },
  };
};

const ProfileFriendsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const headerData = getMockHeaderData(profileId);
  const friendsData = getMockFriendsData(profileId);

  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = useMemo(() => {
    if (!friendsData?.friends) return [];
    if (!searchQuery) return friendsData.friends;
    return friendsData.friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friendsData?.friends, searchQuery]);

  const isOwnProfile = headerData?.friendshipStatus === "self";

  if (!headerData || !friendsData) {
    return <div>Error loading profile data.</div>;
  }

  if (error || !headerData || !friendsData) {
    return (
      <div className="p-6 text-center mt-8 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || "Could not load profile friends information."}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm   md:p-6  mb-6 md:mb-8 min-h-[400px]">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="all"
        profileId={profileId}
        counts={friendsData.counts}
      />

      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} profileId={profileId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "No friends found matching your search."
            : "No friends to display."}
        </div>
      )}
    </div>
  );
};

export default ProfileFriendsPage;

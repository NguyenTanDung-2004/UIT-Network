"use client";

import React, { useState, useMemo, use } from "react";
import { useParams } from "next/navigation";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import FollowerCard from "@/components/profile/friends/FollowerCard";

import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { Follower, FriendshipStatus } from "@/types/profile/FriendData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const SAMPLE_AVATARS = [
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270448/samples/upscale-face-1.jpg",
  DEFAULT_AVATAR,
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg",
];

const getMockHeaderData = (id: string): ProfileHeaderData => ({
  id: id,
  name: id === "me" ? "Phan Nguyễn Trà Giang" : "Nguyễn Tấn Dũng",
  avatar: DEFAULT_AVATAR,
  coverPhoto: "",
  followerCount: id === "me" ? 5 : 2,
  friendCount: id === "me" ? 200 : 12,
  friendshipStatus: id === "me" ? "self" : "friend",
});

const getMockFollowersData = (
  id: string
): {
  followers: Follower[];
  counts: { all: number; following: number; followers: number };
} => {
  const count = 5;
  const statuses: FriendshipStatus[] = [
    "not_friend",
    "pending_received",
    "friend",
    "pending_sent",
    "not_friend",
  ];
  const mockFollowers: Follower[] = Array.from({ length: count }).map(
    (_, i) => ({
      id: `follower-${id}-${i}`,
      name: `Người Theo Dõi ${i + 1}`,
      avatar: SAMPLE_AVATARS[i % SAMPLE_AVATARS.length],
      profileUrl: `/profiles/follower-${id}-${i}`,
      friendshipStatus:
        id === "me" ? statuses[i % statuses.length] : "not_friend", // Chỉ có trạng thái phức tạp nếu là profile của 'me'
    })
  );
  return {
    followers: mockFollowers,
    counts: { all: 10, following: 15, followers: count },
  };
};

const ProfileFollowersPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const headerData = getMockHeaderData(profileId);
  const followersData = getMockFollowersData(profileId);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFollowers = useMemo(() => {
    if (!followersData?.followers) return [];
    if (!searchQuery) return followersData.followers;
    return followersData.followers.filter((follower) =>
      follower.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [followersData?.followers, searchQuery]);

  const isOwnProfile = headerData?.friendshipStatus === "self";

  if (!headerData || !followersData) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm   md:p-6  mb-6 md:mb-8">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="followers"
        profileId={profileId}
        counts={followersData.counts}
      />

      {filteredFollowers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFollowers.map((follower) => (
            <FollowerCard
              key={follower.id}
              follower={follower}
              profileId={profileId}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "No followers found matching your search."
            : "This user has no followers yet."}
        </div>
      )}
    </div>
  );
};

export default ProfileFollowersPage;

"use client";

import React, { useState, useMemo, use } from "react";
import { useParams } from "next/navigation";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import FollowingCard from "@/components/profile/friends/FollowingCard";

import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { FollowingItem } from "@/types/profile/FriendData";

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
  followerCount: id === "me" ? 19 : 2,
  friendCount: id === "me" ? 200 : 12,
  friendshipStatus: id === "me" ? "self" : "friend",
});

const getMockFollowingData = (
  id: string
): {
  following: FollowingItem[];
  counts: { all: number; following: number; followers: number };
} => {
  const userCount = 10;
  const pageCount = 5;
  const totalCount = userCount + pageCount;

  const mockFollowingUsers: FollowingItem[] = Array.from({
    length: userCount,
  }).map((_, i) => ({
    type: "user",
    id: `following-user-${id}-${i}`,
    name: `Người Đang Theo Dõi ${i + 1}`,
    avatar: SAMPLE_AVATARS[i % (SAMPLE_AVATARS.length - 1)], // Avoid page avatar for users
    profileUrl: `/profiles/following-user-${id}-${i}`,
  }));

  const mockFollowingPages: FollowingItem[] = Array.from({
    length: pageCount,
  }).map((_, i) => ({
    type: "page",
    id: `following-page-${id}-${i}`,
    name: `Trang Đang Theo Dõi ${i + 1}`,
    avatar: SAMPLE_AVATARS[SAMPLE_AVATARS.length - 1], // Use last avatar for pages
    pageUrl: `/pages/following-page-${id}-${i}`,
  }));

  // Combine and shuffle for realism
  const combined = [...mockFollowingUsers, ...mockFollowingPages].sort(
    () => Math.random() - 0.5
  );

  return {
    following: combined,
    counts: { all: 10, following: totalCount, followers: 5 },
  };
};

const ProfileFollowingPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const headerData = getMockHeaderData(profileId);
  const followingData = getMockFollowingData(profileId);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFollowing = useMemo(() => {
    if (!followingData?.following) return [];
    if (!searchQuery) return followingData.following;
    return followingData.following.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [followingData?.following, searchQuery]);

  const isOwnProfile = headerData?.friendshipStatus === "self";

  if (!headerData || !followingData) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm   md:p-6  mb-6 md:mb-8">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="following" // Đặt activeTab là 'following'
        profileId={profileId}
        counts={followingData.counts}
      />

      {filteredFollowing.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFollowing.map((item) => (
            <FollowingCard
              key={`${item.type}-${item.id}`} // Key cần unique cho cả user và page
              item={item}
              profileId={profileId}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "Nothing found matching your search."
            : "Not following anyone or any pages yet."}
        </div>
      )}
    </div>
  );
};

export default ProfileFollowingPage;

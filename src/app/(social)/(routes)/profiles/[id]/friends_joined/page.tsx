"use client";

import React, { useState, useMemo, use } from "react";
import { useParams } from "next/navigation";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import JoinedCard from "@/components/profile/friends/JoinedCard";

import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { JoinedGroup } from "@/types/profile/FriendData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const SAMPLE_AVATARS = [
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270448/samples/upscale-face-1.jpg",
  DEFAULT_AVATAR,
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

const getMockJoinedGroupsData = (
  id: string
): {
  groups: JoinedGroup[];
  counts: { all: number; following: number; joined: number };
} => {
  const count = 3; // Số group mock
  const mockGroups: JoinedGroup[] = [
    {
      type: "group",
      id: `group-${id}-1`,
      name: "UIT Study Group",
      avatar: SAMPLE_AVATARS[0],
      groupUrl: `/groups/group-${id}-1`,
    },
    {
      type: "group",
      id: `group-${id}-2`,
      name: "Math Enthusiasts",
      avatar: SAMPLE_AVATARS[1],
      groupUrl: `/groups/group-${id}-2`,
    },
    {
      type: "group",
      id: `group-${id}-3`,
      name: "Coding Club",
      avatar: SAMPLE_AVATARS[2],
      groupUrl: `/groups/group-${id}-3`,
    },
  ];
  return {
    groups: mockGroups,
    counts: { all: 10, following: 5, joined: count },
  };
};

const ProfileJoinedGroupsPage: React.FC<{
  params: Promise<{ id: string }>;
}> = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const headerData = getMockHeaderData(profileId);
  const groupsData = getMockJoinedGroupsData(profileId);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!groupsData?.groups) return [];
    if (!searchQuery) return groupsData.groups;
    return groupsData.groups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groupsData?.groups, searchQuery]);

  const isOwnProfile = headerData?.friendshipStatus === "self";

  if (!headerData || !groupsData) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm md:p-6 mb-6 md:mb-8">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="joined"
        profileId={profileId}
        counts={groupsData.counts}
      />

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGroups.map((group) => (
            <JoinedCard
              key={group.id}
              item={group}
              profileId={profileId}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "No groups found matching your search."
            : "This user hasn't joined any groups yet."}
        </div>
      )}
    </div>
  );
};

export default ProfileJoinedGroupsPage;

"use client";

import React from "react";
import GroupCard from "@/components/search/GroupCard";
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface GroupData {
  id: string;
  name: string;
  avatar?: string;
  stats?: string;
  isJoined: boolean;
}

const ConnectGroupsPage = () => {
  const suggestedGroups: GroupData[] = [
    {
      id: `connect-group-1`,
      name: `Algorithms & Data Structures Study Group`,
      avatar: `https://picsum.photos/seed/group-algo/200`,
      stats: "5.5K members · 3 posts/day",
      isJoined: false,
    },
    {
      id: `connect-group-2`,
      name: `React Developers Vietnam`,
      avatar: `https://picsum.photos/seed/group-react/200`,
      stats: "12K members · 8 posts/day",
      isJoined: true, // Already joined
    },
    {
      id: `connect-group-3`,
      name: `Machine Learning Beginners`,
      // avatar: undefined, // Use default
      stats: "8K members · 2 posts/day",
      isJoined: false,
    },
    {
      id: `connect-group-4`,
      name: `UIT K19 Exchange`,
      avatar: `https://picsum.photos/seed/group-k19/200`,
      stats: "1.5K members · 1 posts/day",
      isJoined: false,
    },
  ];

  return (
    <div className="space-y-4 mx-8 md:mx-12 lg:mx-18 my-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 ">
        Groups You May Be Interested In
      </h2>
      {suggestedGroups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};

export default ConnectGroupsPage;

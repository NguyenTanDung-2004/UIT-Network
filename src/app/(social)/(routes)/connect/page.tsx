"use client";

import React from "react";
import ConnectPeople from "@/components/connect/ConnectPeople";
import PageCard from "@/components/search/PageCard";
import GroupCard from "@/components/search/GroupCard";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface PersonData {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  headline?: string;
  isFriend: boolean;
}

interface PageData {
  id: string;
  name: string;
  avatar?: string;
  descriptionLines: string[];
  isFollowing: boolean;
}

interface GroupData {
  id: string;
  name: string;
  avatar?: string;
  stats?: string;
  isJoined: boolean;
}

const ConnectPage = () => {
  const suggestedPeople: PersonData[] = [
    {
      id: `connect-person-1`,
      name: `Nguyễn Văn A`,
      avatar: DEFAULT_AVATAR,
      bio: "Software Engineer",
      headline: "Web Developer | React Enthusiast",
      isFriend: false,
    },
    {
      id: `connect-person-2`,
      name: `Trần Thị B`,
      avatar: `https://i.pravatar.cc/150?u=connect-person-2`,
      bio: "Software Engineer",
      headline: "Data Science Student",
      isFriend: true, // Already friends
    },
    {
      id: `connect-person-3`,
      name: `Lê Văn C`,
      bio: "Software Engineer",
      headline: "UI/UX Designer",
      isFriend: false,
    },
    {
      id: `connect-person-4`,
      name: `Phạm Thị D`,
      avatar: `https://i.pravatar.cc/150?u=connect-person-4`,
      bio: "Software Engineer",
      isFriend: false,
    },
  ];
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

  const suggestedPages: PageData[] = [
    {
      id: `connect-page-1`,
      name: `UIT - English Club`,
      avatar: `https://picsum.photos/seed/page-eng/200`,
      descriptionLines: [
        "Community · 15K followers",
        "Practice English speaking and writing skills.",
      ],
      isFollowing: false,
    },
    {
      id: `connect-page-2`,
      name: `AI Research Group - UIT`,
      avatar: `https://picsum.photos/seed/page-ai/200`,
      descriptionLines: [
        "Research Lab · 5.2K followers",
        "Exploring the frontiers of Artificial Intelligence.",
      ],
      isFollowing: true, // Already following
    },
    {
      id: `connect-page-3`,
      name: `Coding Competitions Hub`,
      // avatar: undefined, // Use default
      descriptionLines: [
        "Education Website · 22K followers",
        "Get ready for your next coding challenge!",
      ],
      isFollowing: false,
    },
  ];

  return (
    <div className="flex flex-col space-y-4 mx-8 md:mx-12 lg:mx-18 my-6">
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200 ">
          People You May Know
        </h2>
        <div className="flex flex-col gap-3">
          {suggestedPeople.map((person) => (
            <ConnectPeople key={person.id} person={person} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200 ">
          Pages You Might Like
        </h2>
        <div className="flex flex-col gap-3">
          {suggestedPages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200 ">
          Groups You May Be Interested In
        </h2>
        <div className="flex flex-col gap-3">
          {suggestedGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;

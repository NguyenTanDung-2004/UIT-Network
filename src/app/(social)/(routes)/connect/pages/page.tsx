"use client";

import React from "react";
import PageCard from "@/components/search/PageCard";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface PageData {
  id: string;
  name: string;
  avatar?: string;
  descriptionLines: string[];
  isFollowing: boolean;
}

const ConnectPagesPage = () => {
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
    <div className="space-y-4 mx-8 md:mx-12 lg:mx-18 my-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 ">
        Pages You Might Like
      </h2>
      {suggestedPages.map((page) => (
        <PageCard key={page.id} page={page} />
      ))}
    </div>
  );
};

export default ConnectPagesPage;

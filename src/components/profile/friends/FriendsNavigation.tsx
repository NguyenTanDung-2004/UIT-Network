import React from "react";
import Link from "next/link";

interface FriendsNavigationProps {
  activeTab: "all" | "following" | "followers";
  profileId: string;
  counts: {
    all: number;
    following: number;
    followers: number;
  };
}

const FriendsNavigation: React.FC<FriendsNavigationProps> = ({
  activeTab,
  profileId,
  counts,
}) => {
  const tabs = [
    {
      id: "all",
      name: "All friends",
      href: `/profiles/${profileId}/friends`,
      count: counts.all,
    },
    {
      id: "following",
      name: "Following",
      href: `/profiles/${profileId}/friends_following`,
      count: counts.following,
    },
    {
      id: "followers",
      name: "Followers",
      href: `/profiles/${profileId}/friends_follower`,
      count: counts.followers,
    },
  ];

  const totalCount = tabs.find((t) => t.id === activeTab)?.count || 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <nav className="flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`pb-3 px-1 border-b-2 text-sm font-semibold ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {totalCount}{" "}
          {activeTab === "all"
            ? "people"
            : activeTab === "following"
            ? "following"
            : "followers"}
        </span>
      </div>
    </div>
  );
};

export default FriendsNavigation;

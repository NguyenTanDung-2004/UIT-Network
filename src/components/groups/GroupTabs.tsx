"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface GroupTabsProps {
  groupId: string;
}

const tabs = [
  { name: "Posts", href: "" },
  { name: "Members", href: "/members" },
  { name: "Media", href: "/media" },
  { name: "Files", href: "/files" },
];

const GroupTabs: React.FC<GroupTabsProps> = ({ groupId }) => {
  const pathname = usePathname();
  const basePath = `/groups/${groupId}`;
  // Ensure trailing slash consistency might be needed depending on routing setup
  const currentPathEnd = pathname.endsWith("/") ? pathname : pathname + "/";
  const basePathEnd = basePath.endsWith("/") ? basePath : basePath + "/";

  let activeSegment = "";
  if (currentPathEnd.startsWith(basePathEnd)) {
    activeSegment =
      "/" + currentPathEnd.substring(basePathEnd.length).split("/")[0];
    if (activeSegment === "/") activeSegment = ""; // Handle base path case
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <nav
        className="-mb-px flex space-x-4 sm:space-x-6 px-4 md:px-8 overflow-x-auto scrollbar-hide"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={`${basePath}${tab.href}`}
            scroll={false}
            className={`whitespace-nowrap py-3 px-1 sm:px-2 md:px-4 border-b-2 font-medium text-[15px] transition-colors duration-150 ease-in-out
              ${
                activeSegment === tab.href
                  ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default GroupTabs;

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageTabsProps {
  profileId: string;
}

const tabs = [
  { name: "Posts", href: "" },
  { name: "About", href: "/about" },
  { name: "Media", href: "/media" },
];

const PageTabs: React.FC<PageTabsProps> = ({ profileId }) => {
  const pathname = usePathname();
  const activeSegment = pathname.substring(`/pages/${profileId}`.length) || "";

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav
        className="-mb-px flex space-x-6 px-4 md:px-8 overflow-x-auto scrollbar-hide"
        aria-label="Tabs"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={`/pages/${profileId}${tab.href}`}
            scroll={false} // Ngăn scroll lên đầu trang khi chuyển tab
            className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-[15px] transition-colors duration-150 ease-in-out
              ${
                activeSegment === tab.href
                  ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
              }`}
          >
            {tab.name}
          </Link>
        ))}

        {/* Button ' ... ' cho setting nếu có */}
        <button className="ml-auto py-3 px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </nav>
    </div>
  );
};

export default PageTabs;

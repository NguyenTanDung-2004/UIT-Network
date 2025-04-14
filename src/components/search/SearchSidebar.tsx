"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Newspaper,
  Users,
  Building,
  Landmark,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

const mainSidebarItems = [
  { name: "All", href: "/search/top", icon: Search },
  { name: "Posts", href: "/search/posts", icon: Newspaper },
  { name: "People", href: "/search/people", icon: Users },
  { name: "Pages", href: "/search/pages", icon: Landmark },
  { name: "Groups", href: "/search/groups", icon: Building },
];

// Định nghĩa các bộ lọc cho People
const peopleFilters = [
  {
    id: "friend_status",
    name: "Friend",
    options: ["Any", "Friend", "Not Friend"],
  },
  {
    id: "location",
    name: "Province/City",
    options: ["Any", "Hanoi", "Ho Chi Minh City", "Da Nang", "Other"],
  },
  {
    id: "education",
    name: "Education",
    options: ["Any", "High School", "Bachelor", "Master", "PhD"],
  },
  {
    id: "hobby",
    name: "Hobby",
    options: ["Any", "Reading", "Gaming", "Sports", "Music"],
  },
];

export default function SearchSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentQuery = searchParams.get("q") || "";
  const currentType = pathname.split("/").pop() || "top";

  // Posts Filters
  const [showRecentPosts, setShowRecentPosts] = useState(false); // Ví dụ state cho toggle
  const [showPostsSeen, setShowPostsSeen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});
  // State để quản lý việc mở/đóng dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Cập nhật selectedFilters từ URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    const initialFilters: Record<string, string> = {};
    peopleFilters.forEach((filter) => {
      const value = searchParams.get(filter.id);
      if (value) {
        initialFilters[filter.id] = value;
      }
    });
    setSelectedFilters(initialFilters);

    // Lấy các filter khác từ URL (ví dụ: posts filter)
    setShowRecentPosts(searchParams.get("sort") === "recent");
    setShowPostsSeen(searchParams.get("filter") === "seen");
  }, [searchParams]);

  // Hàm cập nhật URL với filter mới
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "Any" || value === "") {
        // Xóa param nếu giá trị là null, 'Any' hoặc rỗng
        currentParams.delete(key);
      } else {
        currentParams.set(key, value);
      }
    });
    // Giữ lại param 'q'
    if (currentQuery) {
      currentParams.set("q", currentQuery);
    } else {
      currentParams.delete("q");
    }

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  // Handler cho thay đổi toggle Posts
  const handlePostsToggleChange = (
    filterType: "recent" | "seen",
    isChecked: boolean
  ) => {
    if (filterType === "recent") {
      setShowRecentPosts(isChecked);
      updateUrlParams({ sort: isChecked ? "recent" : null });
    } else if (filterType === "seen") {
      setShowPostsSeen(isChecked);
      updateUrlParams({ filter: isChecked ? "seen" : null });
    }
  };

  // Handler cho thay đổi dropdown People
  const handlePeopleFilterChange = (filterId: string, value: string) => {
    const newSelectedFilters = { ...selectedFilters, [filterId]: value };
    setSelectedFilters(newSelectedFilters);
    updateUrlParams({ [filterId]: value });
    setOpenDropdown(null);
  };

  // Toggle dropdown
  const toggleDropdown = (filterId: string) => {
    setOpenDropdown(openDropdown === filterId ? null : filterId);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-gray-100 px-2">
        Search Results
      </h2>

      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
        Filter
      </h3>

      {/* Main Filter Links */}
      <nav className="space-y-1 mb-6">
        {mainSidebarItems.map((item) => {
          // Check if the current pathname ENDS with the item's href segment
          // (e.g., /search/posts ends with /posts which matches href /search/posts)
          const itemType = item.href.split("/").pop();
          const isActive = currentType === itemType;
          const hrefWithQuery = `${item.href}?q=${encodeURIComponent(
            currentQuery
          )}`;

          return (
            <Link
              key={item.name}
              href={hrefWithQuery}
              className={`group flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-150 ease-in-out ${
                isActive
                  ? "bg-primary/10"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <div
                className={`flex-shrink-0 mr-4 p-2 rounded-full transition-colors duration-150 ease-in-out ${
                  isActive
                    ? "bg-primary"
                    : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600" // Icon background
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" // Icon color
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`flex-1 font-semibold ${
                  isActive
                    ? "text-primary dark:text-primary"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 my-1 mx-3" />

      <div className="mt-4 px-3 space-y-4 flex-1 overflow-y-auto scrollbar-thin">
        {/* --- Posts Filters --- */}
        {currentType === "posts" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="recentPosts"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Recent Posts
              </label>
              <button
                id="recentPosts"
                onClick={() =>
                  handlePostsToggleChange("recent", !showRecentPosts)
                }
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${
                  showRecentPosts
                    ? "bg-primary"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    showRecentPosts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="postsSeen"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Posts you've seen
              </label>
              <button
                id="postsSeen"
                onClick={() => handlePostsToggleChange("seen", !showPostsSeen)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${
                  showPostsSeen ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    showPostsSeen ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* --- People Filters --- */}
        {currentType === "people" && (
          <div className="space-y-3">
            {peopleFilters.map((filter) => (
              <div key={filter.id} className="relative">
                <button
                  onClick={() => toggleDropdown(filter.id)}
                  className="w-full flex justify-between items-center px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                >
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {filter.name}
                  </span>
                  {openDropdown === filter.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openDropdown === filter.id && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 max-h-48 overflow-y-auto">
                    {filter.options.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          handlePeopleFilterChange(filter.id, option)
                        }
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                      >
                        {option}
                        {selectedFilters[filter.id] === option && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {selectedFilters[filter.id] &&
                  selectedFilters[filter.id] !== "Any" && (
                    <div className="mt-1 px-1 text-xs text-primary dark:text-primary-light">
                      Selected: {selectedFilters[filter.id]}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* --- Pages Filters --- */}
        {currentType === "pages" && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No additional filters for Pages.
            </p>
          </div>
        )}

        {/* --- Groups Filters --- */}
        {currentType === "groups" && (
          <div>
            {/* Groups không có filter con theo yêu cầu */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No additional filters for Groups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

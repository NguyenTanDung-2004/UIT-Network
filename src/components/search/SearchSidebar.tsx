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

  const [showRecentPosts, setShowRecentPosts] = useState(false);
  const [showPostsSeen, setShowPostsSeen] = useState(false);
  const [selectedPeopleFilters, setSelectedPeopleFilters] = useState<
    Record<string, string>
  >({});
  const [expandedPeopleFilterDropdown, setExpandedPeopleFilterDropdown] =
    useState<string | null>(null);

  useEffect(() => {
    const initialFilters: Record<string, string> = {};
    peopleFilters.forEach((filter) => {
      const value = searchParams.get(filter.id);
      if (value && value !== "Any") {
        initialFilters[filter.id] = value;
      }
    });
    setSelectedPeopleFilters(initialFilters);
    setShowRecentPosts(searchParams.get("sort") === "recent");
    setShowPostsSeen(searchParams.get("filter") === "seen");
  }, [searchParams]);

  const updateUrlParams = (
    newParams: Record<string, string | boolean | null>
  ) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    let changed = false;
    Object.entries(newParams).forEach(([key, value]) => {
      const currentValue = currentParams.get(key);
      let newValueString: string | null = null;
      if (
        value === null ||
        value === "Any" ||
        value === "" ||
        value === false
      ) {
        if (currentValue !== null) {
          currentParams.delete(key);
          changed = true;
        }
      } else if (typeof value === "boolean") {
        if (key === "sort" && value === true) newValueString = "recent";
        else if (key === "filter" && value === true) newValueString = "seen";
        else newValueString = "true";
        if (currentValue !== newValueString) {
          if (newValueString) currentParams.set(key, newValueString);
          else currentParams.delete(key);
          changed = true;
        }
      } else {
        newValueString = value;
        if (currentValue !== newValueString) {
          currentParams.set(key, newValueString);
          changed = true;
        }
      }
    });
    if (currentQuery) {
      if (currentParams.get("q") !== currentQuery) {
        currentParams.set("q", currentQuery);
        changed = true;
      }
    } else {
      if (currentParams.has("q")) {
        currentParams.delete("q");
        changed = true;
      }
    }
    if (changed) {
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }
  };

  const handlePostsToggleChange = (
    filterType: "recent" | "seen",
    isChecked: boolean
  ) => {
    if (filterType === "recent") {
      setShowRecentPosts(isChecked);
      updateUrlParams({ sort: isChecked });
    } else if (filterType === "seen") {
      setShowPostsSeen(isChecked);
      updateUrlParams({ filter: isChecked });
    }
  };

  const handlePeopleFilterChange = (filterId: string, value: string) => {
    const newSelectedFilters = { ...selectedPeopleFilters };
    if (value === "Any") {
      delete newSelectedFilters[filterId];
    } else {
      newSelectedFilters[filterId] = value;
    }
    setSelectedPeopleFilters(newSelectedFilters);
    updateUrlParams({ [filterId]: value });
    setExpandedPeopleFilterDropdown(null);
  };

  const togglePeopleFilterDropdown = (filterId: string) => {
    setExpandedPeopleFilterDropdown(
      expandedPeopleFilterDropdown === filterId ? null : filterId
    );
  };

  return (
    <div className="pt-10 p-4 h-full flex flex-col">
      <h2 className=" text-xl font-bold mb-5 text-gray-900 dark:text-gray-100 px-2">
        Search Results
      </h2>
      <h3 className="text-base font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
        Filters
      </h3>
      <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pb-4">
        {mainSidebarItems.map((item) => {
          const itemType = item.href.split("/").pop();
          const isActive = currentType === itemType;
          const hrefWithQuery = `${item.href}?q=${encodeURIComponent(
            currentQuery
          )}`;
          const showSubFilters =
            isActive && (item.name === "Posts" || item.name === "People");

          return (
            <div key={item.name}>
              <Link
                href={hrefWithQuery}
                scroll={false}
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
                      : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors duration-150 ease-in-out ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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

              {showSubFilters && (
                <div className="pl-8 pr-2 pt-2 pb-1 space-y-3 mt-1 ml-3 border-l border-gray-200 dark:border-gray-700">
                  {item.name === "Posts" && (
                    <div className="space-y-3 pl-2 py-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="recentPosts"
                          className="text-base text-gray-700 dark:text-gray-300 font-medium"
                        >
                          Recent Posts
                        </label>
                        <button
                          id="recentPosts"
                          onClick={() =>
                            handlePostsToggleChange("recent", !showRecentPosts)
                          }
                          className={`relative inline-flex items-center h-5 w-9 transition-colors duration-200 ease-in-out rounded-full focus:outline-none ${
                            showRecentPosts
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                              showRecentPosts
                                ? "translate-x-5"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="postsSeen"
                          className="text-base text-gray-700 dark:text-gray-300 font-medium"
                        >
                          Posts you've seen
                        </label>
                        <button
                          id="postsSeen"
                          onClick={() =>
                            handlePostsToggleChange("seen", !showPostsSeen)
                          }
                          className={`relative inline-flex items-center h-5 w-9 transition-colors duration-200 ease-in-out rounded-full focus:outline-none ${
                            showPostsSeen
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                              showPostsSeen ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  {item.name === "People" && (
                    <div className="space-y-2 pl-2 py-1">
                      {peopleFilters.map((filter) => (
                        <div key={filter.id} className="relative">
                          <button
                            onClick={() =>
                              togglePeopleFilterDropdown(filter.id)
                            }
                            className="w-full flex justify-between items-center py-1.5 text-left focus:outline-none"
                          >
                            <span className="text-base text-gray-800 dark:text-gray-200 font-medium">
                              {filter.name}
                            </span>
                            {expandedPeopleFilterDropdown === filter.id ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          {expandedPeopleFilterDropdown === filter.id && (
                            <div className="pt-1 pb-1 pl-2 space-y-1 absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 max-h-48 overflow-y-auto scrollbar-thin">
                              {filter.options.map((option) => {
                                const isSelected =
                                  selectedPeopleFilters[filter.id] === option ||
                                  (!selectedPeopleFilters[filter.id] &&
                                    option === "Any");
                                return (
                                  <button
                                    key={option}
                                    onClick={() =>
                                      handlePeopleFilterChange(
                                        filter.id,
                                        option
                                      )
                                    }
                                    className={`w-full text-left px-2 py-1.5 rounded text-base flex items-center justify-between ${
                                      isSelected
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                    }`}
                                  >
                                    {option}
                                    {isSelected && option !== "Any" && (
                                      <Check className="h-3.5 w-3.5 text-primary ml-1" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {selectedPeopleFilters[filter.id] &&
                            selectedPeopleFilters[filter.id] !== "Any" && (
                              <div className="mt-0.5 pl-1 text-sm text-primary dark:text-primary-light">
                                {selectedPeopleFilters[filter.id]}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

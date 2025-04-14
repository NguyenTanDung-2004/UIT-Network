"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/provider/darkmode/ThemeProvider";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

interface NavBarProps {
  user: {
    name: string;
    avatar: string;
  };
}

const MAX_SEARCH_HISTORY = 10;
const SEARCH_HISTORY_KEY = "STUDY_BUDDY_SEARCH_HISTORY";

const NavBar: React.FC<NavBarProps> = ({ user }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed loading search history:", error);
      setSearchHistory([]);
    }
  }, []);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (!showProfileDropdown) {
      setShowSearchSuggestions(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target as Node)
    ) {
      setShowProfileDropdown(false);
    }

    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setShowSearchSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SEARCH HISTORY DROPDOWN
  const addSearchTermToHistory = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    setSearchHistory((prevHistory) => {
      const newHistory = [
        trimmedTerm,
        ...prevHistory.filter((item) => item !== trimmedTerm),
      ].slice(0, MAX_SEARCH_HISTORY);

      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed saving search history:", error);
      }

      return newHistory;
    });
  };

  const handleSearchSubmit = (
    event?: React.FormEvent<HTMLFormElement>,
    queryOverride?: string
  ) => {
    event?.preventDefault();
    const termToSearch = (queryOverride || searchQuery).trim();

    if (termToSearch) {
      addSearchTermToHistory(termToSearch);
      setShowSearchSuggestions(false);
      router.push(`/search/top?q=${encodeURIComponent(termToSearch.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    addSearchTermToHistory(term);
    setShowSearchSuggestions(false);
    router.push(`/search/top?q=${encodeURIComponent(term.trim())}`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setShowSearchSuggestions(true);
  };

  const handleInputFocus = () => {
    if (searchHistory.length > 0 || searchQuery) {
      setShowSearchSuggestions(true);
    }
  };

  return (
    <div className="flex items-center justify-between px-10 py-2.5 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      {/* Logo */}
      <Link href="/home" className="flex items-center">
        <div className="flex items-center">
          <Image
            src="/icon.ico"
            alt="Study Buddy Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <Image
            src="/auth/logo text.png"
            alt="Study Buddy Logo"
            width={200}
            height={200}
            className="mr-2 hidden md:block"
          />
        </div>
      </Link>

      {/* Search Bar */}
      <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-4 relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search ..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="w-full py-2 pl-11 pr-5 bg-[#f3f3f3] rounded-3xl focus:outline-none text-[#838383] dark:bg-gray-700 dark:text-gray-300"
          />
          <i className="fas fa-search absolute left-4 top-3 text-[#838383] dark:text-gray-300"></i>
          <button
            type="submit"
            className="hidden" // Ẩn
          >
            Search
          </button>
        </form>

        {showSearchSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-40 max-h-60 overflow-y-auto scrollbar-thin">
            {searchHistory.length > 0
              ? searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <History
                      className="mr-2 text-gray-400 dark:text-gray-500"
                      size={16}
                    />
                    {item}
                  </button>
                ))
              : searchQuery && (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No recent searches.
                  </div>
                )}
          </div>
        )}
      </div>

      {/* Notification, Messages and Profile */}
      <div className="flex items-center">
        <div className="relative mx-2 mr-3.5">
          <Link href="/messages">
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hover:dark:stroke-gray-100 hover:stroke-gray-100 transition-all duration-200 cursor-pointer dark:text-gray-300"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-gray-300 hover:dark:stroke-gray-100 hover:stroke-gray-100"
                ></path>
              </g>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </Link>
        </div>
        <div className="relative mx-2 mr-4">
          <Link href="/notifications">
            <i className="fas fa-bell text-xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </Link>
        </div>
        <div className="relative mx-2 mr-4" ref={profileDropdownRef}>
          <button onClick={toggleProfileDropdown} className="flex items-center">
            <span className="font-medium hidden md:block mr-3 dark:text-gray-300">
              {user.name}
            </span>
            <div className="w-10 h-10 relative rounded-full overflow-hidden border cursor-pointer">
              <Image
                src={
                  user.avatar ||
                  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                }
                alt={user.name}
                fill
                className="object-cover"
                style={{ objectPosition: "center" }}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] overflow-hidden z-30 dark:bg-gray-800 dark:shadow-[0px_0px_14px_0px_rgba(0,0,0,0.4)]">
              <div className="py-4 px-6 border-b dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden border mr-3 dark:border-gray-600">
                    <Image
                      src={
                        user.avatar ||
                        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                      }
                      alt={user.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                  <div>
                    <p className="text-base font-semibold dark:text-gray-200">
                      {user.name}
                    </p>
                  </div>
                </div>
                <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-80 transition-colors duration-200">
                  View profile
                </button>
              </div>

              <div className="py-2">
                <Link
                  href="/setting"
                  className=" px-6 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 flex items-center dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <i className="fas fa-cog mr-3"></i>
                  Setting
                </Link>
                <Link
                  href="/privacy"
                  className=" px-6 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 flex items-center dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <i className="fas fa-file-shield mr-3"></i>
                  Privacy
                </Link>
                <Link
                  href="/help"
                  className=" px-6 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 flex items-center dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <i className="fas fa-question-circle mr-3"></i>
                  Help
                </Link>
              </div>

              <div className="py-2 border-t dark:border-gray-700">
                <Link
                  href="/logout"
                  className="px-6 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 flex items-center dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i>
                  Logout
                </Link>
              </div>

              <div className="px-6 py-3 border-t flex items-center justify-between dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">
                  Darkmode
                </span>
                <div className="flex items-center gap-2">
                  <i
                    className={`fas fa-sun cursor-pointer ${
                      !darkMode ? "text-primary" : "text-gray-500"
                    }`}
                    onClick={() => toggleDarkMode(false)}
                  ></i>
                  <i
                    className={`fas fa-moon cursor-pointer ${
                      darkMode ? "text-primary" : "text-gray-500"
                    }`}
                    onClick={() => toggleDarkMode(true)}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;

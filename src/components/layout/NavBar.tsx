"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/provider/darkmode/ThemeProvider";
import { useRouter } from "next/navigation";
import { Bell, History, MessagesSquare } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import MessagesDropdown from "./MessagesDropdown";

interface NavBarProps {
  user: {
    name: string;
    avatar: string;
  };
}

const MAX_SEARCH_HISTORY = 10;
const SEARCH_HISTORY_KEY = "STUDY_BUDDY_SEARCH_HISTORY";

// Data Chat & Noti
// const dummyNotifications = [
//   {
//     id: "n1",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     content: (
//       <>
//         <span className="font-semibold">Tấn Dũng</span> send you a friend
//         request
//       </>
//     ),
//     timestamp: new Date(),
//     read: false,
//   },
//   {
//     id: "n2",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     content: (
//       <>
//         <span className="font-semibold">Tấn Dũng</span> mentioned you in a
//         comment
//       </>
//     ),
//     timestamp: new Date(Date.now() - 20 * 60 * 1000),
//     read: false,
//   },
//   {
//     id: "n3",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     content: (
//       <>
//         <span className="font-semibold">ABC and 10 others</span> liked your post
//       </>
//     ),
//     timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
//     read: true,
//   },
//   {
//     id: "n4",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     content: (
//       <>
//         UIT K22: “Chào mọi người, hello mọi người. Đã hết tết rồi, chúc mọi
//         người vui vẻ và sẵn sàng bắt ...”
//       </>
//     ),
//     timestamp: new Date(2025, 1, 5),
//     read: true,
//   }, // Feb 5, 2025
//   {
//     id: "n5",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     content: (
//       <>
//         UIT K22: “Chào mọi người, hello mọi người. Đã hết tết rồi, chúc mọi
//         người vui vẻ và sẵn sàng bắt ...”
//       </>
//     ),
//     timestamp: new Date(2025, 1, 5),
//     read: true,
//   },
//   {
//     id: "n6",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     content: (
//       <>
//         UIT K22: “Chào mọi người, hello mọi người. Đã hết tết rồi, chúc mọi
//         người vui vẻ và sẵn sàng bắt ...”
//       </>
//     ),
//     timestamp: new Date(2025, 1, 5),
//     read: true,
//   },
// ];

// const dummyMessages = [
//   {
//     id: "m1",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     name: "Nguyễn Tấn Dũng",
//     lastMessage: "Sent a photo.",
//     timestamp: new Date(),
//     read: false,
//   },
//   {
//     id: "m2",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     name: "Group UIT K2022",
//     lastMessage: "You sent a file.",
//     timestamp: new Date(Date.now() - 10 * 60 * 1000),
//     read: false,
//   },
//   {
//     id: "m3",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     name: "Thắm Trần",
//     lastMessage: "Happy birthday, chúc bạn năm mới vui ...",
//     timestamp: new Date(Date.now() - 10 * 60 * 1000),
//     read: true,
//   },
//   {
//     id: "m4",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     name: "Nguyễn Tấn Dũng",
//     lastMessage: "Sent a photo.",
//     timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
//     read: true,
//   },
//   {
//     id: "m5",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     name: "Group UIT K2022",
//     lastMessage: "You sent a file.",
//     timestamp: new Date(2025, 1, 5),
//     read: true,
//   }, // Feb 5, 2025
//   {
//     id: "m6",
//     avatar:
//       "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
//     name: "Thắm Trần",
//     lastMessage: "Happy birthday, chúc bạn năm mới vui ...",
//     timestamp: new Date(2021, 11, 30),
//     read: true,
//   }, // Dec 30, 2021
// ];

// End - Data Chat & Noti
const NavBar: React.FC<NavBarProps> = ({ user }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // const [showNotificationsDropdown, setShowNotificationsDropdown] =
  //   useState(false);
  // const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsIconRef = useRef<HTMLButtonElement>(null);
  const messagesIconRef = useRef<HTMLButtonElement>(null);
  const profileIconRef = useRef<HTMLButtonElement>(null);

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

  const closeAllDropdowns = () => {
    setShowProfileDropdown(false);
    // setShowNotificationsDropdown(false);
    // setShowMessagesDropdown(false);
    setShowSearchSuggestions(false);
  };

  const toggleProfileDropdown = () => {
    closeAllDropdowns();
    setShowProfileDropdown(!showProfileDropdown);
    if (!showProfileDropdown) {
      setShowSearchSuggestions(false);
    }
  };

  // const toggleNotificationsDropdown = () => {
  //   const newState = !showNotificationsDropdown;
  //   closeAllDropdowns();
  //   setShowNotificationsDropdown(newState);
  // };

  // const toggleMessagesDropdown = () => {
  //   const newState = !showMessagesDropdown;
  //   closeAllDropdowns();
  //   setShowMessagesDropdown(newState);
  // };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(target) &&
      profileIconRef.current &&
      !profileIconRef.current.contains(target) &&
      notificationsDropdownRef.current &&
      !notificationsDropdownRef.current.contains(target) &&
      notificationsIconRef.current &&
      !notificationsIconRef.current.contains(target) &&
      messagesDropdownRef.current &&
      !messagesDropdownRef.current.contains(target) &&
      messagesIconRef.current &&
      !messagesIconRef.current.contains(target) &&
      searchContainerRef.current &&
      !searchContainerRef.current.contains(target)
    ) {
      closeAllDropdowns();
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
      closeAllDropdowns();
      router.push(`/search/top?q=${encodeURIComponent(termToSearch.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    addSearchTermToHistory(term);
    closeAllDropdowns();
    router.push(`/search/top?q=${encodeURIComponent(term.trim())}`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (event.target.value) {
      closeAllDropdowns();
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (searchHistory.length > 0 || searchQuery) {
      closeAllDropdowns();
      setShowSearchSuggestions(true);
    }
  };

  // Handle action in dropdown
  const handleViewAllNotifications = () => {
    closeAllDropdowns();
    router.push("/notifications");
  };
  const handleClearAllNotifications = () => {
    console.log("Clear all notifications clicked");
  };

  const handleExpandMessages = () => {
    closeAllDropdowns();
    router.push("/chat");
  };
  // const unreadNotificationsCount = dummyNotifications.filter(
  //   (n) => !n.read
  // ).length;
  // const unreadMessagesCount = dummyMessages.filter((m) => !m.read).length;

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
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        {/* Messages Icon */}
        <div className="relative" ref={messagesDropdownRef}>
          <button
            ref={messagesIconRef}
            // onClick={toggleMessagesDropdown}
            onClick={() => {
              closeAllDropdowns();
              router.push("/chat");
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Messages"
          >
            <MessagesSquare
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              strokeWidth={2}
            />
            {/* {unreadMessagesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-gray-800">
                {unreadMessagesCount}
              </span>
            )} */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-gray-800">
              !
            </span>
          </button>
          {/* <MessagesDropdown
            isOpen={showMessagesDropdown}
            onClose={closeAllDropdowns}
            onExpand={handleExpandMessages}
            messages={dummyMessages}
            newCount={unreadMessagesCount}
          /> */}
        </div>

        {/* Notifications Icon */}
        <div className="relative" ref={notificationsDropdownRef}>
          <button
            ref={notificationsIconRef}
            // onClick={toggleNotificationsDropdown}
            onClick={() => {
              closeAllDropdowns();
              router.push("/notifications");
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Notifications"
          >
            <Bell
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              strokeWidth={2}
            />
            {/* {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-gray-800">
                {unreadNotificationsCount}
              </span>
            )} */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-gray-800">
              !
            </span>
          </button>
          {/* <NotificationsDropdown
            isOpen={showNotificationsDropdown}
            onClose={closeAllDropdowns}
            onViewAll={handleViewAllNotifications}
            onClearAll={handleClearAllNotifications}
            notifications={dummyNotifications}
            newCount={unreadNotificationsCount}
          /> */}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            ref={profileIconRef}
            onClick={toggleProfileDropdown}
            className="flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 dark:focus:ring-offset-gray-800"
            aria-label="User menu"
          >
            <span className="sr-only">Open user menu</span>
            <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
              <Image
                src={
                  user.avatar ||
                  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                }
                alt={user.name}
                fill
                sizes="32px"
                className="object-cover"
                style={{ objectPosition: "center" }}
              />
            </div>
            <span className="font-medium hidden md:block ml-2 text-sm dark:text-gray-300">
              {user.name}
            </span>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-[0px_0px_14px_0px_rgba(0,0,0,0.2)] overflow-hidden z-30 dark:bg-[#2b2d2e] dark:shadow-[0px_0px_14px_0px_rgba(0,0,0,0.4)]">
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
                <button
                  onClick={() => router.push("/profiles/me")}
                  className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-80 transition-colors duration-200"
                >
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
                <span className="text-gray-700 dark:text-gray-300">Theme</span>
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

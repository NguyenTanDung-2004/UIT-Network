"use client";
import React, { useState, useEffect } from "react";
import LeftBar from "@/components/home/layout/LeftBar";
import RightBar from "@/components/home/layout/RightBar";
import { ChatItem } from "@/components/home/layout/RightBar";

interface LayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<LayoutProps> = ({ children }) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Sample data for testing
  const groups = [
    { id: "rubik-club", name: "Rubik Club" },
    { id: "taekwondo-judo", name: "Taekwondo & Judo" },
    { id: "ban-hoc-tap", name: "Ban học tập khoa CNPM" },
  ];

  const chatItems: ChatItem[] = [
    {
      id: "1",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 2,
      status: "online",
    },
    {
      id: "2",
      name: "Phan Giang",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 2,
      status: "offline",
    },
    {
      id: "3",
      name: "Yến Trần",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 2,
      status: "offline",
    },
    {
      id: "4",
      name: "Group Học giải tích",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 1,
    },
    {
      id: "5",
      name: "Group Học giải tích",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 1,
    },
    {
      id: "6",
      name: "Group Học giải tích",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 1,
    },
    {
      id: "7",
      name: "Group Học giải tích",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 1,
    },
    {
      id: "8",
      name: "Nguyễn  Văn A",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 2,
      status: "online",
    },
    {
      id: "9",
      name: "Phan B",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 2,
      status: "offline",
    },
    {
      id: "10",
      name: "Yến Trần 123",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      type: 2,
      status: "offline",
    },
  ];
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        document.body.style.overflowY = "hidden";
        document.body.style.overflowX = "hidden";
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      } else if (window.innerWidth < 1024) {
        setIsMobile(false);
        setShowLeftSidebar(true);
        setShowRightSidebar(false);
      } else {
        setIsMobile(false);
        setShowLeftSidebar(true);
        setShowRightSidebar(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebars for mobile
  const toggleLeftSidebar = () => {
    setShowLeftSidebar(!showLeftSidebar);
    if (isMobile && !showLeftSidebar) {
      setShowRightSidebar(false);
    }
  };

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  return (
    <>
      {/* Mobile Toggle Buttons*/}
      <div className="lg:hidden  flex  px-4 py-2 bg-white border-b">
        <button onClick={toggleLeftSidebar} className="text-gray-600 md:hidden">
          <i className={`fas ${showLeftSidebar ? "fa-times" : "fa-bars"}`}></i>
        </button>

        <button onClick={toggleRightSidebar} className="text-gray-600 ml-auto">
          <i
            className={`fas ${showRightSidebar ? "fa-times" : "fa-users"}`}
          ></i>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`${
            showLeftSidebar ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 w-64 flex-shrink-0 md:translate-x-0 absolute md:relative z-20 bg-white h-full`}
        >
          <LeftBar groups={groups} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="max-w-5xl mx-auto py-4 px-4">{children}</div>
        </div>

        {/* Right Sidebar */}
        {!isMobile && !showRightSidebar && window.innerWidth < 1024 ? null : (
          <div
            className={`${
              showRightSidebar ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 w-72 flex-shrink-0 lg:translate-x-0 absolute right-0 md:relative z-20 bg-white h-full`}
          >
            <RightBar chats={chatItems} />
          </div>
        )}
      </div>

      {/* Backdrop for mobile when sidebar is open */}
      {isMobile && (showLeftSidebar || showRightSidebar) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        ></div>
      )}
    </>
  );
};

export default HomeLayout;

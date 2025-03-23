"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import LeftBar from "@/components/home/layout/LeftBar";
import RightBar from "@/components/home/layout/RightBar";

interface LayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<LayoutProps> = ({ children }) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Sample data for testing
  const user = {
    name: "Phan Giang",
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  };

  const groups = [
    { id: "rubik-club", name: "Rubik Club" },
    { id: "taekwondo-judo", name: "Taekwondo & Judo" },
    { id: "ban-hoc-tap", name: "Ban học tập khoa CNPM" },
  ];

  const communityChats = [
    { id: "rubik-club", name: "Rubik Club" },
    { id: "taekwondo-judo", name: "Teakwondo & Judo" },
    { id: "ban-hoc-tap", name: "Ban học tập khoa CNPM" },
  ];

  const groupChats = [
    { id: "ktpm2022-1", name: "KTPM2022.1" },
    { id: "se101", name: "SE101" },
    { id: "it001", name: "IT001" },
    { id: "learning-english", name: "Learning English" },
  ];

  const onlineContacts = [
    {
      id: "user1",
      name: "Nguyễn Tấn Dũng",
      status: "online" as "online" | "offline",
    },
    {
      id: "user2",
      name: "Trần Nguyễn Hồng Quân",
      status: "online" as "online" | "offline",
    },
    {
      id: "user3",
      name: "Kim Nhung",
      status: "online" as "online" | "offline",
    },
    { id: "user4", name: "Yến Trần", status: "online" as "online" | "offline" },
    {
      id: "user5",
      name: "Nguyễn Tấn Dũng",
      status: "online" as "online" | "offline",
    },
    {
      id: "user6",
      name: "Trần Nguyễn Hồng Quân",
      status: "online" as "online" | "offline",
    },
    {
      id: "user7",
      name: "Kim Nhung",
      status: "online" as "online" | "offline",
    },
    { id: "user8", name: "Yến Trần", status: "online" as "online" | "offline" },
  ];

  // const groupsToJoin = [
  //   { id: "uit-k22", name: "UIT K22" },
  //   { id: "uit-khdl", name: "UIT KHDL" },
  //   { id: "rubik-club", name: "Rubik Club" },
  //   { id: "uit-cnpm", name: "UIT CNPM", years: "2022 - 2025" },
  // ];

  // Check screen size to handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
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
    if (isMobile && !showRightSidebar) {
      setShowLeftSidebar(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F3F3]">
      {/* Navigation Bar */}
      <NavBar user={user} />

      {/* Mobile Toggle Buttons*/}
      <div className="md:hidden flex justify-between px-4 py-2 bg-white border-b">
        <button onClick={toggleLeftSidebar} className="text-gray-600">
          <i className={`fas ${showLeftSidebar ? "fa-times" : "fa-bars"}`}></i>
        </button>
        <button onClick={toggleRightSidebar} className="text-gray-600">
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
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto py-4 px-4">{children}</div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`${
            showRightSidebar ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 w-72 flex-shrink-0 lg:translate-x-0 absolute right-0 md:relative z-20 bg-white h-full`}
        >
          <RightBar
            communityChats={communityChats}
            groupChats={groupChats}
            onlineContacts={onlineContacts}
          />
        </div>
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
    </div>
  );
};

export default HomeLayout;

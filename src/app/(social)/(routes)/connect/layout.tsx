"use client";

import React, { useState, useEffect } from "react";
import ConnectSidebar from "@/components/connect/ConnectSidebar"; // Điều chỉnh đường dẫn nếu cần
import { Filter, X } from "lucide-react"; // Icon để toggle sidebar

interface ConnectLayoutProps {
  children: React.ReactNode;
}

const ConnectLayout: React.FC<ConnectLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 768; // md breakpoint
      setIsSmallScreen(smallScreen);
      setShowSidebar(!smallScreen); // Hide sidebar by default on small screens
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Mobile Toggle Button */}
      <div className="md:hidden absolute top-2 left-2 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white dark:bg-gray-700 rounded-md shadow text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          aria-label={showSidebar ? "Close filters" : "Open filters"}
        >
          {showSidebar ? <X size={20} /> : <Filter size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          w-72 md:w-80 lg:w-96 h-full flex-shrink-0
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
          bg-white dark:bg-gray-800 shadow-md md:shadow-sm md:mr-5 md:rounded-lg
          absolute inset-y-0 left-0 z-20
          md:relative md:inset-auto md:z-auto md:translate-x-0
        `}
      >
        <ConnectSidebar />
      </aside>

      {/* Main Content Area */}
      <main className=" flex-1 h-full overflow-y-auto pr-1 md:pr-5 pb-5 pl-1 md:pl-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pt-12 md:pt-0 ">
        {children}
      </main>

      {/* Backdrop for mobile */}
      {isSmallScreen && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default ConnectLayout;

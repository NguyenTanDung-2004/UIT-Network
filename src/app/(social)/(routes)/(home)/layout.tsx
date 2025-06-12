"use client";
import React, { useState, useEffect } from "react";
import LeftBar from "@/components/home/layout/LeftBar";
import RightBar from "@/components/home/layout/RightBar";
import { ChatItem } from "@/types/chats/ChatData";
import { getChatTopics } from "@/services/chatService";
import ClipLoader from "react-spinners/ClipLoader";

interface LayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<LayoutProps> = ({ children }) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [errorChats, setErrorChats] = useState<string | null>(null);

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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoadingChats(true);
    setErrorChats(null);

    const fetchChats = async () => {
      try {
        const fetchedChats = await getChatTopics();
        if (isMounted) {
          setChatItems(fetchedChats);
        }
      } catch (err: any) {
        console.error("Failed to fetch chat topics in HomeLayout:", err);
        if (isMounted) {
          setErrorChats(err.message || "Failed to load chat list.");
        }
      } finally {
        if (isMounted) {
          setLoadingChats(false);
        }
      }
    };

    fetchChats();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleLeftSidebar = () => {
    setShowLeftSidebar(!showLeftSidebar);
    if (isMobile && !showLeftSidebar) {
      setShowRightSidebar(false);
    }
  };

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };

  if (loadingChats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  if (errorChats) {
    return (
      <div className="text-center p-4 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto mt-8">
        {errorChats}
      </div>
    );
  }

  return (
    <>
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

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${
            showLeftSidebar ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 w-64 flex-shrink-0 md:translate-x-0 absolute md:relative z-20 bg-white h-full`}
        >
          <LeftBar />
        </div>

        <div className="flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="max-w-5xl mx-auto py-4 px-4">{children}</div>
        </div>

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

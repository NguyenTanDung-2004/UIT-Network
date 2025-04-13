"use client";
import React from "react";
import NavBar from "@/components/layout/NavBar";

interface SocialLayoutProps {
  children: React.ReactNode;
}

const SocialLayout: React.FC<SocialLayoutProps> = ({ children }) => {
  const user = {
    name: "Phan Giang",
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F3F3] dark:bg-gray-800 overflow-hidden">
      <NavBar user={user} />
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
};

export default SocialLayout;

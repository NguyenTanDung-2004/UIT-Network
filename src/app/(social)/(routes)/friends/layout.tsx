"use client";
import React from "react";
import Sidebar from "@/components/friends/Sidebar"; // Assuming you renamed the component or the import
import { usePathname } from "next/navigation";

interface FriendLayoutProps {
  children: React.ReactNode;
}

const FriendLayout: React.FC<FriendLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isFriendsHome = pathname === "/friends";

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {isFriendsHome && (
        <aside className="w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:block  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <Sidebar />
        </aside>
      )}

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 h-auto overflow-y-auto mb-4 md:mb-0  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {children}
      </main>
    </div>
  );
};

export default FriendLayout;

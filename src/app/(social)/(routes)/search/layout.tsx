"use client";
import React from "react";
import SearchSidebar from "@/components/search/SearchSidebar";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout: React.FC<SearchLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-1 overflow-hidden pt-5">
      <aside className="w-80 lg:w-96 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-sm mr-5 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <SearchSidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto pr-5 pb-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {children}
      </main>
    </div>
  );
};

export default SearchLayout;

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchAndHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchAndHeader: React.FC<SearchAndHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h2 className="text-xl font-bold mb-4 text-black dark:text-gray-100">
        Friends
      </h2>
      <div className="relative w-full sm:w-64 order-3 sm:order-none">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:text-gray-200"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Link
        href="/friends" // Link to the main friends page (requests, suggestions etc.)
        className="text-sm font-medium text-primary hover:underline order-2 sm:order-none"
      >
        Friend Requests
      </Link>
    </div>
  );
};

export default SearchAndHeader;

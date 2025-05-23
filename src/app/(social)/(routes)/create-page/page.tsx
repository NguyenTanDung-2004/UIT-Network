"use client";

import { useRouter } from "next/navigation";
import React from "react";

const CreatePageLandingPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="bg-[#F3F3F3] dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8 md:p-10 w-full max-w-sm md:max-w-md text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
          Page Management
        </h2>
        <div className="flex flex-col gap-6">
          <button
            onClick={() => router.push("/create-page/create")}
            className="w-full px-6 py-3 text-lg sm:text-xl font-medium rounded-md transition-colors bg-primary text-white hover:bg-primary/80 dark:bg-primary dark:text-white dark:hover:bg-primary/80"
          >
            Create New Page
          </button>
          <button
            onClick={() => router.push("/create-page/manage")}
            className="w-full px-6 py-3 text-lg sm:text-xl font-medium rounded-md transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Manage My Pages
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePageLandingPage;

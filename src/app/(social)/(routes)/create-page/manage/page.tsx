"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { getMockUserPages, Page } from "@/lib/mockData"; // Adjust path
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const MyPageListPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const userPages = getMockUserPages();
      setPages(userPages);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-y-auto py-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-8 md:p-10 max-w-3xl mx-auto border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
            Manage My Pages
          </h1>
          <button
            onClick={() => router.push("/create-page")}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors bg-primaryLight  text-primary  hover:bg-primary/30 flex-shrink-0 dark:bg-primary/30 dark:text-white dark:hover:bg-primary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            You don't manage any pages yet.
          </div>
        ) : (
          <div className="space-y-6">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/create-page/manage/${page.id}`}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {page.avtUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                      <Image
                        src={page.avtUrl}
                        alt={`${page.name} avatar`}
                        fill={true}
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {page.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {page.bio}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>{page.followerCount} Followers</span>
                      <span className="ml-4">{page.postCount} Posts</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageListPage;

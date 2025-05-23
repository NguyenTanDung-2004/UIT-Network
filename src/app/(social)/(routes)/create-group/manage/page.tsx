"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { getMockUserGroups, Group } from "@/lib/mockData";

const MyGroupListPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      const userGroups = getMockUserGroups();
      setGroups(userGroups);
      setLoading(false);
    }, 500); // Simulate network delay

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
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
          Manage My Groups
        </h1>

        {groups.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            You don't manage any groups yet.
            <br />
            <Link
              href="/create-group/create"
              className="text-primary hover:underline dark:text-primary-light"
            >
              Create a new one!
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/create-group/manage/${group.id}`}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {group.avtUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                      <Image
                        src={group.avtUrl}
                        alt={`${group.name} avatar`}
                        fill={true}
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {group.intro}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      <span>{group.memberCount} Members</span>
                      {group.pendingRequestsCount > 0 && (
                        <span className="ml-4 text-yellow-600 dark:text-yellow-400">
                          {group.pendingRequestsCount} Pending Requests
                        </span>
                      )}
                      {group.pendingPostsCount > 0 && (
                        <span className="ml-4 text-red-600 dark:text-red-400">
                          {group.pendingPostsCount} Pending Posts
                        </span>
                      )}
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

export default MyGroupListPage;

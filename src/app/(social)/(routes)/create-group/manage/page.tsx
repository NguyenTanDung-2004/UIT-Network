"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getListGroups } from "@/services/groupService";
import { GroupHeaderData } from "@/types/groups/GroupData";

const MyGroupListPage: React.FC = () => {
  const [groups, setGroups] = useState<GroupHeaderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getListGroups();
        if (isMounted) {
          setGroups(fetchedGroups);
        }
      } catch (err: any) {
        console.error("Failed to fetch groups:", err);
        if (isMounted) {
          setError(err.message || "Could not load groups.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGroups();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-y-auto py-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-8 md:p-10 max-w-3xl mx-auto border border-gray-100 dark:border-gray-700 mb-28">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-grow truncate">
            Manage My Groups
          </h1>
          <button
            onClick={() => router.push("/create-group")}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors bg-primaryLight  text-primary  hover:bg-primary/30 flex-shrink-0 dark:bg-primary/30 dark:text-white dark:hover:bg-primary/20 flex items-center" // Added flex items-center
          >
            <Plus size={16} className="mr-1" /> {/* Changed icon to Plus */}
            Create Group
          </button>
        </div>

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
                  {group.avatar && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                      <Image
                        src={group.avatar}
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
                      {group.bio}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {group.createdDate && (
                        <span>
                          Created:
                          {new Date(group.createdDate).toLocaleDateString(
                            "en-GB"
                          )}
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

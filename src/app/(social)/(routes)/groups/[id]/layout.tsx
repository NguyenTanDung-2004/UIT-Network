"use client";

import React, { useEffect, useState } from "react";
import GroupHeader from "@/components/groups/GroupHeader";
import GroupTabs from "@/components/groups/GroupTabs";
import { ClipLoader } from "react-spinners";
import { GroupHeaderData } from "@/types/groups/GroupData";
import { getGroupInfo } from "@/services/groupService"; // Import API

const GroupLayout = ({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const params = React.use(paramsPromise);
  const { id: currentGroupId } = params;

  const [groupData, setGroupData] = useState<GroupHeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (currentGroupId) {
      setLoading(true);
      setError(null);
      getGroupInfo(currentGroupId)
        .then(({ data }) => {
          if (isMounted) {
            if (data) {
              setGroupData(data);
            } else {
              setError(`Group with ID "${currentGroupId}" not found.`);
            }
            setLoading(false);
          }
        })
        .catch((fetchError) => {
          console.error("Failed to fetch group data:", fetchError);
          if (isMounted) {
            setError("Failed to load group data.");
            setLoading(false);
          }
        });
    } else {
      setError("Invalid group ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentGroupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="text-center mt-16 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || `Group data could not be loaded.`}
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="max-w-7xl mx-auto">
        <GroupHeader groupData={groupData} />
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-b-lg mb-4 sticky top-0 z-10">
          <GroupTabs groupId={currentGroupId} />
        </div>

        <div className="px-2 sm:px-4 lg:px-0 py-4 pb-10 md:pb-28">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GroupLayout;

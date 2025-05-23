"use client";

import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import { getMockPageFollowers, Follower } from "@/lib/mockData"; // Adjust path
import FollowerItem from "@/components/createPage/manage/FollowerItem";

interface PageIdParams {
  id: string;
}

const ManagePageFollowersPage: React.FC = () => {
  const params = useParams();
  const pageId = params.id;

  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageId) {
      setLoading(true);
      const timer = setTimeout(() => {
        const idStr = Array.isArray(pageId) ? pageId[0] : pageId;
        const pageFollowers = getMockPageFollowers(idStr);
        setFollowers(pageFollowers);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Followers ({followers.length})
        </h3>
        {followers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No followers yet.
          </p>
        ) : (
          <div className="space-y-2">
            {followers.map((follower) => (
              <FollowerItem key={follower.id} follower={follower} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePageFollowersPage;

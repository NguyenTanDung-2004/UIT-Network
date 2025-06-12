"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import FollowingCard from "@/components/profile/friends/FollowingCard";

import { FollowingItem } from "@/types/profile/FriendData";
import { useUser } from "@/contexts/UserContext";
import { getFollowingPages } from "@/services/fanpageGroupService";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const ProfileFollowingPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [followingItems, setFollowingItems] = useState<FollowingItem[]>([]);
  const [counts, setCounts] = useState<{
    all: number;
    following: number;
    joined: number;
  }>({
    all: 0,
    following: 0,
    joined: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchFollowingData = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        if (!profileId) {
          throw new Error("Invalid profile ID for following page.");
        }

        const isCurrentUserProfile =
          user && (profileId === "me" || profileId === user.id);
        const targetUserId = isCurrentUserProfile && user ? user.id : profileId;

        const fetchedPages = await getFollowingPages(targetUserId);

        if (isMounted) {
          setFollowingItems(fetchedPages);
          setCounts({
            all: 0, // Placeholder for total friends/following, not fetched here
            following: fetchedPages.length,
            joined: 0, // Placeholder for joined groups, not fetched here
          });
        }
      } catch (err: any) {
        console.error("Error fetching following data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load following data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFollowingData();

    return () => {
      isMounted = false;
    };
  }, [profileId, user, userContextLoading, userContextError]);

  const filteredFollowing = useMemo(() => {
    if (!followingItems) return [];
    if (!searchQuery) return followingItems;
    return followingItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [followingItems, searchQuery]);

  const isOwnProfile = !!(
    user &&
    (profileId === "me" || profileId === user.id)
  );

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

  if (error) {
    return (
      <div className="p-6 text-center mt-8 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm md:p-6 mb-6 md:mb-8 min-h-[400px]">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="following"
        profileId={profileId}
        counts={counts}
      />

      {filteredFollowing.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFollowing.map((item) => (
            <FollowingCard
              key={`${item.type}-${item.id}`}
              item={item}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "Nothing found matching your search."
            : "Not following any pages yet."}
        </div>
      )}
    </div>
  );
};

export default ProfileFollowingPage;

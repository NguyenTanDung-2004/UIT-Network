"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import JoinedCard from "@/components/profile/friends/JoinedCard";

import { JoinedGroup } from "@/types/profile/FriendData";
import { useUser } from "@/contexts/UserContext";
import { getJoinedGroups } from "@/services/fanpageGroupService";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const ProfileJoinedGroupsPage: React.FC<{
  params: Promise<{ id: string }>;
}> = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [joinedGroups, setJoinedGroups] = useState<JoinedGroup[]>([]);
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

    const fetchGroupsData = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        if (!profileId) {
          throw new Error("Invalid profile ID for joined groups page.");
        }

        const isCurrentUserProfile =
          user && (profileId === "me" || profileId === user.id);
        const targetUserId = isCurrentUserProfile && user ? user.id : profileId;

        const fetchedGroups = await getJoinedGroups(targetUserId);

        if (isMounted) {
          setJoinedGroups(fetchedGroups);
          setCounts({
            all: 0, // Placeholder for total friends/following, not fetched here
            following: 0, // Placeholder for following pages, not fetched here
            joined: fetchedGroups.length,
          });
        }
      } catch (err: any) {
        console.error("Error fetching joined groups data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load joined groups data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGroupsData();

    return () => {
      isMounted = false;
    };
  }, [profileId, user, userContextLoading, userContextError]);

  const filteredGroups = useMemo(() => {
    if (!joinedGroups) return [];
    if (!searchQuery) return joinedGroups;
    return joinedGroups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [joinedGroups, searchQuery]);

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm md:p-6 mb-6 md:mb-8">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="joined"
        profileId={profileId}
        counts={counts}
      />

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredGroups.map((group) => (
            <JoinedCard
              key={group.id}
              item={group}
              profileId={profileId}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "No groups found matching your search."
            : "This user hasn't joined any groups yet."}
        </div>
      )}
    </div>
  );
};

export default ProfileJoinedGroupsPage;

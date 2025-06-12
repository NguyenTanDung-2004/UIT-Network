"use client";
import React, { useState, useEffect, useMemo, use } from "react";
import { useParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

import FriendsNavigation from "@/components/profile/friends/FriendsNavigation";
import SearchAndHeader from "@/components/profile/friends/SearchAndHeader";
import FriendCard from "@/components/profile/friends/FriendCard";

import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { Friend } from "@/types/profile/FriendData";
import { useUser } from "@/contexts/UserContext";
import {
  getListFriendIds,
  getUserInfoCardsByIds,
} from "@/services/friendService";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const ProfileFriendsPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [headerData, setHeaderData] = useState<ProfileHeaderData | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendCounts, setFriendCounts] = useState<{
    all: number;
    following: number;
    joined: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchFriendsData = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        if (!profileId) {
          throw new Error("Invalid profile ID for friends page.");
        }

        const isCurrentUserProfile =
          user && (profileId === "me" || profileId === user.id);

        let targetUserId = profileId;
        if (isCurrentUserProfile && user) {
          targetUserId = user.id;
          setHeaderData({
            id: user.id,
            name: user.name,
            avatar: user.avtURL || DEFAULT_AVATAR,
            coverPhoto: user.background || "",
            followerCount: 0,
            friendCount: 0, // Will be updated after fetching friends
            friendshipStatus: "self",
          });
        } else {
          setHeaderData({
            id: profileId,
            name: "Other User", // Placeholder
            avatar: DEFAULT_AVATAR,
            coverPhoto: "",
            followerCount: 0,
            friendCount: 0, // Will be updated after fetching friends
            friendshipStatus: "not_friend", // Placeholder
          });
        }

        const friendIds = await getListFriendIds(targetUserId);
        const friendInfoCards = await getUserInfoCardsByIds(friendIds);

        if (isMounted) {
          setFriends(friendInfoCards);
          setFriendCounts({
            all: friendInfoCards.length,
            following: 0, // Placeholder
            joined: 0, // Placeholder
          });

          // Update friendCount in headerData
          setHeaderData((prev) =>
            prev ? { ...prev, friendCount: friendInfoCards.length } : null
          );
        }
      } catch (err: any) {
        console.error("Error fetching friends data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load friends data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFriendsData();

    return () => {
      isMounted = false;
    };
  }, [profileId, user, userContextLoading, userContextError]);

  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    if (!searchQuery) return friends;
    return friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

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

  if (error || !headerData || !friendCounts) {
    return (
      <div className="p-6 text-center mt-8 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || "Could not load profile friends information."}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm   md:p-6  mb-6 md:mb-8 min-h-[400px]">
      <SearchAndHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsNavigation
        activeTab="all"
        profileId={profileId}
        counts={friendCounts}
      />

      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} profileId={profileId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {searchQuery
            ? "No friends found matching your search."
            : "No friends to display."}
        </div>
      )}
    </div>
  );
};

export default ProfileFriendsPage;

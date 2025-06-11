"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { ClipLoader } from "react-spinners";
import { useUser } from "@/contexts/UserContext";
import { getListUserInfoByIds } from "@/services/userService";
import { ProfileAboutData } from "@/types/profile/AboutData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

const mapProfileAboutToProfileHeader = (
  profileAbout: ProfileAboutData
): ProfileHeaderData => {
  return {
    id: profileAbout.id,
    name: profileAbout.name,
    avatar: profileAbout.avtURL || DEFAULT_AVATAR,
    coverPhoto: profileAbout.background || DEFAULT_COVER,
    followerCount: 0,
    friendCount: 0,
    friendshipStatus: "not_friend",
  };
};

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const ProfileLayout = ({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const params = React.use(paramsPromise);
  const { id: currentProfileId } = params;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [profileData, setProfileData] = useState<ProfileHeaderData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (userContextLoading) {
      setLoading(true);
      return;
    }

    if (userContextError) {
      setError(userContextError);
      setLoading(false);
      return;
    }

    const isCurrentUserProfile =
      user && (currentProfileId === "me" || currentProfileId === user.id);

    if (isCurrentUserProfile && user) {
      setProfileData({
        id: user.id,
        name: user.name,
        avatar: user.avtURL || DEFAULT_AVATAR,
        coverPhoto: user.background || DEFAULT_COVER,
        followerCount: 0,
        friendCount: 0,
        friendshipStatus: "self",
      });
      setLoading(false);
    } else if (currentProfileId) {
      setLoading(true);
      setError(null);

      getListUserInfoByIds([currentProfileId])
        .then((dataArray) => {
          if (isMounted) {
            if (dataArray && dataArray.length > 0) {
              const fetchedProfile = mapProfileAboutToProfileHeader(
                dataArray[0]
              );
              setProfileData(fetchedProfile);
            } else {
              setError(`Profile with ID "${currentProfileId}" not found.`);
            }
            setLoading(false);
          }
        })
        .catch((fetchError) => {
          console.error("Failed to fetch other profile data:", fetchError);
          if (isMounted) {
            setError("Failed to load profile data.");
            setLoading(false);
          }
        });
    } else {
      setError("Invalid profile ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentProfileId, user, userContextLoading, userContextError]);

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

  if (error || !profileData) {
    return (
      <div className="text-center mt-16 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || `Profile data could not be loaded.`}
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="max-w-7xl mx-auto mb-28 ">
        <ProfileHeader profileData={profileData} />
        <div className="relative z-0 -mt-5 md:-mt-8 px-2 sm:px-4 lg:px-0">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-4 sticky top-0 z-10">
            <ProfileTabs profileId={profileData.id} />
          </div>

          <div className="pb-4 mt-10 mb-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;

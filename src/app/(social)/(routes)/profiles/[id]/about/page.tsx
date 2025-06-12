"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

import AboutSidebar from "@/components/profile/about/AboutSidebar";
import OverviewContent from "@/components/profile/about/OverviewContent";
import ContactInfoContent from "@/components/profile/about/ContactInfoContent";
import HobbiesContent from "@/components/profile/about/HobbiesContent";
import EducationContent from "@/components/profile/about/EducationContent";
import ScheduleContent from "@/components/profile/about/ScheduleContent";

import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { ProfileAboutData } from "@/types/profile/AboutData";
import { useUser } from "@/contexts/UserContext";
import { getUserInfo, getListUserInfoByIds } from "@/services/userService"; // Import getUserInfo và getListUserInfoByIds

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

const mapProfileAboutToProfileHeader = (
  profileAbout: ProfileAboutData,
  friendshipStatus: "self" | "friend" | "not_friend"
): ProfileHeaderData => {
  return {
    id: profileAbout.id,
    name: profileAbout.name,
    avatar: profileAbout.avtURL || DEFAULT_AVATAR,
    coverPhoto: profileAbout.background || DEFAULT_COVER,
    followerCount: 0,
    friendCount: 0,
    friendshipStatus: friendshipStatus,
  };
};

const ProfileAboutPageContent: React.FC<{ profileId: string }> = ({
  profileId,
}) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [headerData, setHeaderData] = useState<ProfileHeaderData | null>(null);
  const [aboutData, setAboutData] = useState<ProfileAboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        if (!profileId) {
          throw new Error("Invalid profile ID.");
        }

        const isCurrentUserProfile =
          user && (profileId === "me" || profileId === user.id);

        let fetchedAboutData: ProfileAboutData | null = null;
        let friendshipStatus: "self" | "friend" | "not_friend" = "not_friend";

        if (isCurrentUserProfile && user) {
          fetchedAboutData = user;
          friendshipStatus = "self";
        } else {
          const fetchedUsers = await getListUserInfoByIds([profileId]);
          if (fetchedUsers && fetchedUsers.length > 0) {
            fetchedAboutData = fetchedUsers[0];
            // Hardcode friendship status for now, replace with actual API call later
            if (profileId === "nguyen_tan_dung_id") {
              friendshipStatus = "friend";
            } else {
              friendshipStatus = "not_friend";
            }
          } else {
            throw new Error(`Profile with ID "${profileId}" not found.`);
          }
        }

        if (isMounted && fetchedAboutData) {
          setAboutData(fetchedAboutData);
          setHeaderData(
            mapProfileAboutToProfileHeader(fetchedAboutData, friendshipStatus)
          );
        } else if (isMounted) {
          throw new Error("Could not load profile information.");
        }
      } catch (err: any) {
        console.error("Failed to load profile data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load profile information.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [profileId, user, userContextLoading, userContextError]);

  const isOwnProfile = headerData?.friendshipStatus === "self";

  const renderContent = () => {
    if (!aboutData) return null;

    switch (activeTab) {
      case "contact":
        return (
          <ContactInfoContent
            contactData={aboutData.contact}
            basicInfoData={aboutData.basicInfo}
            isOwnProfile={isOwnProfile}
          />
        );
      case "hobbies":
        return (
          <HobbiesContent
            data={aboutData.hobbies}
            isOwnProfile={isOwnProfile}
          />
        );
      case "education":
        return (
          <EducationContent
            data={aboutData.workAndEducation}
            isOwnProfile={isOwnProfile}
          />
        );

      case "schedule":
        return (
          <ScheduleContent
            data={aboutData.schedule ?? {}}
            isOwnProfile={isOwnProfile}
          />
        );
      case "overview":
      default:
        return (
          <OverviewContent
            data={aboutData.overview}
            isOwnProfile={isOwnProfile}
          />
        );
    }
  };

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

  if (error || !headerData || !aboutData) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || "Could not load profile information."}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-sm md:mb-16 mb-8">
      <AboutSidebar />
      <div className="flex-1 p-6 md:border-l border-gray-200 dark:border-gray-700 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
};

const ProfileAboutPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center w-full h-[400px]">
          <ClipLoader color="#F472B6" loading={true} size={35} />
        </div>
      }
    >
      {profileId && <ProfileAboutPageContent profileId={profileId} />}
      {!profileId && (
        <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
          Invalid profile ID.
        </div>
      )}
    </Suspense>
  );
};

export default ProfileAboutPage;

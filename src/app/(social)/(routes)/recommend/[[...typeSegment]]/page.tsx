"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PeopleCard from "@/components/recommend/PeopleCard";
import { Person } from "@/services/recommendService";
import {
  getRecommendedByMutualFriend,
  getRecommendedByLocation,
  getRecommendedByHobby,
  getRecommendedBySchedule,
} from "@/services/recommendService"; // Import các hàm API
import { useUser } from "@/contexts/UserContext"; // Import useUser
import ClipLoader from "react-spinners/ClipLoader";

const VALID_TYPES = ["schedule", "location", "hobby", "mutual-friend"];

interface RecommendPageParams {
  typeSegment?: string[];
}

const RecommendPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const type = params.typeSegment?.[0];

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [recommendedPeople, setRecommendedPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileId = user?.id || "me"; // Sử dụng ID thật của user

  const buttons = [
    { label: "By Schedule", type: "schedule", href: `/recommend/schedule` },
    { label: "By Location", type: "location", href: `/recommend/location` },
    { label: "By Hobby", type: "hobby", href: `/recommend/hobby` },
    {
      label: "By Mutual Friend",
      type: "mutual-friend",
      href: `/recommend/mutual-friend`,
    },
  ];

  useEffect(() => {
    if (type && !VALID_TYPES.includes(type)) {
      router.replace("/recommend");
    }
  }, [type, router]);

  useEffect(() => {
    let isMounted = true;
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      setRecommendedPeople([]);

      if (userContextLoading) {
        return;
      }

      if (userContextError) {
        setError(userContextError);
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setError(
          "User not authenticated. Please log in to see recommendations."
        );
        setLoading(false);
        return;
      }

      if (!type || !VALID_TYPES.includes(type)) {
        setLoading(false);
        return;
      }

      try {
        let fetchedData: Person[] = [];
        switch (type) {
          case "schedule":
            fetchedData = await getRecommendedBySchedule();
            break;
          case "location":
            fetchedData = await getRecommendedByLocation();
            break;
          case "hobby":
            fetchedData = await getRecommendedByHobby();
            break;
          case "mutual-friend":
            fetchedData = await getRecommendedByMutualFriend();
            break;
          default:
            setError("Invalid recommendation type.");
            break;
        }

        if (isMounted) {
          setRecommendedPeople(fetchedData);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch recommendations.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [type, user, userContextLoading, userContextError]);

  const isValidType = type && VALID_TYPES.includes(type);
  const isOwnProfile = profileId === user?.id; // isOwnProfile based on actual user ID

  if (!isValidType) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-screen bg-[#f3f3f3] dark:bg-gray-900 p-4 sm:p-6 md:p-8">
        <div className="rounded-lg shadow-sm px-6 sm:px-8 md:px-10 w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <h2 className="-mt-[80px] text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 sm:mb-8 text-center">
            Choose Recommendation Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {buttons.map((button) => (
              <button
                key={button.type}
                onClick={() => router.push(button.href)}
                className="bg-white w-full min-h-[200px] px-4 py-6 text-lg sm:text-xl font-medium rounded-md transition-colors dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-center"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading || userContextLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Recommendations"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="bg-[#f3f3f3] dark:bg-gray-800 rounded-lg shadow-sm min-h-screen my-6 md:my-10 lg:my-12 sm:my-8 mx-10 sm:mx-10 md:mx-32 lg:mx-28 px-16">
        <div className="mb-6">
          <button
            onClick={() => router.push("/recommend")}
            className=" px-4 py-2 text-sm font-medium rounded-md transition-colors bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white capitalize">
          Recommended People by {type?.replace("-", " ") || "Type"}
        </h1>
        {recommendedPeople.length > 0 ? (
          <div className="space-y-4">
            {recommendedPeople.map((person) => (
              <PeopleCard
                key={person.id}
                person={person}
                profileId={profileId}
                isOwnProfile={isOwnProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No recommended people found for type "{type}".
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendPage;

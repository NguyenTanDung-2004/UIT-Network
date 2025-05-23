"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PeopleCard from "@/components/recommend/PeopleCard";
import { FriendshipStatus, Person } from "@/types/profile/FriendData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const SAMPLE_AVATARS = [
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270448/samples/upscale-face-1.jpg",
  DEFAULT_AVATAR,
];

const VALID_TYPES = ["schedule", "location", "hobby", "mutual-friend"];

const getMockRecommendedPeople = (
  type: string,
  profileId: string
): Person[] => {
  const count = 3;
  const statuses: FriendshipStatus[] = [
    "not_friend",
    "pending_received",
    "friend",
    "pending_sent",
  ];
  return Array.from({ length: count }).map((_, i) => ({
    id: `${type}-${profileId}-${i}`,
    name: `Recommended User ${i + 1} (${type})`,
    avatar: SAMPLE_AVATARS[i % SAMPLE_AVATARS.length],
    profileUrl: `/profiles/${type}-${profileId}-${i}`,
    friendshipStatus:
      profileId === "me" ? statuses[i % statuses.length] : "not_friend",
    followers: Math.floor(Math.random() * 1000),
  }));
};

interface RecommendPageParams {
  typeSegment?: string[];
}

const RecommendPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const type = params.typeSegment?.[0];

  const profileId = "me";

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

  const isValidType = type && VALID_TYPES.includes(type);

  const recommendedPeople = useMemo(
    () =>
      isValidType ? getMockRecommendedPeople(type as string, profileId) : [],
    [isValidType, type, profileId]
  );

  const isOwnProfile = profileId === "me";

  if (!isValidType) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-screen bg-[#f3f3f3] dark:bg-gray-900 p-4 sm:p-6 md:p-8">
        <div className="  rounded-lg shadow-sm px-6 sm:px-8 md:px-10 w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
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

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="bg-[#f3f3f3] dark:bg-gray-800 rounded-lg shadow-sm min-h-screen my-6 md:my-10 lg:my-12 sm:my-8 mx-10 sm:mx-16 md:mx-20 lg:mx-28 px-10">
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

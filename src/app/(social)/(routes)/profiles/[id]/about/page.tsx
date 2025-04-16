"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

import AboutSidebar from "@/components/profile/about/AboutSidebar";
import OverviewContent from "@/components/profile/about/OverviewContent";
import ContactInfoContent from "@/components/profile/about/ContactInfoContent";
import HobbiesContent from "@/components/profile/about/HobbiesContent";
import EducationContent from "@/components/profile/about/EducationContent";

import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { ProfileAboutData } from "@/types/profile/AboutData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

async function fetchProfileBasicData(
  id: string
): Promise<ProfileHeaderData | null> {
  await new Promise((res) => setTimeout(res, 300));
  try {
    if (id === "me") {
      return {
        id: "me",
        name: "Phan Nguyễn Trà Giang",
        avatar: DEFAULT_AVATAR,
        coverPhoto: DEFAULT_COVER,
        followerCount: 19,
        friendCount: 200,
        friendshipStatus: "self",
      };
    } else {
      return {
        id: id,
        name: "Nguyễn Tấn Dũng",
        avatar: DEFAULT_AVATAR,
        coverPhoto: DEFAULT_COVER,
        followerCount: 2,
        friendCount: 12,
        friendshipStatus: "friend",
      };
    }
  } catch (error) {
    console.error("Error fetching basic profile data for page:", error);
    return null;
  }
}

async function fetchProfileAboutData(
  id: string
): Promise<ProfileAboutData | null> {
  await new Promise((res) => setTimeout(res, 600)); // Simulate network delay
  const isMe = id === "me";
  try {
    const data: ProfileAboutData = {
      overview: {
        bio: "He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy. Handsome met debating sir dwelling age material. As style lived he worse dried. Offered related so visitors we private removed. Moderate do subjects to distance.",
        born: "29/03/2004",
        status: "Single",
        occupation: "Backend Java Developer",
        livesIn: "Thu Duc, Ho Chi Minh city",
        phone: "0925xxxX10",
        email: "abc@gmail.com",
      },
      contact: {
        phone: "0925xxxX10",
        email: "abc@gmail.com",
        githubLink: isMe ? null : "https://github.com/someuser",
        socialLinks: isMe
          ? []
          : [
              { id: "fb", platform: "Facebook", url: "https://facebook.com" },
              { id: "ig", platform: "Instagram", url: "https://instagram.com" },
              { id: "li", platform: "Linkedin", url: "https://linkedin.com" },
            ],
        websites: isMe ? [] : [{ id: "uit", url: "https://se.uit.edu.vn/vi/" }],
      },
      basicInfo: { born: "29/03/2004", gender: "Female" },
      hobbies: [
        {
          id: "cook",
          name: "Cooking",
          iconUrl:
            "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/njpufnhlajjpss384yuz.png",
        },
        {
          id: "art",
          name: "Art",
          iconUrl:
            "https://res.cloudinary.com/dos914bk9/image/upload/v1738273041/hobbies/px7m0gvsvow5p5kwyvel.png",
        },
        {
          id: "game",
          name: "Gaming",
          iconUrl:
            "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/tedd2lc2v77g6gnvgpll.png",
        },
        {
          id: "read",
          name: "Reading",
          iconUrl:
            "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/fuywpmecepaqh5allfze.png",
        },
        {
          id: "photo",
          name: "Photography",
          iconUrl:
            "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/fkpi0dk3ufbqyaphckxc.png",
        },
      ],
      workAndEducation: {
        workplaces: isMe
          ? [
              {
                id: "w1",
                company: "UIT Company",
                position: "Intern",
                duration: "2023-Present",
              },
            ]
          : [],
        occupations: isMe
          ? [
              { id: "occ1", title: "Backend Java Developer" },
              { id: "occ2", title: "UI/UX Designer" },
            ]
          : [],
        experienceSummary: isMe
          ? 'Currently working in the "color hands" web development agency from the last 5 five years as Senior Backend Developer'
          : null,
        colleges: isMe
          ? [
              {
                id: "c1",
                name: "University of Information Technology",
                degree: "BSc Computer Science",
                duration: "2020-2024",
              },
            ]
          : [],
        highSchools: isMe
          ? [{ id: "h1", name: "Some High School", duration: "2017-2020" }]
          : [],
      },
    };
    return data;
  } catch (error) {
    console.error("Error fetching about profile data:", error);
    return null;
  }
}
// --- Kết thúc các hàm fetch và constant ---

const ProfileAboutPageContent: React.FC<{ profileId: string }> = ({
  profileId,
}) => {
  const searchParams = useSearchParams(); // Lấy searchParams
  const activeTab = searchParams.get("tab") || "overview"; // Lấy tab từ URL

  const [headerData, setHeaderData] = useState<ProfileHeaderData | null>(null);
  const [aboutData, setAboutData] = useState<ProfileAboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!profileId) {
        setError("Invalid profile ID.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [fetchedHeaderData, fetchedAboutData] = await Promise.all([
          fetchProfileBasicData(profileId),
          fetchProfileAboutData(profileId),
        ]);

        if (!fetchedHeaderData || !fetchedAboutData) {
          throw new Error("Could not load profile information.");
        }

        setHeaderData(fetchedHeaderData);
        setAboutData(fetchedAboutData);
      } catch (err: any) {
        console.error("Failed to load profile data:", err);
        setError(err.message || "Failed to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profileId]); // Chỉ fetch lại data khi profileId thay đổi

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
      <div className="flex justify-center items-center w-full h-[400px]">
        <ClipLoader color="#F472B6" loading={true} size={35} />
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

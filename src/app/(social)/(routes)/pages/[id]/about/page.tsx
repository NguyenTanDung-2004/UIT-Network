"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

import AboutSidebar from "@/components/pages/about/AboutSidebar";

import { PageHeaderData } from "@/types/pages/PageData";
import { PageAboutData } from "@/types/pages/PageData";
import ContactInfoContent from "@/components/pages/about/ContactInfoContent";
import PageTransparency from "@/components/pages/about/PageTransparency";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg";

async function fetchProfileBasicData(
  id: string
): Promise<PageHeaderData | null> {
  try {
    if (id === "page-following") {
      return {
        id: "me",
        name: "UIT Official Page",
        avatar: DEFAULT_AVATAR,
        coverPhoto: DEFAULT_COVER,
        followerCount: 5000,
        isFollowing: true,
      };
    } else {
      return {
        id: id,
        name: `Java Backend Developer`,
        avatar: DEFAULT_AVATAR,
        coverPhoto: DEFAULT_COVER,
        followerCount: 14000,
        isFollowing: false,
      };
    }
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

async function fetchPageAboutData(id: string): Promise<PageAboutData | null> {
  await new Promise((res) => setTimeout(res, 600)); // Simulate network delay
  const isMe = id === "me";
  try {
    const data: PageAboutData = {
      overview: {
        bio: "Thích lập trình  khám phá công nghệ mới của Java. Dành cho những ai đang tìm kiếm cơ hội thực tập hè.",
      },
      contact: {
        phone: "0925xxxX10",
        email: "abc@gmail.com",
        githubLink: "https://github.com/page",
        socialLinks: [
          { id: "fb", platform: "Facebook", url: "https://facebook.com" },
          { id: "ig", platform: "Instagram", url: "https://instagram.com" },
          { id: "li", platform: "Linkedin", url: "https://linkedin.com" },
        ],
        websites: [{ id: "uit", url: "https://se.uit.edu.vn/vi/" }],
      },
      pageTransparency: {
        pageId: "page2184379812749",
        creationDate: "29/03/2004",
        infoAdmin:
          "This page may have multiple administrators. They may have the authority to post content, comment, or send messages on behalf of the Page.",
      },
    };
    return data;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return null;
  }
}
// --- Kết thúc các hàm fetch và constant ---

const AboutPageContent: React.FC<{ profileId: string }> = ({ profileId }) => {
  const searchParams = useSearchParams(); // Lấy searchParams
  const activeTab = searchParams.get("tab") || "contact"; // Lấy tab từ URL

  const [headerData, setHeaderData] = useState<PageHeaderData | null>(null);
  const [aboutData, setAboutData] = useState<PageAboutData | null>(null);
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
          fetchPageAboutData(profileId),
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

  const renderContent = () => {
    if (!aboutData) return null;

    switch (activeTab) {
      case "page-transparency":
        return (
          <PageTransparency transparencyData={aboutData.pageTransparency} />
        );
      default:
        return <ContactInfoContent contactData={aboutData.contact} />;
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

const AboutPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center w-full h-[400px] ">
          <ClipLoader color="#F472B6" loading={true} size={35} />
        </div>
      }
    >
      {profileId && <AboutPageContent profileId={profileId} />}
      {!profileId && (
        <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
          Invalid profile ID.
        </div>
      )}
    </Suspense>
  );
};

export default AboutPage;

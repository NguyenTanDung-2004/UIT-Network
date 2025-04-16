"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/pages/PageHeader";
import PageTabs from "@/components/pages/PageTabs";
import { ClipLoader } from "react-spinners";
import { PageHeaderData } from "@/types/pages/PageData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg";

async function fetchPageData(id: string): Promise<PageHeaderData | null> {
  try {
    if (id === "page-following") {
      return {
        id: "me",
        name: "UIT Official Page",
        avatar:
          "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg",
        coverPhoto:
          "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg",
        followerCount: 5000,
        isFollowing: true,
      };
    } else {
      return {
        id: id,
        name: `Java Backend Developer`,
        avatar:
          "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg",
        coverPhoto:
          "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg",
        followerCount: 14000,
        isFollowing: false,
      };
    }
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

const PageLayout = ({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const params = React.use(paramsPromise);
  const { id: currentPageId } = params;

  const [pageData, satPageData] = useState<PageHeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (currentPageId) {
      setLoading(true);
      setError(null);
      fetchPageData(currentPageId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              satPageData(data);
            } else {
              setError(`Page with ID "${currentPageId}" not found.`);
            }
            setLoading(false);
          }
        })
        .catch((fetchError) => {
          console.error("Failed to fetch page data:", fetchError);
          if (isMounted) {
            setError("Failed to load page data.");
            setLoading(false);
          }
        });
    } else {
      setError("Invalid page ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentPageId]);

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

  if (error || !pageData) {
    return (
      <div className="text-center mt-16 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || `Page data could not be loaded.`}
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-screen overflow-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="max-w-7xl mx-auto">
        <PageHeader pageData={pageData} />
        <div className="relative z-0 -mt-5 md:-mt-8 px-2 sm:px-4 lg:px-0">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-4 sticky top-0 z-10">
            <PageTabs profileId={currentPageId} />
          </div>

          <div className="pb-4 mt-10 mb-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;

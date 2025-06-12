"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

import AboutSidebar from "@/components/pages/about/AboutSidebar";

import { PageHeaderData } from "@/types/pages/PageData";
import { PageAboutData } from "@/types/pages/PageData";
import ContactInfoContent from "@/components/pages/about/ContactInfoContent";
import PageTransparency from "@/components/pages/about/PageTransparency";
import { getFanpageInfo } from "@/services/fanpageService"; // Import API

const AboutPageContent: React.FC<{ profileId: string }> = ({ profileId }) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "contact";

  const [headerData, setHeaderData] = useState<PageHeaderData | null>(null);
  const [aboutData, setAboutData] = useState<PageAboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!profileId) {
        setError("Invalid page ID.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { header, about } = await getFanpageInfo(profileId); // Gọi API fanpage
        if (isMounted) {
          if (header && about) {
            setHeaderData(header);
            setAboutData(about);
          } else {
            throw new Error(`Page with ID "${profileId}" not found.`);
          }
        }
      } catch (err: any) {
        console.error("Failed to load page data:", err);
        if (isMounted) {
          setError(err.message || "Failed to load page information.");
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
  }, [profileId]);

  const renderContent = () => {
    if (!aboutData) return null;

    switch (activeTab) {
      case "page-transparency":
        return (
          <PageTransparency transparencyData={aboutData.pageTransparency} />
        );
      case "contact":
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
        {error || "Could not load page information."}
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
          Invalid page ID.
        </div>
      )}
    </Suspense>
  );
};

export default AboutPage;

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import AboutSummaryWidget from "@/components/pages/AboutSummaryWidget";
import MediaSummaryWidget from "@/components/pages/MediaSummaryWidget";
import { PostDataType } from "@/components/post/Post";
import ClipLoader from "react-spinners/ClipLoader";
import { PageHeaderData, PageAboutData } from "@/types/pages/PageData";
import {
  getFanpageInfo,
  getListMediaByPostId as getListMediaByPageId,
} from "@/services/fanpageService";
import { getPostsByFanpageId } from "@/services/postService";
import { MediaItem } from "@/services/fanpageService";

interface AboutSummary {
  bio: string;
  details: { icon: string; text: string }[];
}

interface PhotoSummary {
  url: string;
}

interface PageSummaryData {
  about: AboutSummary | null;
  photos: PhotoSummary[] | null;
}

const Page: React.FC = () => {
  const params = useParams();
  const pageId = params?.id as string;

  const [pageHeaderData, setPageHeaderData] = useState<PageHeaderData | null>(
    null
  );
  const [pageAboutData, setPageAboutData] = useState<PageAboutData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [photos, setPhotos] = useState<PhotoSummary[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (!pageId) {
          throw new Error("Invalid page ID.");
        }

        const { header, about } = await getFanpageInfo(pageId);
        if (isMounted) {
          if (header && about) {
            setPageHeaderData(header);
            setPageAboutData(about);
          } else {
            throw new Error(`Page with ID "${pageId}" not found.`);
          }
        }

        // Gọi API lấy bài viết của fanpage
        const fetchedPosts = await getPostsByFanpageId(pageId);
        if (isMounted) {
          setPosts(fetchedPosts);
        }

        // Gọi API lấy media của fanpage
        const fetchedMedia: MediaItem[] = await getListMediaByPageId(pageId);
        if (isMounted) {
          setPhotos(fetchedMedia.map((item) => ({ url: item.url })));
        }
      } catch (err: any) {
        console.error("Error fetching page data:", err);
        if (isMounted) {
          setError(err.message || "Could not load page information.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [pageId]);

  const aboutSummary: AboutSummary | null = pageAboutData
    ? {
        bio: pageAboutData.overview.bio,
        details: [
          ...(pageAboutData.contact.phone
            ? [{ icon: "fas fa-phone", text: pageAboutData.contact.phone }]
            : []),
          ...(pageAboutData.contact.email
            ? [{ icon: "fas fa-envelope", text: pageAboutData.contact.email }]
            : []),
          ...(pageAboutData.pageTransparency.creationDate
            ? [
                {
                  icon: "fas fa-calendar-alt",
                  text: `Created: ${pageAboutData.pageTransparency.creationDate}`,
                },
              ]
            : []),
          ...(pageAboutData.pageTransparency.infoAdmin
            ? [
                {
                  icon: "fas fa-user-shield",
                  text: `Admin: ${pageAboutData.pageTransparency.infoAdmin}`,
                },
              ]
            : []),
        ],
      }
    : null;

  const summaries: PageSummaryData = {
    about: aboutSummary,
    photos: photos,
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

  if (error || !pageHeaderData || !summaries) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || "Could not load page information for this page."}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-2 md:px-0 md:mb-16 mb-8">
      <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4 flex-shrink-0 order-2 lg:order-1">
        {summaries.about && (
          <AboutSummaryWidget
            data={summaries.about}
            pageId={pageHeaderData.id}
          />
        )}
        {summaries.photos && summaries.photos.length > 0 && (
          <MediaSummaryWidget
            photos={summaries.photos}
            pageId={pageHeaderData.id}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 order-1 lg:order-2 ">
        <div className={`mt-0 space-y-4`}>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <i className="fas fa-stream text-4xl mb-3"></i>
              <p>No posts to display for this page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

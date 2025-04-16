"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import AboutSummaryWidget from "@/components/pages/AboutSummaryWidget";
import MediaSummaryWidget from "@/components/pages/MediaSummaryWidget";
import { AuthorInfo, UploadedFile, PostDataType } from "@/components/post/Post";
import ClipLoader from "react-spinners/ClipLoader";
import { PageHeaderData } from "@/types/pages/PageData";
import { div } from "framer-motion/client";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg";

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

async function fetchProfileContent(
  id: string
): Promise<{ posts: PostDataType[]; summaries: PageSummaryData }> {
  await new Promise((res) => setTimeout(res, 500));

  const pageData = await fetchProfileBasicData(id);

  const samplePosts: PostDataType[] = [
    {
      id: "profile-post-page1",
      author: {
        id: pageData?.id || "pageJavaDev",
        name: pageData?.name || "CLB Java Developer",
        avatar: pageData?.avatar || DEFAULT_AVATAR,
      },
      origin: {
        type: "page",
        pageInfo: { isFollowing: pageData?.isFollowing || false },
      },
      content: "Thông báo: Workshop Java nâng cao sắp diễn ra!",
      date: "Fri, March 14, 2025",
      time: "04:00 PM",
      mediaList: [
        {
          url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661303/cld-sample-2.jpg",
          type: "image",
        },
        {
          url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
          type: "image",
        },
      ],
      likes: 150,
      comments: 22,
      shares: 5,
    },
    {
      id: "profile-post-page2",
      author: {
        id: pageData?.id || "pageJavaDev",
        name: pageData?.name || "CLB Java Developer",
        avatar: pageData?.avatar || DEFAULT_AVATAR,
      },
      origin: {
        type: "page",
        pageInfo: { isFollowing: pageData?.isFollowing || false },
      },
      content: "Thông báo: Workshop Java nâng cao sắp diễn ra!",
      date: "Fri, March 14, 2025",
      time: "04:00 PM",
      likes: 150,
      comments: 22,
      shares: 5,
    },
    {
      id: "profile-post-page3",
      author: {
        id: pageData?.id || "pageJavaDev",
        name: pageData?.name || "CLB Java Developer",
        avatar: pageData?.avatar || DEFAULT_AVATAR,
      },
      origin: {
        type: "page",
        pageInfo: { isFollowing: pageData?.isFollowing || false },
      },
      content: "Thông báo: Workshop Java nâng cao sắp diễn ra!",
      date: "Fri, March 14, 2025",
      time: "04:00 PM",
      likes: 150,
      comments: 22,
      shares: 5,
    },
  ];

  const sampleSummaries: PageSummaryData = {
    about: {
      bio: "Thích lập trình  khám phá công nghệ mới của Java. Dành cho những ai đang tìm kiếm cơ hội thực tập hè.",
      details: [
        { icon: "fas fa-graduation-cap", text: "#1 Trang cá nhân về Java" },
        { icon: "fas fa-map-marker-alt", text: "làm việc tại TP. Hồ Chí Minh" },
        { icon: "fas fa-link", text: "github.com/page" },
      ],
    },
    photos: [
      {
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
      },
      {
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/njpufnhlajjpss384yuz.png",
      },
      {
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738661303/cld-sample-2.jpg",
      },
      {
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738661302/samples/cup-on-a-table.jpg",
      },
      {
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample-3.jpg",
      },
      {
        url: "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/cld-sample-video.mp4",
      },
      {
        url: "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/sea-turtle.mp4",
      },
    ],
  };

  return { posts: samplePosts, summaries: sampleSummaries };
}

const Page: React.FC = () => {
  const params = useParams();
  const profileId = params?.id as string;

  const [pageProfileData, setPageProfileData] = useState<PageHeaderData | null>(
    null
  );
  const [basicInfoLoading, setBasicInfoLoading] = useState(true);
  const [basicInfoError, setBasicInfoError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [summaries, setSummaries] = useState<PageSummaryData | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (profileId) {
      setBasicInfoLoading(true);
      setBasicInfoError(null);
      fetchProfileBasicData(profileId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setPageProfileData(data);
            } else {
              setBasicInfoError(
                `Basic profile info for ID "${profileId}" not found.`
              );
            }
            setBasicInfoLoading(false);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch basic profile data for page:", error);
          if (isMounted) {
            setBasicInfoError("Failed to load basic profile info.");
            setBasicInfoLoading(false);
          }
        });
    } else {
      setBasicInfoError("Invalid profile ID for page.");
      setBasicInfoLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [profileId]);

  useEffect(() => {
    if (profileId && !basicInfoLoading && !basicInfoError) {
      setContentLoading(true);
      fetchProfileContent(profileId)
        .then(({ posts: fetchedPosts, summaries: fetchedSummaries }) => {
          setPosts(fetchedPosts);
          setSummaries(fetchedSummaries);
          setContentLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch profile content:", error);
          setContentLoading(false);
        });
    } else if (!profileId || basicInfoError) {
      setContentLoading(false);
      if (!profileId) console.error("Profile ID is missing for content fetch.");
      if (basicInfoError)
        console.error(
          "Cannot fetch content due to basic info error:",
          basicInfoError
        );
    }
  }, [profileId, basicInfoLoading, basicInfoError]);

  if (basicInfoLoading || contentLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[500px]">
        <ClipLoader
          color="#2A88F5"
          loading={true}
          size={30}
          aria-label="Loading Profile Content"
        />
      </div>
    );
  }

  if (basicInfoError || !pageProfileData) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {basicInfoError || "Could not load profile information for this page."}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-2 md:px-0 md:mb-16 mb-8">
      <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4 flex-shrink-0 order-2 lg:order-1">
        {summaries?.about && (
          <AboutSummaryWidget
            data={summaries.about}
            pageId={pageProfileData.id}
          />
        )}
        {summaries?.photos && summaries.photos.length > 0 && (
          <MediaSummaryWidget
            photos={summaries.photos}
            pageId={pageProfileData.id}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 order-1 lg:order-2 ">
        <div className={`mt-0 space-y-4`}>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

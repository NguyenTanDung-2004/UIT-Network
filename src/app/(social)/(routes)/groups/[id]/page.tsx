"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import CreatePost from "@/components/post/CreatePost";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import AboutSummaryWidget from "@/components/groups/AboutSummaryWidget"; // Updated import
import MediaSummaryWidget from "@/components/groups/MediaSummaryWidget"; // Updated import
import { AuthorInfo, UploadedFile, PostDataType } from "@/components/post/Post";
import ClipLoader from "react-spinners/ClipLoader";
import { GroupHeaderData } from "@/types/groups/GroupData";
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

interface GroupAboutSummary {
  bio: string;
  isPrivate: boolean;
  isVisible: boolean;
}
interface PhotoSummary {
  url: string;
}

interface GroupSummaryData {
  about: GroupAboutSummary | null;
  mediaList: PhotoSummary[] | null;
}

const MOCK_CURRENT_USER: AuthorInfo = {
  id: "user-123",
  name: "Current User Name",
  avatar: DEFAULT_AVATAR,
};

async function fetchGroupBasicData(
  id: string
): Promise<GroupHeaderData | null> {
  try {
    // console.log(`Fetching basic group data for ID: ${id}`);
    // await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      id: id,
      name: `Group luyện thi cuối kỳ môn giải tích ${id}`,
      avatar: DEFAULT_AVATAR, //
      coverPhoto: DEFAULT_COVER,
      memberCount: 19000,
      isJoined: true,
      isPrivate: true,
    };
  } catch (error) {
    console.error("Error fetching basic group data:", error);
    return null;
  }
}

async function fetchGroupContent(
  id: string,
  groupName: string,
  isJoined: boolean
): Promise<{ posts: PostDataType[]; summaries: GroupSummaryData }> {
  await new Promise((res) => setTimeout(res, 500));

  const samplePosts: PostDataType[] = [
    {
      id: `group-${id}-post1`,
      author: { id: "user-abc", name: "Member One", avatar: DEFAULT_AVATAR }, // A member posts
      origin: {
        type: "group",
        groupInfo: { id: id, name: groupName, isJoined: isJoined },
      },
      content: `Bài viết trong group ${groupName}. Thảo luận về đề thi năm trước!`,
      fullContent: `Bài viết trong group ${groupName}. Thảo luận về đề thi năm trước! Có ai có đáp án chi tiết không ạ?`,
      date: "Sat, March 15, 2025",
      time: "10:30 AM",
      mediaList: [
        {
          url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
          type: "image",
        },
      ],
      likes: Math.floor(Math.random() * 50 + 5),
      comments: Math.floor(Math.random() * 15),
      shares: Math.floor(Math.random() * 3),
    },
    {
      id: `group-${id}-post2`,
      author: { id: "user-def", name: "Member Two", avatar: DEFAULT_AVATAR },
      origin: {
        type: "group",
        groupInfo: { id: id, name: groupName, isJoined: isJoined },
      },
      content: "Chia sẻ tài liệu ôn tập Calculus mới sưu tầm được.",
      date: "Fri, March 14, 2025",
      time: "02:00 PM",
      mediaList: [
        {
          url: "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/cld-sample-video.mp4",
          type: "video",
        },
        {
          url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738661302/samples/cup-on-a-table.jpg",
          type: "image",
        },
      ],
      likes: 88,
      comments: 19,
      shares: 4,
    },
    {
      id: `group-${id}-post3`,
      author: { id: "user-ghi", name: "Member Three", avatar: DEFAULT_AVATAR },
      origin: {
        type: "group",
        groupInfo: { id: id, name: groupName, isJoined: isJoined },
      },
      content: "Hỏi về lịch thi và địa điểm thi?",
      date: "Thu, March 13, 2025",
      time: "09:00 AM",
      likes: 30,
      comments: 5,
      shares: 1,
    },
  ];

  const sampleSummaries: GroupSummaryData = {
    about: {
      bio: `Đây là nơi trao đổi, chia sẻ tài liệu và kinh nghiệm ôn thi môn Giải tích cuối kỳ. Cùng nhau cố gắng nhé! Group ${id}.`,
      isPrivate: true,
      isVisible: true,
    },
    mediaList: [
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

// Renamed component
const GroupPage: React.FC = () => {
  const params = useParams();
  const groupId = params?.id as string; // Renamed variable

  // Renamed state and type
  const [pageGroupData, setPageGroupData] = useState<GroupHeaderData | null>(
    null
  );
  const [basicInfoLoading, setBasicInfoLoading] = useState(true);
  const [basicInfoError, setBasicInfoError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostDataType[]>([]);
  // Updated state type
  const [summaries, setSummaries] = useState<GroupSummaryData | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (groupId) {
      setBasicInfoLoading(true);
      setBasicInfoError(null);
      fetchGroupBasicData(groupId) // Use updated fetch function
        .then((data) => {
          if (isMounted) {
            if (data) {
              setPageGroupData(data); // Use updated state setter
            } else {
              setBasicInfoError(
                `Basic group info for ID "${groupId}" not found.`
              ); // Updated error message
            }
            setBasicInfoLoading(false);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch basic group data:", error); // Updated log
          if (isMounted) {
            setBasicInfoError("Failed to load basic group info."); // Updated error
            setBasicInfoLoading(false);
          }
        });
    } else {
      setBasicInfoError("Invalid group ID for page."); // Updated error
      setBasicInfoLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [groupId]); // Dependency on groupId

  useEffect(() => {
    // Fetch content only if basic group data loaded successfully
    if (groupId && pageGroupData && !basicInfoLoading && !basicInfoError) {
      setContentLoading(true);
      fetchGroupContent(groupId, pageGroupData.name, pageGroupData.isJoined) // Use updated fetch function
        .then(({ posts: fetchedPosts, summaries: fetchedSummaries }) => {
          setPosts(fetchedPosts);
          setSummaries(fetchedSummaries);
          setContentLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch group content:", error); // Updated log
          setContentLoading(false);
        });
    } else if (!groupId || basicInfoError) {
      // Ensure content loading stops if basic info fails or ID is missing
      setContentLoading(false);
      if (!groupId) console.error("Group ID is missing for content fetch.");
      if (basicInfoError)
        console.error(
          "Cannot fetch content due to basic info error:",
          basicInfoError
        );
    }
  }, [groupId, pageGroupData, basicInfoLoading, basicInfoError]); // Depend on pageGroupData

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreatePost = (
    content: string,
    mediaList?: { url: string; type: string }[],
    file?: UploadedFile
  ) => {
    if (!pageGroupData) return;

    const newPost: PostDataType = {
      id: `new-group-post-${Date.now()}`,
      author: MOCK_CURRENT_USER,
      origin: {
        type: "group",
        groupInfo: {
          id: pageGroupData.id,
          name: pageGroupData.name,
          isJoined: pageGroupData.isJoined,
        },
      },
      content: content.length > 200 ? content.substring(0, 200) : content,
      fullContent: content.length > 200 ? content : undefined,
      date: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      mediaList: mediaList,
      likes: 0,
      comments: 0,
      shares: 0,
      file: file,
    };
    setPosts([newPost, ...posts]);
    closeModal();
  };

  if (basicInfoLoading || contentLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[500px]">
        <ClipLoader
          color="#2A88F5"
          loading={true}
          size={30}
          aria-label="Loading Group Content"
        />
      </div>
    );
  }

  if (basicInfoError || !pageGroupData) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {basicInfoError || "Could not load group information for this page."}
      </div>
    );
  }

  const canPost = pageGroupData.isJoined;

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-2 md:px-0 md:mb-16 mb-8">
      <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4 flex-shrink-0 order-2 lg:order-1">
        {summaries?.about && (
          <AboutSummaryWidget
            data={summaries.about}
            groupId={pageGroupData.id}
          />
        )}
        {summaries?.mediaList && summaries.mediaList.length > 0 && (
          <MediaSummaryWidget
            photos={summaries.mediaList}
            groupId={pageGroupData.id}
          />
        )}
      </div>

      {/* (Posts) */}
      <div className="flex-1 min-w-0 order-1 lg:order-2 ">
        {canPost && (
          <CreatePost user={MOCK_CURRENT_USER} onPostCreate={openModal} />
        )}
        <div className={`mt-${canPost ? "4" : "0"} space-y-4`}>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <i className="fas fa-stream text-4xl mb-3"></i>
              <p>No posts in this group yet.</p>
              {canPost && (
                <p className="text-sm mt-1">Be the first to share something!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && canPost && (
        <CreatePostModal onClose={closeModal} onPost={handleCreatePost} />
      )}
    </div>
  );
};

export default GroupPage;

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import CreatePost from "@/components/post/CreatePost";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import AboutSummaryWidget from "@/components/profile/AboutSummaryWidget";
import MediaSummaryWidget from "@/components/profile/MediaSummaryWidget";
import FriendsSummaryWidget from "@/components/profile/FriendsSummaryWidget";
import { AuthorInfo, UploadedFile, PostDataType } from "@/components/post/Post";
import ClipLoader from "react-spinners/ClipLoader";
import { ProfileHeaderData } from "@/types/profile/ProfileData";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

interface AboutSummary {
  bio: string;
  details: { icon: string; text: string }[];
}

interface PhotoSummary {
  url: string;
}

interface FriendSummary {
  id: string;
  name: string;
  avatar: string;
}

interface ProfileSummaryData {
  about: AboutSummary | null;
  photos: PhotoSummary[] | null;
  friends: FriendSummary[] | null;
}

async function fetchProfileBasicData(
  id: string
): Promise<ProfileHeaderData | null> {
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

async function fetchProfileContent(
  id: string
): Promise<{ posts: PostDataType[]; summaries: ProfileSummaryData }> {
  await new Promise((res) => setTimeout(res, 500));

  const isMe = id === "me";
  const tempName = isMe ? "Phan Nguyễn Trà Giang" : "Nguyễn Tấn Dũng";
  const tempAvatar = DEFAULT_AVATAR;

  const samplePosts: PostDataType[] = [
    {
      id: `profile-${id}-post1`,
      author: { id: id, name: tempName, avatar: tempAvatar },
      content: `Đây là bài viết cá nhân của ${tempName}. Chia sẻ một chút về ngày hôm nay!`,
      fullContent: `Đây là bài viết cá nhân của ${tempName}. Chia sẻ một chút về ngày hôm nay! Hôm nay thời tiết thật đẹp và tôi đã có một buổi làm việc hiệu quả.`,
      date: "Sat, March 15, 2025",
      time: "09:15 AM",
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
      likes: Math.floor(Math.random() * 100 + 10),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 5),
    },
    {
      id: "profile-post-page1",
      author: {
        id: "pageJavaDev",
        name: "CLB Java Developer",
        avatar: DEFAULT_AVATAR,
      },
      origin: { type: "page", pageInfo: { isFollowing: Math.random() > 0.5 } },
      content: "Thông báo: Workshop Java nâng cao sắp diễn ra!",
      date: "Fri, March 14, 2025",
      time: "04:00 PM",
      likes: 150,
      comments: 22,
      shares: 5,
    },
    {
      id: `profile-${id}-post-group1`,
      author: { id: id, name: tempName, avatar: tempAvatar },
      origin: {
        type: "group",
        groupInfo: { id: "groupUITK22", name: "UIT K22", isJoined: true },
      },
      content: "Có ai có tài liệu môn Cấu trúc dữ liệu không ạ?",
      date: "Fri, March 14, 2025",
      time: "11:30 AM",
      likes: 45,
      comments: 8,
      shares: 2,
    },
    {
      id: `profile-${id}-post2`,
      author: { id: id, name: tempName, avatar: tempAvatar },
      content: "Cuối tuần thư giãn với một cuốn sách hay.",
      date: "Thu, March 13, 2025",
      time: "08:00 PM",
      likes: 55,
      comments: 12,
      shares: 3,
    },
  ];

  const sampleSummaries: ProfileSummaryData = {
    about: {
      bio: "Thích lập trình, đọc sách và khám phá công nghệ mới. Đang tìm kiếm cơ hội thực tập hè.",
      details: [
        { icon: "fas fa-graduation-cap", text: "Sinh viên năm 3 - UIT" },
        { icon: "fas fa-map-marker-alt", text: "Sống tại TP. Hồ Chí Minh" },
        { icon: "fas fa-link", text: "github.com/yourusername" },
      ],
    },
    photos: Array.from({ length: 9 }).map((_, i) => ({
      url: `https://picsum.photos/seed/${id}-${i}/200/200`,
    })),
    friends: Array.from({ length: 6 }).map((_, i) => ({
      id: `friend-${id}-${i}`,
      name: `Bạn bè ${i + 1}`,
      avatar: `https://i.pravatar.cc/150?u=${id}-${i}`,
    })),
  };

  return { posts: samplePosts, summaries: sampleSummaries };
}

const ProfilePage: React.FC = () => {
  const params = useParams();
  const profileId = params?.id as string;

  const [pageProfileData, setPageProfileData] =
    useState<ProfileHeaderData | null>(null);
  const [basicInfoLoading, setBasicInfoLoading] = useState(true);
  const [basicInfoError, setBasicInfoError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [summaries, setSummaries] = useState<ProfileSummaryData | null>(null);
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreatePost = (
    content: string,
    mediaList?: { url: string; type: string }[],
    file?: UploadedFile
  ) => {
    if (!pageProfileData) return;

    const newPost: PostDataType = {
      id: `new-post-${Date.now()}`,
      author: {
        id: pageProfileData.id,
        name: pageProfileData.name,
        avatar: pageProfileData.avatar,
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

  const isOwnProfile = pageProfileData.friendshipStatus === "self";

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-2 md:px-0 md:mb-16 mb-8">
      <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4 flex-shrink-0 order-2 lg:order-1">
        {summaries?.about && (
          <AboutSummaryWidget
            data={summaries.about}
            profileId={pageProfileData.id}
          />
        )}
        {summaries?.photos && summaries.photos.length > 0 && (
          <MediaSummaryWidget
            photos={summaries.photos}
            profileId={pageProfileData.id}
          />
        )}
        {summaries?.friends && summaries.friends.length > 0 && (
          <FriendsSummaryWidget
            friends={summaries.friends}
            count={pageProfileData.friendCount}
            profileId={pageProfileData.id}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 order-1 lg:order-2 ">
        {isOwnProfile && (
          <CreatePost
            user={{
              id: pageProfileData.id,
              name: pageProfileData.name,
              avatar: pageProfileData.avatar,
            }}
            onPostCreate={openModal}
          />
        )}
        <div className={`mt-${isOwnProfile ? "4" : "0"} space-y-4`}>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <i className="fas fa-stream text-4xl mb-3"></i>
              <p>No posts to display.</p>
              {isOwnProfile && (
                <p className="text-sm mt-1">
                  Share your thoughts to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && isOwnProfile && (
        <CreatePostModal onClose={closeModal} onPost={handleCreatePost} />
      )}
    </div>
  );
};

export default ProfilePage;

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import CreatePost from "@/components/post/CreatePost";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import AboutSummaryWidget from "@/components/profile/AboutSummaryWidget";
import MediaSummaryWidget from "@/components/profile/MediaSummaryWidget";
import FriendsSummaryWidget from "@/components/profile/FriendsSummaryWidget";
import { PostDataType, UploadedFile } from "@/components/post/Post";
import ClipLoader from "react-spinners/ClipLoader";
import { ProfileHeaderData } from "@/types/profile/ProfileData";
import { useUser } from "@/contexts/UserContext";
import { getListUserInfoByIds } from "@/services/userService";
import { ProfileAboutData } from "@/types/profile/AboutData";
import {
  getListFriendIds,
  getUserInfoCardsByIds,
} from "@/services/friendService";
import { Friend } from "@/types/profile/FriendData";

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

interface ProfileSummaryData {
  about: AboutSummary | null;
  photos: PhotoSummary[] | null;
  friends: Friend[] | null;
}

const mapProfileAboutToProfileHeader = (
  profileAbout: ProfileAboutData,
  friendshipStatus: "self" | "friend" | "not_friend"
): ProfileHeaderData => {
  return {
    id: profileAbout.id,
    name: profileAbout.name,
    avatar: profileAbout.avtURL || DEFAULT_AVATAR,
    coverPhoto: profileAbout.background || DEFAULT_COVER,
    followerCount: 0,
    friendCount: 0,
    friendshipStatus: friendshipStatus,
  };
};

const ProfilePage: React.FC = () => {
  const params = useParams();
  const profileId = params?.id as string;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [pageProfileData, setPageProfileData] =
    useState<ProfileHeaderData | null>(null);
  const [profileAboutData, setProfileAboutData] =
    useState<ProfileAboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [summaries, setSummaries] = useState<ProfileSummaryData | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        if (!profileId) {
          throw new Error("Invalid profile ID for page.");
        }

        const isCurrentUserProfile =
          user && (profileId === "me" || profileId === user.id);

        let fetchedAboutData: ProfileAboutData | null = null;
        let friendshipStatus: "self" | "friend" | "not_friend" = "not_friend";

        if (isCurrentUserProfile && user) {
          fetchedAboutData = user;
          friendshipStatus = "self";
        } else {
          const fetchedUsers = await getListUserInfoByIds([profileId]);
          if (fetchedUsers && fetchedUsers.length > 0) {
            fetchedAboutData = fetchedUsers[0];
            if (profileId === "nguyen_tan_dung_id") {
              friendshipStatus = "friend";
            } else {
              friendshipStatus = "not_friend";
            }
          } else {
            throw new Error(`Profile with ID "${profileId}" not found.`);
          }
        }

        if (isMounted && fetchedAboutData) {
          setProfileAboutData(fetchedAboutData);

          let friendList: Friend[] = [];
          let friendCount = 0;
          try {
            const friendIds = await getListFriendIds(fetchedAboutData.id);
            friendList = await getUserInfoCardsByIds(friendIds);
            friendCount = friendList.length;
          } catch (friendError) {
            console.error("Error fetching friends data:", friendError);
          }

          const headerData = mapProfileAboutToProfileHeader(
            fetchedAboutData,
            friendshipStatus
          );
          headerData.friendCount = friendCount;
          setPageProfileData(headerData);

          const bio = fetchedAboutData.overview.bio;
          const details: { icon: string; text: string }[] = [];

          if (
            fetchedAboutData.workAndEducation.colleges &&
            fetchedAboutData.workAndEducation.colleges.length > 0
          ) {
            const college = fetchedAboutData.workAndEducation.colleges[0];
            if (college.name && college.degree) {
              details.push({
                icon: "fas fa-graduation-cap",
                text: `Faculty: ${college.name}`,
              });
            } else if (college.name) {
              details.push({
                icon: "fas fa-graduation-cap",
                text: `Studied at ${college.name}`,
              });
            }
          } else if (fetchedAboutData.overview.occupation) {
            details.push({
              icon: "fas fa-briefcase",
              text: fetchedAboutData.overview.occupation,
            });
          }

          if (fetchedAboutData.basicInfo.born) {
            details.push({
              icon: "fas fa-birthday-cake",
              text: `Born on ${fetchedAboutData.basicInfo.born}`,
            });
          }

          if (fetchedAboutData.contact.email) {
            details.push({
              icon: "fas fa-envelope",
              text: fetchedAboutData.contact.email,
            });
          }

          if (fetchedAboutData.contact.phone) {
            details.push({
              icon: "fas fa-phone",
              text: fetchedAboutData.contact.phone,
            });
          }

          if (fetchedAboutData.hobbies && fetchedAboutData.hobbies.length > 0) {
            const hobbyNames = fetchedAboutData.hobbies
              .slice(0, 3)
              .map((h) => h.name)
              .join(", ");
            if (hobbyNames) {
              details.push({
                icon: "fas fa-heart",
                text: `Hobbies: ${hobbyNames}`,
              });
            }
          }

          const generatedAboutSummary: AboutSummary = {
            bio: bio,
            details: details,
          };

          const samplePosts: PostDataType[] = [
            {
              id: `profile-${fetchedAboutData.id}-post1`,
              author: {
                id: fetchedAboutData.id,
                name: fetchedAboutData.name,
                avatar: fetchedAboutData.avtURL || DEFAULT_AVATAR,
              },
              content: `Đây là bài viết cá nhân của ${fetchedAboutData.name}. Chia sẻ một chút về ngày hôm nay!`,
              fullContent: `Đây là bài viết cá nhân của ${fetchedAboutData.name}. Chia sẻ một chút về ngày hôm nay! Hôm nay thời tiết thật đẹp và tôi đã có một buổi làm việc hiệu quả.`,
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
              origin: {
                type: "page",
                pageInfo: { isFollowing: Math.random() > 0.5 },
              },
              content: "Thông báo: Workshop Java nâng cao sắp diễn ra!",
              date: "Fri, March 14, 2025",
              time: "04:00 PM",
              likes: 150,
              comments: 22,
              shares: 5,
            },
            {
              id: `profile-${fetchedAboutData.id}-post-group1`,
              author: {
                id: fetchedAboutData.id,
                name: fetchedAboutData.name,
                avatar: fetchedAboutData.avtURL || DEFAULT_AVATAR,
              },
              origin: {
                type: "group",
                groupInfo: {
                  id: "groupUITK22",
                  name: "UIT K22",
                  isJoined: true,
                },
              },
              content: "Có ai có tài liệu môn Cấu trúc dữ liệu không ạ?",
              date: "Fri, March 14, 2025",
              time: "11:30 AM",
              likes: 45,
              comments: 8,
              shares: 2,
            },
            {
              id: `profile-${fetchedAboutData.id}-post2`,
              author: {
                id: fetchedAboutData.id,
                name: fetchedAboutData.name,
                avatar: fetchedAboutData.avtURL || DEFAULT_AVATAR,
              },
              content: "Cuối tuần thư giãn với một cuốn sách hay.",
              date: "Thu, March 13, 2025",
              time: "08:00 PM",
              likes: 55,
              comments: 12,
              shares: 3,
            },
          ];

          const newSummaries: ProfileSummaryData = {
            about: generatedAboutSummary,
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
            friends: friendList,
          };

          setPosts(samplePosts);
          setSummaries(newSummaries);
        } else if (isMounted) {
          throw new Error(`Profile with ID "${profileId}" not found.`);
        }
      } catch (err: any) {
        console.error("Error fetching profile data for page:", err);
        if (isMounted) {
          setError(err.message || "Failed to load profile data.");
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
  }, [profileId, user, userContextLoading, userContextError]);

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

  if (error || !pageProfileData || !summaries) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || "Could not load profile information for this page."}
      </div>
    );
  }

  const isOwnProfile = pageProfileData.friendshipStatus === "self";

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-2 md:px-0 md:mb-16 mb-8">
      <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4 flex-shrink-0 order-2 lg:order-1">
        {summaries.about && (
          <AboutSummaryWidget
            data={summaries.about}
            profileId={pageProfileData.id}
          />
        )}
        {summaries.photos && summaries.photos.length > 0 && (
          <MediaSummaryWidget
            photos={summaries.photos}
            profileId={pageProfileData.id}
          />
        )}
        {summaries.friends && summaries.friends.length > 0 && (
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

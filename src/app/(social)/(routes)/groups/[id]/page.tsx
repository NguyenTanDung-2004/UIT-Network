"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/post/Post";
import CreatePost from "@/components/post/CreatePost";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import AboutSummaryWidget from "@/components/groups/AboutSummaryWidget";
import MediaSummaryWidget from "@/components/groups/MediaSummaryWidget";
import { UploadedFile, PostDataType } from "@/components/post/Post";
import ClipLoader from "react-spinners/ClipLoader";
import { GroupHeaderData } from "@/types/groups/GroupData";
import {
  getGroupInfo,
  getListMediaAndFilesByGroupId,
} from "@/services/groupService";
import { getPostsByGroupId, createPostInGroup } from "@/services/postService";
import { useUser } from "@/contexts/UserContext";
import { CreatePostMediaItem } from "@/services/postService";

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

const GroupPage: React.FC = () => {
  const params = useParams();
  const groupId = params?.id as string;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [groupData, setGroupData] = useState<GroupHeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [photos, setPhotos] = useState<PhotoSummary[]>([]);

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
        if (!groupId) {
          throw new Error("Invalid group ID.");
        }

        const { data: fetchedGroupInfo } = await getGroupInfo(groupId);
        if (isMounted) {
          if (fetchedGroupInfo) {
            setGroupData(fetchedGroupInfo);
          } else {
            throw new Error(`Group with ID "${groupId}" not found.`);
          }
        }

        const fetchedPosts = await getPostsByGroupId(groupId);
        if (isMounted) {
          setPosts(fetchedPosts);
        }

        const { media: fetchedMedia, files: fetchedFiles } =
          await getListMediaAndFilesByGroupId(groupId);
        if (isMounted) {
          setPhotos(fetchedMedia.map((item) => ({ url: item.url })));
        }
      } catch (err: any) {
        console.error("Error fetching group data:", err);
        if (isMounted) {
          setError(err.message || "Could not load group information.");
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
  }, [groupId, userContextLoading, userContextError]);

  const groupAboutSummary: GroupAboutSummary | null = groupData
    ? {
        bio: groupData.bio || "No description available.",
        isPrivate: groupData.isPrivate,
        isVisible: true,
      }
    : null;

  const summaries: GroupSummaryData = {
    about: groupAboutSummary,
    mediaList: photos,
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreatePost = async (
    content: string,
    mediaList?: { url: string; type: string }[],
    file?: UploadedFile
  ) => {
    if (!user || !groupData) return;

    try {
      // Map mediaList (images/videos) to CreatePostMediaItem
      const formattedMedia: CreatePostMediaItem[] = (mediaList || [])
        .filter((item) => item.type === "image" || item.type === "video") // Chỉ lấy image/video từ mediaList
        .map((item) => ({
          typeId: item.type === "image" ? 2 : 3, // 2 cho image, 3 cho video
          url: item.url,
        }));

      // Add file to formattedMedia if it exists
      if (file) {
        formattedMedia.push({
          typeId: 1, // 1 for file
          url: file.url,
          name: file.name,
          sizeValue: file.size,
          unit: "Bytes",
        });
      }

      const newPostData = await createPostInGroup(
        groupId,
        content,
        formattedMedia,
        7
      );

      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      closeModal();
    } catch (err) {
      console.error("Failed to create post in group:", err);
    }
  };

  if (loading || userContextLoading) {
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

  if (error || !groupData) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error || "Could not load group information for this page."}
      </div>
    );
  }

  const canPost = groupData.isJoined;

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-2 md:px-0 md:mb-16 mb-8">
      <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4 flex-shrink-0 order-2 lg:order-1">
        {summaries?.about && (
          <AboutSummaryWidget data={summaries.about} groupId={groupData.id} />
        )}
        {summaries?.mediaList && summaries.mediaList.length > 0 && (
          <MediaSummaryWidget
            photos={summaries.mediaList}
            groupId={groupData.id}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 order-1 lg:order-2 ">
        {canPost && user && (
          <CreatePost
            user={{ id: user.id, name: user.name, avatar: user.avtURL || "" }}
            onPostCreate={openModal}
          />
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

      {isModalOpen && canPost && (
        <CreatePostModal onClose={closeModal} onPost={handleCreatePost} />
      )}
    </div>
  );
};

export default GroupPage;

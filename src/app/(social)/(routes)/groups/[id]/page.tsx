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
import { getPostsByGroupId } from "@/services/postService";
import { useUser } from "@/contexts/UserContext";

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

        const fetchedPosts = await getPostsByGroupId(groupId); // Lấy posts theo GroupId
        if (isMounted) {
          setPosts(fetchedPosts);
        }

        const { media: fetchedMedia, files: fetchedFiles } =
          await getListMediaAndFilesByGroupId(groupId);
        if (isMounted) {
          setPhotos(fetchedMedia.map((item) => ({ url: item.url })));
          // Bạn có thể xử lý `fetchedFiles` ở đây nếu cần hiển thị chúng trong `MediaSummaryWidget`
          // hoặc một widget riêng biệt. Hiện tại `MediaSummaryWidget` chỉ nhận `photos`.
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
        isVisible: true, // Giả định
      }
    : null;

  const summaries: GroupSummaryData = {
    about: groupAboutSummary,
    mediaList: photos,
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreatePost = (
    content: string,
    mediaList?: { url: string; type: string }[],
    file?: UploadedFile
  ) => {
    // Logic tạo post mới trong group
    console.log("Create post in group:", groupId, content, mediaList, file);
    // TODO: Gọi API tạo post mới với parentId là groupId và postType phù hợp
    // Ví dụ: await createPost(content, media, postTypeId, groupId);
    // Sau đó cập nhật lại posts list hoặc thêm post mới vào state
    if (!user || !groupData) return; // User và groupData phải có

    const newPost: PostDataType = {
      id: `new-group-post-${Date.now()}`,
      author: {
        id: user.id, // Người tạo post
        name: user.name,
        avatar: user.avtURL || "",
      },
      origin: {
        type: "group",
        groupInfo: {
          id: groupData.id,
          name: groupData.name,
          isJoined: groupData.isJoined,
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

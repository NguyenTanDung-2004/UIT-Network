"use client";
import React, { useState, useEffect } from "react";
import CreatePost from "@/components/post/CreatePost";
import Post from "@/components/post/Post";
import { PostDataType } from "@/components/post/Post";
import {
  PeopleToConnectWidget,
  GroupsToJoinWidget,
  ConnectionStatus,
} from "@/components/home/Connect";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import { UploadedFile } from "@/components/post/create/CreatePostModal";
import {
  getHomePosts,
  createPost as apiCreatePost,
} from "@/services/postService";
import { useUser } from "@/contexts/UserContext";
import ClipLoader from "react-spinners/ClipLoader";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const HomePage = () => {
  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  const [posts, setPosts] = useState<PostDataType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [peopleToConnect, setPeopleToConnect] = useState([
    {
      id: "user1",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.PENDING,
    },
    {
      id: "user2",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.NONE,
    },
    {
      id: "user3",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.CONNECTED,
    },
    {
      id: "user4",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.NONE,
    },
  ]);

  const [groupsToJoin, setGroupsToJoin] = useState([
    {
      id: "group1",
      name: "UIT K22",
      joined: false,
    },
    {
      id: "group2",
      name: "UIT KHDL",
      joined: false,
    },
    {
      id: "group3",
      name: "Rubik Club",
      joined: true,
    },
    {
      id: "group4",
      name: "UIT CNPM",
      years: "2022 - 2025",
      joined: false,
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    setLoadingPosts(true);
    setErrorPosts(null);

    const fetchPosts = async () => {
      try {
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        const fetchedPosts = await getHomePosts();
        if (isMounted) {
          setPosts(fetchedPosts);
        }
      } catch (err: any) {
        console.error("Error fetching home posts:", err);
        if (isMounted) {
          setErrorPosts(err.message || "Failed to load posts.");
        }
      } finally {
        if (isMounted) {
          setLoadingPosts(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [userContextLoading, userContextError]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePost = async (
    content: string,
    mediaList: { url: string; type: string }[],
    file?: UploadedFile
  ) => {
    if (!user) {
      console.warn("User not logged in. Cannot create post.");
      return;
    }

    try {
      type MediaItem = {
        typeId: 1 | 2 | 3;
        url: string;
        name?: string;
        sizeValue?: number;
        unit?: string;
      };

      const formattedMedia: MediaItem[] = mediaList.map((item) => ({
        typeId: item.type === "image" ? 2 : item.type === "video" ? 3 : 1, // Default to 1 if not image/video
        url: item.url,
      }));

      if (file) {
        formattedMedia.push({
          typeId: 1, // File type
          url: file.url,
          name: file.name,
          sizeValue: file.size,
          unit: "Bytes", // Assuming bytes, adjust if API needs specific units
        });
      }

      // postTypeId mặc định là 2 (normal_student_post public)
      const newPostData = await apiCreatePost(content, formattedMedia, 2);

      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      closeModal();
    } catch (err) {
      console.error("Failed to create post:", err);
      // Có thể hiển thị thông báo lỗi cho người dùng
    }
  };

  const handleConnect = (userId: string) => {
    setPeopleToConnect(
      peopleToConnect.map((person) =>
        person.id === userId
          ? { ...person, status: ConnectionStatus.PENDING }
          : person
      )
    );
  };

  const handleJoinGroup = (groupId: string) => {
    setGroupsToJoin(
      groupsToJoin.map((group) =>
        group.id === groupId ? { ...group, joined: true } : group
      )
    );
  };

  if (userContextLoading || loadingPosts) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  if (userContextError || errorPosts || !user) {
    return (
      <div className="text-center p-4 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto mt-8">
        {userContextError ||
          errorPosts ||
          "Failed to load user or posts data. Please try logging in again."}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 ">
        <CreatePost
          user={{
            id: user.id,
            name: user.name,
            avatar: user.avtURL || DEFAULT_AVATAR,
          }}
          onPostCreate={openModal}
        />

        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-4">
            <i className="fas fa-stream text-4xl mb-3"></i>
            <p>No posts to display in your feed.</p>
            <p className="text-sm mt-1">
              Start by creating a new post or connecting with others!
            </p>
          </div>
        )}
      </div>

      <div className="hidden lg:block lg:w-72 ml-4 ">
        <PeopleToConnectWidget
          title="Who to connect"
          people={peopleToConnect}
          onConnect={handleConnect}
        />

        <GroupsToJoinWidget
          title="Group to join"
          groups={groupsToJoin}
          onJoin={handleJoinGroup}
        />
      </div>

      {isModalOpen && (
        <CreatePostModal
          onClose={closeModal}
          onPost={(content, mediaList, fileUrl) => {
            handleCreatePost(content, mediaList || [], fileUrl);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;

"use client";

import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import {
  getMockPagePosts,
  mockRemovePagePost,
  mockCreatePagePost,
  PagePost,
  Page,
  User,
} from "@/lib/mockData";
import PagePostItem from "@/components/createPage/manage/PagePostItem";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import { AuthorInfo, UploadedFile } from "@/components/post/Post";

// Fix: Add index signature to satisfy Params constraint
interface PageIdParams {
  id?: string | string[];
  [key: string]: string | string[] | undefined; // Index signature
}

const ManagePagePostsPage: React.FC = () => {
  const params = useParams<PageIdParams>();
  const pageId = typeof params?.id === "string" ? params.id : undefined;

  const [posts, setPosts] = useState<PagePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = () => {
    if (!pageId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const pagePosts = getMockPagePosts(pageId);
      setPosts(pagePosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchData();
  }, [pageId]);

  const handleRemove = async (postId: string) => {
    if (processing || !pageId) return;
    setProcessing(true);

    if (window.confirm("Are you sure you want to remove this post?")) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = mockRemovePagePost(pageId, postId);
      if (success) {
        fetchData();
        alert(`Removed post ${postId}`);
      } else {
        alert(`Failed to remove post ${postId}`);
      }
    }
    setProcessing(false);
  };

  const handleCreatePost = async (
    caption: string,
    mediaListFromModal?: { url: string; type: string }[],
    fileFromModal?: UploadedFile
  ) => {
    if (!pageId) {
      alert("Cannot create post: Invalid page ID.");
      setIsCreateModalOpen(false);
      return;
    }

    const mediaForMock: PagePost["media"] = [];

    if (mediaListFromModal) {
      mediaListFromModal.forEach((item) => {
        let typeId: number;
        if (item.type.startsWith("image")) {
          typeId = 2;
        } else if (item.type.startsWith("video")) {
          typeId = 3;
        } else {
          typeId = 2;
        }
        mediaForMock.push({
          typeId: typeId,
          url: item.url,
        });
      });
    }

    if (fileFromModal) {
      mediaForMock.push({
        typeId: 1,
        url: fileFromModal.url,
        name: fileFromModal.name,
        sizeValue: fileFromModal.size,
      });
    }

    const postDataForMock = {
      caption: caption,
      media: mediaForMock.length > 0 ? mediaForMock : undefined,
    };

    const newMockPost = mockCreatePagePost(pageId, postDataForMock);

    if (newMockPost) {
      setPosts([newMockPost, ...posts]);
      alert("Mock: Post created successfully!");
      console.log("New mock page post created:", newMockPost);
    } else {
      alert("Mock: Failed to create post.");
    }

    setIsCreateModalOpen(false);
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

  if (!pageId) {
    return (
      <div className="text-center mt-8 text-red-600 dark:text-red-400 font-semibold p-4 bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        Invalid page ID provided.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-screen  dark:border-gray-700">
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-primary text-white hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80"
            >
              Create New Post
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <i className="fas fa-newspaper text-4xl mb-3"></i>
              <p>No posts created for this page yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PagePostItem
                  key={post.postId}
                  post={post}
                  pageId={pageId}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}

          {isCreateModalOpen && (
            <CreatePostModal
              onClose={() => setIsCreateModalOpen(false)}
              onPost={handleCreatePost}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePagePostsPage;

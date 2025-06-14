"use client";

import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import PostReviewItem from "@/components/createGroup/manage/PostReviewItem";
import {
  getPostsByGroupId,
  getPendingPostsByGroupId,
  approveGroupPost,
  deletePost,
} from "@/services/postService";
import { Post } from "@/lib/mockData";

import { PostDataType } from "@/components/post/Post";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const mapPostDataTypeToPost = (
  postDataType: PostDataType,
  status: "APPROVED" | "PENDING" | "REJECTED"
): Post => {
  return {
    postId: postDataType.id,
    userId: postDataType.author.id,
    authorName: postDataType.author.name,
    authorAvatar: postDataType.author.avatar || DEFAULT_AVATAR,
    createdDate: `${postDataType.date} ${postDataType.time}`,
    caption: postDataType.fullContent || postDataType.content,
    media: (postDataType.mediaList || [])
      .filter((media) => media.url)
      .map((media) => ({
        typeId: media.type === "image" ? 2 : 3,
        url: media.url!,
      })),
    postType: {
      id: 0,
      typeName: "",
      value: "",
    },
    status: status,
  };
};

const ManageGroupPostsPage: React.FC = () => {
  const params = useParams();
  const groupId = params.id as string;
  const { toast } = useToast();

  const [approvedPosts, setApprovedPosts] = useState<Post[]>([]); // Use Post type
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]); // Use Post type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedApprovedPosts, fetchedPendingPosts] = await Promise.all([
        getPostsByGroupId(groupId),
        getPendingPostsByGroupId(groupId),
      ]);
      setApprovedPosts(
        fetchedApprovedPosts.map((post) =>
          mapPostDataTypeToPost(post, "APPROVED")
        )
      );
      setPendingPosts(
        fetchedPendingPosts.map((post) =>
          mapPostDataTypeToPost(post, "PENDING")
        )
      );
    } catch (err: any) {
      console.error("Failed to fetch group posts:", err);
      setError(err.message || "Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const handleApprove = async (postId: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      await approveGroupPost(postId);
      toast({
        title: "Post Approved",
        description: "The post has been successfully approved.",
        variant: "default",
      });
      fetchData();
    } catch (err: any) {
      console.error("Error approving post:", err);
      toast({
        title: "Failed to Approve Post",
        description:
          err.message || "An error occurred while approving the post.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (postId: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      await deletePost(postId);
      toast({
        title: "Post Rejected",
        description: "The post has been successfully rejected and deleted.",
        variant: "default",
      });
      fetchData();
    } catch (err: any) {
      console.error("Error rejecting post:", err);
      toast({
        title: "Failed to Reject Post",
        description:
          err.message || "An error occurred while rejecting the post.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600 min-h-[400px]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Pending Posts ({pendingPosts.length})
        </h3>
        {pendingPosts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No pending posts.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingPosts.map((post) => (
              <PostReviewItem
                key={post.postId}
                post={post}
                groupId={groupId}
                onApprove={handleApprove}
                onReject={handleReject}
                processing={processing}
              />
            ))}
          </div>
        )}
      </div>

      {approvedPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Approved Posts ({approvedPosts.length})
          </h3>
          <div className="space-y-4">
            {approvedPosts.map((post) => (
              <PostReviewItem
                key={post.postId}
                post={post}
                groupId={groupId}
                processing={processing}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGroupPostsPage;

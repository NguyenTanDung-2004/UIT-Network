"use client";

import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import {
  getMockGroupPosts,
  mockApprovePost,
  mockRejectPost,
  Post,
} from "@/lib/mockData"; // Adjust path
import PostReviewItem from "@/components/createGroup/manage/PostReviewItem";

const ManageGroupPostsPage: React.FC = () => {
  const params = useParams();
  const groupId = params.id as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // For button states

  const fetchData = () => {
    setLoading(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      const groupPosts = getMockGroupPosts(groupId);
      setPosts(groupPosts);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const handleApprove = async (postId: string) => {
    if (processing) return;
    setProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const success = mockApprovePost(groupId, postId);
    if (success) {
      // Refresh data or update state
      fetchData();
      alert(`Approved post ${postId}`);
    } else {
      alert(`Failed to approve post ${postId}`);
    }
    setProcessing(false);
  };

  const handleReject = async (postId: string) => {
    if (processing) return;
    setProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const success = mockRejectPost(groupId, postId);
    if (success) {
      // Refresh data or update state
      fetchData();
      alert(`Rejected post ${postId}`);
    } else {
      alert(`Failed to reject post ${postId}`);
    }
    setProcessing(false);
  };

  const pendingPosts = posts.filter((post) => post.status === "PENDING");
  const approvedPosts = posts.filter((post) => post.status === "APPROVED"); // Optional: display approved posts too

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader color="#FF69B4" loading={true} size={35} />
      </div>
    );
  }

  return (
    // The main container and title are handled by the layout
    <div className="space-y-8">
      {/* Pending Posts */}
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Approved Posts (Optional) */}
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
                // No action buttons for approved posts in this view
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGroupPostsPage;

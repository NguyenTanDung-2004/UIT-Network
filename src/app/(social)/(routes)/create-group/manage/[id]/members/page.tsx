"use client";

import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import {
  getMockGroupMembersAndRequests,
  mockAcceptRequest,
  mockRejectRequest,
  mockRemoveMember,
  User,
} from "@/lib/mockData"; // Adjust path
import MemberRequestItem from "@/components/createGroup/manage/MemberRequestItem";

const ManageGroupMembersPage: React.FC = () => {
  const params = useParams();
  const groupId = params.id as string;

  const [members, setMembers] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // For button states

  const fetchData = () => {
    setLoading(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      const data = getMockGroupMembersAndRequests(groupId);
      setMembers(data.members);
      setRequests(data.requests);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const handleAccept = async (userId: string) => {
    if (processing) return;
    setProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const success = mockAcceptRequest(groupId, userId);
    if (success) {
      // Refresh data or update state
      fetchData();
      alert(`Accepted user ${userId}`);
    } else {
      alert(`Failed to accept user ${userId}`);
    }
    setProcessing(false);
  };

  const handleReject = async (userId: string) => {
    if (processing) return;
    setProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const success = mockRejectRequest(groupId, userId);
    if (success) {
      // Refresh data or update state
      fetchData();
      alert(`Rejected user ${userId}`);
    } else {
      alert(`Failed to reject user ${userId}`);
    }
    setProcessing(false);
  };

  const handleRemove = async (userId: string) => {
    if (processing) return;
    setProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const success = mockRemoveMember(groupId, userId);
    if (success) {
      // Refresh data or update state
      fetchData();
      alert(`Removed user ${userId}`);
    } else {
      alert(`Failed to remove user ${userId}. (Cannot remove admin in mock)`);
    }
    setProcessing(false);
  };

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
      {/* Pending Requests */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Pending Join Requests ({requests.length})
        </h3>
        {requests.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-2">
            {requests.map((user) => (
              <MemberRequestItem
                key={user.id}
                user={user}
                groupId={groupId}
                type="request"
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Members */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Group Members ({members.length})
        </h3>
        {members.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No members yet.
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((user) => (
              <MemberRequestItem
                key={user.id}
                user={user}
                groupId={groupId}
                type="member"
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGroupMembersPage;

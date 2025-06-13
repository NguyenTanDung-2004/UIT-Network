"use client";

import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "next/navigation";
import MemberRequestItem from "@/components/createGroup/manage/MemberRequestItem";
import {
  getGroupMembers,
  getGroupJoinRequests,
  acceptGroupJoinRequest,
  deleteGroupJoinRequest,
} from "@/services/groupService";
import { GroupMember } from "@/types/groups/GroupData";
import { User } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const mapGroupMemberToUser = (groupMember: GroupMember): User => {
  let status: "member" | "pending" | "admin" = "member";
  if (groupMember.role === "admin") status = "admin";

  return {
    id: groupMember.id,
    name: groupMember.name,
    avatar: groupMember.avatar,
    status: status,
  };
};

const ManageGroupMembersPage: React.FC = () => {
  const params = useParams();
  const groupId = params.id as string;
  const { toast } = useToast(); // Khởi tạo toast

  const [members, setMembers] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedMembers, fetchedRequests] = await Promise.all([
        getGroupMembers(groupId),
        getGroupJoinRequests(groupId),
      ]);

      setMembers(fetchedMembers.map(mapGroupMemberToUser));
      setRequests(
        fetchedRequests
          .map(mapGroupMemberToUser)
          .map((req) => ({ ...req, status: "pending" }))
      );
    } catch (err: any) {
      console.error("Failed to fetch group members/requests:", err);
      setError(err.message || "Could not load members/requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const handleAccept = async (userId: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      await acceptGroupJoinRequest(groupId, userId);
      toast({
        title: "Request Accepted",
        description: `User ${userId} has been accepted into the group.`,
        variant: "default",
      });
      fetchData();
    } catch (err: any) {
      console.error("Error accepting request:", err);
      toast({
        title: "Failed to Accept Request",
        description:
          err.message || "An error occurred while accepting the request.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      await deleteGroupJoinRequest(groupId, userId);
      toast({
        title: "Request Rejected",
        description: `User ${userId}'s join request has been rejected.`,
        variant: "default",
      });
      fetchData();
    } catch (err: any) {
      console.error("Error rejecting request:", err);
      toast({
        title: "Failed to Reject Request",
        description:
          err.message || "An error occurred while rejecting the request.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      // TODO: Call API to remove member (chưa có API này)
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = true; // Replace with actual API call result

      if (success) {
        toast({
          title: "Member Removed",
          description: `User ${userId} has been removed from the group.`,
          variant: "default",
        });
        fetchData();
      } else {
        toast({
          title: "Failed to Remove Member",
          description: `Could not remove user ${userId}.`,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Error removing member:", err);
      toast({
        title: "Failed to Remove Member",
        description:
          err.message || "An error occurred while removing the member.",
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

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import MemberCardInfo from "@/components/groups/members/MemberCardInfo";
import { GroupMember, GroupMemberRole } from "@/types/groups/GroupData";
import { Search } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

// --- Mock Current User ID (Replace with actual context/auth data) ---
const CURRENT_USER_ID = "member-1";
// --- End Mock ---

// Mock function to fetch members - Replace with your actual API call
async function fetchGroupMembers(
  groupId: string
): Promise<{ members: GroupMember[]; totalCount: number }> {
  console.log(`Fetching members for group ${groupId}`);
  await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay

  const mockMembers: GroupMember[] = [
    {
      id: "member-1",
      name: "Phan Giang",
      avatar: DEFAULT_AVATAR,
      description: "University Information of Technology",
      role: "member",
      friendshipStatus: "self",
    },
    {
      id: "admin-1",
      name: "Yen Tran",
      avatar: DEFAULT_AVATAR,
      description: "Works at University Information of Technology",
      role: "admin",
      friendshipStatus: "not_friend",
    },
    {
      id: "admin-2",
      name: "Trong Thanh Le",
      avatar: DEFAULT_AVATAR,
      description: "Works at University Information of Technology",
      role: "admin",
      friendshipStatus: "friend",
    },
    {
      id: "mod-1",
      name: "Tran Anh Dung",
      avatar: DEFAULT_AVATAR,
      description: "Works at University Information of Technology",
      role: "moderator",
      friendshipStatus: "not_friend",
    },
    {
      id: "member-2",
      name: "Tấn Dũng",
      avatar: DEFAULT_AVATAR,
      description: "University Information of Technology",
      role: "member",
      friendshipStatus: "friend",
    },
    {
      id: "member-3",
      name: "Bảo Phú",
      avatar: DEFAULT_AVATAR,
      description: "University Information of Technology",
      role: "member",
      friendshipStatus: "not_friend",
    },
    {
      id: "member-4",
      name: "Thắm Trần",
      avatar: DEFAULT_AVATAR,
      description: "University Information of Technology",
      role: "member",
      friendshipStatus: "pending_sent",
    },
    {
      id: "member-5",
      name: "Member Five",
      avatar: DEFAULT_AVATAR,
      description: "Student at UIT",
      role: "member",
      friendshipStatus: "not_friend",
    },
    {
      id: "member-6",
      name: "Member Six",
      avatar: DEFAULT_AVATAR,
      description: "Student at HCMUS",
      role: "member",
      friendshipStatus: "not_friend",
    },
    {
      id: "member-7",
      name: "Another Admin",
      avatar: DEFAULT_AVATAR,
      description: "UIT Staff",
      role: "admin",
      friendshipStatus: "not_friend",
    },
  ];

  // Simulate a larger member count
  const totalCount = 190293;

  return { members: mockMembers, totalCount };
}

const MemberGroup = () => {
  const params = useParams();
  const groupId = params?.id as string;

  const [allMembers, setAllMembers] = useState<GroupMember[]>([]);
  const [totalMemberCount, setTotalMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (groupId) {
      setLoading(true);
      setError(null);
      fetchGroupMembers(groupId)
        .then(({ members, totalCount }) => {
          if (isMounted) {
            setAllMembers(members);
            setTotalMemberCount(totalCount);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch members:", err);
          if (isMounted) {
            setError("Could not load members.");
            setLoading(false);
          }
        });
    } else {
      setError("Invalid Group ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) {
      return allMembers;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return allMembers.filter((member) =>
      member.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [allMembers, searchTerm]);

  const { currentUser, adminsAndMods, regularMembers } = useMemo(() => {
    const currentUser = filteredMembers.find((m) => m.id === CURRENT_USER_ID);
    const adminsAndMods = filteredMembers
      .filter(
        (m) =>
          (m.role === "admin" || m.role === "moderator") &&
          m.id !== CURRENT_USER_ID
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    const regularMembers = filteredMembers
      .filter((m) => m.role === "member" && m.id !== CURRENT_USER_ID)
      .sort((a, b) => a.name.localeCompare(b.name));
    return { currentUser, adminsAndMods, regularMembers };
  }, [filteredMembers]);

  const handleAddFriend = (memberId: string) => {
    console.log(`Add friend request sent to member: ${memberId}`);
    setAllMembers((prevMembers) =>
      prevMembers.map((m) =>
        m.id === memberId ? { ...m, friendshipStatus: "pending_sent" } : m
      )
    );
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

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600  min-h-[400px]">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Members
        </h2>
        <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
          {totalMemberCount.toLocaleString()}
        </span>
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="search-members"
          id="search-members"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Current User Section */}
      {currentUser && (
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <MemberCardInfo
            member={currentUser}
            isCurrentUser={true}
            onAddFriend={handleAddFriend}
          />
        </div>
      )}

      {/* Admins & Moderators Section */}
      {adminsAndMods.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            Admins & Moderators
            <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
              {adminsAndMods.length}
            </span>
          </h3>
          <div className="space-y-1">
            {adminsAndMods.map((member) => (
              <MemberCardInfo
                key={member.id}
                member={member}
                isCurrentUser={false}
                onAddFriend={handleAddFriend}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Members Section */}
      {regularMembers.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          {/* Optional: Add a title like "Members" if needed, or just list them */}
          <div className="space-y-1">
            {regularMembers.map((member) => (
              <MemberCardInfo
                key={member.id}
                member={member}
                isCurrentUser={false}
                onAddFriend={handleAddFriend}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredMembers.length === 0 && searchTerm && !loading && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No members found matching "{searchTerm}".
        </div>
      )}
      {allMembers.length === 0 && !loading && !error && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          This group currently has no members listed.
        </div>
      )}
    </div>
  );
};
export default MemberGroup;

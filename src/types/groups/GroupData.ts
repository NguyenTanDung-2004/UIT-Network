export type GroupHeaderData = {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  memberCount: number;
  isJoined: boolean | true;
  isPrivate: boolean | true;
  bio?: string | null;
  createdDate?: string | null;
};

export type GroupMemberRole = "admin" | "moderator" | "member";

export type FriendshipStatus =
  | "friend"
  | "pending_sent"
  | "pending_received"
  | "not_friend"
  | "self";

export type GroupMember = {
  id: string;
  name: string;
  avatar: string;
  joinedDate?: string | null;
  role: GroupMemberRole;
};

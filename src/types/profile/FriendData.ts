export interface Friend {
  id: string;
  name: string;
  avatar: string;
  followerCount: number;
  profileUrl: string;
}

export type FriendshipStatus =
  | "friend"
  | "not_friend"
  | "pending_sent" // You sent a request
  | "pending_received" // You received a request
  | "self";

export interface Follower {
  id: string;
  name: string;
  avatar: string;
  profileUrl: string;
  friendshipStatus: FriendshipStatus;
}

export interface FollowingUser {
  type: "user";
  id: string;
  name: string;
  avatar: string;
  profileUrl: string;
}

export interface FollowingPage {
  type: "page";
  id: string;
  name: string;
  avatar: string;
  pageUrl: string;
}

export type FollowingItem = FollowingUser | FollowingPage;

export type ProfileHeaderData = {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  followerCount: number;
  friendCount: number;
  friendshipStatus:
    | "friend"
    | "not_friend"
    | "pending_sent"
    | "pending_received"
    | "self";
};

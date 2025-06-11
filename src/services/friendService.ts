// services/friendService.tsx
import apiFetch from "./apiClient";
import { Friend } from "@/types/profile/FriendData";

interface UserCardInfoItem {
  userId: string;
  userName: string;
  avtURL: string;
  studentId: string;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const formatUserCardInfoToFriend = (userCard: UserCardInfoItem): Friend => {
  return {
    id: userCard.userId,
    name: userCard.userName || "Unknown User",
    avatar: userCard.avtURL || DEFAULT_AVATAR,
    followerCount: 0,
    profileUrl: `/profile/${userCard.userId}`,
  };
};

export const getListFriendIds = async (userId: string): Promise<string[]> => {
  const baseUrl = process.env.FRIEND_API_URL || "http://localhost:8082";
  const url = `${baseUrl}/friend/notexternal/list/${userId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<string[]>(url, options);

  return response;
};

export const getUserInfoCardsByIds = async (
  ids: string[]
): Promise<Friend[]> => {
  if (ids.length === 0) {
    return [];
  }

  const baseUrl = process.env.USER_API_URL || "http://localhost:8080";
  const idsString = ids.join(",");
  const url = `${baseUrl}/user/user-info?ids=${idsString}`;

  const response = await apiFetch<UserCardInfoItem[]>(url);

  return response.map(formatUserCardInfoToFriend);
};

import apiFetch from "./apiClient";
import { Friend, FriendshipStatus } from "@/types/profile/FriendData";

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
    profileUrl: `/profiles/${userCard.userId}`,
  };
};

export const getListFriendIds = async (userId: string): Promise<string[]> => {
  const baseUrl = process.env.FRIEND_API_URL || "http://localhost:8082";
  const url = `${baseUrl}/friend/notexternal/list/${userId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

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

// FRIEND STATUS
interface BackendFriendStatusResponse {
  object: "NO_RE" | "FRIEND" | "ACCEPT" | "REQUEST";
  enumResponse: {
    code: string;
    message: string;
  };
}
interface BackendSimpleApiResponse {
  object: any | null;
  enumResponse: {
    code: string;
    message: string;
  };
}

const FRIEND_API_BASE_URL =
  process.env.FRIEND_API_URL || "http://localhost:8082";

const mapBackendStatusToFrontendStatus = (
  backendStatus: "NO_RE" | "FRIEND" | "ACCEPT" | "REQUEST",
  currentUserId: string, // User đang xem trạng thái
  otherUserId: string // User mà currentUserId đang kiểm tra trạng thái với
): FriendshipStatus => {
  // Logic này cần biết ai là người gửi/nhận request nếu backend chỉ trả về chung chung
  // Dựa trên mô tả:
  // FRIEND -> "friend"
  // NO_RE -> "not_friend"
  // ACCEPT -> "pending_received" (nếu otherUserId là người gửi request tới currentUserId)
  // REQUEST -> "pending_sent" (nếu currentUserId gửi request tới otherUserId)

  // API friend-status không cung cấp thông tin "ai gửi ai nhận",
  // mà chỉ trả về trạng thái của mối quan hệ từ góc nhìn của currentUserId (người xem).
  // Vì vậy, "ACCEPT" nghĩa là otherUserId đã chấp nhận request CỦA BẠN (currentUserId),
  // "REQUEST" nghĩa là otherUserId đã gửi request ĐẾN BẠN (currentUserId).
  // Tuy nhiên, mô tả bạn đưa ra lại ngược lại so với thông thường:
  // "Nếu b gửi request đến a ((người dùng đang xem status (a) chưa được chấp nhận) là ACCEPT"
  // "Nếu a gửi request đến b (b chưa chấp nhận) là REQUEST"
  // Dựa vào đó:
  if (backendStatus === "FRIEND") return "friend";
  if (backendStatus === "NO_RE") return "not_friend";
  if (backendStatus === "ACCEPT") return "pending_received"; // otherUser (b) gửi request đến bạn (a)
  if (backendStatus === "REQUEST") return "pending_sent"; // Bạn (a) gửi request đến otherUser (b)
  return "not_friend"; // Fallback
};

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
): Promise<void> => {
  const url = `${FRIEND_API_BASE_URL}/friend/${senderId}/request/${receiverId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<BackendSimpleApiResponse>(url, options);

  if (response.enumResponse.code !== "s_01_friend") {
    throw new Error(
      response.enumResponse.message || "Failed to send friend request"
    );
  }
};

export const acceptFriendRequest = async (
  userBId: string,
  userAId: string
): Promise<void> => {
  const url = `${FRIEND_API_BASE_URL}/friend/${userAId}/friend/${userBId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<BackendSimpleApiResponse>(url, options);

  if (response.enumResponse.code !== "s_03_friend") {
    throw new Error(
      response.enumResponse.message || "Failed to accept friend request"
    );
  }
};

export const cancelFriendRequest = async (
  userBId: string,
  userAId: string
): Promise<void> => {
  const url = `${FRIEND_API_BASE_URL}/friend/${userBId}/request/${userAId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<BackendSimpleApiResponse>(url, options);

  if (response.enumResponse.code !== "s_01_friend") {
    throw new Error(
      response.enumResponse.message || "Failed to cancel friend request"
    );
  }
};

export const removeFriend = async (
  userAId: string,
  userBId: string
): Promise<void> => {
  const url = `${FRIEND_API_BASE_URL}/friend/${userAId}/friend/${userBId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<BackendSimpleApiResponse>(url, options);

  if (response.enumResponse.code !== "s_04_friend") {
    throw new Error(response.enumResponse.message || "Failed to remove friend");
  }
};

export const getFriendshipStatus = async (
  currentUserId: string,
  otherUserId: string
): Promise<FriendshipStatus> => {
  const url = `${FRIEND_API_BASE_URL}/friend/friend-status/${currentUserId}/${otherUserId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<BackendFriendStatusResponse>(url, options);

  if (response.enumResponse.code !== "s_00") {
    throw new Error(
      response.enumResponse.message || "Failed to get friendship status"
    );
  }

  return mapBackendStatusToFrontendStatus(
    response.object,
    currentUserId,
    otherUserId
  );
};

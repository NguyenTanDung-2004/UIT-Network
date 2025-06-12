import apiFetch from "./apiClient";
import { getUserInfoCardsByIds } from "@/services/friendService";
import { Friend } from "@/types/profile/FriendData";

interface BackendNotificationItem {
  typeid: number | null;
  id: string;
  createdid: string;
  message: string;
  date: string;
  receivedid: string;
  postid: string | null;
  extrafield: string | null;
}

interface GetNotificationsApiResponse {
  object: BackendNotificationItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

export interface NotificationItemData {
  id: string;
  avatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

export const getNotifications = async (
  userId: string
): Promise<NotificationItemData[]> => {
  const baseUrl = process.env.NOTI_API_URL || "http://localhost:8081";
  const url = `${baseUrl}/notify/${userId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetNotificationsApiResponse>(url, options);

  if (response.enumResponse.code !== "n1_success") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch notifications"
    );
  }

  const backendNotifications = response.object;

  const creatorIds = Array.from(
    new Set(backendNotifications.map((n) => n.createdid))
  );
  const creatorInfos: Friend[] = await getUserInfoCardsByIds(creatorIds);

  return backendNotifications.map((item) => {
    const creator = creatorInfos.find((info) => info.id === item.createdid);
    const creatorName = creator?.name || "Unknown User";
    const creatorAvatar = creator?.avatar || DEFAULT_AVATAR;

    const timestamp = new Date(item.date);
    const link = item.postid ? `/post/${item.postid}` : undefined;

    return {
      id: item.id,
      avatar: creatorAvatar,
      content: `${creatorName} ${item.message}`,
      timestamp: timestamp,
      read: false,
      link: link,
    };
  });
};

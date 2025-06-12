import apiFetch from "./apiClient";
import { ChatItem } from "@/types/chats/ChatData";

interface BackendChatItem {
  id: string;
  type: 1 | 2;
  name: string;
  ownerid: string | null;
  status: string;
  createddate: string;
  modifieddate: string;
  avturl: string;
  otheruserid: string | null;
  isdisplay: 0 | 1;
  isseen: 0 | 1;
}

interface GetChatTopicsApiResponse {
  object: BackendChatItem[];
  enumResponse: {
    message: string;
    code: string;
  };
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const formatBackendChatItemToChatItem = (
  backendChat: BackendChatItem
): ChatItem => {
  return {
    id: backendChat.id,
    name: backendChat.name,
    avatar: backendChat.avturl || DEFAULT_AVATAR,
    type: backendChat.type,
    status: backendChat.status === "ACTIVE" ? "online" : "offline",
    isSeen: backendChat.isseen === 1,
  };
};

export const getChatTopics = async (): Promise<ChatItem[]> => {
  const baseUrl = process.env.CHAT_API_URL || "http://localhost:8085";
  const url = `${baseUrl}/chat/group/list`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetChatTopicsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_07_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch chat topics"
    );
  }

  return response.object.map(formatBackendChatItemToChatItem);
};

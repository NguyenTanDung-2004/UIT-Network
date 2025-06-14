import apiFetch from "./apiClient";
import {
  ChatItem,
  ChatData,
  Message,
  ChatPartnerInfo,
  SharedMediaItem,
  SharedFileItem,
  GroupMemberInfo,
} from "@/types/chats/ChatData";
import { getUserInfoCardsByIds } from "@/services/friendService";

import { Friend } from "@/types/profile/FriendData";

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

const CHAT_API_BASE_URL = process.env.CHAT_API_URL || "http://localhost:8085";

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

const formatBackendChatItemToChatData = (
  backendChat: BackendChatItem
): ChatData => {
  const chatType = backendChat.type === 1 ? "group" : "person";
  const timestamp = new Date(
    backendChat.modifieddate || backendChat.createddate
  );

  return {
    id: backendChat.id,
    type: chatType,
    avatar: backendChat.avturl || DEFAULT_AVATAR,
    name: backendChat.name,
    lastMessage: "No recent messages",
    timestamp: timestamp,
    unread: backendChat.isseen === 0,
    isOnline: chatType === "person" ? backendChat.status === "ACTIVE" : false,
  };
};

export const getChatTopics = async (): Promise<ChatItem[]> => {
  const url = `${CHAT_API_BASE_URL}/chat/group/list`;
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

export const getTopicsForChatPage = async (): Promise<ChatData[]> => {
  const url = `${CHAT_API_BASE_URL}/chat/group/list`;
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
      response.enumResponse.message || "Failed to fetch chat list summary"
    );
  }

  return response.object.map(formatBackendChatItemToChatData);
};

interface BackendMessageItem {
  id: string;
  parentid: string | null;
  senderid: string;
  message: string; // Có thể là JSON string
  tags: string[] | null;
  type: number; // 1: text, 2: image, 3: video, 4: file, 5: AI question/rich text
  createddate: string;
  modifieddate: string;
  status: string;
  groupid: string | null;
  isowner: boolean;
  avturl: string;
  sendername: string;
}

interface BackendMessageMedia {
  typeId: number;
  url: string;
  name?: string; // Dành cho file
  sizeValue?: number; // Dành cho file
  unit?: string; // Dành cho file
}

interface ParsedMessageContent {
  // Cấu trúc JSON bên trong trường 'message'
  content?: string;
  media?: BackendMessageMedia[];
}

interface GetListMessageApiResponse {
  object: BackendMessageItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

const parseMessageContentAndMedia = (
  messageString: string
): { content: string; media?: BackendMessageMedia[] } => {
  try {
    const parsed: ParsedMessageContent = JSON.parse(messageString);
    let content = parsed.content || messageString; // Nếu không có content field, dùng nguyên chuỗi
    let media = parsed.media;
    return { content, media };
  } catch (e) {
    return { content: messageString }; // Nếu không phải JSON, trả về nguyên chuỗi
  }
};

const formatBackendMessageToMessage = (
  backendMessage: BackendMessageItem
): Message => {
  const { content: parsedContent, media } = parseMessageContentAndMedia(
    backendMessage.message
  );
  let messageContent: string = parsedContent; // Dùng biến tạm để có thể thay đổi
  let messageType: Message["type"] = "text";
  let mediaUrl: string | undefined = undefined;
  let fileName: string | undefined = undefined;
  let fileSize: number | undefined = undefined;
  let fileType: string | undefined = undefined;

  if (media && media.length > 0) {
    const firstMedia = media[0];
    switch (firstMedia.typeId) {
      case 2:
        messageType = "image";
        mediaUrl = firstMedia.url;
        break;
      case 3:
        messageType = "video";
        mediaUrl = firstMedia.url;
        break;
      case 4:
        messageType = "file";
        mediaUrl = firstMedia.url;
        fileName = firstMedia.name;
        fileSize = firstMedia.sizeValue;
        fileType = firstMedia.name
          ? firstMedia.name.split(".").pop()?.toLowerCase()
          : "unknown";
        break;
      default:
        messageType = "text";
    }
  } else {
    switch (backendMessage.type) {
      case 1:
        messageType = "text";
        break;
      case 5:
        messageType = "text";
        messageContent = "@AIAssist " + parsedContent;
        break;
      case 2:
        messageType = "image";
        break;
      case 3:
        messageType = "video";
        break;
      case 4:
        messageType = "file";
        break;
      default:
        messageType = "text";
        break;
    }
  }

  return {
    id: backendMessage.id,
    senderId: backendMessage.senderid,
    content: messageContent,
    timestamp: new Date(backendMessage.createddate),
    type: messageType,
    mediaUrl: mediaUrl,
    fileName: fileName,
    fileSize: fileSize,
    fileType: fileType,
    senderName: backendMessage.sendername,
    senderAvatar: backendMessage.avturl || DEFAULT_AVATAR,
  };
};

export const getListMessages = async (
  chatId: string
): Promise<{
  messages: Message[];
  media: SharedMediaItem[];
  files: SharedFileItem[];
}> => {
  const url = `${CHAT_API_BASE_URL}/chat/message/${chatId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetListMessageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_08_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch messages"
    );
  }

  const backendMessages = response.object;

  const messages: Message[] = [];
  const mediaItems: SharedMediaItem[] = [];
  const fileItems: SharedFileItem[] = [];

  backendMessages.forEach((backendMsg) => {
    const formattedMessage = formatBackendMessageToMessage(backendMsg);
    messages.push(formattedMessage);

    if (formattedMessage.mediaUrl) {
      if (
        formattedMessage.type === "image" ||
        formattedMessage.type === "video"
      ) {
        mediaItems.push({
          id: formattedMessage.id,
          url: formattedMessage.mediaUrl,
          type: formattedMessage.type,
        });
      } else if (
        formattedMessage.type === "file" &&
        formattedMessage.fileName &&
        formattedMessage.fileSize
      ) {
        fileItems.push({
          id: formattedMessage.id,
          name: formattedMessage.fileName,
          size: formattedMessage.fileSize,
          url: formattedMessage.mediaUrl,
          type: formattedMessage.fileType || "unknown",
        });
      }
    }
  });

  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return { messages: messages, media: mediaItems, files: fileItems };
};

interface SeenMessageApiResponse {
  object: any | null;
  enumResponse: {
    code: string;
    message: string;
  };
}

export const seenMessage = async (chatId: string): Promise<void> => {
  const url = `${CHAT_API_BASE_URL}/chat/group/seen/${chatId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<SeenMessageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_06_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to mark message as seen"
    );
  }
};

interface GetChatGroupMembersApiResponse {
  object: string[]; // Mảng các userId
  enumResponse: {
    code: string;
    message: string;
  };
}

export const getChatGroupMembers = async (
  groupId: string
): Promise<GroupMemberInfo[]> => {
  const url = `${CHAT_API_BASE_URL}/chat/group/members/${groupId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetChatGroupMembersApiResponse>(url, options);

  if (response.enumResponse.code !== "s_00_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch chat group members"
    );
  }

  const memberIds = response.object;

  if (memberIds.length === 0) {
    return [];
  }

  // Gọi getUserInfoCardsByIds để lấy thông tin chi tiết (name, avatar)
  const memberInfos: Friend[] = await getUserInfoCardsByIds(memberIds);

  const groupMembers: GroupMemberInfo[] = memberIds.map((userId) => {
    const userInfo = memberInfos.find((info) => info.id === userId);

    return {
      id: userId,
      name: userInfo?.name || "Unknown Member",
      avatar: userInfo?.avatar || DEFAULT_AVATAR,
      role: "member",
    };
  });

  return groupMembers;
};

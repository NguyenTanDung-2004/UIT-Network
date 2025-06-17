import apiClient from "./apiClient";
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
import SockJS from "sockjs-client";
import {
  Client,
  IMessage as StompMessage,
  StompSubscription,
} from "@stomp/stompjs";

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
const WEBSOCKET_URL =
  process.env.WEBSOCKET_URL || "http://localhost:8085/chat-socket";

let stompClient: Client | null = null;
let activeSubscriptions: Map<
  string,
  {
    callbacks: Set<(message: Message) => void>;
    subscription: StompSubscription | null;
  }
> = new Map();

interface WebSocketRawMessage {
  id: string;
  parentid: string | null;
  senderid: string;
  message: string;
  tags: string[] | null;
  type: number;
  createddate: string;
  modifieddate: string;
  status: string;
  groupid: string | null;
  pin: 0 | 1;
}

const formatWebSocketRawMessageToMessage = async (
  rawMessage: WebSocketRawMessage
): Promise<Message> => {
  const { content: parsedContent, media } = parseMessageContentAndMedia(
    rawMessage.message
  );
  let messageContent: string = parsedContent;
  let messageType: Message["type"] = "text";
  let mediaUrl: string | undefined = undefined;
  let fileName: string | undefined = undefined;
  let fileSize: number | undefined = undefined;
  let fileType: string | undefined = undefined;

  let timestamp: Date;
  try {
    timestamp = new Date(rawMessage.createddate);
    if (isNaN(timestamp.getTime())) {
      console.warn(
        "Invalid createddate from raw WebSocket message:",
        rawMessage.createddate
      );
      timestamp = new Date();
    }
  } catch (e) {
    console.error(
      "Error parsing createddate from raw WebSocket message:",
      rawMessage.createddate,
      e
    );
    timestamp = new Date();
  }

  if (media && media.length > 0) {
    const firstMedia = media[0];
    mediaUrl = firstMedia.url;
    switch (firstMedia.typeId) {
      case 1:
      case 4:
        messageType = "file";
        fileName = firstMedia.name;
        fileSize = firstMedia.sizeValue;
        fileType =
          firstMedia.name?.split(".").pop()?.toLowerCase() || "unknown";
        break;
      case 2:
        messageType = "image";
        break;
      case 3:
        messageType = "video";
        break;
      default:
        mediaUrl = undefined;
        fileName = undefined;
        fileSize = undefined;
        fileType = undefined;
        messageType = "text";
        break;
    }
  } else {
    if (rawMessage.type === 5) {
      messageType = "text";
      messageContent = "@AIAssist " + parsedContent;
    } else {
      messageType = "text";
    }
  }

  let senderName: string = "Unknown";
  let senderAvatar: string = DEFAULT_AVATAR;
  try {
    const senderInfoArray = await getUserInfoCardsByIds([rawMessage.senderid]);
    if (senderInfoArray && senderInfoArray.length > 0) {
      senderName = senderInfoArray[0].name;
      senderAvatar = senderInfoArray[0].avatar || DEFAULT_AVATAR;
    }
  } catch (e) {
    console.error(
      `Failed to fetch sender info for ID: ${rawMessage.senderid} from WebSocket message`,
      e
    );
  }

  return {
    id: rawMessage.id,
    senderId: rawMessage.senderid,
    content: messageContent,
    timestamp: timestamp,
    type: messageType,
    mediaUrl: mediaUrl,
    fileName: fileName,
    fileSize: fileSize,
    fileType: fileType,
    senderName: senderName,
    senderAvatar: senderAvatar,
  };
};

const handleStompMessage = async (message: StompMessage, topic: string) => {
  try {
    const rawData = JSON.parse(message.body);
    console.log(`Raw WebSocket Message Payload for topic ${topic}:`, rawData);

    let messagesToProcess: WebSocketRawMessage[] = [];

    // Kiểm tra nếu rawData là một mảng
    if (Array.isArray(rawData)) {
      messagesToProcess = rawData;
    } else if (typeof rawData === "object" && rawData !== null) {
      // Nếu rawData đã là một object đơn lẻ
      messagesToProcess = [rawData];
    } else {
      console.error(
        `Invalid message format received from WebSocket for topic ${topic}:`,
        rawData
      );
      return;
    }

    // Xử lý tất cả các tin nhắn trong mảng (hoặc object đơn đã được bọc trong mảng)
    for (const msg of messagesToProcess) {
      const formattedMessage = await formatWebSocketRawMessageToMessage(
        msg as WebSocketRawMessage
      );
      const subEntry = activeSubscriptions.get(topic);
      if (subEntry) {
        subEntry.callbacks.forEach((callback) => {
          callback(formattedMessage);
        });
      }
    }
  } catch (error) {
    console.error(`Error processing STOMP message for topic ${topic}:`, error);
    console.error("Message body that caused error:", message.body);
  }
};

export const initializeStompClient = (token: string | null) => {
  if (stompClient && stompClient.active) {
    return;
  }
  if (stompClient && !stompClient.active && stompClient.webSocket) {
    stompClient.activate();
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => {
      const sock = new SockJS(WEBSOCKET_URL);
      return sock;
    },
    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    debug: (str) => {
      // console.log("STOMP Debug:", str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    activeSubscriptions.forEach((subEntry, topic) => {
      if (!subEntry.subscription) {
        const newSubscription = stompClient?.subscribe(topic, (message) =>
          handleStompMessage(message, topic)
        );
        if (newSubscription) {
          activeSubscriptions.set(topic, {
            ...subEntry,
            subscription: newSubscription,
          });
        }
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP Broker reported error:", frame.headers["message"]);
    console.error("STOMP Additional details:", frame.body);
  };

  stompClient.onWebSocketError = (event) => {
    console.error("STOMP WebSocket error:", event);
  };

  stompClient.onDisconnect = () => {
    activeSubscriptions.forEach((subEntry, topic) => {
      activeSubscriptions.set(topic, { ...subEntry, subscription: null });
    });
  };

  stompClient.activate();
};

export const disconnectStompClient = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }
  stompClient = null;
  activeSubscriptions.clear();
};

export const subscribeToChatMessages = (
  chatId: string,
  callback: (message: Message) => void
): (() => void) => {
  const topic = `/topic/chat/message/${chatId}`;

  let subEntry = activeSubscriptions.get(topic);
  if (!subEntry) {
    subEntry = { callbacks: new Set(), subscription: null };
    activeSubscriptions.set(topic, subEntry);
  }
  subEntry.callbacks.add(callback);

  if (stompClient && stompClient.connected && !subEntry.subscription) {
    const subscription = stompClient.subscribe(topic, (message) =>
      handleStompMessage(message, topic)
    );
    subEntry.subscription = subscription;
  }

  return () => {
    const currentSubEntry = activeSubscriptions.get(topic);
    if (currentSubEntry) {
      currentSubEntry.callbacks.delete(callback);

      if (
        currentSubEntry.callbacks.size === 0 &&
        currentSubEntry.subscription
      ) {
        currentSubEntry.subscription.unsubscribe();
        activeSubscriptions.delete(topic);
      }
    }
  };
};

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
    otheruserid: backendChat.otheruserid || null,
  };
};

export const getChatTopics = async (): Promise<ChatItem[]> => {
  const url = `${CHAT_API_BASE_URL}/chat/group/list`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiClient<GetChatTopicsApiResponse>(url, options);

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
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiClient<GetChatTopicsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_07_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch chat list summary"
    );
  }

  const chatTopics = response.object.map(formatBackendChatItemToChatData);

  initializeStompClient(token);

  const globalChatListUpdateCallback = (message: Message) => {};

  chatTopics.forEach((chat) => {
    if (chat.type === "group" || chat.type === "person") {
      subscribeToChatMessages(chat.id, globalChatListUpdateCallback);
    }
  });

  return chatTopics;
};

interface BackendMessageItem {
  id: string;
  parentid: string | null;
  senderid: string;
  message: string;
  tags: string[] | null;
  type: number;
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
  name?: string;
  sizeValue?: number;
  unit?: string;
}

interface ParsedMessageContent {
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
    const content = parsed.content == null ? "" : parsed.content;
    const media = parsed.media;
    return { content, media };
  } catch (e) {
    return { content: messageString };
  }
};

const formatBackendMessageToMessage = (
  backendMessage: BackendMessageItem
): Message => {
  const { content: parsedContent, media } = parseMessageContentAndMedia(
    backendMessage.message
  );
  let messageContent: string = parsedContent;
  let messageType: Message["type"] = "text";
  let mediaUrl: string | undefined = undefined;
  let fileName: string | undefined = undefined;
  let fileSize: number | undefined = undefined;
  let fileType: string | undefined = undefined;

  let timestamp: Date;
  try {
    timestamp = new Date(backendMessage.createddate);
    if (isNaN(timestamp.getTime())) {
      console.warn(
        "Invalid createddate from backend (API):",
        backendMessage.createddate
      );
      timestamp = new Date();
    }
  } catch (e) {
    console.error(
      "Error parsing createddate from backend (API):",
      backendMessage.createddate,
      e
    );
    timestamp = new Date();
  }

  if (media && media.length > 0) {
    const firstMedia = media[0];
    mediaUrl = firstMedia.url;

    switch (firstMedia.typeId) {
      case 1:
      case 4:
        messageType = "file";
        fileName = firstMedia.name;
        fileSize = firstMedia.sizeValue;
        fileType = firstMedia.name
          ? firstMedia.name.split(".").pop()?.toLowerCase()
          : "unknown";
        break;
      case 2:
        messageType = "image";
        break;
      case 3:
        messageType = "video";
        break;
      default:
        mediaUrl = undefined;
        fileName = undefined;
        fileSize = undefined;
        fileType = undefined;
        messageType = "text";
        break;
    }
  } else {
    if (backendMessage.type === 5) {
      messageType = "text";
      messageContent = "@AIAssist " + parsedContent;
    } else {
      messageType = "text";
    }
  }

  return {
    id: backendMessage.id,
    senderId: backendMessage.senderid,
    content: messageContent,
    timestamp: timestamp,
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
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiClient<GetListMessageApiResponse>(url, options);

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
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiClient<SeenMessageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_06_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to mark message as seen"
    );
  }
};

interface GetChatGroupMembersApiResponse {
  object: string[];
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
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiClient<GetChatGroupMembersApiResponse>(
    url,
    options
  );

  if (response.enumResponse.code !== "s_00_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch chat group members"
    );
  }

  const memberIds = response.object;

  if (memberIds.length === 0) {
    return [];
  }

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

interface BackendSendMessageRequestBodyItem {
  receiverid: string | null;
  message: string;
  tags: string[] | null;
  messagetype: number;
  grouptype: 1 | 2;
  groupid: string | null;
}

interface AIMessageRequestBody {
  groupid: string;
  question: string;
  tags: string[] | null;
  messagetype: 5;
  grouptype: 1;
}

const mapFrontendMessageTypeToBackendTypeId = (
  type: Message["type"]
): number => {
  switch (type) {
    case "image":
      return 2;
    case "video":
      return 3;
    case "file":
      return 1;
    case "text":
      return 1;
    default:
      return 1;
  }
};

const formatMessageToRequestBodyContent = (message: Message): string => {
  let contentJson: { content: string; media?: BackendMessageMedia[] } = {
    content: message.content,
  };

  if (message.mediaUrl) {
    const mediaItem: BackendMessageMedia = {
      typeId: mapFrontendMessageTypeToBackendTypeId(message.type),
      url: message.mediaUrl,
    };
    if (message.type === "file") {
      mediaItem.name = message.fileName;
      mediaItem.sizeValue = message.fileSize;
    }
    contentJson.media = [mediaItem];
  }
  return JSON.stringify(contentJson);
};

export const sendMessageToPerson = async (
  message: Message,
  receiverId: string
): Promise<Message> => {
  const requestBodyItem: BackendSendMessageRequestBodyItem = {
    receiverid: receiverId,
    message: formatMessageToRequestBodyContent(message),
    tags: null,
    messagetype: 1,
    grouptype: 2,
    groupid: null,
  };

  const url = `${CHAT_API_BASE_URL}/chat/message`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify([requestBodyItem]),
  };

  const response = await apiClient<GetListMessageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_01_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to send person message"
    );
  }

  if (!response.object || response.object.length === 0) {
    throw new Error("No message object returned from API.");
  }
  return formatBackendMessageToMessage(response.object[0]);
};

export const sendMessageToGroup = async (
  message: Message,
  groupId: string
): Promise<Message> => {
  const requestBodyItem: BackendSendMessageRequestBodyItem = {
    receiverid: null,
    message: formatMessageToRequestBodyContent(message),
    tags: null,
    messagetype: 1,
    grouptype: 1,
    groupid: groupId,
  };

  const url = `${CHAT_API_BASE_URL}/chat/message`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify([requestBodyItem]),
  };

  const response = await apiClient<GetListMessageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_01_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to send group message"
    );
  }

  if (!response.object || response.object.length === 0) {
    throw new Error("No message object returned from API.");
  }
  return formatBackendMessageToMessage(response.object[0]);
};

export const sendMessageToAI = async (
  question: string,
  groupId: string
): Promise<Message[]> => {
  const requestBody: AIMessageRequestBody = {
    groupid: groupId,
    question: question,
    tags: null,
    messagetype: 5,
    grouptype: 1,
  };

  const url = `${CHAT_API_BASE_URL}/chat/message/AI`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await apiClient<GetListMessageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_01_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to send message to AI"
    );
  }

  if (!response.object || response.object.length === 0) {
    throw new Error("No message object returned from AI API.");
  }

  return response.object.map(formatBackendMessageToMessage);
};

export const createGroup1on1 = async (
  currentUserId: string,
  memberIds: string[]
): Promise<void> => {
  const url = `${CHAT_API_BASE_URL}/chat/group/create-group-1-1/${currentUserId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const rawResponse = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(memberIds),
  });

  if (!rawResponse.ok) {
  }
};

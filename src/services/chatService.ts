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
} from "@stomp/stompjs"; // Import StompSubscription

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
  process.env.WEBSOCKET_URL || "http://localhost:8085/chat-websocket";

let stompClient: Client | null = null;
let activeSubscriptions: Map<
  string,
  {
    callbacks: Set<(message: Message) => void>; // Use a Set to store multiple callbacks
    subscription: StompSubscription | null;
  }
> = new Map();

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
        // If no subscription object (means not active or just reconnected)
        const newSubscription = stompClient?.subscribe(topic, (message) => {
          const data = JSON.parse(message.body);
          const formattedMessage = formatBackendMessageToMessage(
            data as BackendMessageItem
          );
          // Invoke all registered callbacks for this topic
          subEntry.callbacks.forEach((callback) => {
            callback(formattedMessage);
          });
        });
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
  activeSubscriptions.clear(); // Clear all registered subscriptions
};

export const subscribeToChatMessages = (
  chatId: string,
  callback: (message: Message) => void
): (() => void) => {
  const topic = `/topic/chat/message/${chatId}`;

  // Get existing entry or create a new one
  let subEntry = activeSubscriptions.get(topic);
  if (!subEntry) {
    subEntry = { callbacks: new Set(), subscription: null };
    activeSubscriptions.set(topic, subEntry);
  }
  subEntry.callbacks.add(callback); // Add the new callback to the Set

  // Try to subscribe immediately if the client is connected and not already subscribed to this topic
  if (stompClient && stompClient.connected && !subEntry.subscription) {
    const subscription = stompClient.subscribe(
      topic,
      (message: StompMessage) => {
        const data = JSON.parse(message.body);
        const formattedMessage = formatBackendMessageToMessage(
          data as BackendMessageItem
        );
        // Invoke all callbacks registered for this topic
        subEntry?.callbacks.forEach((cb) => cb(formattedMessage));
      }
    );
    subEntry.subscription = subscription;
    // console.log(`Subscribed to ${topic} immediately.`);
  } else if (!stompClient || !stompClient.connected) {
    // If not connected, the onConnect handler will pick it up when it connects.
    // The callback is already stored in activeSubscriptions.
    // console.warn(`STOMP client not connected. Subscription for ${topic} pending.`);
  }

  // Return an unsubscribe function specific to this topic and callback
  return () => {
    const currentSubEntry = activeSubscriptions.get(topic);
    if (currentSubEntry) {
      currentSubEntry.callbacks.delete(callback); // Remove only this specific callback

      // If no more callbacks for this topic, unsubscribe from STOMP
      if (
        currentSubEntry.callbacks.size === 0 &&
        currentSubEntry.subscription
      ) {
        currentSubEntry.subscription.unsubscribe();
        activeSubscriptions.delete(topic); // Remove from our management map
        // console.log(`Unsubscribed from ${topic}. Removed STOMP subscription.`);
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

  // Initialize STOMP client here when topics are fetched and token is available
  initializeStompClient(token);

  // Register a global callback for each chat topic immediately.
  // This callback is intended to update the chat list summary (last message, unread status).
  // The actual state management for your chat list (e.g., in a React Context or component state)
  // would be listening to these updates.
  const globalChatListUpdateCallback = (message: Message) => {
    // This is where you would process messages that affect the chat list overview
    // (e.g., update `lastMessage`, `timestamp`, `unread` status for the relevant chat item).
    // You might need to find the chat in your existing chat list state using `message.groupid`
    // or `message.senderId` and then update its properties.
    // For example:
    // console.log(`Received real-time update for chat ${message.groupid || message.senderId}:`, message.content);
    // You would then dispatch an action or update a global state here to reflect this.
    // Example: updateChatListItem(message.groupid || message.senderId, { lastMessage: message.content, unread: true, timestamp: message.timestamp });
  };

  chatTopics.forEach((chat) => {
    if (chat.type === "group" || chat.type === "person") {
      // Subscribe each chat ID with the global callback
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

  if (media && media.length > 0) {
    const firstMedia = media[0];
    mediaUrl = firstMedia.url;

    switch (firstMedia.typeId) {
      case 1: // File typeId as per user's example
      case 4: // File typeId as per existing code (assuming both mean file)
        messageType = "file";
        fileName = firstMedia.name;
        fileSize = firstMedia.sizeValue;
        fileType = firstMedia.name
          ? firstMedia.name.split(".").pop()?.toLowerCase()
          : "unknown";
        break;
      case 2: // Image
        messageType = "image";
        break;
      case 3: // Video
        messageType = "video";
        break;
      default:
        // If typeId is unknown or not explicitly handled, treat as text with no media.
        // This ensures frontend 'type' matches media presence.
        mediaUrl = undefined;
        fileName = undefined;
        fileSize = undefined;
        fileType = undefined;
        messageType = "text";
        break;
    }
  } else {
    // If no media array in the parsed message, determine type based on backendMessage.type
    if (backendMessage.type === 5) {
      // AI message
      messageType = "text";
      messageContent = "@AIAssist " + parsedContent;
    } else {
      // Normal message (type 1) or any other type not indicating special media
      messageType = "text";
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
      return 1; // Assuming typeId 1 for files when sending, as per example
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

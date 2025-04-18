export interface ChatData {
  id: string;
  type: "person" | "group";
  avatar: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  isOnline: boolean | false;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "video";
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  senderName?: string; // dành cho group chat
  senderAvatar?: string; // dành cho group chat
}

export interface SharedMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}
export interface SharedFileItem {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}
export interface SharedLinkItem {
  id: string;
  url: string;
  title?: string;
  domain?: string;
}

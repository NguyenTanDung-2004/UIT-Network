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

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ChatData } from "@/types/chats/ChatData";
import { getTopicsForChatPage } from "@/services/chatService";
import { ClipLoader } from "react-spinners";

interface ChatListContextType {
  chats: ChatData[];
  loading: boolean;
  error: string | null;
}

const ChatListContext = createContext<ChatListContextType | undefined>(
  undefined
);

export const ChatListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchChats = async () => {
      try {
        const fetchedChats = await getTopicsForChatPage();
        if (isMounted) {
          setChats(fetchedChats);
        }
      } catch (err: any) {
        console.error("Failed to fetch chat list in context:", err);
        if (isMounted) {
          setError(err.message || "Could not load chat list.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchChats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ChatListContext.Provider value={{ chats, loading, error }}>
      {loading ? (
        <div className="w-80 md:w-96 h-screen flex items-center justify-center bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
          <ClipLoader color="#FF69B4" size={30} />
        </div>
      ) : (
        children
      )}
    </ChatListContext.Provider>
  );
};

export const useChatList = () => {
  const context = useContext(ChatListContext);
  if (!context) {
    throw new Error("useChatList must be used within a ChatListProvider");
  }
  return context;
};

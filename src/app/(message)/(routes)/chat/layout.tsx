"use client";
import React, { useEffect, useState } from "react";
import { ChatData } from "@/types/chats/ChatData";
import { useParams, usePathname, useRouter } from "next/navigation";
import ChatLeftBar from "@/components/chat/layout/ChatLeftBar";
import { ChatListProvider, useChatList } from "./ChatListContext"; // Import context

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayoutContent: React.FC<ChatLayoutProps> = ({ children }) => {
  const { chats, loading, error } = useChatList(); // Lấy chats từ context
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeChatId = (params?.id as string | null) ?? null;

  useEffect(() => {
    if (!loading && !error && chats.length > 0 && pathname === "/chat") {
      const firstChat = chats[0];
      const redirectPath =
        firstChat.type === "group"
          ? `/chat/group/${firstChat.id}`
          : `/chat/person/${firstChat.id}`;
      router.replace(redirectPath);
    }
  }, [loading, error, chats, pathname, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ChatLeftBar chats={chats} activeChatId={activeChatId} />

      <main className="flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <ChatListProvider>
      <ChatLayoutContent>{children}</ChatLayoutContent>
    </ChatListProvider>
  );
};

export default ChatLayout;

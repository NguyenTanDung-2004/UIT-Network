"use client";

import { MessageCirclePlus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import ChatListItem from "./ChatListItem";
import { ChatData } from "@/types/chats/ChatData";

interface ChatLeftBarProps {
  chats: ChatData[];
  activeChatId: string | null;
}

const ChatLeftBar: React.FC<ChatLeftBarProps> = ({ chats, activeChatId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleChatClick = (id: string, type: "person" | "group") => {
    const path = type === "group" ? `/chat/group/${id}` : `/chat/person/${id}`;
    router.push(path);
  };

  const filteredChats = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (!lowerSearchTerm) return chats;
    return chats.filter((chat) =>
      chat.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [chats, searchTerm]);

  return (
    <div className="w-80 md:w-96 h-screen flex flex-col bg-white dark:bg-gray-800  border-r border-gray-200 dark:border-gray-700 flex-shrink-0 ">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Chats
          </h2>
          <button className="p-2 rounded-full shadow-lg text-primary bg-white dark:bg-primary hover:bg-pink-100/80 dark:text-white dark:hover:bg-opacity-80 transition-colors focus:outline-none">
            <MessageCirclePlus size={18} />
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>

          <input
            type="text"
            name="search-chats"
            id="search-chats"
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-3xl leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 p-2">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              {...chat}
              isActive={chat.id === activeChatId}
              onClick={handleChatClick}
            />
          ))
        ) : (
          <div className="text-center py-10 px-4 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? "No chats found." : "No active conversations."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLeftBar;

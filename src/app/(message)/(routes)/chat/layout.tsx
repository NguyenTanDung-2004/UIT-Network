"use client";
import React, { useEffect, useState } from "react";
import { ChatData } from "@/types/chats/ChatData";
import { useParams, usePathname, useRouter } from "next/navigation";
import ChatLeftBar from "@/components/chat/layout/ChatLeftBar";
import { ClipLoader } from "react-spinners";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

async function fetchChatList(): Promise<ChatData[]> {
  console.log("Fetching chat list...");
  await new Promise((resolve) => setTimeout(resolve, 600));
  const mockData: ChatData[] = [
    {
      id: "person-1",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "Doe John",
      lastMessage: "You: Where r u?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      unread: true,
      isOnline: true,
    },
    {
      id: "person-2",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      unread: false,
      isOnline: true,
    },
    {
      id: "person-3",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "Nguyễn Tấn Dũng",
      lastMessage: "You sent a photo.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: false,
      isOnline: true,
    },
    {
      id: "group-1",
      type: "group",
      avatar: DEFAULT_AVATAR,
      name: "Group UIT",
      lastMessage: "You sent a photo.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unread: false,
      isOnline: false,
    },
    {
      id: "person-4",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      isOnline: false,
    },
    {
      id: "person-5",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unread: false,
      isOnline: true,
    },
    {
      id: "person-6",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unread: false,
      isOnline: false,
    },
    {
      id: "group-2",
      type: "group",
      avatar: DEFAULT_AVATAR,
      name: "Group UIT",
      lastMessage: "You sent a photo.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unread: false,
      isOnline: false,
    },
    {
      id: "person-7",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      isOnline: false,
    },
    {
      id: "person-15",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unread: false,
      isOnline: true,
    },
    {
      id: "person-16",
      type: "person",
      avatar: DEFAULT_AVATAR,
      name: "YenTran",
      lastMessage: "Yen: I give u 10 scores.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unread: false,
      isOnline: false,
    },
  ];

  return mockData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chats, setChats] = useState<ChatData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  const pathname = usePathname();
  const router = useRouter();

  const activeChatId = (params?.id as string | null) ?? null;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchChatList()
      .then((data) => {
        if (isMounted) {
          setChats(data);
          setLoading(false);

          if (pathname === "/chat" && data.length > 0) {
            const firstChat = data[0];
            const redirectPath =
              firstChat.type === "group"
                ? `/chat/group/${firstChat.id}`
                : `/chat/person/${firstChat.id}`;

            router.replace(redirectPath);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch chat list: ", err);
        if (isMounted) {
          setError("Could not load chats.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {loading ? (
        <div className="w-80 md:w-96 h-screen flex items-center justify-center bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
          <ClipLoader color="#FF69B4" size={30} />
        </div>
      ) : (
        <ChatLeftBar chats={chats} activeChatId={activeChatId} />
      )}

      <main className="flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default ChatLayout;

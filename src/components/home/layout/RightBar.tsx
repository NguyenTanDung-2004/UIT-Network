import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface ChatItem {
  id: string;
  name: string;
  avatar?: string; // Dùng cho Personal
  type: 1 | 2; // 1: Group, 2: Personal
  status?: "online" | "offline"; // Chỉ dùng cho Personal
}

interface RightBarProps {
  chats: ChatItem[];
}

const RightBar: React.FC<RightBarProps> = ({ chats }) => {
  const groupChats = chats.filter((chat) => chat.type === 1);
  const personalChats = chats.filter((chat) => chat.type === 2);

  return (
    <div className="w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-white pt-4 pb-20 border-l dark:bg-gray-800 dark:border-gray-700">
      {/* Group Chats */}
      <div className="px-4 mb-4">
        <h3 className="text-base font-semibold mb-3 dark:text-gray-200">
          Group
        </h3>
        <ul>
          {groupChats.map((chat) => (
            <li key={chat.id} className="mb-1">
              <Link href={`/chat/group/${chat.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border dark:bg-gray-700 dark:border-gray-600">
                    <Image
                      src={
                        chat.avatar ||
                        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                      }
                      alt={chat.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold dark:text-gray-300">
                    {chat.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Personal Chats */}
      <div className="px-4">
        <h3 className="text-base font-semibold mb-3 dark:text-gray-200">
          Personal
        </h3>
        <ul>
          {personalChats.map((chat) => (
            <li key={chat.id} className="mb-1">
              <Link href={`/chat/person/${chat.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <div className="w-8 h-8 relative">
                    <div className="rounded-full overflow-hidden absolute inset-0 border">
                      <Image
                        src={
                          chat.avatar ||
                          "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                        }
                        alt={chat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {chat.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold dark:text-gray-300">
                    {chat.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightBar;

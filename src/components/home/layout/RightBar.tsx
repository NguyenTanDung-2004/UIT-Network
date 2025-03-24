import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ChatItem {
  id: string;
  name: string;
  icon?: string;
}

interface ContactItem {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  company?: string;
  status?: "online" | "offline";
}

interface RightBarProps {
  communityChats: ChatItem[];
  groupChats: ChatItem[];
  onlineContacts: ContactItem[];
}

const RightBar: React.FC<RightBarProps> = ({
  communityChats,
  groupChats,
  onlineContacts,
}) => {
  return (
    <div className="w-full h-screen overflow-y-auto bg-white pt-4 pb-20 border-l dark:bg-gray-800 dark:border-gray-700">
      {/* Community Chats */}
      <div className="px-4 mb-4">
        <h3 className="text-base font-semibold mb-3 dark:text-gray-200">
          Community Chats
        </h3>
        <ul>
          {communityChats.map((chat) => (
            <li key={chat.id} className="mb-1">
              <Link href={`/community-chats/${chat.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border dark:bg-gray-700 dark:border-gray-600">
                    {chat.icon ? (
                      <Image
                        src={chat.icon}
                        alt={chat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-users text-blue-500 text-sm dark:text-gray-400"></i>
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

      {/* Groups Chats */}
      <div className="px-4 mb-4">
        <h3 className="text-base font-semibold mb-3 dark:text-gray-200">
          Groups Chats
        </h3>
        <ul>
          {groupChats.map((chat) => (
            <li key={chat.id} className="mb-1">
              <Link href={`/group-chats/${chat.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border dark:bg-gray-700 dark:border-gray-600">
                    {chat.icon ? (
                      <Image
                        src={chat.icon}
                        alt={chat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-users text-blue-500 text-sm dark:text-gray-400"></i>
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

      {/* Online Contacts */}
      <div className="px-4">
        <h3 className="text-base font-semibold mb-3 dark:text-gray-200">
          Online Contacts
        </h3>
        <ul>
          {onlineContacts.map((contact) => (
            <li key={contact.id} className="mb-1">
              <Link href={`/messages/${contact.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <div className="w-8 h-8 relative ">
                    <div className="rounded-full overflow-hidden absolute inset-0 border">
                      <Image
                        src={
                          contact.avatar ||
                          "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                        }
                        alt={contact.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full "></div>
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold dark:text-gray-300">
                    {contact.name}
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

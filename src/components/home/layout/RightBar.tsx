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
  // groupsToJoin: {
  //   id: string;
  //   name: string;
  //   years?: string;
  // }[];
}

const RightBar: React.FC<RightBarProps> = ({
  communityChats,
  groupChats,
  onlineContacts,
  // groupsToJoin,
}) => {
  return (
    <div className="w-full h-screen overflow-y-auto bg-white pt-4 pb-20 border-l">
      {/* Community Chats */}
      <div className="px-4 mb-4">
        <h3 className="text-base font-semibold mb-3">Community Chats</h3>
        <ul>
          {communityChats.map((chat) => (
            <li key={chat.id} className="mb-1">
              <Link href={`/community-chats/${chat.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border">
                    {chat.icon ? (
                      <Image
                        src={chat.icon}
                        alt={chat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-users text-blue-500 text-sm"></i>
                    )}
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold">
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
        <h3 className="text-base font-semibold mb-3">Groups Chats</h3>
        <ul>
          {groupChats.map((chat) => (
            <li key={chat.id} className="mb-1">
              <Link href={`/group-chats/${chat.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border">
                    {chat.icon ? (
                      <Image
                        src={chat.icon}
                        alt={chat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-users text-blue-500 text-sm"></i>
                    )}
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold">
                    {chat.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Groups to Join */}
      {/* <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Group to join</h3>
        <ul>
          {groupsToJoin.map((group) => (
            <li key={group.id} className="mb-3">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-users text-blue-500 text-xs"></i>
                  </div>
                  <div className="ml-2">
                    <p className="font-medium">{group.name}</p>
                    {group.years && (
                      <p className="text-xs text-gray-500">{group.years}</p>
                    )}
                  </div>
                </div>
                <button className="w-8 h-8 bg-pink-100 rounded-full text-pink-500 hover:bg-pink-200 flex items-center justify-center">
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Online Contacts */}
      <div className="px-4">
        <h3 className="text-base font-semibold mb-3">Online Contacts</h3>
        <ul>
          {onlineContacts.map((contact) => (
            <li key={contact.id} className="mb-1">
              <Link href={`/messages/${contact.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-200 border">
                    <Image
                      src={
                        contact.avatar ||
                        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg"
                      }
                      alt={contact.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold">
                    {contact.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Rate Experience Section */}
      {/* <div className="mt-6 px-4">
        <h3 className="text-lg font-semibold mb-3">Rate your experience!</h3>
        <div className="flex justify-between items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <i className="far fa-frown text-red-500 text-xl"></i>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <i className="far fa-meh text-orange-500 text-xl"></i>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <i className="far fa-smile text-yellow-500 text-xl"></i>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <i className="far fa-smile-beam text-green-500 text-xl"></i>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
            <i className="far fa-grin-hearts text-pink-500 text-xl"></i>
          </button>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Not great</span>
          <span>Great</span>
        </div>
      </div> */}
    </div>
  );
};

export default RightBar;

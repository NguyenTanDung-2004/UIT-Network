import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare } from "lucide-react";

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface GroupItem {
  id: string;
  name: string;
  icon?: string;
}

interface LeftBarProps {
  groups: GroupItem[];
}

const LeftBar: React.FC<LeftBarProps> = ({ groups }) => {
  const menuItems: MenuItem[] = [
    {
      id: "home",
      icon: <i className="fas fa-home"></i>,
      label: "Home",
      href: "/home",
    },
    {
      id: "profile",
      icon: <i className="fas fa-user"></i>,
      label: "Profile",
      href: "/profiles/me",
    },
    // {
    //   id: "favorites",
    //   icon: <i className="fas fa-star"></i>,
    //   label: "Favorites",
    //   href: "/favorites",
    // },
    {
      id: "chat",
      icon: <MessagesSquare className="w-4 h-4" strokeWidth={3} />,
      label: "Chat",
      href: "/chat",
    },
    {
      id: "friends",
      icon: <i className="fas fa-user-friends"></i>,
      label: "Friends",
      href: "/friends",
    },
    {
      id: "connect",
      icon: <i className="fas fa-globe"></i>,
      label: "Connect",
      href: "/connect",
    },
    {
      id: "notifications",
      icon: <i className="fas fa-bell"></i>,
      label: "Notifications",
      href: "/notifications",
    },
    // {
    //   id: "videos",
    //   icon: <i className="fas fa-video"></i>,
    //   label: "Videos",
    //   href: "/videos",
    // },
    {
      id: "helps",
      icon: <i className="fas fa-question-circle"></i>,
      label: "Helps",
      href: "/helps",
    },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-white pt-4 pb-20 border-r  dark:bg-gray-800 dark:border-gray-700">
      <div className="px-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              {item.id === "home" ? (
                // Nếu là "Home", dùng thẻ <a> thường để reload
                <a href={item.href}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors pl-4 dark:hover:bg-gray-700">
                    <div
                      className={`w-6 flex justify-center items-center text-gray-600 dark:text-gray-400`}
                    >
                      {item.icon}
                    </div>
                    <span className="ml-4 text-sm font-medium dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                </a>
              ) : (
                <Link href={item.href}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors pl-4 dark:hover:bg-gray-700">
                    <div
                      className={`w-6 flex justify-center items-center text-gray-600 dark:text-gray-400`}
                    >
                      {item.icon}
                    </div>
                    <span className="ml-4 text-sm font-medium dark:text-gray-300">
                      {item.label}
                    </span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 px-4">
        <h3 className="text-base font-semibold mb-2 dark:text-gray-200">
          Groups
        </h3>
        <ul>
          {groups.map((group) => (
            <li key={group.id} className="mb-1">
              <Link href={`/groups/${group.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center dark:bg-gray-700">
                    {group.icon ? (
                      <Image
                        src={group.icon}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-users text-blue-500 text-sm dark:text-gray-400"></i>
                    )}
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold dark:text-gray-300">
                    {group.name}
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

export default LeftBar;

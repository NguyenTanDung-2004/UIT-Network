import React from "react";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const LeftBar: React.FC = () => {
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
      id: "recommend",
      icon: <i className="fas fa-globe"></i>,
      label: "Recommend",
      href: "/recommend",
    },
    {
      id: "notifications",
      icon: <i className="fas fa-bell"></i>,
      label: "Notifications",
      href: "/notifications",
    },
    {
      id: "help",
      icon: <i className="fas fa-question-circle"></i>,
      label: "Help & Support",
      href: "/help",
    },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-white pt-4 pb-20 border-r dark:bg-gray-800 dark:border-gray-700">
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
          Create
        </h3>
        <div className="flex flex-col gap-2">
          <Link href="/create-group">
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
              <div className="w-6 flex justify-center items-center text-gray-600 dark:text-gray-400">
                <i className="fas fa-users"></i>
              </div>
              <span className="ml-4 text-sm font-medium dark:text-gray-300">
                Create Group
              </span>
            </div>
          </Link>
          <Link href="/create-page">
            <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
              <div className="w-6 flex justify-center items-center text-gray-600 dark:text-gray-400">
                <i className="fas fa-file-alt"></i>
              </div>
              <span className="ml-4 text-sm font-medium dark:text-gray-300">
                Create Page
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;

import React from "react";
import Link from "next/link";
import Image from "next/image";

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
  // Main menu items
  const menuItems: MenuItem[] = [
    {
      id: "home",
      icon: <i className="fas fa-home"></i>,
      label: "Home",
      href: "/",
    },
    {
      id: "profile",
      icon: <i className="fas fa-user"></i>,
      label: "Profile",
      href: "/profiles/me",
    },
    {
      id: "favorites",
      icon: <i className="fas fa-star"></i>,
      label: "Favorites",
      href: "/favorites",
    },
    {
      id: "messages",
      icon: (
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="dark:text-gray-400 "
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M19.4003 18C19.7837 17.2499 20 16.4002 20 15.5C20 12.4624 17.5376 10 14.5 10C11.4624 10 9 12.4624 9 15.5C9 18.5376 11.4624 21 14.5 21L21 21C21 21 20 20 19.4143 18.0292M18.85 12C18.9484 11.5153 19 11.0137 19 10.5C19 6.35786 15.6421 3 11.5 3C7.35786 3 4 6.35786 4 10.5C4 11.3766 4.15039 12.2181 4.42676 13C5.50098 16.0117 3 18 3 18H9.5"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-gray-300"
            ></path>
          </g>
        </svg>
      ),
      label: "Messages",
      href: "/messages",
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
    {
      id: "videos",
      icon: <i className="fas fa-video"></i>,
      label: "Videos",
      href: "/videos",
    },
    {
      id: "helps",
      icon: <i className="fas fa-question-circle"></i>,
      label: "Helps",
      href: "/helps",
    },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-white pt-4 pb-20 border-r  dark:bg-gray-800 dark:border-gray-700">
      {/* Main Menu */}
      <div className="px-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <Link href={item.href}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors pl-4 dark:hover:bg-gray-700">
                  <div className={`w-6 text-gray-600 dark:text-gray-400`}>
                    {item.icon}
                  </div>{" "}
                  {/* Sử dụng trực tiếp JSX */}
                  <span className="ml-4 text-sm font-medium dark:text-gray-300">
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Groups Section */}
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

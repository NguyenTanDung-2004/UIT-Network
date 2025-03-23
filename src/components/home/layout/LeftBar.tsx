import React from "react";
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  id: string;
  icon: string;
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
    { id: "home", icon: "fas fa-home", label: "Home", href: "/" },
    { id: "profile", icon: "fas fa-user", label: "Profile", href: "/profile" },
    {
      id: "favorites",
      icon: "fas fa-star",
      label: "Favorites",
      href: "/favorites",
    },
    {
      id: "messages",
      icon: "fas fa-envelope",
      label: "Messages",
      href: "/messages",
    },
    {
      id: "friends",
      icon: "fas fa-user-friends",
      label: "Friends",
      href: "/friends",
    },
    { id: "connect", icon: "fas fa-globe", label: "Connect", href: "/connect" },
    {
      id: "notifications",
      icon: "fas fa-bell",
      label: "Notifications",
      href: "/notifications",
    },
    { id: "videos", icon: "fas fa-video", label: "Videos", href: "/videos" },
    {
      id: "helps",
      icon: "fas fa-question-circle",
      label: "Helps",
      href: "/helps",
    },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto bg-white pt-4 pb-20 border-r">
      {/* Main Menu */}
      <div className="px-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <Link href={item.href}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors pl-4">
                  <i className={`${item.icon}  text-gray-600 w-6`}></i>
                  <span className="ml-4 text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Groups Section */}
      <div className="mt-4 px-4">
        <h3 className="text-base font-semibold mb-2">Groups</h3>
        <ul>
          {groups.map((group) => (
            <li key={group.id} className="mb-1">
              <Link href={`/groups/${group.id}`}>
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    {group.icon ? (
                      <Image
                        src={group.icon}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-users text-blue-500 text-sm"></i>
                    )}
                  </div>
                  <span className="ml-2 truncate text-sm font-semibold">
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

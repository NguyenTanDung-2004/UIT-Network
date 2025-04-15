"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRoundCog, UserPlus, Users, UserCheck } from "lucide-react";

const sidebarItems = [
  { name: "Home", href: "/friends", icon: Users },
  { name: "Friend Requests", href: "/friends/requests", icon: UserPlus },
  { name: "Suggestions", href: "/friends/suggestions", icon: UserRoundCog },
  { name: "All Friends", href: "/friends/all", icon: UserCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100 px-4">
        Friends
      </h2>
      {/* Consistent spacing */}
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-150 ease-in-out ${
                isActive
                  ? "bg-primary/10"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <div
                className={`flex-shrink-0 mr-4 p-2 rounded-full transition-colors duration-150 ease-in-out ${
                  isActive
                    ? "bg-primary"
                    : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`flex-1 font-semibold ${
                  isActive
                    ? "text-primary dark:text-primary"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

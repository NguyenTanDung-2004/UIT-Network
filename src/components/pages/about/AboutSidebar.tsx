"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Phone, Heart } from "lucide-react";

const sidebarItems = [
  {
    id: "contact",
    name: "Contact and Basic Info",
    icon: Phone,
  },
  {
    id: "page-transparency",
    name: "Page Transparency",
    icon: Heart,
    hrefSuffix: "page-transparency",
  },
];

const AboutSidebar: React.FC = ({}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "contact";

  return (
    <div className="w-full sm:w-64 md:w-80 lg:w-96 flex-shrink-0 p-6">
      <h3 className="text-xl font-bold mb-4 text-black dark:text-gray-100">
        About
      </h3>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const href = item.hrefSuffix
            ? `${pathname}?tab=${item.hrefSuffix}`
            : pathname;

          return (
            <Link
              href={href}
              key={item.id}
              scroll={false}
              className={`group flex items-center w-full px-3 py-2.5 rounded-lg text-base font-medium text-left transition-colors duration-150 ease-in-out ${
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
                className={`flex-1 font-semibold text-start ${
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
};

export default AboutSidebar;

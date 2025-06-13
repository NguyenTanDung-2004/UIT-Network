"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ReactNode, use } from "react";

interface GroupManageLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}
const GroupManageLayout: React.FC<GroupManageLayoutProps> = ({
  children,
  params: paramsPromise,
}) => {
  const resolvedParams = React.use(paramsPromise);
  const groupId = resolvedParams.id;
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Info", href: `/create-group/manage/${groupId}/info` },
    { label: "Members", href: `/create-group/manage/${groupId}/members` },
    { label: "Posts", href: `/create-group/manage/${groupId}/posts` },
  ];

  return (
    <div className="w-full min-h-screen overflow-y-auto py-8 bg-gray-50 dark:bg-gray-900 ">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 md:p-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-grow truncate">
            Manage Group: {groupId}
          </h1>
          <button
            onClick={() => router.push("/create-group/manage")}
            className="px-3 py-1 text-sm font-medium rounded-md transition-colors bg-primaryLight  text-primary  hover:bg-primary/30 flex-shrink-0 dark:bg-primary/30 dark:text-white dark:hover:bg-primary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2 text-sm font-medium ${
                    pathname === link.href
                      ? "border-b-2 border-primary text-primary dark:border-primary-light dark:text-primary-light"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default GroupManageLayout;

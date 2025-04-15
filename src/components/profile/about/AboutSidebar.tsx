import React from "react";
import { User, Phone, Heart, Briefcase } from "lucide-react";

interface AboutSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "overview", name: "Overview", icon: User },
  { id: "contact", name: "Contact and Basic Info", icon: Phone },
  { id: "hobbies", name: "Hobbies and Interests", icon: Heart },
  { id: "education", name: "Education and Work", icon: Briefcase },
];

const AboutSidebar: React.FC<AboutSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full sm:w-64 md:w-80 lg:w-96 flex-shrink-0 p-4">
      <h3 className="text-xl font-bold mb-4 text-black dark:text-gray-100">
        About
      </h3>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`w-full group flex gap-4 items-center justify-start px-3 py-2.5 rounded-lg text-base font-medium transition-colors duration-150 ease-in-out ${
                isActive
                  ? "bg-primary/10"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => onTabChange(item.id)}
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
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AboutSidebar;

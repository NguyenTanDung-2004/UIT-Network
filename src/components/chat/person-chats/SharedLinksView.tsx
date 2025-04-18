import React from "react";
import { SharedLinkItem } from "@/types/chats/ChatData";
import { ArrowLeft, Link, LinkIcon } from "lucide-react";

interface SharedLinksViewProps {
  linksList: SharedLinkItem[];
  onBack: () => void;
}

const SharedLinksView: React.FC<SharedLinksViewProps> = ({
  linksList,
  onBack,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0">
        <button
          onClick={onBack}
          className="mr-3 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to details"
        >
          <ArrowLeft size={20} />
        </button>

        <h3 className="text-lg font-bold text-black dark:text-gray-100">
          Shared Links ({linksList.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {linksList.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 mb-2 transition-colors"
            title={`Open link: ${link.url}`}
          >
            <div className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full flex-shrink-0">
              <LinkIcon
                size={18}
                className="text-gray-600 dark:text-gray-400"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {link.title || link.url}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {link.domain || new URL(link.url).hostname.replace("www.", "")}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SharedLinksView;

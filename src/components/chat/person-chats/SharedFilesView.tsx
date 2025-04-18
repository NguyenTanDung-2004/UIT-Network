import React from "react";
import { ArrowLeft } from "lucide-react";
import { SharedFileItem } from "@/types/chats/ChatData";
import { getFileIcon, formatFileSize } from "@/utils/ViewFilesUtils";

interface SharedFilesViewProps {
  filesList: SharedFileItem[];
  onBack: () => void;
}

const SharedFilesView: React.FC<SharedFilesViewProps> = ({
  filesList,
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
          Shared Files ({filesList.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {filesList.map((file) => (
          <a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 mb-2 transition-colors"
            title={`Open ${file.name}`}
          >
            <div className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full flex-shrink-0">
              <img
                src={getFileIcon(file.type)}
                alt="file icon"
                className="w-5 h-5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
export default SharedFilesView;

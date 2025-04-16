import React from "react";

export type FileTypeFilter = "all" | "pdf" | "docx" | "other";

interface FileFilterProps {
  activeFilter: FileTypeFilter;
  onFilterChange: (filter: FileTypeFilter) => void;
}

const filters: { label: string; value: FileTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Documents", value: "docx" }, // Combine doc/docx for simplicity
  { label: "Other", value: "other" },
];

const FileFilter: React.FC<FileFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-150 focus:outline-none ${
            activeFilter === filter.value
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FileFilter;

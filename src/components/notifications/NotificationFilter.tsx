import React from "react";

export type NotificationFilterType = "all" | "unread" | "read";

interface NotificationFilterProps {
  activeFilter: NotificationFilterType;
  onFilterChange: (filter: NotificationFilterType) => void;
}

const filters: { label: string; value: NotificationFilterType }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

const NotificationFilter: React.FC<NotificationFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-150 focus:outline-none ${
            activeFilter === filter.value
              ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default NotificationFilter;

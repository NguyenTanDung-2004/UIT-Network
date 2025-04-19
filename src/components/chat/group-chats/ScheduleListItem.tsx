import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoreHorizontal, Calendar, Clock, Eye, Trash2 } from "lucide-react";

export interface ScheduleItemData {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
}

interface ScheduleListItemProps {
  schedule: ScheduleItemData;
  onViewDetails: (schedule: ScheduleItemData) => void;
  onDelete: (scheduleId: string, scheduleTitle: string) => void;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
};

const ScheduleListItem: React.FC<ScheduleListItemProps> = ({
  schedule,
  onViewDetails,
  onDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showOptions &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(false);
    onViewDetails(schedule);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(false);
    onDelete(schedule.id, schedule.title);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group">
      <div className="flex items-center min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 flex-shrink-0">
          <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black dark:text-gray-100 truncate">
            {schedule.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(schedule.date)}, {schedule.startTime} -{" "}
            {schedule.endTime}
          </p>
        </div>
      </div>
      <div className="relative ml-2">
        {/* Assume everyone can view/delete for now, add permission checks later */}
        <button
          ref={buttonRef}
          onClick={() => setShowOptions(!showOptions)}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={20} />
        </button>

        {showOptions && (
          <div
            ref={optionsRef}
            className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10 py-1"
          >
            <button
              onClick={handleViewClick}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
            >
              <Eye size={14} className="mr-2" /> View details
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
            >
              <Trash2 size={14} className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleListItem;

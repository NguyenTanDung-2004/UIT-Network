import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Calendar,
  Clock,
  Eye,
  Trash2,
  User,
  CheckCircle,
  Circle,
  HardHat,
} from "lucide-react";
import {
  BackendWorksheetItemWithFrontendFields,
  parseUserIds,
  getWorkStatusString,
} from "@/services/workSheetService";
import { Friend } from "@/types/profile/FriendData";

interface ScheduleListItemProps {
  schedule: BackendWorksheetItemWithFrontendFields;
  userMap: Map<string, Friend>;
  onViewDetails: (schedule: BackendWorksheetItemWithFrontendFields) => void;
  onDelete: (scheduleId: string, scheduleTitle: string) => void;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const formatDateTimeDisplay = (isoString: string | null): string => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const renderWorkStatusIcon = (status: "Done" | "Doing" | "Todo" | "N/A") => {
  switch (status) {
    case "Done":
      return <CheckCircle size={16} className="text-green-500" />;
    case "Doing":
      return <HardHat size={16} className="text-blue-500" />;
    case "Todo":
      return <Circle size={16} className="text-gray-400" />;
    default:
      return null;
  }
};

const ScheduleListItem: React.FC<ScheduleListItemProps> = ({
  schedule,
  userMap,
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
    onDelete(schedule.id, schedule.name || "Untitled");
  };

  const fromDateDisplay = formatDateTimeDisplay(schedule.fromdate);
  const toDateDisplay = formatDateTimeDisplay(schedule.todate);
  const workStatus = schedule.workStatus;
  const assignedToNames = (schedule.assignedTo || [])
    .map((a) => a.name)
    .join(", ");

  const isSubSchedule = schedule.isparent === 2;

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group ${
        isSubSchedule
          ? "ml-6 border-l border-gray-200 dark:border-gray-600"
          : ""
      }`}
    >
      <div className="flex items-center min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 flex-shrink-0">
          <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black dark:text-gray-100 truncate">
            {schedule.name}
          </p>
          {schedule.content && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Content: {schedule.content}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            From: {fromDateDisplay}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            To: {toDateDisplay}
          </p>
          {workStatus && workStatus !== "N/A" && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
              {renderWorkStatusIcon(workStatus)}
              <span className="ml-1">{workStatus}</span>
            </p>
          )}
          {assignedToNames && assignedToNames.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
              <User size={14} className="mr-1" />
              Assigned: {assignedToNames}
            </p>
          )}
        </div>
      </div>
      <div className="relative ml-2">
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

import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import ScheduleListItem, { ScheduleItemData } from "./ScheduleListItem";

interface SchedulesViewProps {
  schedules: ScheduleItemData[];
  onBack: () => void;
  onCreateSchedule: () => void;
  onViewScheduleDetails: (schedule: ScheduleItemData) => void;
  onDeleteSchedule: (scheduleId: string, scheduleTitle: string) => void;
}

const SchedulesView: React.FC<SchedulesViewProps> = ({
  schedules,
  onBack,
  onCreateSchedule,
  onViewScheduleDetails,
  onDeleteSchedule,
}) => {
  const canCreate = true;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <button
          onClick={onBack}
          className="mr-3 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to details"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          Schedule ({schedules.length})
        </h3>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {/* Create Button */}

        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <ScheduleListItem
              key={schedule.id}
              schedule={schedule}
              onViewDetails={onViewScheduleDetails}
              onDelete={onDeleteSchedule}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
            No schedules created yet.
          </p>
        )}

        {canCreate && (
          <button
            onClick={onCreateSchedule}
            className="flex items-center w-full py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg text-left mb-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-pink-100 hover:bg-opacity-80 dark:bg-primary flex items-center justify-center mr-3">
              <Plus className="text-primary dark:text-white" size={20} />
            </div>
            <span className="text-sm font-medium text-black dark:text-pink-400">
              Create a Schedule
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SchedulesView;

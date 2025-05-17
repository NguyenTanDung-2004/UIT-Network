import React, { useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { ProfileAboutData } from "@/types/profile/AboutData";
import EditScheduleModal from "./edit/EditScheduleModal";

type ScheduleSlot = { from: number; to: number };

interface ScheduleContentProps {
  data: { [key: string]: ScheduleSlot[] };
  isOwnProfile: boolean;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  data,
  isOwnProfile,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState(data);

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (updatedSchedule: {
    [key: string]: ScheduleSlot[];
  }) => {
    setSchedule(updatedSchedule);
    console.log("Updated schedule:", updatedSchedule);
    // TODO: Gọi API để lưu lịch vào backend
    // Ví dụ: await fetch('/api/profile/schedule', { method: 'PUT', body: JSON.stringify(updatedSchedule) });
  };

  return (
    <div className="space-y-6 min-h-[400px]">
      <div className="relative group">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Below is the weekly schedule showing available time slots for study or
          collaboration.
        </p>
        {isOwnProfile && (
          <button
            onClick={handleOpenModal}
            className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil size={16} />
          </button>
        )}
        {!isOwnProfile && (
          <button className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayKey =
            day.toLowerCase() as keyof ProfileAboutData["schedule"];
          const slots = schedule?.[dayKey] ?? [];
          return (
            <div
              key={day}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {day}
              </h4>
              {slots.length > 0 ? (
                <ul className="space-y-1">
                  {slots.map((slot, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {formatTime(slot.from)} - {formatTime(slot.to)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No available slots
                </p>
              )}
            </div>
          );
        })}
      </div>

      <EditScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schedule={schedule}
        onSave={handleSaveSchedule}
      />
    </div>
  );
};

export default ScheduleContent;

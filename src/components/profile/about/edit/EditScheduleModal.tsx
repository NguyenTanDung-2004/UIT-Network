import React, { useState } from "react";
import { X } from "lucide-react";

type ScheduleSlot = { from: number; to: number };
type ScheduleData = { [key: string]: ScheduleSlot[] };

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleData;
  onSave: (updatedSchedule: ScheduleData) => void;
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

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSave,
}) => {
  const [localSchedule, setLocalSchedule] = useState<ScheduleData>({
    ...schedule,
  });

  const addSlot = (day: string) => {
    const dayKey = day.toLowerCase();
    setLocalSchedule((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), { from: 9.0, to: 10.0 }],
    }));
  };

  const updateSlot = (
    day: string,
    index: number,
    field: "from" | "to",
    value: number
  ) => {
    const dayKey = day.toLowerCase();
    setLocalSchedule((prev) => {
      const newSlots = [...(prev[dayKey] || [])];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, [dayKey]: newSlots };
    });
  };

  const deleteSlot = (day: string, index: number) => {
    const dayKey = day.toLowerCase();
    setLocalSchedule((prev) => {
      const newSlots = [...(prev[dayKey] || [])].filter((_, i) => i !== index);
      return { ...prev, [dayKey]: newSlots };
    });
  };

  const handleSave = () => {
    onSave(localSchedule);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Edit Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {DAYS_OF_WEEK.map((day) => {
            const dayKey = day.toLowerCase();
            const slots = localSchedule[dayKey] || [];
            return (
              <div key={day} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {day}
                  </h3>
                  <button
                    onClick={() => addSlot(day)}
                    className="text-sm text-primary hover:text-primary/80 dark:text-primary-dark dark:hover:text-primary-dark/80"
                  >
                    + Add Slot
                  </button>
                </div>
                {slots.length > 0 ? (
                  <div className="space-y-2">
                    {slots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={formatTime(slot.from)}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            updateSlot(
                              day,
                              index,
                              "from",
                              hours + minutes / 60
                            );
                          }}
                          className="p-1 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                          -
                        </span>
                        <input
                          type="time"
                          value={formatTime(slot.to)}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            updateSlot(day, index, "to", hours + minutes / 60);
                          }}
                          className="p-1 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <button
                          onClick={() => deleteSlot(day, index)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No slots added
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary dark:bg-primary-dark rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export default EditScheduleModal;

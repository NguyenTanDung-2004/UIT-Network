import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

export interface ScheduleItemData {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: Date;
  location?: string;
  attendees?: "all" | string[];
}

type ScheduleModalMode = "create" | "view";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ScheduleModalMode;
  initialData?: ScheduleItemData | null;
  onSubmit: (data: Omit<ScheduleItemData, "id">) => Promise<void>;
  onDelete?: (scheduleId: string) => Promise<void>;
  groupMembers?: { id: string; name: string }[];
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
  onDelete,
  groupMembers = [],
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("21:00 - 22:00");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [attendeeSelection, setAttendeeSelection] = useState<string>("all"); // 'all' or specific member IDs (not implemented fully here)
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === "view" && initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || "");
        setTime(`${initialData.startTime} - ${initialData.endTime}`);
        const isoDate =
          initialData.date instanceof Date
            ? initialData.date.toISOString().split("T")[0]
            : "";
        setDate(isoDate);
        setLocation(initialData.location || "");
        setAttendeeSelection(
          initialData.attendees === "all" || !initialData.attendees
            ? "all"
            : "specific"
        );
      } else if (mode === "create") {
        setTitle("");
        setDescription("");
        setTime("21:00 - 22:00");
        setDate(new Date().toISOString().split("T")[0]);
        setLocation("");
        setAttendeeSelection("all");
      }
    } else {
      setIsProcessing(false);
    }
  }, [isOpen, mode, initialData]);

  const isValidTimeRange = (timeStr: string): boolean => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== "create") return;

    if (!title || !date || !time) {
      alert("Please fill in Title, Date, and Time.");
      return;
    }
    if (!isValidTimeRange(time)) {
      alert(
        "Invalid time format. Please use HH:MM - HH:MM (e.g., 14:00 - 15:00)."
      );
      return;
    }

    setIsProcessing(true);
    try {
      const [startTime, endTime] = time.split(" - ").map((t) => t.trim());
      const scheduleData: Omit<ScheduleItemData, "id"> = {
        title,
        description: description || undefined,
        startTime,
        endTime,
        date: new Date(date + "T00:00:00"),
        location: location || undefined,

        attendees: attendeeSelection === "all" ? "all" : [],
      };
      await onSubmit(scheduleData);
      onClose();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      alert("Failed to create schedule.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "view" || !initialData || !onDelete) return;

    setIsProcessing(true);
    try {
      await onDelete(initialData.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert("Failed to delete schedule.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg p-1 min-w-[500px] max-w-md shadow-xl relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {isViewMode ? "Schedule Details" : "Create a schedule"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={!isViewMode}
              disabled={isViewMode}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isViewMode}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 resize-none disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="time"
                className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
              >
                Time
              </label>
              <input
                type="text"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required={!isViewMode}
                placeholder="e.g., 14:00 - 15:00"
                disabled={isViewMode}
                className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required={!isViewMode}
                disabled={isViewMode}
                className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Google Meet link or Room name"
              disabled={isViewMode}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="attendees"
              className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
            >
              Attendees
            </label>
            <select
              id="attendees"
              value={attendeeSelection}
              onChange={(e) => setAttendeeSelection(e.target.value)}
              disabled={isViewMode}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
            >
              <option value="all">All members</option>
              {/* <option value="specific" disabled={isViewMode}>Specific members...</option> */}
            </select>
          </div>
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-3">
          {!isViewMode && (
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          {isViewMode && onDelete && (
            <button
              type="button"
              onClick={handleDelete} // Consider adding confirmation before calling handleDelete
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 flex items-center"
            >
              {isProcessing ? (
                <ClipLoader size={16} color="#FF69B4" className="mr-2" />
              ) : (
                <Trash2 size={16} className="mr-1.5" />
              )}
              Delete
            </button>
          )}
          {!isViewMode && (
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 flex items-center"
            >
              {isProcessing && (
                <ClipLoader size={16} color="#FF69B4" className="mr-2" />
              )}
              Create
            </button>
          )}
          {isViewMode && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Close
            </button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ScheduleModal;

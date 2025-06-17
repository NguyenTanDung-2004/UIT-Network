import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Trash2,
  Calendar,
  Users,
  Plus,
  Edit, // Giữ lại Edit icon vì nó vẫn được dùng để chuyển đổi chế độ UI
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  BackendWorksheetItemWithFrontendFields,
  getWorksheetDetails,
  parseUserIds,
  getWorkStatusString,
  CreateWorksheetRequestBody,
  BackendWorksheetTask,
  // Removed UpdateParentWorksheetRequestBody, UpdateChildWorksheetRequestBody imports here
  // as they are passed directly to onUpdateSubmit from GroupChat
} from "@/services/workSheetService";
import { Friend } from "@/types/profile/FriendData";

interface GroupMemberInfo {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

type ScheduleModalMode = "create" | "view";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ScheduleModalMode;
  initialData?: BackendWorksheetItemWithFrontendFields | null;
  onCreateSubmit: (data: CreateWorksheetRequestBody) => Promise<void>;
  onUpdateSubmit?: (
    // New prop for update submission
    updatedParentData: {
      id: string;
      name: string | null;
      fromdate: string | null;
      todate: string | null;
      content: string | null;
      userids: string | null;
      workstatus: number | null;
    },
    updatedChildrenData: BackendWorksheetItemWithFrontendFields[]
  ) => Promise<void>;
  onDelete?: (scheduleId: string, scheduleTitle: string) => Promise<void>;
  groupMembers?: GroupMemberInfo[];
  groupId: string;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onCreateSubmit,
  onUpdateSubmit,
  onDelete,
  groupMembers = [],
  groupId,
}) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");
  const [attendeeSelection, setAttendeeSelection] = useState<"all" | string[]>(
    "all"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [workStatus, setWorkStatus] = useState<
    "Done" | "Doing" | "Todo" | "N/A"
  >("N/A");

  const [newSubTasks, setNewSubTasks] = useState<BackendWorksheetTask[]>([]); // For new subtasks in create mode
  const [editableSubtasks, setEditableSubtasks] = useState<
    // For existing subtasks in view/edit mode
    BackendWorksheetItemWithFrontendFields[]
  >([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailUserMap, setDetailUserMap] = useState<Map<string, Friend>>(
    new Map()
  );
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode within "view" mode

  const formatForDatetimeLocal = useCallback(
    (isoString: string | null): string => {
      if (!isoString) return "";
      try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch {
        return "";
      }
    },
    []
  );

  const initializeFormData = useCallback(
    (data?: BackendWorksheetItemWithFrontendFields | null) => {
      setName(data?.name || "");
      setContent(data?.content || "");

      setFromDateInput(formatForDatetimeLocal(data?.fromdate ?? null));
      setToDateInput(formatForDatetimeLocal(data?.todate ?? null));
      setAttendeeSelection(data?.userids ? parseUserIds(data.userids) : "all");
      setWorkStatus(getWorkStatusString(data?.workstatus ?? null));
      setNewSubTasks([]); // Clear new subtasks when initializing
      setEditableSubtasks(data?.subSchedules || []);
    },
    [formatForDatetimeLocal]
  );

  useEffect(() => {
    if (isOpen) {
      if (mode === "view" && initialData) {
        initializeFormData(initialData);
        setIsEditing(false); // Start in view mode

        setIsLoadingDetails(true);
        getWorksheetDetails(initialData.id)
          .then(({ worksheet: fullWorksheet, userMap }) => {
            if (fullWorksheet) {
              initializeFormData(fullWorksheet); // Re-initialize with full details
              setEditableSubtasks(fullWorksheet.subSchedules || []); // Set editable subtasks from full data
              setDetailUserMap(userMap);
            }
          })
          .catch((err) =>
            console.error("Failed to fetch worksheet details:", err)
          )
          .finally(() => setIsLoadingDetails(false));
      } else if (mode === "create") {
        initializeFormData(null);
        setIsEditing(true); // Always editable in create mode
      }
    } else {
      setIsProcessing(false);
      setIsLoadingDetails(false);
      setIsEditing(false);
    }
  }, [isOpen, mode, initialData, initializeFormData]);

  const handleAddSubTask = () => {
    const now = new Date();
    const future = new Date(now.getTime() + 60 * 60 * 1000);
    const formatDefaultDatetime = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setNewSubTasks((prev) => [
      ...prev,
      {
        fromdate: formatDefaultDatetime(now),
        todate: formatDefaultDatetime(future),
        content: "",
        workstatus: null,
        userids: null,
      },
    ]);
  };

  const handleUpdateNewSubTask = (index: number, field: string, value: any) => {
    setNewSubTasks((prev) =>
      prev.map((task, i) =>
        i === index
          ? {
              ...task,
              [field]:
                field === "userids"
                  ? value === "all"
                    ? null
                    : JSON.stringify(value)
                  : field === "workstatus"
                  ? value === "N/A"
                    ? null
                    : value === "Done"
                    ? 1
                    : value === "Doing"
                    ? 2
                    : 3
                  : value,
            }
          : task
      )
    );
  };

  const handleRemoveNewSubTask = (index: number) => {
    setNewSubTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExistingSubtask = (
    index: number,
    field: string,
    value: any
  ) => {
    setEditableSubtasks((prev) =>
      prev.map((task, i) => {
        if (i === index) {
          let updatedValue = value;
          if (field === "userids") {
            updatedValue = value === "all" ? null : JSON.stringify(value);
          } else if (field === "workstatus") {
            updatedValue =
              value === "N/A"
                ? null
                : value === "Done"
                ? 1
                : value === "Doing"
                ? 2
                : 3;
          }
          return {
            ...task,
            [field]: updatedValue,
          };
        }
        return task;
      })
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== "create") return;

    if (!name || !fromDateInput || !toDateInput) {
      alert(
        "Please fill in Worksheet Name, From Date & Time, and To Date & Time."
      );
      return;
    }

    setIsProcessing(true);
    try {
      const scheduleData: CreateWorksheetRequestBody = {
        groupid: groupId,
        name: name,
        content: content || null,
        fromdate: fromDateInput ? new Date(fromDateInput).toISOString() : null,
        todate: toDateInput ? new Date(toDateInput).toISOString() : null,
        userids:
          attendeeSelection === "all"
            ? null
            : JSON.stringify(attendeeSelection),
        isparent: 1,
        workstatus:
          workStatus === "N/A"
            ? null
            : workStatus === "Done"
            ? 1
            : workStatus === "Doing"
            ? 2
            : 3,
        worksinsheet: newSubTasks.map((task) => ({
          ...task,
          fromdate: task.fromdate
            ? new Date(task.fromdate).toISOString()
            : null,
          todate: task.todate ? new Date(task.todate).toISOString() : null,
        })),
      };
      await onCreateSubmit(scheduleData);
      onClose();
    } catch (error) {
      console.error("Failed to create worksheet:", error);
      alert("Failed to create worksheet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateClick = async () => {
    if (!initialData || !onUpdateSubmit) return; // Use onUpdateSubmit prop
    setIsProcessing(true);
    try {
      const updatedParentData = {
        id: initialData.id,
        name: name,
        fromdate: fromDateInput ? new Date(fromDateInput).toISOString() : null,
        todate: toDateInput ? new Date(toDateInput).toISOString() : null,
        content: content || null,
        userids:
          attendeeSelection === "all"
            ? null
            : JSON.stringify(attendeeSelection),
        workstatus:
          workStatus === "N/A"
            ? null
            : workStatus === "Done"
            ? 1
            : workStatus === "Doing"
            ? 2
            : 3,
      };

      await onUpdateSubmit(updatedParentData, editableSubtasks);
      setIsEditing(false); // Exit edit mode after successful update
      onClose();
    } catch (error) {
      console.error("Failed to update worksheet:", error);
      alert("Failed to update worksheet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    initializeFormData(initialData); // Revert changes
    // Re-fetch details to ensure the data is fresh if initialData was incomplete
    if (initialData) {
      setIsLoadingDetails(true);
      getWorksheetDetails(initialData.id)
        .then(({ worksheet: fullWorksheet, userMap }) => {
          if (fullWorksheet) {
            initializeFormData(fullWorksheet);
            setEditableSubtasks(fullWorksheet.subSchedules || []);
            setDetailUserMap(userMap);
          }
        })
        .catch((err) =>
          console.error("Failed to re-fetch worksheet details:", err)
        )
        .finally(() => setIsLoadingDetails(false));
    }
  };

  const handleDelete = async () => {
    if (mode !== "view" || !initialData || !onDelete) return;

    setIsProcessing(true);
    try {
      await onDelete(initialData.id, initialData.name || "Untitled");
      onClose();
    } catch (error) {
      console.error("Failed to delete worksheet:", error);
      alert("Failed to delete worksheet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderWorkStatusSelect = (
    currentStatus: "Done" | "Doing" | "Todo" | "N/A",
    isDisabled: boolean,
    onChangeHandler: (value: "Done" | "Doing" | "Todo" | "N/A") => void
  ) => {
    return (
      <select
        value={currentStatus || "N/A"}
        onChange={(e) =>
          onChangeHandler(e.target.value as "Done" | "Doing" | "Todo" | "N/A")
        }
        disabled={isDisabled}
        className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
      >
        <option value="N/A">Not Set</option>
        <option value="Todo">Todo</option>
        <option value="Doing">Doing</option>
        <option value="Done">Done</option>
      </select>
    );
  };

  const renderAttendeesSelect = (
    currentSelection: "all" | string[] | undefined,
    isDisabled: boolean,
    onChangeHandler: (value: "all" | string[]) => void
  ) => {
    const selectedValue =
      Array.isArray(currentSelection) && currentSelection.length > 0
        ? "specific"
        : "all";

    return (
      <select
        value={selectedValue}
        onChange={(e) => {
          const val = e.target.value;
          onChangeHandler(val === "all" ? "all" : []);
        }}
        disabled={isDisabled}
        className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
      >
        <option value="all">All members</option>
        <option value="specific">Specific members...</option>
      </select>
    );
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const formDisabled = isViewMode && !isEditing;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={isEditing ? (e) => e.preventDefault() : handleCreateSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg p-1 min-w-[500px] max-w-md shadow-xl relative max-h-[600px] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {isViewMode
              ? isEditing
                ? "Edit Worksheet"
                : "Worksheet Details"
              : "Create a Worksheet"}
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

        {isLoadingDetails ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#FF69B4" size={30} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
              >
                Worksheet Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!formDisabled}
                disabled={formDisabled}
                className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
              />
            </div>
            {/* <div>
              <label
                htmlFor="content"
                className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                disabled={formDisabled}
                className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 resize-none disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
              />
            </div> */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fromdate"
                  className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
                >
                  From Date & Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="fromdate"
                    value={fromDateInput}
                    onChange={(e) => setFromDateInput(e.target.value)}
                    required={!formDisabled}
                    disabled={formDisabled}
                    className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="todate"
                  className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
                >
                  To Date & Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="todate"
                    value={toDateInput}
                    onChange={(e) => setToDateInput(e.target.value)}
                    required={!formDisabled}
                    disabled={formDisabled}
                    className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="attendees"
                className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
              >
                Attendees
              </label>
              <div className="relative">
                {renderAttendeesSelect(attendeeSelection, formDisabled, (val) =>
                  setAttendeeSelection(val)
                )}
                <Users
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {attendeeSelection !== "all" &&
                Array.isArray(attendeeSelection) &&
                attendeeSelection.length === 0 &&
                !formDisabled && (
                  <p className="text-xs text-red-500 mt-1">
                    Select at least one member or choose "All members".
                  </p>
                )}
              {isViewMode &&
                !isEditing &&
                initialData?.userids &&
                initialData.userids !== null && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {parseUserIds(initialData.userids).map((attendeeId) => {
                      const member = groupMembers?.find(
                        (m) => m.id === attendeeId
                      );
                      return member ? (
                        <span
                          key={member.id}
                          className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1"
                        >
                          {member.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
            </div>
            <div>
              <label
                htmlFor="workstatus"
                className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase"
              >
                Work Status
              </label>
              {renderWorkStatusSelect(
                getWorkStatusString(
                  workStatus === "N/A"
                    ? null
                    : workStatus === "Done"
                    ? 1
                    : workStatus === "Doing"
                    ? 2
                    : 3
                ),
                formDisabled,
                (val) => setWorkStatus(val)
              )}
            </div>

            {/* Display/Edit existing Sub-Tasks */}
            {isViewMode && initialData && (
              <>
                {initialData.createdbyuserid &&
                  detailUserMap.get(initialData.createdbyuserid) && (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1 uppercase">
                        Created By
                      </label>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={
                            detailUserMap.get(initialData.createdbyuserid)
                              ?.avatar || DEFAULT_AVATAR
                          }
                          alt={
                            detailUserMap.get(initialData.createdbyuserid)
                              ?.name || "Unknown"
                          }
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {detailUserMap.get(initialData.createdbyuserid)
                            ?.name || "Unknown User"}
                        </span>
                      </div>
                    </div>
                  )}
                {editableSubtasks && editableSubtasks.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase">
                      Sub-Tasks ({editableSubtasks.length})
                    </h4>
                    <div className="space-y-2">
                      {editableSubtasks.map((sub, index) => (
                        <div
                          key={sub.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-md p-3 relative ml-6"
                        >
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                                Content
                              </label>
                              <textarea
                                value={sub.content || ""}
                                onChange={(e) =>
                                  handleUpdateExistingSubtask(
                                    index,
                                    "content",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                disabled={formDisabled}
                                className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 resize-none disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                                  From
                                </label>
                                <input
                                  type="datetime-local"
                                  value={formatForDatetimeLocal(sub.fromdate)}
                                  onChange={(e) =>
                                    handleUpdateExistingSubtask(
                                      index,
                                      "fromdate",
                                      e.target.value
                                    )
                                  }
                                  disabled={formDisabled}
                                  className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                                  To
                                </label>
                                <input
                                  type="datetime-local"
                                  value={formatForDatetimeLocal(sub.todate)}
                                  onChange={(e) =>
                                    handleUpdateExistingSubtask(
                                      index,
                                      "todate",
                                      e.target.value
                                    )
                                  }
                                  disabled={formDisabled}
                                  className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                                Assigned To
                              </label>
                              {renderAttendeesSelect(
                                sub.userids ? parseUserIds(sub.userids) : "all",
                                formDisabled,
                                (val) =>
                                  handleUpdateExistingSubtask(
                                    index,
                                    "userids",
                                    val
                                  )
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                                Work Status
                              </label>
                              {renderWorkStatusSelect(
                                getWorkStatusString(sub.workstatus),
                                formDisabled,
                                (val) =>
                                  handleUpdateExistingSubtask(
                                    index,
                                    "workstatus",
                                    val
                                  )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Add new Sub-Tasks (only in create mode) */}
            {!isViewMode && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2 uppercase">
                  Sub-Tasks ({newSubTasks.length})
                  <button
                    type="button"
                    onClick={handleAddSubTask}
                    className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                    title="Add new sub-task"
                  >
                    <Plus size={16} />
                  </button>
                </h4>
                <div className="space-y-3">
                  {newSubTasks.map((task, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveNewSubTask(index)}
                        className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                        title="Remove sub-task"
                      >
                        <X size={14} />
                      </button>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                            Content
                          </label>
                          <textarea
                            value={task.content || ""}
                            onChange={(e) =>
                              handleUpdateNewSubTask(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                              From
                            </label>
                            <input
                              type="datetime-local"
                              value={task.fromdate || ""}
                              onChange={(e) =>
                                handleUpdateNewSubTask(
                                  index,
                                  "fromdate",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                              To
                            </label>
                            <input
                              type="datetime-local"
                              value={task.todate || ""}
                              onChange={(e) =>
                                handleUpdateNewSubTask(
                                  index,
                                  "todate",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                            Assigned To
                          </label>
                          {renderAttendeesSelect(
                            task.userids ? parseUserIds(task.userids) : "all",
                            false,
                            (val) =>
                              handleUpdateNewSubTask(index, "userids", val)
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#A09FB0] dark:text-gray-300 mb-1">
                            Work Status
                          </label>
                          {renderWorkStatusSelect(
                            getWorkStatusString(task.workstatus),
                            false,
                            (val) =>
                              handleUpdateNewSubTask(index, "workstatus", val)
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-3">
          {isViewMode ? (
            <>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateClick}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 flex items-center"
                  >
                    {isProcessing && (
                      <ClipLoader size={16} color="#FF69B4" className="mr-2" />
                    )}
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 flex items-center"
                  >
                    <Edit size={16} className="mr-1.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
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
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                // type="submit"
                disabled={isProcessing}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 flex items-center"
              >
                {isProcessing && (
                  <ClipLoader size={16} color="#FF69B4" className="mr-2" />
                )}
                Create
              </button>
            </>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ScheduleModal;

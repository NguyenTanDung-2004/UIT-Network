import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import ScheduleListItem from "./ScheduleListItem";
import {
  getWorksheetsByGroupId,
  BackendWorksheetItemWithFrontendFields,
} from "@/services/workSheetService";
import { Friend } from "@/types/profile/FriendData";
import { useUser } from "@/contexts/UserContext";
import { ClipLoader } from "react-spinners";

interface SchedulesViewProps {
  groupId: string;
  onBack: () => void;
  onCreateSchedule: () => void;
  onViewScheduleDetails: (
    schedule: BackendWorksheetItemWithFrontendFields
  ) => void;
  onDeleteSchedule: (scheduleId: string, scheduleTitle: string) => void;
}

const SchedulesView: React.FC<SchedulesViewProps> = ({
  groupId,
  onBack,
  onCreateSchedule,
  onViewScheduleDetails,
  onDeleteSchedule,
}) => {
  const [fetchedWorksheets, setFetchedWorksheets] = useState<
    BackendWorksheetItemWithFrontendFields[]
  >([]);
  const [userMap, setUserMap] = useState<Map<string, Friend>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchSchedules = async () => {
      try {
        if (userContextLoading || userContextError || !user) {
          return;
        }
        const { worksheets, userMap: fetchedUserMap } =
          await getWorksheetsByGroupId(groupId);

        if (isMounted) {
          setFetchedWorksheets(worksheets.filter((s) => s.isparent === 1));
          setUserMap(fetchedUserMap);
        }
      } catch (err: any) {
        console.error("Failed to fetch schedules:", err);
        if (isMounted) {
          setError(err.message || "Could not load schedules.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (groupId) {
      fetchSchedules();
    } else {
      setLoading(false);
      setError("Invalid Group ID for schedules.");
    }

    return () => {
      isMounted = false;
    };
  }, [groupId, user, userContextLoading, userContextError]);

  const canCreate = true;

  if (loading || userContextLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="#FF69B4" size={30} />
      </div>
    );
  }

  if (error || userContextError) {
    return (
      <div className="text-center text-red-500 py-10">
        {error || userContextError}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <button
          onClick={onBack}
          className="mr-3 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to details"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          Worksheets ({fetchedWorksheets.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {fetchedWorksheets.length > 0 ? (
          fetchedWorksheets.map((schedule) => (
            <ScheduleListItem
              key={schedule.id}
              schedule={schedule}
              userMap={userMap}
              onViewDetails={onViewScheduleDetails}
              onDelete={onDeleteSchedule}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
            No worksheets created yet.
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
              Create a Worksheet
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SchedulesView;

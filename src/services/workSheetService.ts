import apiClient from "./apiClient";
import { getUserInfoCardsByIds } from "@/services/friendService";
import { Friend } from "@/types/profile/FriendData";

export interface BackendWorksheetItem {
  id: string;
  groupid: string;
  userids: string | null;
  fromdate: string | null;
  todate: string | null;
  createddate: string;
  modifieddate: string;
  name: string | null;
  status: string;
  content: string | null;
  parentid: string | null;
  isparent: 0 | 1 | 2;
  workstatus: number | null;
  createdbyuserid: string;
  modifiedbyuserid: string;
}

export interface BackendWorksheetItemWithFrontendFields
  extends BackendWorksheetItem {
  isParent: boolean;
  workStatus: "Done" | "Doing" | "Todo" | "N/A";
  assignedTo?: { id: string; name: string; avatar: string }[];
  createdBy?: { id: string; name: string; avatar: string };
  subSchedules?: BackendWorksheetItemWithFrontendFields[];
}

interface GetWorksheetsApiResponse {
  object: BackendWorksheetItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

export interface BackendWorksheetTask {
  fromdate: string | null;
  todate: string | null;
  content: string | null;
  workstatus: number | null;
  userids: string | null;
}

export interface CreateWorksheetRequestBody {
  groupid: string;
  name: string | null;
  fromdate: string | null;
  todate: string | null;
  content: string | null;
  userids: string | null;
  isparent: 1;
  workstatus: number | null;
  worksinsheet?: BackendWorksheetTask[];
}

interface CreateWorksheetApiResponse {
  object: BackendWorksheetItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const CHAT_API_BASE_URL = process.env.CHAT_API_URL || "http://localhost:8085";

export const parseUserIds = (userIdsString: string | null): string[] => {
  if (!userIdsString) return [];
  try {
    const parsed = JSON.parse(userIdsString);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [userIdsString];
  }
};

export const getWorkStatusString = (
  statusId: number | null
): "Done" | "Doing" | "Todo" | "N/A" => {
  switch (statusId) {
    case 1:
      return "Done";
    case 2:
      return "Doing";
    case 3:
      return "Todo";
    default:
      return "N/A";
  }
};

const formatBackendWorksheetToEnrichedWorksheet = async (
  backendItem: BackendWorksheetItem,
  allUserInfos: Map<string, Friend>
): Promise<BackendWorksheetItemWithFrontendFields> => {
  const assignedToIds = parseUserIds(backendItem.userids);
  const assignedTo = assignedToIds.map((id) => {
    const userInfo = allUserInfos.get(id);
    return {
      id: id,
      name: userInfo?.name || "Unknown User",
      avatar: userInfo?.avatar || DEFAULT_AVATAR,
    };
  });

  const createdByUser = allUserInfos.get(backendItem.createdbyuserid);
  const createdBy = createdByUser
    ? {
        id: createdByUser.id,
        name: createdByUser.name || "Unknown User",
        avatar: createdByUser.avatar || DEFAULT_AVATAR,
      }
    : undefined;

  return {
    ...backendItem,
    isParent: backendItem.isparent === 1,
    workStatus: getWorkStatusString(backendItem.workstatus),
    assignedTo: assignedTo.length > 0 ? assignedTo : undefined,
    createdBy: createdBy,
    subSchedules: [],
  };
};

export const getWorksheetsByGroupId = async (
  groupId: string
): Promise<{
  worksheets: BackendWorksheetItemWithFrontendFields[];
  userMap: Map<string, Friend>;
}> => {
  const url = `${CHAT_API_BASE_URL}/chat/worksheet/${groupId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiClient<GetWorksheetsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_11_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch worksheets"
    );
  }

  const backendWorksheets = response.object;
  const allUserIds = Array.from(
    new Set(
      backendWorksheets.flatMap((ws) => [
        ws.createdbyuserid,
        ...parseUserIds(ws.userids),
      ])
    )
  );
  const userInfos = await getUserInfoCardsByIds(allUserIds);
  const userMap = new Map<string, Friend>(
    userInfos.map((user) => [user.id, user])
  );

  const formattedWorksheets = await Promise.all(
    backendWorksheets.map((ws) =>
      formatBackendWorksheetToEnrichedWorksheet(ws, userMap)
    )
  );

  return { worksheets: formattedWorksheets, userMap: userMap };
};

export const getWorksheetDetails = async (
  worksheetId: string
): Promise<{
  worksheet: BackendWorksheetItemWithFrontendFields;
  userMap: Map<string, Friend>;
}> => {
  const url = `${CHAT_API_BASE_URL}/chat/worksheet/${worksheetId}/detail`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiClient<GetWorksheetsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_11_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch worksheet details"
    );
  }

  const backendDetails = response.object;

  // Tìm task chính (isparent = 1, id = worksheetId)
  const mainBackendWorksheet = backendDetails.find(
    (item) => item.isparent === 1
  );

  if (!mainBackendWorksheet) {
    throw new Error(
      `Main worksheet with ID ${worksheetId} and isparent = 1 not found.`
    );
  }

  // Lấy danh sách user IDs
  const allUserIds = Array.from(
    new Set(
      backendDetails.flatMap((ws) => [
        ws.createdbyuserid,
        ...parseUserIds(ws.userids),
      ])
    )
  );
  const userInfos = await getUserInfoCardsByIds(allUserIds);
  const userMap = new Map<string, Friend>(
    userInfos.map((user) => [user.id, user])
  );

  // Format task chính
  const mainWorksheet = await formatBackendWorksheetToEnrichedWorksheet(
    mainBackendWorksheet,
    userMap
  );

  // Tìm và format sub-tasks (isparent = 2, parentid = worksheetId)
  const subTasks = backendDetails.filter((item) => item.isparent === 2);
  const formattedSubTasks = await Promise.all(
    subTasks.map((ws) => formatBackendWorksheetToEnrichedWorksheet(ws, userMap))
  );

  // Gán sub-tasks vào mainWorksheet
  mainWorksheet.subSchedules = formattedSubTasks;

  return { worksheet: mainWorksheet, userMap: userMap };
};

export const createWorksheet = async (
  data: CreateWorksheetRequestBody
): Promise<BackendWorksheetItemWithFrontendFields> => {
  const url = `${CHAT_API_BASE_URL}/chat/worksheet`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  };

  const response = await apiClient<CreateWorksheetApiResponse>(url, options);

  if (response.enumResponse.code !== "s_09_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to create worksheet"
    );
  }

  const createdWorksheets = response.object;
  const parentWorksheet = createdWorksheets.find((ws) => ws.isparent === 1);

  if (!parentWorksheet) {
    throw new Error("Created worksheet parent not found in response.");
  }

  const allUserIds = Array.from(
    new Set(
      createdWorksheets.flatMap((ws) => [
        ws.createdbyuserid,
        ...parseUserIds(ws.userids),
      ])
    )
  );
  const userInfos = await getUserInfoCardsByIds(allUserIds);
  const userMap = new Map<string, Friend>(
    userInfos.map((user) => [user.id, user])
  );

  const formattedParentWorksheet =
    await formatBackendWorksheetToEnrichedWorksheet(parentWorksheet, userMap);

  formattedParentWorksheet.subSchedules = await Promise.all(
    createdWorksheets
      .filter(
        (ws) => ws.isparent === 2 && ws.parentid === formattedParentWorksheet.id
      )
      .map((ws) => formatBackendWorksheetToEnrichedWorksheet(ws, userMap))
  );

  return formattedParentWorksheet;
};

export interface UpdateParentWorksheetRequestBody {
  id: string;
  name?: string | null;
  fromdate?: string | null;
  todate?: string | null;
}

export interface UpdateChildWorksheetRequestBody {
  id: string;
  content?: string | null;
  fromdate?: string | null;
  todate?: string | null;
  workstatus?: number | null;
  userids?: string | null;
}

interface UpdateWorksheetApiResponse {
  object: null;
  enumResponse: {
    code: string;
    message: string;
  };
}

export const updateWorksheetParent = async (
  data: UpdateParentWorksheetRequestBody
): Promise<void> => {
  const url = `${CHAT_API_BASE_URL}/chat/worksheet/parent`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  };

  const response = await apiClient<UpdateWorksheetApiResponse>(url, options);

  if (response.enumResponse.code !== "s_10_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to update parent worksheet"
    );
  }
};

export const updateWorksheetChild = async (
  data: UpdateChildWorksheetRequestBody[]
): Promise<void> => {
  const url = `${CHAT_API_BASE_URL}/chat/worksheet/child`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  };

  const response = await apiClient<UpdateWorksheetApiResponse>(url, options);

  if (response.enumResponse.code !== "s_10_chat") {
    throw new Error(
      response.enumResponse.message || "Failed to update child worksheet(s)"
    );
  }
};

import apiFetch from "./apiClient";
import { GroupHeaderData, GroupMember } from "@/types/groups/GroupData";
import { getUserInfoCardsByIds } from "@/services/friendService";
import { Friend } from "@/types/profile/FriendData";

interface BackendGroupInfo {
  id: string;
  name: string;
  intro: string;
  phone: string;
  email: string;
  avtURL: string;
  backgroundURL: string;
  createdUserId: string;
  createdDate: string;
  updatedDate: string;
  isDelete: boolean | null;
  deletedDate: string | null;
}

interface GetGroupInfoApiResponse {
  object: BackendGroupInfo;
  enumResponse: {
    message: string;
    code: string;
  };
}

// MEMBERS
interface BackendGroupMemberItem {
  userId: string;
  groupId: string;
  requestedDate: string;
  accepted: boolean;
}
interface GetGroupMembersFullApiResponse {
  object: BackendGroupMemberItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

const FANPAGE_API_BASE_URL =
  process.env.FANPAGE_API_URL || "http://localhost:8084";
const POST_API_BASE_URL = process.env.POST_API_URL || "http://localhost:8083";

const formatGroupInfo = (
  group: BackendGroupInfo,
  memberCount: number = 0,
  isJoined: boolean = true
): GroupHeaderData => {
  return {
    id: group.id,
    name: group.name || "Unknown Page",
    avatar: group.avtURL || DEFAULT_AVATAR,
    coverPhoto: group.backgroundURL || DEFAULT_COVER,
    memberCount: memberCount,
    isJoined: true,
    isPrivate: true, // Giả định
    bio: group.intro || null,
    createdDate: group.createdDate || null,
  };
};

export const getGroupInfo = async (
  groupId: string
): Promise<{ data: GroupHeaderData }> => {
  const url = `${FANPAGE_API_BASE_URL}/group/${groupId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetGroupInfoApiResponse>(url, options);
  if (response.enumResponse.code !== "s_00_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch group info"
    );
  }

  const backendGroup = response.object;

  const headerData = formatGroupInfo(backendGroup, 0, false);
  return { data: headerData };
};

interface ApiMediaItem {
  typeId: 1 | 2 | 3;
  url: string;
  name?: string;
  unit?: string;
  sizeValue?: number;
}

interface MediaListApiResponse {
  object: ApiMediaItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

export const getListMediaAndFilesByGroupId = async (
  groupId: string
): Promise<{ media: MediaItem[]; files: UploadedFile[] }> => {
  const url = `${POST_API_BASE_URL}/post/media/group/${groupId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<MediaListApiResponse>(url, options);

  if (response.enumResponse.code !== "s_00_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch group media and files"
    );
  }

  const media: MediaItem[] = [];
  const files: UploadedFile[] = [];

  response.object.forEach((item, index) => {
    if (item.typeId === 2 || item.typeId === 3) {
      media.push({
        id: `${groupId}-media-${index}`,
        url: item.url,
        type: item.typeId === 2 ? "image" : "video",
      });
    } else if (item.typeId === 1) {
      // Ensure name, sizeValue, unit exist for file type
      if (item.name && item.sizeValue) {
        files.push({
          id: `${groupId}-file-${index}`,
          name: item.name,
          size: item.sizeValue,
          url: item.url,
          type: item.name.split(".").pop()?.toLowerCase() || "unknown", // Lấy extension làm type
        });
      }
    }
  });

  return { media, files };
};

export const getGroupMembers = async (
  groupId: string
): Promise<GroupMember[]> => {
  const url = `${FANPAGE_API_BASE_URL}/group/members/${groupId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetGroupMembersFullApiResponse>(url, options);

  if (response.enumResponse.code !== "s_012_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch group members"
    );
  }

  const backendMembers = response.object;

  const acceptedBackendMembers = backendMembers.filter(
    (member) => member.accepted
  );
  const acceptedMemberIds = acceptedBackendMembers.map(
    (member) => member.userId
  );

  if (acceptedMemberIds.length === 0) {
    return [];
  }

  const memberInfos: Friend[] = await getUserInfoCardsByIds(acceptedMemberIds);

  const groupMembers: GroupMember[] = acceptedBackendMembers.map(
    (backendMember) => {
      const userInfo = memberInfos.find(
        (info) => info.id === backendMember.userId
      );

      return {
        id: backendMember.userId,
        name: userInfo?.name || "Unknown Member",
        avatar: userInfo?.avatar || DEFAULT_AVATAR,
        joinedDate: backendMember.requestedDate
          ? new Date(backendMember.requestedDate).toLocaleDateString("en-GB")
          : null,
        role: "member", // Mặc định là member, cần API để lấy role thật
      };
    }
  );

  return groupMembers;
};

interface GetGroupsListApiResponse {
  object: {
    listGroup: BackendGroupInfo[];
    joinedList: boolean[];
  };
  enumResponse: {
    code: string;
    message: string;
  };
}

export const getListGroups = async (): Promise<GroupHeaderData[]> => {
  const url = `${FANPAGE_API_BASE_URL}/group/list`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetGroupsListApiResponse>(url, options);

  if (response.enumResponse.code !== "s_012_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch groups list"
    );
  }

  const { listGroup, joinedList } = response.object;

  const groupHeaderDataList: GroupHeaderData[] = listGroup.map(
    (group, index) => {
      const memberCount = 0;
      const isJoined = joinedList[index] || false;

      return {
        id: group.id,
        name: group.name || "Unknown Group",
        avatar: group.avtURL || DEFAULT_AVATAR,
        coverPhoto: group.backgroundURL || DEFAULT_COVER,
        memberCount: memberCount,
        isJoined: true,
        isPrivate: true,
        bio: group.intro || null,
        createdDate: group.createdDate || null,
      };
    }
  );

  return groupHeaderDataList;
};

export const getGroupInfoForManager = async (
  groupId: string
): Promise<{ header: GroupHeaderData; details: BackendGroupInfo }> => {
  const url = `${FANPAGE_API_BASE_URL}/group/${groupId}`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetGroupInfoApiResponse>(url, options);
  if (response.enumResponse.code !== "s_00_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch group info"
    );
  }

  const backendGroup = response.object;

  const headerData = formatGroupInfo(backendGroup, 0, false);
  return { header: headerData, details: backendGroup };
};

interface BackendJoinRequestItem {
  userId: string;
  userName: string;
  avtURL: string;
  date: string;
  studentId: string;
}

interface GetGroupJoinRequestsApiResponse {
  object: BackendJoinRequestItem[];
  enumResponse: {
    code: string;
    message: string;
  };
}

export const getGroupJoinRequests = async (
  groupId: string
): Promise<GroupMember[]> => {
  const url = `${FANPAGE_API_BASE_URL}/group/${groupId}/join-requests`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetGroupJoinRequestsApiResponse>(
    url,
    options
  );

  if (response.enumResponse.code !== "s_08_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch group join requests"
    );
  }

  const backendRequests = response.object;

  // Vì API này đã trả về đủ thông tin (userId, userName, avtURL, date),
  // không cần gọi getUserInfoCardsByIds nữa.
  const joinRequests: GroupMember[] = backendRequests.map((request) => {
    return {
      id: request.userId,
      name: request.userName || "Unknown User",
      avatar: request.avtURL || DEFAULT_AVATAR,
      joinedDate: request.date
        ? new Date(request.date).toLocaleDateString("en-GB")
        : null,
      role: "member", // Mặc định là member, có thể có role khác nếu API cung cấp
    };
  });

  return joinRequests;
};

interface ManageJoinRequestRequestBody {
  userId: string;
}

interface ManageJoinRequestApiResponse {
  object: any | null;
  enumResponse: {
    code: string;
    message: string;
  };
}

export const acceptGroupJoinRequest = async (
  groupId: string,
  userId: string
): Promise<void> => {
  const url = `${FANPAGE_API_BASE_URL}/group/${groupId}/join-requests`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const requestBody: ManageJoinRequestRequestBody = { userId };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await apiFetch<ManageJoinRequestApiResponse>(url, options);

  if (response.enumResponse.code !== "s_09_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to accept group join request"
    );
  }
};

export const deleteGroupJoinRequest = async (
  groupId: string,
  userId: string
): Promise<void> => {
  const url = `${FANPAGE_API_BASE_URL}/group/${groupId}/join-requests`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;

  const requestBody: ManageJoinRequestRequestBody = { userId };

  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await apiFetch<ManageJoinRequestApiResponse>(url, options);

  if (response.enumResponse.code !== "s_010_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to delete group join request"
    );
  }
};

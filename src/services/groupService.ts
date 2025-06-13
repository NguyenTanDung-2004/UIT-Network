import apiFetch from "./apiClient";
import { GroupHeaderData, GroupMember } from "@/types/groups/GroupData";

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

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_COVER =
  "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg";

const FANPAGE_API_BASE_URL =
  process.env.NEXT_PUBLIC_FANPAGE_GROUP_API_URL || "http://localhost:8084";
const POST_API_BASE_URL =
  process.env.NEXT_PUBLIC_POST_API_URL || "http://localhost:8083";

const formatGroupInfo = (
  group: BackendGroupInfo,
  memberCount: number = 0,
  isJoined: boolean = false
): GroupHeaderData => {
  return {
    id: group.id,
    name: group.name || "Unknown Page",
    avatar: group.avtURL || DEFAULT_AVATAR,
    coverPhoto: group.backgroundURL || DEFAULT_COVER,
    memberCount: memberCount,
    isJoined: isJoined,
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
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

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
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

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

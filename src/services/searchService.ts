import apiFetch from "./apiClient";

interface BackendUserInfoObject {
  latitude: number;
  description: string;
  avtURL: string;
  privateProperties: number;
  faculty: string;
  studentID: string;
  major: string;
  phone: string;
  dob: string;
  name: string;
  id: string;
  email: string;
  longitude: number;
}

interface BackendFanpageGroupObject {
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

interface BackendApiResponse<T> {
  object: T[];
  enumResponse: {
    code: string;
    message: string;
  };
}

export interface PersonData {
  id: string;
  type: "people";
  name: string;
  avatar: string;
  followers?: number;
  headline?: string;
  isFriend: boolean;
}

export interface PageData {
  id: string;
  type: "page";
  name: string;
  avatar: string;
  descriptionLines: string[];
  isFollowing: boolean;
}

export interface GroupData {
  id: string;
  type: "group";
  name: string;
  avatar: string;
  stats?: string;
  isJoined: boolean;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const USER_API_BASE_URL = process.env.USER_API_URL || "http://localhost:8080";
const FANPAGE_GROUP_API_BASE_URL =
  process.env.FANPAGE_API_URL || "http://localhost:8084";

const formatUserToPersonData = (user: BackendUserInfoObject): PersonData => {
  return {
    id: user.id,
    type: "people",
    name: user.name || "Unknown User",
    avatar: user.avtURL || DEFAULT_AVATAR,
    followers: 0,
    headline: user.description || user.major || undefined,
    isFriend: false,
  };
};

const formatFanpageToPageData = (
  fanpage: BackendFanpageGroupObject
): PageData => {
  return {
    id: fanpage.id,
    type: "page",
    name: fanpage.name || "Unknown Fanpage",
    avatar: fanpage.avtURL || DEFAULT_AVATAR,
    descriptionLines: fanpage.intro ? fanpage.intro.split("\n") : [],
    isFollowing: false,
  };
};

const formatGroupToGroupData = (
  group: BackendFanpageGroupObject
): GroupData => {
  return {
    id: group.id,
    type: "group",
    name: group.name || "Unknown Group",
    avatar: group.avtURL || DEFAULT_AVATAR,
    stats: undefined,
    isJoined: false,
  };
};

export const searchPeople = async (text: string): Promise<PersonData[]> => {
  const url = `${USER_API_BASE_URL}/user/search?text=${encodeURIComponent(
    text
  )}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<BackendApiResponse<BackendUserInfoObject>>(
    url,
    options
  );

  if (response.enumResponse.code !== "s_08") {
    throw new Error(response.enumResponse.message || "Failed to search people");
  }

  return response.object.map(formatUserToPersonData);
};

export const searchFanpages = async (text: string): Promise<PageData[]> => {
  const url = `${FANPAGE_GROUP_API_BASE_URL}/fanpage/search?text=${encodeURIComponent(
    text
  )}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<
    BackendApiResponse<BackendFanpageGroupObject>
  >(url, options);

  if (response.enumResponse.code !== "s_012_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to search fanpages"
    );
  }

  return response.object.map(formatFanpageToPageData);
};

export const searchGroups = async (text: string): Promise<GroupData[]> => {
  const url = `${FANPAGE_GROUP_API_BASE_URL}/group/search?text=${encodeURIComponent(
    text
  )}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<
    BackendApiResponse<BackendFanpageGroupObject>
  >(url, options);

  if (response.enumResponse.code !== "s_012_fanpagegroup") {
    throw new Error(response.enumResponse.message || "Failed to search groups");
  }

  return response.object.map(formatGroupToGroupData);
};

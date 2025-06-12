import apiFetch from "./apiClient";
import { FollowingPage, JoinedGroup } from "@/types/profile/FriendData";

interface ApiObjectBase {
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

interface ApiResponse<T> {
  object: T[];
  enumResponse: {
    code: string;
    message: string;
  };
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const formatGroupToJoinedGroup = (group: ApiObjectBase): JoinedGroup => {
  return {
    type: "group",
    id: group.id,
    name: group.name,
    avatar: group.avtURL || DEFAULT_AVATAR,
    groupUrl: `/groups/${group.id}`,
  };
};

const formatFanpageToFollowingPage = (
  fanpage: ApiObjectBase
): FollowingPage => {
  return {
    type: "page",
    id: fanpage.id,
    name: fanpage.name,
    avatar: fanpage.avtURL || DEFAULT_AVATAR,
    pageUrl: `/pages/${fanpage.id}`,
  };
};

export const getJoinedGroups = async (
  userId: string
): Promise<JoinedGroup[]> => {
  const baseUrl = process.env.FANPAGE_API_URL || "http://localhost:8084";
  const url = `${baseUrl}/group/notexternal/list/${userId}`;
  const options: RequestInit = {
    method: "GET",
  };

  const response = await apiFetch<ApiResponse<ApiObjectBase>>(url, options);

  if (response.enumResponse.code !== "s_012_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch joined groups"
    );
  }

  return response.object.map(formatGroupToJoinedGroup);
};

export const getFollowingPages = async (
  userId: string
): Promise<FollowingPage[]> => {
  const baseUrl = process.env.FANPAGE_API_URL || "http://localhost:8084";
  const url = `${baseUrl}/fanpage/notexternal/list/${userId}`;
  const options: RequestInit = {
    method: "GET",
  };

  const response = await apiFetch<ApiResponse<ApiObjectBase>>(url, options);

  if (response.enumResponse.code !== "s_011_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch followed fanpages"
    );
  }

  return response.object.map(formatFanpageToFollowingPage);
};

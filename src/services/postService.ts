import apiFetch from "./apiClient";
import {
  UploadedFile,
  AuthorInfo,
  PostOrigin,
  PostDataType,
} from "@/components/post/Post";

interface ApiMediaItem {
  typeId: 1 | 2 | 3;
  url: string;
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

export const getListMediaByUserId = async (
  userId: string
): Promise<MediaItem[]> => {
  const baseUrl = process.env.POST_API_URL || "http://localhost:8083";
  const url = `${baseUrl}/post/media/user/${userId}`;

  const response = await apiFetch<MediaListApiResponse>(url);

  if (response.enumResponse.code !== "s_00_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch user media"
    );
  }

  return response.object
    .filter((item) => item.typeId === 2 || item.typeId === 3) // Chỉ lấy ảnh (2) và video (3)
    .map((item, index) => ({
      id: `${userId}-${item.typeId}-${index}`, // Tạo ID duy nhất
      url: item.url,
      type: item.typeId === 2 ? "image" : "video",
    }));
};

interface BackendMedia {
  typeId: number | string;
  url: string;
  name?: string;
  unit?: string;
  sizeValue?: number;
}

interface BackendPostType {
  id: number;
  typeName: string;
  value: string;
}

interface BackendPost {
  postId: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
  caption: string;
  statusgroup: string;
  media: BackendMedia[];
  postType: BackendPostType;
  deletedDate: string | null;
  parentId: string | null;
  delete: boolean;
}

interface BackendUserInfoInPostList {
  userId: string;
  userName: string;
  avtURL: string;
  studentId: string;
}
interface BackendGroupInfoInPostList {
  id: string;
  name: string;
  avtURL: string;
}

interface BackendFanpageInfoInPostList {
  id: string;
  name: string;
  avtURL: string;
}

interface GetPostsApiResponse {
  object: {
    listUserInfos: BackendUserInfoInPostList[];
    listPost: BackendPost[];
  };
  enumResponse: {
    message: string;
    code: string;
  };
}
interface GetHomePostsApiResponse {
  object: {
    listUserInfos: BackendUserInfoInPostList[];
    listGroupInfos: BackendGroupInfoInPostList[];
    listFanpageInfos: BackendFanpageInfoInPostList[];
    listPost: BackendPost[];
  };
  enumResponse: {
    message: string;
    code: string;
  };
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const findAuthorInfo = (
  userId: string,
  userInfos: BackendUserInfoInPostList[]
): AuthorInfo => {
  const userInfo = userInfos.find((u) => u.userId === userId);
  return {
    id: userId,
    name: userInfo?.userName || "Unknown User",
    avatar: userInfo?.avtURL || DEFAULT_AVATAR,
  };
};

const formatDateTime = (isoDateString: string) => {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return { date: formattedDate, time: formattedTime };
  } catch (e) {
    return { date: "Unknown Date", time: "Unknown Time" };
  }
};

const formatBackendPostToPostDataType = (
  backendPost: BackendPost,
  allUserInfos: BackendUserInfoInPostList[],
  allGroupInfos: BackendGroupInfoInPostList[] = [],
  allFanpageInfos: BackendFanpageInfoInPostList[] = []
): PostDataType => {
  const originalAuthor = findAuthorInfo(backendPost.userId, allUserInfos);
  const { date, time } = formatDateTime(backendPost.createdDate);

  let mediaList: { url: string; type: string }[] = [];
  let file: UploadedFile | undefined = undefined;

  backendPost.media.forEach((m) => {
    const typeIdNum =
      typeof m.typeId === "string" ? parseInt(m.typeId, 10) : m.typeId;
    if (typeIdNum === 2) {
      mediaList.push({ url: m.url, type: "image" });
    } else if (typeIdNum === 3) {
      mediaList.push({ url: m.url, type: "video" });
    } else if (typeIdNum === 1 && m.name && m.sizeValue) {
      file = {
        name: m.name,
        size: m.sizeValue,
        url: m.url,
        type: "file",
      };
    }
  });

  let origin: PostOrigin | undefined;
  let displayAuthor: AuthorInfo = { ...originalAuthor };

  if (backendPost.parentId) {
    const [type, id] = backendPost.parentId.split("||");
    if (type === "group") {
      const groupInfo = allGroupInfos.find((g) => g.id === id);
      origin = {
        type: "group",
        groupInfo: {
          id: id,
          name: groupInfo?.name || `Group ${id.substring(0, 8)}`,
          isJoined: true, // Default value, will need API to check
        },
      };
      displayAuthor.name = groupInfo?.name || displayAuthor.name;
      displayAuthor.avatar = groupInfo?.avtURL || displayAuthor.avatar;
    } else if (type === "fanpage") {
      const fanpageInfo = allFanpageInfos.find((f) => f.id === id);
      origin = {
        type: "page",
        pageInfo: {
          isFollowing: true,
        },
      };
      displayAuthor.name = fanpageInfo?.name || displayAuthor.name;
      displayAuthor.avatar = fanpageInfo?.avtURL || displayAuthor.avatar;
    }
  }

  const content = backendPost.caption || "";
  const fullContent = content.length > 200 ? content : undefined;
  const displayContent =
    content.length > 200 ? content.substring(0, 200) : content;

  return {
    id: backendPost.postId,
    author: displayAuthor, // Use the potentially overridden author info
    origin: origin,
    content: displayContent,
    fullContent: fullContent,
    date: date,
    time: time,
    mediaList: mediaList.length > 0 ? mediaList : undefined,
    likes: 0,
    comments: 0,
    shares: 0,
    file: file,
  };
};

export const getPostsByUserId = async (
  userId: string
): Promise<PostDataType[]> => {
  const baseUrl = process.env.POST_API_URL || "http://localhost:8083";
  const url = `${baseUrl}/post/list/user/${userId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetPostsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_12_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch user posts"
    );
  }

  const { listUserInfos, listPost } = response.object;
  return listPost.map((post) =>
    formatBackendPostToPostDataType(post, listUserInfos)
  );
};

export const getHomePosts = async (): Promise<PostDataType[]> => {
  const baseUrl = process.env.POST_API_URL || "http://localhost:8083";
  const url = `${baseUrl}/post/list/home`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetHomePostsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_09_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch home feed posts"
    );
  }

  const { listUserInfos, listGroupInfos, listFanpageInfos, listPost } =
    response.object;
  return listPost.map((post) =>
    formatBackendPostToPostDataType(
      post,
      listUserInfos,
      listGroupInfos,
      listFanpageInfos
    )
  );
};

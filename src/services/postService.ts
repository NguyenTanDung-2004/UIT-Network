import apiFetch from "./apiClient";
import {
  UploadedFile,
  AuthorInfo,
  PostOrigin,
  PostDataType,
} from "@/components/post/Post";
import { Friend } from "@/types/profile/FriendData";
import { getUserInfoCardsByIds } from "@/services/friendService";
import { CommentType } from "@/components/post/detail/CommentItem";
import { getGroupInfo } from "./groupService";

interface CreatePostMediaItem {
  typeId: 1 | 2 | 3; // 1: File, 2: Image, 3: Video
  url: string;
  sizeValue?: number;
  unit?: string;
  name?: string;
}

interface CreatePostRequestBody {
  caption: string;
  media?: CreatePostMediaItem[];
  postTypeId: number;
}

interface CreatePostApiResponse {
  object: {
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
  };
  enumResponse: {
    message: string;
    code: string;
  };
}

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

interface GetLikesApiResponse {
  object: number;
  enumResponse: {
    message: string;
    code: string;
  };
}

interface GetIsLikedApiResponse {
  object: boolean;
  enumResponse: {
    message: string;
    code: string;
  };
}

interface LikePostApiResponse {
  object: any;
  enumResponse: {
    message: string;
    code: string;
  };
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const POST_API_BASE_URL = process.env.POST_API_URL || "http://localhost:8083";

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
  allFanpageInfos: BackendFanpageInfoInPostList[] = [],
  likesCount: number = 0
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
          isJoined: true,
        },
      };
      displayAuthor.name =
        displayAuthor.name || groupInfo?.name || "Unknown Group";
      displayAuthor.avatar =
        displayAuthor.avatar || groupInfo?.avtURL || DEFAULT_AVATAR;
    } else if (type === "fanpage") {
      displayAuthor.name = displayAuthor.name || "Fanpage";
      const fanpageInfo = allFanpageInfos.find((f) => f.id === id);
      origin = {
        type: "page",
        pageInfo: {
          isFollowing: true,
        },
      };
      // Author của bài post fanpage là fanpage đó
      displayAuthor = {
        id: id, // ID của fanpage
        name: fanpageInfo?.name || `Fanpage ${id.substring(0, 8)}`,
        avatar: fanpageInfo?.avtURL || DEFAULT_AVATAR,
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
    author: displayAuthor,
    origin: origin,
    content: displayContent,
    fullContent: fullContent,
    date: date,
    time: time,
    mediaList: mediaList.length > 0 ? mediaList : undefined,
    likes: likesCount,
    comments: 0,
    shares: 0,
    file: file,
  };
};

export const createPost = async (
  caption: string,
  media: CreatePostMediaItem[] = [],
  postTypeId: number = 2 // Mặc định là normal_student_post public
): Promise<PostDataType> => {
  const url = `${POST_API_BASE_URL}/post/create`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const requestBody: CreatePostRequestBody = {
    caption,
    media,
    postTypeId,
  };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await apiFetch<CreatePostApiResponse>(url, options);

  if (response.enumResponse.code !== "s_01_post") {
    throw new Error(response.enumResponse.message || "Failed to create post");
  }
  const createdPostBackend = response.object;

  const userInfos = await (async () => {
    try {
      const fetchedUserInfos = await getUserInfoCardsByIds([
        createdPostBackend.userId,
      ]);
      return fetchedUserInfos;
    } catch (e) {
      console.error("Failed to fetch user info for new post author:", e);
      return [];
    }
  })();

  const formattedPost = formatBackendPostToPostDataType(
    createdPostBackend,
    userInfos.map((u) => ({
      userId: u.id,
      userName: u.name,
      avtURL: u.avatar,
      studentId: "",
    })),
    [],
    [],
    0
  );

  return formattedPost;
};

export const getNumberOfLikes = async (postId: string): Promise<number> => {
  const url = `${POST_API_BASE_URL}/post/number-of-like/${postId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetLikesApiResponse>(url, options);

  if (response.enumResponse.code !== "s_00_post") {
    throw new Error(
      response.enumResponse.message || "Failed to get like count"
    );
  }
  return response.object;
};

export const getIsLiked = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  const url = `${POST_API_BASE_URL}/post/is-liked/${postId}/${userId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetIsLikedApiResponse>(url, options);

  if (response.enumResponse.code !== "s_00_post") {
    throw new Error(
      response.enumResponse.message || "Failed to check if post is liked"
    );
  }
  return response.object;
};

export const likePost = async (postId: string): Promise<void> => {
  const url = `${POST_API_BASE_URL}/post/like?postId=${postId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<LikePostApiResponse>(url, options);

  if (response.enumResponse.code !== "s_04_post") {
    throw new Error(response.enumResponse.message || "Failed to like post");
  }
};

export const getListMediaByUserId = async (
  userId: string
): Promise<MediaItem[]> => {
  const url = `${POST_API_BASE_URL}/post/media/user/${userId}`;

  const response = await apiFetch<MediaListApiResponse>(url);

  if (response.enumResponse.code !== "s_00_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch user media"
    );
  }

  return response.object
    .filter((item) => item.typeId === 2 || item.typeId === 3)
    .map((item, index) => ({
      id: `${userId}-${item.typeId}-${index}`,
      url: item.url,
      type: item.typeId === 2 ? "image" : "video",
    }));
};

export const getPostsByUserId = async (
  userId: string
): Promise<PostDataType[]> => {
  const url = `${POST_API_BASE_URL}/post/list/user/${userId}`;
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

  const postsWithLikes = await Promise.all(
    listPost.map(async (post) => {
      try {
        const likes = await getNumberOfLikes(post.postId);
        return formatBackendPostToPostDataType(
          post,
          listUserInfos,
          [],
          [],
          likes
        );
      } catch (e) {
        console.error(`Error fetching likes for post ${post.postId}:`, e);
        return formatBackendPostToPostDataType(post, listUserInfos);
      }
    })
  );

  return postsWithLikes;
};

export const getHomePosts = async (): Promise<PostDataType[]> => {
  const url = `${POST_API_BASE_URL}/post/list/home`;
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

  const postsWithLikes = await Promise.all(
    listPost.map(async (post) => {
      try {
        const likes = await getNumberOfLikes(post.postId);
        return formatBackendPostToPostDataType(
          post,
          listUserInfos,
          listGroupInfos,
          listFanpageInfos,
          likes
        );
      } catch (e) {
        console.error(`Error fetching likes for post ${post.postId}:`, e);
        return formatBackendPostToPostDataType(
          post,
          listUserInfos,
          listGroupInfos,
          listFanpageInfos
        ); // Return with default likes if fetch fails
      }
    })
  );

  return postsWithLikes;
};

// COMMENT
interface BackendCommentMedia {
  typeId: number | string;
  url: string;
}

// Backend Comment Object
interface BackendComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  creatDate: string;
  modifiedDate: string;
  deletedDate: string | null;
  mediaList: BackendCommentMedia[] | null;
  tagIds: string[] | null;
  parentCommentId: string | null;
  deleted: boolean;
}

// Backend Comment Response Structure
interface BackendCommentTreeItem {
  parentComment: BackendComment;
  listComment: BackendComment[]; // Replies to the parentComment
}

interface GetCommentsApiResponse {
  object: BackendCommentTreeItem[];
  enumResponse: {
    message: string;
    code: string;
  };
}

// Interfaces mới cho API tạo comment
interface CreateCommentRequestBody {
  postId: string;
  userId: string;
  content: string;
  tagIds?: string[] | null;
  parentCommentId?: string | null;
}

interface CreateCommentApiResponse {
  object: BackendComment;
  enumResponse: {
    message: string;
    code: string;
  };
}

const formatTimestamp = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  return `${weeks} weeks ago`;
};

// Hàm định dạng một comment từ backend sang frontend
const formatBackendCommentToCommentType = (
  backendComment: BackendComment,
  allUserInfos: Friend[]
): CommentType => {
  const authorInfo = allUserInfos.find((u) => u.id === backendComment.userId);
  const authorName = authorInfo?.name || "Unknown User";
  const authorAvatar = authorInfo?.avatar || DEFAULT_AVATAR;

  let commentText = backendComment.content;
  if (backendComment.tagIds && backendComment.tagIds.length > 0) {
    const tagNames = backendComment.tagIds
      .map((tagId) => {
        const taggedUser = allUserInfos.find((u) => u.id === tagId);
        return taggedUser ? `@${taggedUser.name.replace(/\s+/g, "")}` : "";
      })
      .filter(Boolean)
      .join(" ");
    if (tagNames) {
      commentText = `${commentText} ${tagNames}`;
    }
  }

  return {
    id: backendComment.id,
    author: {
      id: backendComment.userId,
      name: authorName,
      avatar: authorAvatar,
    },
    text: commentText,
    timestamp: formatTimestamp(backendComment.creatDate),
    likes: 0,
    replies: [],
    parentCommentId: backendComment.parentCommentId, // Thêm trường này
  };
};

export const getCommentsByPostId = async (
  postId: string
): Promise<CommentType[]> => {
  const url = `${POST_API_BASE_URL}/comments/${postId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  const response = await apiFetch<GetCommentsApiResponse>(url, options);

  if (response.enumResponse.code !== "s_11_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch comments"
    );
  }

  const backendCommentTrees = response.object;

  const allUserIdsInComments = Array.from(
    new Set(
      backendCommentTrees.flatMap((tree) => [
        tree.parentComment.userId,
        ...(tree.parentComment.tagIds || []),
        ...tree.listComment.map((c) => c.userId),
        ...tree.listComment.flatMap((c) => c.tagIds || []),
      ])
    )
  );

  const userInfos = await getUserInfoCardsByIds(allUserIdsInComments);

  const finalComments: CommentType[] = [];
  backendCommentTrees.forEach((tree) => {
    const parentComment = formatBackendCommentToCommentType(
      tree.parentComment,
      userInfos
    );
    finalComments.push(parentComment);

    tree.listComment.forEach((reply) => {
      // Đánh dấu reply bằng isReply và thêm parentCommentId để UI xử lý thụt lề
      const formattedReply = {
        ...formatBackendCommentToCommentType(reply, userInfos),
        isReply: true,
        parentCommentId: parentComment.id,
      };
      finalComments.push(formattedReply);
    });
  });

  return finalComments;
};

export const createComment = async (
  postId: string,
  userId: string,
  content: string,
  tagIds: string[] | null = null,
  parentCommentId: string | null = null
): Promise<CommentType> => {
  // Hàm này giờ trả về CommentType
  const url = `${POST_API_BASE_URL}/comments`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const requestBody: CreateCommentRequestBody = {
    postId,
    userId,
    content,
    tagIds,
    parentCommentId,
  };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(requestBody),
  };

  const response = await apiFetch<CreateCommentApiResponse>(url, options);

  if (response.enumResponse.code !== "s_05_post") {
    // Cập nhật code thành công
    throw new Error(
      response.enumResponse.message || "Failed to create comment"
    );
  }

  const newCommentBackend = response.object;

  // Lấy thông tin user cho comment mới được tạo
  const userInfos = await (async () => {
    try {
      return await getUserInfoCardsByIds([newCommentBackend.userId]);
    } catch (e) {
      console.error("Failed to fetch user info for new comment author:", e);
      return [];
    }
  })();

  // Format và trả về CommentType
  return formatBackendCommentToCommentType(newCommentBackend, userInfos);
};

// END COMMENT

// FANPAGE
interface BackendFanpageInfoInPostListResponse {
  id: string;
  name: string;
  avtURL: string;
}

interface GetPostsByFanpageApiResponse {
  object: {
    fanpageInfo: BackendFanpageInfoInPostListResponse;
    listUserInfos: BackendUserInfoInPostList[]; // Người dùng tạo post trên fanpage
    listPost: BackendPost[];
  };
  enumResponse: {
    message: string;
    code: string;
  };
}

export const getPostsByFanpageId = async (
  fanpageId: string
): Promise<PostDataType[]> => {
  const url = `${POST_API_BASE_URL}/post/list/fanpage/${fanpageId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetPostsByFanpageApiResponse>(url, options);

  if (response.enumResponse.code !== "s_13_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch fanpage posts"
    );
  }

  const { fanpageInfo, listUserInfos, listPost } = response.object;

  const postsWithLikes = await Promise.all(
    listPost.map(async (post) => {
      try {
        const likes = await getNumberOfLikes(post.postId);
        // Khi định dạng post của fanpage, fanpageInfo là nơi lấy author của post
        return formatBackendPostToPostDataType(
          post,
          listUserInfos, // listUserInfos vẫn cần cho trường hợp bài viết của user trên fanpage
          [], // Không có group info
          [fanpageInfo], // Chỉ có fanpage info liên quan
          likes
        );
      } catch (e) {
        // console.error(`Error fetching likes for post ${post.postId}:`, e); // Bỏ console.error
        return formatBackendPostToPostDataType(
          post,
          listUserInfos,
          [],
          [fanpageInfo]
        );
      }
    })
  );

  return postsWithLikes;
};

// POST OF GROUP
interface BackendGroupInfoInPostListResponse {
  id: string;
  name: string;
  avtURL: string;
}

interface GetPostsByGroupApiResponse {
  object: {
    listUserInfos: BackendUserInfoInPostList[];
    listPost: BackendPost[];
  };
  enumResponse: {
    message: string;
    code: string;
  };
}

export const getPostsByGroupId = async (
  groupId: string
): Promise<PostDataType[]> => {
  const url = `${
    process.env.POST_API_URL || "http://localhost:8083"
  }/post/list/group/${groupId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const [postsResponse, groupDataResponse] = await Promise.all([
    apiFetch<GetPostsByGroupApiResponse>(url, options),
    getGroupInfo(groupId),
  ]);

  if (postsResponse.enumResponse.code !== "s_14_post") {
    throw new Error(
      postsResponse.enumResponse.message || "Failed to fetch group posts"
    );
  }

  const { listUserInfos, listPost } = postsResponse.object;
  const currentGroupInfo = groupDataResponse.data;

  const groupInfoForFormatting: BackendGroupInfoInPostList[] = currentGroupInfo
    ? [
        {
          id: currentGroupInfo.id,
          name: currentGroupInfo.name,
          avtURL: currentGroupInfo.avatar,
        },
      ]
    : [];

  const postsWithLikes = await Promise.all(
    listPost.map(async (post) => {
      try {
        const likes = await getNumberOfLikes(post.postId);
        return formatBackendPostToPostDataType(
          post,
          listUserInfos,
          groupInfoForFormatting,
          [],
          likes
        );
      } catch (e) {
        return formatBackendPostToPostDataType(
          post,
          listUserInfos,
          groupInfoForFormatting,
          []
        );
      }
    })
  );

  return postsWithLikes;
};

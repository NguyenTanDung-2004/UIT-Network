import apiFetch from "./apiClient";
import { PageHeaderData, PageAboutData } from "@/types/pages/PageData";

interface BackendFanpageInfo {
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

interface GetFanpageInfoApiResponse {
  object: BackendFanpageInfo;
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
  process.env.FANPAGE_API_URL || "http://localhost:8084";
const POST_API_BASE_URL = process.env.POST_API_URL || "http://localhost:8083";

const formatFanpageInfoToPageHeaderData = (
  fanpage: BackendFanpageInfo,
  followerCount: number = 0,
  isFollowing: boolean = false
): PageHeaderData => {
  return {
    id: fanpage.id,
    name: fanpage.name || "Unknown Page",
    avatar: fanpage.avtURL || DEFAULT_AVATAR,
    coverPhoto: fanpage.backgroundURL || DEFAULT_COVER,
    followerCount: followerCount,
    isFollowing: isFollowing,
  };
};

const formatFanpageInfoToPageAboutData = (
  fanpage: BackendFanpageInfo
): PageAboutData => {
  return {
    overview: {
      bio: fanpage.intro || "",
    },
    contact: {
      phone: fanpage.phone || null,
      email: fanpage.email || null,
      githubLink: null,
      socialLinks: [],
      websites: [],
    },
    pageTransparency: {
      pageId: fanpage.id,
      creationDate: fanpage.createdDate
        ? new Date(fanpage.createdDate).toLocaleDateString("en-GB")
        : "N/A",
      infoAdmin:
        "This page may have multiple administrators. They may have the authority to post content, comment, or send messages on behalf of the Page.",
    },
  };
};

export const getFanpageInfo = async (
  pageId: string
): Promise<{ header: PageHeaderData; about: PageAboutData }> => {
  const url = `${FANPAGE_API_BASE_URL}/fanpage/${pageId}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<GetFanpageInfoApiResponse>(url, options);
  if (response.enumResponse.code !== "s_012_fanpagegroup") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch fanpage info"
    );
  }

  const backendFanpage = response.object;

  const headerData = formatFanpageInfoToPageHeaderData(
    backendFanpage,
    0,
    false
  );
  const aboutData = formatFanpageInfoToPageAboutData(backendFanpage);

  return { header: headerData, about: aboutData };
};

// MEDIA
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

export const getListMediaByPostId = async (
  pageId: string
): Promise<MediaItem[]> => {
  const url = `${POST_API_BASE_URL}/post/media/fanpage/${pageId}`;

  const response = await apiFetch<MediaListApiResponse>(url);

  if (response.enumResponse.code !== "s_00_post") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch fanpage media"
    );
  }

  return response.object
    .filter((item) => item.typeId === 2 || item.typeId === 3)
    .map((item, index) => ({
      id: `${pageId}-${item.typeId}-${index}`,
      url: item.url,
      type: item.typeId === 2 ? "image" : "video",
    }));
};

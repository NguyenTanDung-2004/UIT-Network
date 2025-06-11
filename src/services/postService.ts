import apiFetch from "./apiClient";

interface ApiMediaItem {
  typeId: 1 | 2 | 3; // 1: file, 2: image, 3: video
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

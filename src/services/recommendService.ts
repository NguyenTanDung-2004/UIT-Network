import apiFetch from "./apiClient";

// Định nghĩa interface cho dữ liệu người dùng trả về từ backend API recommend
interface BackendRecommendedUser {
  id: string;
  name: string;
  avtURL: string;
  studentId: string;
  email: string;
  major: string;
  faculty: string;
  data: number;
}

interface RecommendApiResponse {
  object: BackendRecommendedUser[];
  enumResponse: {
    code: string;
    message: string;
  };
}

export interface Person {
  id: string;
  name: string;
  avatar: string;
  profileUrl: string;
  description?: string;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const USER_API_BASE_URL = process.env.USER_API_URL || "http://localhost:8080";

const formatBackendUserToPerson = (
  user: BackendRecommendedUser,
  recommendationType: "mutual-friend" | "location" | "schedule" | "hobby"
): Person => {
  let descriptionParts: string[] = [];

  if (user.faculty) {
    descriptionParts.push(`Faculty: ${user.faculty}`);
  }

  switch (recommendationType) {
    case "mutual-friend":
      descriptionParts.push(`Mutual Friends: ${user.data}`);
      break;
    case "location":
      descriptionParts.push(`Distance: ${user.data.toFixed(2)} km`);
      break;
    case "schedule":
      descriptionParts.push(`Common Schedule: ${user.data.toFixed(1)} hours`);
      break;
    case "hobby":
      descriptionParts.push(`Common Hobbies: ${user.data}`);
      break;
  }

  const description = descriptionParts.join(", ");

  return {
    id: user.id,
    name: user.name || "Unknown User",
    avatar: user.avtURL || DEFAULT_AVATAR,
    profileUrl: `/profiles/${user.id}`,
    description: description || undefined,
  };
};

export const getRecommendedByMutualFriend = async (): Promise<Person[]> => {
  const url = `${USER_API_BASE_URL}/user/list/mutual-friend`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<RecommendApiResponse>(url, options);

  if (response.enumResponse.code !== "s_08") {
    throw new Error(
      response.enumResponse.message ||
        "Failed to fetch mutual friends recommendation"
    );
  }

  return response.object.map((user) =>
    formatBackendUserToPerson(user, "mutual-friend")
  );
};

export const getRecommendedByLocation = async (): Promise<Person[]> => {
  const url = `${USER_API_BASE_URL}/user/list/location`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<RecommendApiResponse>(url, options);

  if (response.enumResponse.code !== "s_08") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch location recommendation"
    );
  }

  return response.object.map((user) =>
    formatBackendUserToPerson(user, "location")
  );
};

export const getRecommendedBySchedule = async (): Promise<Person[]> => {
  const url = `${USER_API_BASE_URL}/user/list/schedule`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<RecommendApiResponse>(url, options);

  if (response.enumResponse.code !== "s_08") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch schedule recommendation"
    );
  }

  return response.object.map((user) =>
    formatBackendUserToPerson(user, "schedule")
  );
};

export const getRecommendedByHobby = async (): Promise<Person[]> => {
  const url = `${USER_API_BASE_URL}/user/list/recommend-hobby`;
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };

  const response = await apiFetch<RecommendApiResponse>(url, options);

  if (response.enumResponse.code !== "s_08") {
    throw new Error(
      response.enumResponse.message || "Failed to fetch hobby recommendation"
    );
  }

  return response.object.map((user) =>
    formatBackendUserToPerson(user, "hobby")
  );
};

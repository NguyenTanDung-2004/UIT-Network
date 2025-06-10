import apiFetch from "./apiClient";
import { ProfileAboutData } from "@/types/profile/AboutData";

interface UserInfoObject {
  id: string;
  email: string;
  avtURL: string;
  name: string;
  description: string;
  studentID: string;
  major: string;
  faculty: string;
  phone: string;
  dob: string;
  latitude: number;
  longitude: number;
  jsonSchedule: string;
  background: string;
  hobbies: {
    id: number;
    name: string;
    description: string;
    avtURL: string;
  }[];
}

interface UserInfoResponse {
  object: UserInfoObject;
  enumResponse: {
    message: string;
    code: string;
  };
}

interface ListUserInfoResponse {
  object: UserInfoObject[];
  enumResponse: {
    message: string;
    code: string;
  };
}

const formatUserInfoToProfileAboutData = (
  userInfo: UserInfoObject
): ProfileAboutData => {
  let schedule;
  try {
    schedule = JSON.parse(userInfo.jsonSchedule);
  } catch (error) {
    console.error("Failed to parse jsonSchedule for user:", userInfo.id, error);
    schedule = {};
  }

  return {
    id: userInfo.id,
    avtURL: userInfo.avtURL || "",
    name: userInfo.name || "",
    background: userInfo.background || "",
    overview: {
      bio: userInfo.description || "",
      born: userInfo.dob || null,
      status: null,
      occupation: userInfo.major || null,
      livesIn: `${userInfo.latitude}, ${userInfo.longitude}` || null,
      phone: userInfo.phone || null,
      email: userInfo.email || null,
    },
    contact: {
      phone: userInfo.phone || null,
      email: userInfo.email || null,
      githubLink: null,
      socialLinks: [],
      websites: [],
    },
    basicInfo: {
      born: userInfo.dob || null,
      gender: null,
    },
    hobbies: userInfo.hobbies.map((hobby) => ({
      id: hobby.id.toString(),
      name: hobby.name,
      iconUrl: hobby.avtURL,
    })),
    workAndEducation: {
      workplaces: [],
      occupations: userInfo.major
        ? [{ id: userInfo.id, title: userInfo.major }]
        : [],
      experienceSummary: null,
      colleges: userInfo.faculty
        ? [
            {
              id: userInfo.id,
              name: userInfo.faculty,
              degree: userInfo.major,
              duration: "",
            },
          ]
        : [],
      highSchools: [],
    },
    schedule: schedule || undefined,
  };
};

export const getUserInfo = async (): Promise<ProfileAboutData> => {
  const baseUrl = process.env.USER_API_URL || "http://localhost:8080";
  const url = `${baseUrl}/user/get-user-info`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  console.log("Fetching user info from:", url);

  try {
    const response = await apiFetch<UserInfoResponse>(url, options);
    console.log("User info response:", response);

    if (response.enumResponse.code !== "s_05") {
      throw new Error(
        response.enumResponse.message || "Failed to fetch user info"
      );
    }

    return formatUserInfoToProfileAboutData(response.object);
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const getListUserInfoByIds = async (
  ids: string[]
): Promise<ProfileAboutData[]> => {
  if (ids.length === 0) {
    return [];
  }

  const baseUrl = process.env.USER_API_URL || "http://localhost:8080";
  const idsString = ids.join(",");
  const url = `${baseUrl}/user/list-user-info/${idsString}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  console.log("Fetching list of user info from:", url);

  try {
    const response = await apiFetch<ListUserInfoResponse>(url, options);
    console.log("List user info response:", response);

    if (response.enumResponse.code !== "s_08") {
      throw new Error(
        response.enumResponse.message || "Failed to fetch list of user info"
      );
    }

    return response.object.map(formatUserInfoToProfileAboutData);
  } catch (error) {
    console.error("Error fetching list of user info:", error);
    throw error;
  }
};

import apiFetch from "./apiClient";
import { ProfileAboutData } from "@/types/profile/AboutData";

interface UserInfoResponse {
  object: {
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
  };
  enumResponse: {
    message: string;
    code: string;
  };
}

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

    // Parse jsonSchedule
    let schedule;
    try {
      schedule = JSON.parse(response.object.jsonSchedule);
    } catch (error) {
      console.error("Failed to parse jsonSchedule:", error);
      schedule = {};
    }

    // Format response to ProfileAboutData
    return {
      id: response.object.id,
      avtURL: response.object.avtURL || "",
      name: response.object.name || "",
      background: response.object.background || "",
      overview: {
        bio: response.object.description || "",
        born: response.object.dob || null,
        status: null,
        occupation: response.object.major || null,
        livesIn:
          `${response.object.latitude}, ${response.object.longitude}` || null,
        phone: response.object.phone || null,
        email: response.object.email || null,
      },
      contact: {
        phone: response.object.phone || null,
        email: response.object.email || null,
        githubLink: null,
        socialLinks: [],
        websites: [],
      },
      basicInfo: {
        born: response.object.dob || null,
        gender: null,
      },
      hobbies: response.object.hobbies.map((hobby) => ({
        id: hobby.id.toString(),
        name: hobby.name,
        iconUrl: hobby.avtURL,
      })),
      workAndEducation: {
        workplaces: [],
        occupations: response.object.major
          ? [{ id: response.object.id, title: response.object.major }]
          : [],
        experienceSummary: null,
        colleges: response.object.faculty
          ? [
              {
                id: response.object.id,
                name: response.object.faculty,
                degree: response.object.major,
                duration: "",
              },
            ]
          : [],
        highSchools: [],
      },
      schedule: schedule || undefined,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

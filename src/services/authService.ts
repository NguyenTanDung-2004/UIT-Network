import apiFetch from "./apiClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  object: {
    jwt: string;
  };
  enumResponse: {
    message: string;
    code: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const baseUrl = process.env.USER_API_URL || "http://localhost:8080";
  const url = `${baseUrl}/user/login`;
  const options: RequestInit = {
    method: "POST",
    body: JSON.stringify({ email, password }),
  };

  console.log("Calling API at:", url);

  const response = await apiFetch<LoginResponse>(url, options);

  // Thay đổi từ localStorage sang sessionStorage
  if (typeof window !== "undefined" && response.object?.jwt) {
    sessionStorage.setItem("jwt", response.object.jwt);
  }

  return response;
};

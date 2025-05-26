import apiFetch from "./apiClient";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// Function LOGIN
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const endpoint = "/user/login";
  const options: RequestInit = {
    method: "POST",
    body: JSON.stringify({ email, password }),
  };

  return apiFetch<LoginResponse>(endpoint, options);
};

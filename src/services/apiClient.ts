const apiFetch = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const defaultOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData.message = `HTTP error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      // Sửa lỗi ở đây: PHẢI AWAIT response.json()
      const data = await response.json();
      return data as T;
    } else {
      // Trường hợp response không có JSON body (ví dụ 204 No Content)
      return {} as T;
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export default apiFetch;

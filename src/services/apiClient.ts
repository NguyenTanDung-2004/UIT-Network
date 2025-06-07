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
    console.log("Fetching URL:", url, "with options:", defaultOptions);
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.enumResponse?.message || `HTTP error: ${response.status}`
      );
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export default apiFetch;

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback, // Import useCallback
} from "react";
import { getUserInfo } from "@/services/userService";
import { ProfileAboutData } from "@/types/profile/AboutData";

interface UserContextType {
  user: ProfileAboutData | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ProfileAboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Đặt logic fetch vào một hàm riêng và sử dụng useCallback
  const fetchUserInfo = useCallback(async () => {
    setLoading(true); // Bắt đầu load lại, hiển thị loading state
    setError(null); // Xóa lỗi cũ
    const token = sessionStorage.getItem("jwt");

    if (!token) {
      setUser(null); // Đảm bảo user là null nếu không có token
      setError("No JWT found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const profile = await getUserInfo();
      setUser(profile);
    } catch (err: any) {
      setUser(null); // Đặt user là null nếu có lỗi
      setError(err.message || "Failed to fetch user info");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  }, []); // Empty dependency array, as token comes from sessionStorage

  useEffect(() => {
    fetchUserInfo(); // Fetch lần đầu khi component mount
  }, [fetchUserInfo]); // Dependency on fetchUserInfo to make sure it's called

  return (
    <UserContext.Provider
      value={{ user, loading, error, refetchUser: fetchUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

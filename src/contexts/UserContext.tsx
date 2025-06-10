import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getUserInfo } from "@/services/userService";
import { ProfileAboutData } from "@/types/profile/AboutData";

interface UserContextType {
  user: ProfileAboutData | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ProfileAboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("No JWT found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserInfo();
        setUser(profile);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user info");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
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

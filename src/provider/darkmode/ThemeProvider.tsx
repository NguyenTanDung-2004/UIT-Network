// src/provider/darkmode/ThemeProvider.tsx
"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

interface ThemeContextProps {
  darkMode: boolean;
  toggleDarkMode: (forceValue?: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load trạng thái dark mode từ localStorage khi component được mount
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark"); // Thêm class 'dark' khi tải từ localStorage
    }
  }, []);

  useEffect(() => {
    // Thêm hoặc xóa class 'dark' khỏi thẻ <html> mỗi khi darkMode thay đổi
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true"); // Lưu trạng thái vào localStorage
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false"); // Lưu trạng thái vào localStorage
    }
  }, [darkMode]);

  const toggleDarkMode = (forceValue?: boolean) => {
    if (forceValue === undefined) {
      // Toggle chế độ hiện tại
      setDarkMode((prev) => !prev);
    } else {
      // Đặt chế độ theo giá trị được chỉ định
      setDarkMode(forceValue);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Tạo hook để sử dụng ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

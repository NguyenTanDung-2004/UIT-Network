"use client";

import { ThemeProvider } from "@/provider/darkmode/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}

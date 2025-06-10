"use client";
import React from "react";
import NavBar from "@/components/layout/NavBar";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface SocialLayoutProps {
  children: React.ReactNode;
}

const SocialLayout: React.FC<SocialLayoutProps> = ({ children }) => {
  const { user, loading, error } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[#F3F3F3] dark:bg-gray-800 overflow-hidden">
      <NavBar user={{ id: user.id, name: user.name, avatar: user.avtURL }} />
      <div className="flex-1 flex-col flex overflow-hidden">{children}</div>
    </div>
  );
};

export default SocialLayout;

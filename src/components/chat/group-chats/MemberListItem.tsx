"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { GroupMemberInfo } from "@/types/chats/ChatData";
import { LogOut, MessagesSquare, MoreHorizontal, UserX } from "lucide-react";
import { div, option } from "framer-motion/client";

interface MemberListItemProps {
  member: GroupMemberInfo;
  isCurrentUser: boolean;
  currentUserRole: "admin" | "moderator" | "member";
  onChat: (memberId: string) => void;
  onRemove: (memberId: string, memberName: string) => void;
  onLeave?: () => void;
}

const MemberListItem: React.FC<MemberListItemProps> = ({
  member,
  isCurrentUser,
  currentUserRole,
  onChat,
  onRemove,
  onLeave,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const canRemove =
    (currentUserRole === "admin" || currentUserRole === "moderator") &&
    member.role != "admin" &&
    !isCurrentUser;

  const canLeave = isCurrentUser && onLeave;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showOptions &&
        optionRef.current &&
        !optionRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation;
    setShowOptions(false);
    onRemove(member.id, member.name);
  };

  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation;
    setShowOptions(false);
    if (onLeave) onLeave();
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation;
    setShowOptions(false);
    onChat(member.id);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group">
      <div className="flex items-center min-w-0">
        <Image
          src={member.avatar}
          alt={member.name}
          width={40}
          height={40}
          className="rounded-full mr-3 flex-shrink-0"
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 ">
            {member.name}
            {isCurrentUser && (
              <span className="text-xs text-gray-500"> (You)</span>
            )}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {member.role}
          </p>
        </div>
      </div>

      <div className="relative ml-2">
        {!isCurrentUser &&
          (currentUserRole === "admin" ||
            currentUserRole === "moderator" ||
            canLeave) && (
            <button
              ref={buttonRef}
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={20} />
            </button>
          )}

        {isCurrentUser && canLeave && (
          <button
            ref={buttonRef}
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full focus:outline-none"
          >
            <MoreHorizontal size={20} />
          </button>
        )}

        {showOptions && (
          <div
            ref={optionRef}
            className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10 py-1"
          >
            {!isCurrentUser && (
              <button
                onClick={handleChatClick}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
              >
                <MessagesSquare size={14} className="mr-2" /> Chat
              </button>
            )}

            {canRemove && (
              <button
                onClick={handleRemoveClick}
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
              >
                <UserX size={14} className="mr-2" /> Remove
              </button>
            )}

            {canLeave && (
              <button
                onClick={handleLeaveClick}
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center"
              >
                <LogOut size={14} className="mr-2" /> Leave Group
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberListItem;

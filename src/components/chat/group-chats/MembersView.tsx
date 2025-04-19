import React from "react";
import Image from "next/image";
import { ArrowLeft, UserPlus } from "lucide-react";
import MemberListItem from "./MemberListItem";
import { GroupMemberInfo } from "@/types/chats/ChatData";

interface MembersViewProps {
  members: GroupMemberInfo[];
  currentUserInfo: GroupMemberInfo;
  onBack: () => void;
  onAddMember: () => void;
  onChatMember: (memberId: string) => void;
  onRemoveMember: (memberId: string, memberName: string) => void;
  onLeaveGroup?: () => void;
}

const MembersView: React.FC<MembersViewProps> = ({
  members,
  currentUserInfo,
  onBack,
  onAddMember,
  onChatMember,
  onRemoveMember,
  onLeaveGroup,
}) => {
  const admins = members.filter((m) => m.role === "admin");
  const moderators = members.filter((m) => m.role === "moderator");
  const regularMembers = members.filter((m) => m.role === "member");

  const canAddMembers =
    currentUserInfo.role === "admin" || currentUserInfo.role === "moderator";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <button
          onClick={onBack}
          className="mr-3 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to details"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-base font-bold text-black dark:text-gray-100">
          Members in Chat ({members.length})
        </h3>
      </div>

      {/* List Members */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {/* admins */}
        {admins.length > 0 && (
          <div>
            {admins.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                isCurrentUser={member.id == currentUserInfo.id}
                currentUserRole={currentUserInfo.role}
                onChat={onChatMember}
                onRemove={onRemoveMember}
                onLeave={
                  member.id === currentUserInfo.id ? onLeaveGroup : undefined
                }
              />
            ))}
          </div>
        )}

        {/* moderators */}
        {moderators.length > 0 && (
          <div>
            {moderators.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                isCurrentUser={member.id == currentUserInfo.id}
                currentUserRole={currentUserInfo.role}
                onChat={onChatMember}
                onRemove={onRemoveMember}
                onLeave={
                  member.id === currentUserInfo.id ? onLeaveGroup : undefined
                }
              />
            ))}
          </div>
        )}

        {/* members */}
        {regularMembers.length > 0 && (
          <div>
            {regularMembers.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                isCurrentUser={member.id == currentUserInfo.id}
                currentUserRole={currentUserInfo.role}
                onChat={onChatMember}
                onRemove={onRemoveMember}
                onLeave={
                  member.id === currentUserInfo.id ? onLeaveGroup : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Add Member Button */}
        {canAddMembers && (
          <button
            onClick={onAddMember}
            className="flex items-center w-full py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg text-left mb-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-pink-100 hover:bg-opacity-80 dark:bg-primary flex items-center justify-center mr-3">
              <UserPlus className="text-primary dark:text-white" size={20} />
            </div>
            <span className="text-sm font-medium text-black dark:text-pink-400">
              Add Member
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MembersView;

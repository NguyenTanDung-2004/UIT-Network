import React from "react";
import Image from "next/image";
import { GroupMember } from "@/types/groups/GroupData";

interface MemberCardInfoProps {
  member: GroupMember;
}

const MemberCardInfo: React.FC<MemberCardInfoProps> = ({ member }) => {
  const renderRoleBadge = () => {
    if (member.role === "admin") {
      return (
        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium dark:bg-purple-900 dark:text-purple-300">
          Admin
        </span>
      );
    }
    if (member.role === "moderator") {
      return (
        <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-medium dark:bg-pink-900 dark:text-pink-300">
          Moderator
        </span>
      );
    }
    return null;
  };

  // const renderActionButton = () => {
  //   if (isCurrentUser) {
  //     return (
  //       <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none">
  //         <MoreHorizontal size={20} />
  //       </button>
  //     );
  //   }

  //   let friendButtonText = "Add Friend";
  //   let friendButtonIcon = <UserPlus size={16} className="mr-1.5" />;
  //   let friendButtonStyle =
  //     "duration-200 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500";
  //   let friendButtonAction = () => onAddFriend(member.id);
  //   let isFriendActionDisabled = false;

  //   switch (member.friendshipStatus) {
  //     case "friend":
  //       friendButtonText = "Friend";
  //       friendButtonIcon = <UserCheck size={16} className="mr-1.5" />;
  //       friendButtonStyle =
  //         "duration-200 bg-primary text-white hover:bg-opacity-80";
  //       friendButtonAction = () =>
  //         console.log("Already friends with:", member.id);
  //       break;
  //     case "pending_sent":
  //       friendButtonText = "Request Sent";
  //       friendButtonIcon = <UserX size={16} className="mr-1.5" />;
  //       friendButtonStyle =
  //         "duration-200 bg-pink-100 text-primary hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80";
  //       friendButtonAction = () =>
  //         console.log("Cancel friend request to:", member.id);
  //       break;
  //     case "pending_received":
  //       friendButtonText = "Respond";
  //       friendButtonIcon = <UserPlus size={16} className="mr-1.5" />;
  //       friendButtonStyle =
  //         "duration-200 bg-pink-100 text-primary hover:bg-pink-200 hover:bg-opacity-80 dark:bg-primary dark:text-white dark:hover:bg-opacity-80";

  //       friendButtonAction = () =>
  //         console.log("Respond to friend request from:", member.id);
  //       break;
  //     case "not_friend":
  //     default:
  //       break;
  //   }

  //   return (
  //     <button
  //       onClick={friendButtonAction}
  //       disabled={isFriendActionDisabled}
  //       className={`min-w-32 px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none flex items-center justify-center gap-1 ${friendButtonStyle} ${
  //         isFriendActionDisabled ? "opacity-60 cursor-not-allowed" : ""
  //       }`}
  //     >
  //       {friendButtonIcon}
  //       {friendButtonText}
  //     </button>
  //   );
  // };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center min-w-0">
        <Image
          src={member.avatar}
          alt={`${member.name}'s avatar`}
          width={48}
          height={48}
          className="rounded-full mr-3 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {member.name}
            </p>
            {renderRoleBadge()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {member.joinedDate !== null ? `Joined on ${member.joinedDate}` : ""}
          </p>
        </div>
      </div>
      {/* <div className="ml-4 flex-shrink-0">{renderActionButton()}</div> */}
    </div>
  );
};

export default MemberCardInfo;

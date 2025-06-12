import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare, UserPlus, Check, Clock } from "lucide-react";
import { FriendshipStatus } from "@/types/profile/FriendData";

export interface Person {
  id: string;
  name: string;
  avatar: string;
  profileUrl: string;
  // friendshipStatus: FriendshipStatus;
  description?: string;
}

interface PeopleCardProps {
  person: Person;
  profileId: string;
  isOwnProfile: boolean;
}

const PeopleCard: React.FC<PeopleCardProps> = ({
  person,
  profileId,
  isOwnProfile,
}) => {
  const handleChat = () => console.log(`Chat with ${person.id}`);
  // const handleAction = () =>
  //   console.log(`Action for ${person.id}, status: ${person.friendshipStatus}`);

  // const renderActionButton = () => {
  //   if (!isOwnProfile || person.friendshipStatus === "self") return null;

  //   switch (person.friendshipStatus) {
  //     case "not_friend":
  //       return (
  //         <button
  //           onClick={handleAction}
  //           className="min-w-32 px-5 py-2 rounded-md text-sm font-medium bg-pink-100 text-primary hover:bg-pink-200 dark:bg-primary dark:text-white dark:hover:bg-opacity-80 flex items-center justify-center"
  //         >
  //           <UserPlus className="w-3.5 h-3.5 mr-1" /> Add Friend
  //         </button>
  //       );
  //     case "pending_received":
  //       return (
  //         <button
  //           onClick={handleAction}
  //           className="min-w-32 px-5 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-opacity-80 flex items-center justify-center"
  //         >
  //           <Check className="w-3.5 h-3.5 mr-1" /> Respond
  //         </button>
  //       );
  //     case "pending_sent":
  //       return (
  //         <button
  //           disabled
  //           className="min-w-32 px-5 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-200 cursor-not-allowed flex items-center justify-center"
  //         >
  //           <Clock className="w-3.5 h-3.5 mr-1" /> Request Sent
  //         </button>
  //       );
  //     case "friend":
  //       return (
  //         <button
  //           onClick={handleChat}
  //           className="min-w-32 px-5 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 flex items-center justify-center"
  //         >
  //           <MessagesSquare className="w-3.5 h-3.5 mr-1" /> Chat
  //         </button>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between space-x-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Link href={person.profileUrl} className="flex-shrink-0">
          <div className="w-14 h-14 relative rounded-full overflow-hidden cursor-pointer">
            <Image
              src={person.avatar}
              alt={person.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        </Link>
        <div className="min-w-0 flex flex-col gap-1">
          <Link href={person.profileUrl} className="cursor-pointer">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-primary dark:hover:text-primary">
              {person.name}
            </h4>
          </Link>
          <h2 className="text-sm  text-gray-900 dark:text-gray-100 truncate ">
            {"Description: " + person.description || "No description available"}
          </h2>
        </div>
      </div>
      {/* <div className="flex-shrink-0">{renderActionButton()}</div> */}
    </div>
  );
};

export default PeopleCard;

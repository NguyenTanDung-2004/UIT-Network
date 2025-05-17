import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessagesSquare } from "lucide-react";
import { JoinedGroup } from "@/types/profile/FriendData";

interface JoinedCardProps {
  item: JoinedGroup;
  profileId: string;
  isOwnProfile: boolean;
}

const JoinedCard: React.FC<JoinedCardProps> = ({
  item,
  profileId,
  isOwnProfile,
}) => {
  const handleUnjoin = () => console.log(`Unjoin ${item.type} ${item.id}`);

  const linkUrl = `/groups/${item.id}`;

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm flex flex-col h-full">
      <Link href={linkUrl} className="block mb-3">
        <Image
          src={item.avatar}
          alt={item.name}
          width={80}
          height={80}
          className="w-full aspect-square object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow px-4">
        <Link href={linkUrl} className="hover:underline">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {item.name}
          </h4>
        </Link>
      </div>
      <div className="flex px-4 mb-3  items-center justify-between mt-4 space-x-2">
        {isOwnProfile && (
          <button
            onClick={handleUnjoin}
            className="text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-400 flex items-center ml-auto"
          >
            Unjoin
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinedCard;

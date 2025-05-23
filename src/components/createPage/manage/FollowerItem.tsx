import React from "react";
import Image from "next/image";
import { Follower } from "@/lib/mockData";
interface FollowerItemProps {
  follower: Follower;
}

const FollowerItem: React.FC<FollowerItemProps> = ({ follower }) => {
  return (
    <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={follower.avatar}
            alt={`${follower.name} avatar`}
            fill={true}
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {follower.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {follower.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FollowerItem;

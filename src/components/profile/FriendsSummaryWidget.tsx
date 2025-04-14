import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface FriendsSummaryWidgetProps {
  friends: Friend[];
  count: number;
  profileId: string;
}

const FriendsSummaryWidget: React.FC<FriendsSummaryWidgetProps> = ({
  friends,
  count,
  profileId,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Friends
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {count} friends
          </p>
        </div>
        <Link
          href={`/profiles/${profileId}/friends`}
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {friends.slice(0, 6).map((friend) => (
          <Link key={friend.id} href={`/profiles/${friend.id}`}>
            <div className="text-center cursor-pointer group">
              <div className="aspect-square relative rounded overflow-hidden mb-1">
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-primary">
                {friend.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default FriendsSummaryWidget;

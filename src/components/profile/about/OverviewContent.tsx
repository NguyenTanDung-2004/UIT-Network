import React from "react";
import InfoItemCard from "./InfoItemCard";
import { ProfileAboutData } from "@/types/profile/AboutData";
import { MoreHorizontal, Pencil } from "lucide-react";

interface OverviewContentProps {
  data: ProfileAboutData["overview"];
  isOwnProfile: boolean;
}

const OverviewContent: React.FC<OverviewContentProps> = ({
  data,
  isOwnProfile,
}) => {
  return (
    <div className="space-y-6">
      {data.bio && (
        <div className="relative group">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {data.bio}
          </p>
          {isOwnProfile && (
            <button className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil size={16} />
            </button>
          )}
          {!isOwnProfile && (
            <button className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={16} />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.born && (
          <InfoItemCard icon="far fa-calendar-alt" value={data.born} />
        )}
        {data.status && (
          <InfoItemCard icon="far fa-heart" value={data.status} />
        )}
        {data.occupation && (
          <InfoItemCard icon="fas fa-briefcase" value={data.occupation} />
        )}
        {data.livesIn && (
          <InfoItemCard icon="fas fa-map-marker-alt" value={data.livesIn} />
        )}
        {data.phone && (
          <InfoItemCard icon="fas fa-phone-alt" value={data.phone} />
        )}
        {data.email && (
          <InfoItemCard icon="far fa-envelope" value={data.email} />
        )}
      </div>
    </div>
  );
};

export default OverviewContent;

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MediaSummaryWidgetProps {
  photos: { url: string }[];
  profileId: string;
}

const MediaSummaryWidget: React.FC<MediaSummaryWidgetProps> = ({
  photos,
  profileId,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Photos
        </h3>
        <Link
          href={`/profiles/${profileId}/media`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.slice(0, 6).map(
          (
            photo,
            index // Hiển thị tối đa 6 ảnh
          ) => (
            <div
              key={index}
              className="aspect-square relative rounded overflow-hidden"
            >
              <Image
                src={photo.url}
                alt={`Photo ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default MediaSummaryWidget;

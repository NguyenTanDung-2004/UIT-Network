import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FileImage } from "lucide-react";

interface MediaSummaryWidgetProps {
  photos: { url: string }[];
  pageId: string;
}

const imageExtensions = [".jpeg", ".png", ".jpg", ".gif", ".svg", ".webp"];
const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

const getMediaType = (url: string): "image" | "video" | "unknown" => {
  if (!url) return "unknown";
  try {
    const lowerCaseUrl = url.toLowerCase();
    const extensionMatch = lowerCaseUrl.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : null;

    if (extension) {
      if (imageExtensions.includes(extension)) {
        return "image";
      }
      if (videoExtensions.includes(extension)) {
        return "video";
      }
    }
  } catch (e) {
    console.error("Error determining media type for URL:", url, e);
  }
  return "unknown";
};

const MediaSummaryWidget: React.FC<MediaSummaryWidgetProps> = ({
  photos,
  pageId,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Media
        </h3>
        <Link
          href={`/pages/${pageId}/media`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos && photos.length > 0 ? (
          photos.slice(0, 6).map((media, index) => {
            const mediaType = getMediaType(media.url);
            return (
              <div
                key={index}
                className="aspect-square relative rounded overflow-hidden bg-gray-200 dark:bg-gray-700 group"
              >
                {mediaType === "image" ? (
                  <Image
                    src={media.url}
                    alt={`Media ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                ) : mediaType === "video" ? (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="col-span-3 text-sm text-center text-gray-500 dark:text-gray-400 py-4">
            No media to display.
          </p>
        )}
      </div>
    </div>
  );
};
export default MediaSummaryWidget;

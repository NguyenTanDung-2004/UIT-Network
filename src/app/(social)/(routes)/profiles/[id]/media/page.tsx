"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}

const SAMPLE_MEDIA_URLS = [
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
  "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/sea-turtle.mp4",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/njpufnhlajjpss384yuz.png",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738661303/cld-sample-2.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample-4.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample-3.jpg",
  "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/cld-sample-video.mp4",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270447/samples/chair-and-coffee-table.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg",
];

const ProfileMediaPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const mediaItems: MediaItem[] = SAMPLE_MEDIA_URLS.map((url, i) => ({
    id: `media-${profileId}-${i}`,
    url: url,
    type: url.endsWith(".mp4") ? "video" : "image",
  }));

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  const handleMediaClick = (index: number) => {
    setViewerStartIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Media
      </h2>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {mediaItems.map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-md cursor-pointer group bg-gray-200 dark:bg-gray-700"
              onClick={() => handleMediaClick(index)}
            >
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  priority={index < 10}
                />
              ) : (
                <>
                  <video
                    src={item.url}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <i className="fas fa-play text-white text-3xl"></i>
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No media to display.
        </div>
      )}

      <MediaViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        mediaList={mediaItems}
        startIndex={viewerStartIndex}
      />
    </div>
  );
};

export default ProfileMediaPage;

"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";
import { getListMediaAndFilesByGroupId } from "@/services/groupService"; // Import API
import { MediaItem } from "@/services/groupService"; // Import MediaItem from groupService
import ClipLoader from "react-spinners/ClipLoader";

// Không cần getMediaType, imageExtensions, videoExtensions nữa vì API đã trả về type
// const imageExtensions = [".jpeg", ".png", ".jpg", ".gif", ".svg", ".webp"];
// const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
// const getMediaType = (url: string): "image" | "video" | "unknown" => { ... };

const MediaPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const groupId = params.id;

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchMedia = async () => {
      try {
        if (!groupId) {
          throw new Error("Invalid group ID.");
        }
        // Gọi API mới
        const { media: fetchedMedia, files: fetchedFiles } =
          await getListMediaAndFilesByGroupId(groupId);
        if (isMounted) {
          setMediaItems(fetchedMedia); // Chỉ set ảnh và video vào đây
          // Bạn có thể xử lý fetchedFiles riêng nếu muốn hiển thị chúng ở một phần khác
        }
      } catch (err: any) {
        console.error("Failed to fetch group media:", err);
        if (isMounted) {
          setError(err.message || "Failed to load group media.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMedia();

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const handleMediaClick = (index: number) => {
    setViewerStartIndex(index);
    setViewerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Media"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8 min-h-[400px]">
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

export default MediaPage;

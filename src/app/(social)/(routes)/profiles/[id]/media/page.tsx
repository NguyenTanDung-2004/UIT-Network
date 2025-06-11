"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";
import ClipLoader from "react-spinners/ClipLoader";
import { getListMediaByUserId } from "@/services/postService";
import { useUser } from "@/contexts/UserContext";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}

const ProfileMediaPage: React.FC<{ params: Promise<{ id: string }> }> = ({
  params: paramsPromise,
}) => {
  const params = use(paramsPromise);
  const profileId = params.id;

  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();

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
        if (userContextLoading) {
          return;
        }

        if (userContextError) {
          throw new Error(userContextError);
        }

        let targetUserId = profileId;
        if (profileId === "me" && user) {
          targetUserId = user.id;
        } else if (profileId === "me" && !user) {
          throw new Error("User not logged in. Cannot fetch media for 'me'.");
        }

        if (!targetUserId) {
          throw new Error("Invalid profile ID.");
        }

        const fetchedMedia = await getListMediaByUserId(targetUserId);

        if (isMounted) {
          setMediaItems(fetchedMedia);
        }
      } catch (err: any) {
        console.error("Error fetching media:", err);
        if (isMounted) {
          setError(err.message || "Failed to load media.");
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
  }, [profileId, user, userContextLoading, userContextError]);

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
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 mt-8 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/20 rounded-md max-w-md mx-auto">
        {error}
      </div>
    );
  }

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

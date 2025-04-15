"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MediaItem {
  url: string;
  type: string;
}

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaItem[];
  startIndex: number;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  startIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        gotoPreviousMedia();
      } else if (event.key === "ArrowRight") {
        gotoNextMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex]);

  const gotoPreviousMedia = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const gotoNextMedia = () => {
    setCurrentIndex((prev) => Math.min(mediaList.length - 1, prev + 1));
  };

  if (!isOpen || !mediaList || mediaList.length === 0) {
    return null;
  }

  const currentMedia = mediaList[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-5 text-gray-300 hover:text-white z-[1001] p-2"
        aria-label="Close viewer"
      >
        <i className="fas fa-times text-3xl"></i>
      </button>

      <div
        className="relative w-[90%] h-[90%] max-w-screen-xl max-h-screen-xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {currentIndex > 0 && (
          <button
            onClick={gotoPreviousMedia}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white z-[1001]"
          >
            <i className="fas fa-chevron-left text-3xl"></i>
          </button>
        )}

        {currentIndex < mediaList.length - 1 && (
          <button
            onClick={gotoNextMedia}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white z-[1001]"
          >
            <i className="fas fa-chevron-right text-3xl"></i>
          </button>
        )}

        {currentMedia && (
          <div className="w-full h-full flex items-center justify-center">
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.url}
                alt="Media content"
                layout="fill"
                objectFit="contain"
                quality={90}
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                className="max-w-full max-h-full object-contain outline-none"
                autoPlay
                loop
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaViewerModal;

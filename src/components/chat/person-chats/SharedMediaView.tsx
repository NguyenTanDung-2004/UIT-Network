import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { SharedMediaItem } from "@/types/chats/ChatData";

interface SharedMediaViewProps {
  mediaList: SharedMediaItem[];
  onBack: () => void;
  onMediaItemClick: (media: SharedMediaItem, index: number) => void;
}

const SharedMediaView: React.FC<SharedMediaViewProps> = ({
  mediaList,
  onBack,
  onMediaItemClick,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0">
        <button
          onClick={onBack}
          className="mr-3 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Back to details"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-bold text-black dark:text-gray-100">
          Shared Media ({mediaList.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="grid grid-cols-3 gap-1.5">
          {mediaList.map((media, index) => (
            <button
              key={media.id}
              onClick={() => onMediaItemClick(media, index)}
              className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              title={`View media ${index + 1}`}
            >
              {media.type === "image" ? (
                <Image
                  src={media.url}
                  alt="Shared media preview"
                  fill
                  sizes="(max-width: 768px) 33vw, 100px"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <>
                  <video
                    src={media.url}
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedMediaView;

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  FileText,
  Link as LinkIcon,
  Image as ImageIconVideo,
  Users,
  Calendar,
  LogOut,
  Bell,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";
import { SharedMediaItem } from "@/types/chats/ChatData";
import { SharedFileItem } from "@/types/chats/ChatData";
import { SharedLinkItem } from "@/types/chats/ChatData";
import { getFileIcon, formatFileSize } from "@/utils/ViewFilesUtils";
import SharedMediaView from "./SharedMediaView";
import SharedFilesView from "./SharedFilesView";
import SharedLinksView from "./SharedLinksView";

interface GroupMemberInfo {
  id: string;
  name: string;
  avatar: string;
}

interface ChatDetailProps {
  type: "person" | "group";
  partnerName?: string;
  partnerAvatar?: string;
  groupName?: string;
  groupAvatar?: string;
  sharedMedia: SharedMediaItem[];
  sharedFiles: SharedFileItem[];
  sharedLinks: SharedLinkItem[];
  groupMembers?: GroupMemberInfo[];
  onClose: () => void;
  onViewAllMedia?: () => void;
  onViewAllFiles?: () => void;
  onViewAllLinks?: () => void;
  onViewMembers?: () => void;
  onScheduleEvent?: () => void;
  onLeaveGroup?: () => void;
  onBlockUser?: () => void;
  onToggleNotifications?: () => void;
  onMediaItemClick?: (mediaItem: SharedMediaItem, index: number) => void;
}

type DetailView = "details" | "media" | "files" | "links";

const ChatDetail: React.FC<ChatDetailProps> = ({
  type,
  sharedMedia,
  sharedFiles,
  sharedLinks,
  groupMembers,
  onClose,
  onViewAllMedia,
  onViewAllFiles,
  onViewAllLinks,
  onViewMembers,
  onScheduleEvent,
  onLeaveGroup,
  onBlockUser,
  onToggleNotifications,
  onMediaItemClick,
}) => {
  const [currentView, setCurrentView] = useState<DetailView>("details");
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [mediaViewerList, setMediaViewerList] = useState<SharedMediaItem[]>([]);
  const [mediaViewerStartIndex, setMediaViewerStartIndex] = useState(0);

  // Hàm xử lý click media mở modal
  const handleMediaClick = (media: SharedMediaItem, index: number) => {
    setMediaViewerList(sharedMedia);
    setMediaViewerStartIndex(index);
    setIsMediaViewerOpen(true);
    if (onMediaItemClick) {
      onMediaItemClick(media, index);
    }
  };

  const renderSection = (
    title: string,
    content: React.ReactNode,
    viewAllHandler?: () => void,
    itemCountForTitle?: number
  ) => {
    const displayCount = itemCountForTitle;
    if (!content || (Array.isArray(content) && content.length === 0))
      return null;

    return (
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2 px-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {title} {displayCount !== undefined ? `(${displayCount})` : ""}
          </h4>
          {viewAllHandler && (
            <button
              onClick={viewAllHandler}
              className="text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light p-1 -mr-1" // Make clickable area slightly larger
              aria-label={`View all ${title}`}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
        <div className="px-4">{content}</div>
      </div>
    );
  };

  const renderActionButtons = () => {
    interface ActionButtonConfig {
      icon: React.FC<any>;
      label: string;
      action?: () => void;
      viewTarget?: DetailView;
      danger?: boolean;
    }
    const buttonConfigMap: Record<string, ActionButtonConfig> = {
      media: { icon: ImageIconVideo, label: "Media", viewTarget: "media" },
      files: { icon: FileText, label: "Files", viewTarget: "files" },
      links: { icon: LinkIcon, label: "Links", viewTarget: "links" },
      notifications: {
        icon: Bell,
        label: "Notifications",
        action: onToggleNotifications,
      },
      members: { icon: Users, label: "Members", action: onViewMembers },
      schedule: { icon: Calendar, label: "Schedule", action: onScheduleEvent },
      leave: {
        icon: LogOut,
        label: "Leave",
        action: onLeaveGroup,
        danger: true,
      },
      block: { icon: Users, label: "Block", action: onBlockUser, danger: true },
    };
    const commonSections: (keyof typeof buttonConfigMap)[] = [
      "media",
      "files",
      "links",
      "notifications",
    ];
    const personSections: (keyof typeof buttonConfigMap)[] = [
      ...commonSections,
    ];
    const groupSections: (keyof typeof buttonConfigMap)[] = [
      ...commonSections,
      "members",
    ];
    const sectionsToShow = type === "group" ? groupSections : personSections;
    return (
      <div className="flex justify-around items-center px-4 pt-2 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        {sectionsToShow.map((sectionKey) => {
          const config = buttonConfigMap[sectionKey];
          if (!config) return null;
          const handleClick = () => {
            if (config.action) config.action();
            if (config.viewTarget) setCurrentView(config.viewTarget);
          };
          return (
            <button
              key={sectionKey}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center p-1 rounded-full w-14 h-14 transition-colors text-center group focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                config.danger
                  ? "hover:bg-red-50 dark:hover:bg-red-900/20"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title={config.label}
            >
              <div
                className={`w-10 h-10 mb-0.5 rounded-full flex items-center justify-center ${
                  config.danger
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <config.icon
                  size={18}
                  className={`${
                    config.danger
                      ? "text-red-600 dark:text-red-400"
                      : "text-primary "
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const mediaPreviewContent =
    sharedMedia.length > 0 ? (
      <div className="grid grid-cols-3 gap-1.5">
        {sharedMedia.slice(0, 6).map((media, index) => (
          <button
            key={media.id}
            onClick={() => handleMediaClick(media, index)}
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
    ) : null;
  const filesPreviewContent =
    sharedFiles.length > 0
      ? sharedFiles.slice(0, 3).map((file) => (
          <a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 mb-1 transition-colors"
            title={`Open ${file.name}`}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full flex-shrink-0">
              <img
                src={getFileIcon(file.type)}
                alt="file icon"
                className="w-4 h-4"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                {file.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </a>
        ))
      : null;
  const linksPreviewContent =
    sharedLinks.length > 0
      ? sharedLinks.slice(0, 3).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 mb-1 transition-colors"
            title={`Open link: ${link.url}`}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full flex-shrink-0">
              <LinkIcon
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                {link.title || link.url}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {link.domain || new URL(link.url).hostname.replace("www.", "")}
              </p>
            </div>
          </a>
        ))
      : null;
  const membersPreviewContent =
    type === "group" && groupMembers && groupMembers.length > 0 ? (
      <div className="flex -space-x-2 overflow-hidden">
        {groupMembers.slice(0, 7).map((member) => (
          <Image
            key={member.id}
            src={member.avatar}
            width={28}
            height={28}
            alt={member.name}
            title={member.name}
            className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
          />
        ))}
        {groupMembers.length > 7 && (
          <div
            title={`${groupMembers.length - 7} more members`}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            +{groupMembers.length - 7}
          </div>
        )}
      </div>
    ) : null;

  const renderCurrentView = () => {
    switch (currentView) {
      case "media":
        return (
          <SharedMediaView
            mediaList={sharedMedia}
            onBack={() => setCurrentView("details")}
            onMediaItemClick={(item, index) => handleMediaClick(item, index)} // Pass both media and index
          />
        );
      case "files":
        return (
          <SharedFilesView
            filesList={sharedFiles}
            onBack={() => setCurrentView("details")}
          />
        );
      case "links":
        return (
          <SharedLinksView
            linksList={sharedLinks}
            onBack={() => setCurrentView("details")}
          />
        );
      case "details":
      default:
        return (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pt-0 pb-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Chat details
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Close chat details"
              >
                <X size={20} />
              </button>
            </div>

            {renderActionButtons()}
            <div id="detail-section-media">
              {renderSection(
                "Shared media",
                mediaPreviewContent,
                () => setCurrentView("media"),
                sharedMedia.length
              )}
            </div>
            <div id="detail-section-files">
              {renderSection(
                "Shared files",
                filesPreviewContent,
                () => setCurrentView("files"),
                sharedFiles.length
              )}
            </div>
            <div id="detail-section-links">
              {renderSection(
                "Shared links",
                linksPreviewContent,
                () => setCurrentView("links"),
                sharedLinks.length
              )}
            </div>
            {type === "group" && membersPreviewContent && (
              <div id="detail-section-members">
                {renderSection(
                  "Members",
                  membersPreviewContent,
                  onViewMembers,
                  groupMembers?.length
                )}
              </div>
            )}
          </div>
        );
    }
  };

  // const mediaContent =
  //   sharedMedia.length > 0 ? (
  //     <div className="grid grid-cols-3 gap-1.5">
  //       {sharedMedia.slice(0, 6).map((media, index) => (
  //         <button
  //           key={media.id}
  //           onClick={() => handleMediaClick(media, index)}
  //           className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
  //           title={`View media ${index + 1}`}
  //         >
  //           {media.type === "image" ? (
  //             <Image
  //               src={media.url}
  //               alt="Shared media preview"
  //               fill
  //               sizes="(max-width: 768px) 33vw, 100px"
  //               className="object-cover transition-transform duration-200 group-hover:scale-105"
  //             />
  //           ) : (
  //             <>
  //               <video
  //                 src={media.url}
  //                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  //                 muted
  //                 playsInline
  //                 preload="metadata"
  //               />
  //               <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
  //                 <i className="fas fa-play text-white text-3xl"></i>
  //               </div>
  //             </>
  //           )}
  //         </button>
  //       ))}
  //     </div>
  //   ) : null;

  // const filesContent =
  //   sharedFiles.length > 0
  //     ? sharedFiles.slice(0, 3).map((file) => (
  //         <a
  //           key={file.id}
  //           href={file.url}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 mb-1 transition-colors"
  //           title={`Open ${file.name}`}
  //         >
  //           <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full flex-shrink-0">
  //             <img
  //               src={getFileIcon(file.type)}
  //               alt="file icon"
  //               className="w-4 h-4"
  //             />
  //           </div>
  //           <div className="min-w-0 flex-1">
  //             <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
  //               {file.name}
  //             </p>
  //             <p className="text-[11px] text-gray-500 dark:text-gray-400">
  //               {formatFileSize(file.size)}
  //             </p>
  //           </div>
  //         </a>
  //       ))
  //     : null;

  // const linksContent =
  //   sharedLinks.length > 0
  //     ? sharedLinks.slice(0, 3).map((link) => (
  //         <a
  //           key={link.id}
  //           href={link.url}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="flex items-center gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 mb-1 transition-colors"
  //           title={`Open link: ${link.url}`}
  //         >
  //           <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-full flex-shrink-0">
  //             <LinkIcon
  //               size={16}
  //               className="text-gray-600 dark:text-gray-400"
  //             />
  //           </div>
  //           <div className="min-w-0 flex-1">
  //             <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
  //               {link.title || link.url}
  //             </p>
  //             <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
  //               {link.domain || new URL(link.url).hostname.replace("www.", "")}
  //             </p>
  //           </div>
  //         </a>
  //       ))
  //     : null;

  // const membersContent =
  //   type === "group" && groupMembers && groupMembers.length > 0 ? (
  //     <div className="flex -space-x-2 overflow-hidden">
  //       {groupMembers.slice(0, 7).map((member) => (
  //         <Image
  //           key={member.id}
  //           src={member.avatar}
  //           width={28}
  //           height={28}
  //           alt={member.name}
  //           title={member.name}
  //           className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
  //         />
  //       ))}
  //       {groupMembers.length > 7 && (
  //         <div
  //           title={`${groupMembers.length - 7} more members`}
  //           className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300"
  //         >
  //           +{groupMembers.length - 7}
  //         </div>
  //       )}
  //     </div>
  //   ) : null;

  return (
    <div className="w-80 md:w-96 h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
      {renderCurrentView()}

      {isMediaViewerOpen && (
        <MediaViewerModal
          isOpen={isMediaViewerOpen}
          onClose={() => setIsMediaViewerOpen(false)}
          // Pass the compatible SharedMediaItem[] directly after ensuring type safety if needed
          mediaList={mediaViewerList}
          startIndex={mediaViewerStartIndex}
        />
      )}
    </div>
  );
};

export default ChatDetail;

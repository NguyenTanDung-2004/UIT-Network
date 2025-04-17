"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Image as ImageIcon,
  SendHorizontal,
  ArrowDown,
} from "lucide-react";
import { ClipLoader } from "react-spinners";

import ChatMessageItem from "@/components/chat/person-chats/ChatMessageItem";
import ChatInput from "@/components/chat/person-chats/ChatInput";
import ChatDetail from "@/components/chat/person-chats/ChatDetail";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";
import { Message } from "@/types/chats/ChatData";

interface MediaItem {
  url: string;
  type: string;
}
interface ChatPartnerInfo {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}
interface SharedMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
}
interface SharedFileItem {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}
interface SharedLinkItem {
  id: string;
  url: string;
  title?: string;
  domain?: string;
}

const CURRENT_USER_ID = "my-user-id";
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

// --- Mock Fetch Functions (Replace with API calls) ---
async function fetchPersonInfo(
  personId: string
): Promise<ChatPartnerInfo | null> {
  console.log("Fetching info for person:", personId);
  await new Promise((res) => setTimeout(res, 300));
  if (personId === "not-found") return null;
  return {
    id: personId,
    name: `Nguyễn Tấn Dũng ${personId.split("-")[1] || ""}`,
    avatar: DEFAULT_AVATAR,
    isOnline: Math.random() > 0.3,
  };
}

async function fetchMessages(
  chatId: string, // chatId could be personId for 1-on-1
  limit = 20,
  offset = 0
): Promise<Message[]> {
  console.log(
    `Fetching messages for ${chatId}, limit ${limit}, offset ${offset}`
  );
  await new Promise((res) => setTimeout(res, 500));
  const messages: Message[] = [];
  const messageCount = 30; // Total mock messages
  const startIndex = offset;
  const endIndex = Math.min(offset + limit, messageCount);

  for (let i = startIndex; i < endIndex; i++) {
    const isSender = Math.random() > 0.5;
    const msgType = Math.random();
    let type: Message["type"] = "text";
    let content = `This is message number ${messageCount - i}. `;
    let mediaUrl: string | undefined;
    let fileName: string | undefined;
    let fileSize: number | undefined;
    let fileType: string | undefined;

    if (msgType < 0.15) {
      // Image
      type = "image";
      content = i % 3 === 0 ? "" : "A beautiful picture."; // Sometimes no text with image
      mediaUrl = `https://picsum.photos/seed/${chatId}-${i}/600/400`; // Slightly larger images
    } else if (msgType < 0.2) {
      // Video
      type = "video";
      content = "Check this out!";
      mediaUrl =
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Sample video
    } else if (msgType < 0.25) {
      // File
      type = "file";
      content = ""; // Usually no text with file
      mediaUrl = "/mock-files/sample-file.pdf";
      fileName = `Sample Document ${i}.pdf`;
      fileSize = Math.floor(Math.random() * 1000 * 1024) + 50 * 1024;
      fileType = "application/pdf";
    } else {
      content += "Some more text to make it longer. ".repeat(
        Math.floor(Math.random() * 3)
      );
      if (i % 5 === 0) content = "Ok";
      if (i % 7 === 0) content = "Wooooo waoo !!!!\nCá nhà ngủ ngon ✨✨✨";
    }

    messages.push({
      id: `msg-${chatId}-${messageCount - i}`,
      senderId: isSender ? CURRENT_USER_ID : chatId,
      content,
      timestamp: new Date(
        Date.now() - (i * 5 * 60 * 1000 + Math.random() * 60 * 1000)
      ), // ~5 min intervals + randomness
      type,
      mediaUrl,
      fileName,
      fileSize,
      fileType,
    });
  }
  // Return sorted oldest first, same as before
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

async function fetchSharedItems(chatId: string): Promise<{
  media: SharedMediaItem[];
  files: SharedFileItem[];
  links: SharedLinkItem[];
}> {
  console.log("Fetching shared items for:", chatId);
  await new Promise((res) => setTimeout(res, 400));
  return {
    media: [
      {
        id: "media-fixed-1",
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
        type: "image",
      },
      {
        id: "media-fixed-2",
        url: "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/cld-sample-video.mp4",
        type: "video",
      },
      {
        id: "media-fixed-3",
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample-3.jpg",
        type: "image",
      },
      {
        id: "media-fixed-4",
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738273042/hobbies/njpufnhlajjpss384yuz.png",
        type: "image",
      },
      {
        id: "media-fixed-5",
        url: "https://res.cloudinary.com/dos914bk9/video/upload/v1738270440/samples/sea-turtle.mp4",
        type: "video",
      },
      {
        id: "media-fixed-6",
        url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738270446/samples/breakfast.jpg",
        type: "image",
      },
    ],
    files: Array.from({ length: 5 }).map((_, i) => ({
      id: `file-${i}`,
      name: `Đề ôn thi cuối kỳ 24-25-${i}.pdf`,
      size: 100 * 1024 + i * 1024,
      url: `/mock-files/shared-${i}.pdf`,
      type: "application/pdf",
    })),
    links: Array.from({ length: 5 }).map((_, i) => ({
      id: `link-${i}`,
      url:
        i % 2 === 0
          ? "https://www.tiktok.com/@eset.fang/video/7..."
          : "https://www.facebook.com/groups/7628504...",
      title: i % 2 === 0 ? "TikTok - Eser Fang" : "Java deve...",
    })),
  };
}

// --- Main Page Component ---
const PersonChatPage = () => {
  const params = useParams();
  const personId = params?.id as string;

  const [partnerInfo, setPartnerInfo] = useState<ChatPartnerInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sharedMedia, setSharedMedia] = useState<SharedMediaItem[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileItem[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLinkItem[]>([]);

  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingShared, setIsLoadingShared] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [showDetails, setShowDetails] = useState(true);

  // State for the profile's MediaViewerModal
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerList, setMediaViewerList] = useState<MediaItem[]>([]);
  const [mediaViewerStartIndex, setMediaViewerStartIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (!personId) {
      setError("Invalid chat ID.");
      setIsLoadingInfo(false);
      setIsLoadingMessages(false);
      setIsLoadingShared(false);
      return;
    }

    let isMounted = true;
    setIsLoadingInfo(true);
    setIsLoadingMessages(true);
    setIsLoadingShared(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [info, initialMessages, shared] = await Promise.all([
          fetchPersonInfo(personId),
          fetchMessages(personId, 20, 0),
          fetchSharedItems(personId),
        ]);

        if (!isMounted) return;

        if (!info) {
          setError("Chat partner not found.");
        } else {
          setPartnerInfo(info);
          setMessages(initialMessages);
          setSharedMedia(shared.media);
          setSharedFiles(shared.files);
          setSharedLinks(shared.links);
        }
      } catch (err) {
        console.error("Failed to fetch chat data:", err);
        if (isMounted) setError("Could not load chat data.");
      } finally {
        if (isMounted) {
          setIsLoadingInfo(false);
          setIsLoadingMessages(false);
          setIsLoadingShared(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [personId]);

  // Scroll to bottom when messages load or new messages are added
  useEffect(() => {
    if (!isLoadingMessages) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoadingMessages, scrollToBottom]);

  const handleSendMessage = async (text: string, attachments?: any[]) => {
    if (!partnerInfo) return;
    setIsSending(true);
    console.log("Sending:", { text, attachments });

    const optimisticMessages: Message[] = [];
    const timestamp = new Date();

    if (attachments && attachments.length > 0) {
      attachments.forEach((att, index) => {
        const msgType =
          att.type === "image" || att.type === "video" ? att.type : "file";
        optimisticMessages.push({
          id: `temp-${Date.now()}-${index}`,
          senderId: CURRENT_USER_ID,
          content: index === attachments.length - 1 ? text : "",
          timestamp: timestamp,
          type: msgType,
          mediaUrl: att.url,
          fileName: msgType === "file" ? att.name : undefined,
          fileSize: msgType === "file" ? att.size : undefined,
          fileType: msgType === "file" ? att.type : undefined,
        });
      });
    } else if (text) {
      optimisticMessages.push({
        id: `temp-${Date.now()}`,
        senderId: CURRENT_USER_ID,
        content: text,
        timestamp: timestamp,
        type: "text",
      });
    }

    if (optimisticMessages.length > 0) {
      setMessages((prev) => [...prev, ...optimisticMessages]);
    }

    try {
      await new Promise((res) => setTimeout(res, 700));
      console.log("Message supposedly sent.");
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message.");
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
    } finally {
      setIsSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // Updated handler to prepare data for the profile MediaViewerModal
  const handleMediaClick = (clickedMessageId: string) => {
    const mediaMessages = messages.filter(
      (msg) => (msg.type === "image" || msg.type === "video") && msg.mediaUrl
    );

    const viewerItems: MediaItem[] = mediaMessages.map((msg) => ({
      // id: msg.id, // Profile viewer doesn't use ID in its MediaItem type
      url: msg.mediaUrl!,
      type: msg.type, // Type is already 'image' or 'video'
    }));

    const clickedIndex = mediaMessages.findIndex(
      (msg) => msg.id === clickedMessageId
    );

    if (viewerItems.length > 0 && clickedIndex !== -1) {
      setMediaViewerList(viewerItems);
      setMediaViewerStartIndex(clickedIndex);
      setMediaViewerOpen(true);
    }
  };

  const closeMediaViewer = () => {
    setMediaViewerOpen(false);
    // No need to reset currentMediaView as it's removed
  };

  if (isLoadingInfo || isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color="#FF69B4" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!partnerInfo) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-center text-gray-500">
        Chat partner not found.
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center min-w-0">
            <div className="w-10 h-10 flex-shrink-0 mr-3 relative">
              <Image
                src={partnerInfo.avatar}
                alt={partnerInfo.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              {partnerInfo.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {partnerInfo.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {partnerInfo.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="p-2 text-primary dark:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <Phone size={20} />
            </button>
            <button className="p-2 text-primary dark:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <Video size={20} />
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <Info size={20} />
            </button>
          </div>
        </div>

        <div
          ref={chatListRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col-reverse"
        >
          <div ref={messagesEndRef} />
          {[...messages].reverse().map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isSender={msg.senderId === CURRENT_USER_ID}
              isGroup={false}
              // Pass message ID to handler
              onMediaClick={() =>
                msg.mediaUrl && (msg.type === "image" || msg.type === "video")
                  ? handleMediaClick(msg.id)
                  : undefined
              }
            />
          ))}
        </div>

        <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
      </div>

      {showDetails && (
        <ChatDetail
          type="person"
          partnerName={partnerInfo.name}
          partnerAvatar={partnerInfo.avatar}
          sharedMedia={sharedMedia}
          sharedFiles={sharedFiles}
          sharedLinks={sharedLinks}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* Use the imported MediaViewerModal with adapted props */}
      <MediaViewerModal
        isOpen={mediaViewerOpen}
        onClose={closeMediaViewer}
        mediaList={mediaViewerList} // Pass the prepared list
        startIndex={mediaViewerStartIndex} // Pass the calculated start index
      />
    </div>
  );
};

export default PersonChatPage;

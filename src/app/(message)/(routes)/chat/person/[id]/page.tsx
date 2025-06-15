"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Phone, Video, Info } from "lucide-react";
import { ClipLoader } from "react-spinners";

import ChatMessageItem from "@/components/chat/person-chats/ChatMessageItem";
import ChatInput from "@/components/chat/person-chats/ChatInput";
import ChatDetail from "@/components/chat/person-chats/ChatDetail";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";
import {
  Message,
  SharedMediaItem,
  SharedFileItem,
  SharedLinkItem,
} from "@/types/chats/ChatData";
import { getListMessages } from "@/services/chatService";
import { useUser } from "@/contexts/UserContext";
import { useChatList } from "../../ChatListContext";

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

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const PersonChatPage = () => {
  const params = useParams();
  const chatId = params?.id as string;
  const {
    user,
    loading: userContextLoading,
    error: userContextError,
  } = useUser();
  const {
    chats,
    loading: chatListLoading,
    error: chatListError,
  } = useChatList();

  const [partnerInfo, setPartnerInfo] = useState<ChatPartnerInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sharedMedia, setSharedMedia] = useState<SharedMediaItem[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileItem[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLinkItem[]>([]);

  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingShared, setIsLoadingShared] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [showDetails, setShowDetails] = useState(true);

  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerList, setMediaViewerList] = useState<MediaItem[]>([]);
  const [mediaViewerStartIndex, setMediaViewerStartIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatListLoading || userContextLoading) {
      setError(null);
      return;
    }

    if (chatListError || userContextError) {
      setError(chatListError || userContextError);
      setPartnerInfo(null);
      return;
    }

    const currentChatTopic = chats.find(
      (chat) => chat.id === chatId && chat.type === "person"
    );

    if (currentChatTopic) {
      setPartnerInfo({
        id: currentChatTopic.id,
        name: currentChatTopic.name,
        avatar: currentChatTopic.avatar,
        isOnline: currentChatTopic.isOnline,
      });
      setError(null);
    } else {
      setError("Chat partner not found for this conversation ID.");
      setPartnerInfo(null);
    }
  }, [
    chatId,
    chats,
    chatListLoading,
    chatListError,
    userContextLoading,
    userContextError,
  ]);

  useEffect(() => {
    if (!user || !chatId || !partnerInfo) {
      setIsLoadingMessages(true);
      setIsLoadingShared(true);
      return;
    }

    let isMounted = true;
    setIsLoadingMessages(true);
    setIsLoadingShared(true);
    setError(null);

    const fetchChatContent = async () => {
      try {
        const {
          messages: fetchedMessages,
          media,
          files,
        } = await getListMessages(chatId);

        if (!isMounted) return;

        setMessages(fetchedMessages);
        setSharedMedia(media);
        setSharedFiles(files);
      } catch (err: any) {
        console.error("Failed to fetch chat content:", err);
        if (isMounted) setError(err.message || "Could not load chat content.");
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
          setIsLoadingShared(false);
        }
      }
    };

    fetchChatContent();

    return () => {
      isMounted = false;
    };
  }, [chatId, user, partnerInfo]); // Add partnerInfo to dependencies

  useEffect(() => {
    if (!isLoadingMessages) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoadingMessages, scrollToBottom]);

  const handleSendMessage = async (text: string, attachments?: any[]) => {
    if (!partnerInfo || !user) return;
    setIsSending(true);

    const optimisticMessages: Message[] = [];
    const timestamp = new Date();

    if (attachments && attachments.length > 0) {
      attachments.forEach((att, index) => {
        const msgType =
          att.type === "image" || att.type === "video" ? att.type : "file";
        optimisticMessages.push({
          id: `temp-${Date.now()}-${index}`,
          senderId: user.id,
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
        senderId: user.id,
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
    } catch (sendError) {
      console.error("Failed to send message:", sendError);
      setError("Failed to send message.");
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
    } finally {
      setIsSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleMediaClick = (clickedMessageId: string) => {
    const mediaMessages = messages.filter(
      (msg) => (msg.type === "image" || msg.type === "video") && msg.mediaUrl
    );

    const viewerItems: MediaItem[] = mediaMessages.map((msg) => ({
      url: msg.mediaUrl!,
      type: msg.type,
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
  };

  if (chatListLoading || userContextLoading || isLoadingMessages) {
    // Add isLoadingMessages here
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color="#FF69B4" size={40} />
      </div>
    );
  }

  if (error || userContextError || chatListError || !user) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-center text-red-500">
        {error ||
          userContextError ||
          chatListError ||
          "User not logged in or data unavailable."}
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
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-4 mb-16">
              No messages yet.
            </div>
          ) : (
            [...messages]
              .reverse()
              .map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  isSender={msg.senderId === user.id}
                  isGroup={false}
                  onMediaClick={() =>
                    msg.mediaUrl &&
                    (msg.type === "image" || msg.type === "video")
                      ? handleMediaClick(msg.id)
                      : undefined
                  }
                />
              ))
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
      </div>

      {showDetails && partnerInfo && (
        <ChatDetail
          type="person"
          partnerName={partnerInfo.name}
          partnerAvatar={partnerInfo.avatar}
          sharedMedia={sharedMedia}
          sharedFiles={sharedFiles}
          sharedLinks={sharedLinks}
          onClose={() => setShowDetails(false)}
          schedules={[]}
          currentUserInfo={{
            id: user.id,
            name: user.name,
            avatar: user.avtURL || DEFAULT_AVATAR,
            role: "member",
          }}
          groupMembers={undefined}
          onAddMember={() => {}}
          onChatMember={() => {}}
          onRemoveMember={() => {}}
          onCreateSchedule={() => {}}
          onViewScheduleDetails={() => {}}
          onDeleteSchedule={() => {}}
          onBlockUser={() => console.log("Block user action")}
          onToggleNotifications={() =>
            console.log("Toggle notifications action")
          }
          groupId={chatId}
        />
      )}

      <MediaViewerModal
        isOpen={mediaViewerOpen}
        onClose={closeMediaViewer}
        mediaList={mediaViewerList}
        startIndex={mediaViewerStartIndex}
      />
    </div>
  );
};

export default PersonChatPage;

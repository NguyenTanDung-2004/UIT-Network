"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Phone, Video, Info } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useToast } from "@/hooks/use-toast";

import ChatMessageItem from "@/components/chat/person-chats/ChatMessageItem";
import ChatInput from "@/components/chat/person-chats/ChatInput";
import ChatDetail from "@/components/chat/person-chats/ChatDetail";
import MediaViewerModal from "@/components/profile/media/MediaViewerModal";
import {
  Message,
  SharedMediaItem,
  SharedFileItem,
  SharedLinkItem,
  GroupMemberInfo, // Keep GroupMemberInfo for ChatDetail's currentUserInfo
} from "@/types/chats/ChatData";
import {
  getListMessages,
  sendMessageToPerson, // Import for person messages
  sendMessageToAI, // Import for AI messages
  subscribeToChatMessages, // Import for WebSocket messages
} from "@/services/chatService";
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
  const chatId = params?.id as string; // Here chatId refers to the conversationId with the person
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
  const { toast } = useToast();

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

  const fetchDataForChat = useCallback(async () => {
    try {
      if (chatListLoading || userContextLoading) {
        return;
      }

      if (chatListError || userContextError) {
        throw new Error(chatListError || userContextError || "Unknown error");
      }

      if (!user) {
        throw new Error("User not authenticated.");
      }

      const currentChatTopic = chats.find(
        (chat) => chat.id === chatId && chat.type === "person"
      );

      if (!currentChatTopic) {
        setError("Chat partner not found for this conversation ID.");
        setPartnerInfo(null);
        setIsLoadingMessages(false);
        setIsLoadingShared(false);
        return;
      }

      setPartnerInfo({
        id: currentChatTopic.otheruserid ? currentChatTopic.otheruserid : "",
        name: currentChatTopic.name,
        avatar: currentChatTopic.avatar,
        isOnline: currentChatTopic.isOnline,
      });
      setError(null);

      const {
        messages: fetchedMessages,
        media,
        files,
      } = await getListMessages(currentChatTopic.id);

      setMessages(fetchedMessages);
      setSharedMedia(media);
      setSharedFiles(files);
    } catch (err: any) {
      console.error("Failed to fetch chat content:", err);
      setError(err.message || "Could not load chat content.");
    } finally {
      setIsLoadingMessages(false);
      setIsLoadingShared(false);
    }
  }, [
    chatId,
    user,
    chats,
    chatListLoading,
    userContextLoading,
    chatListError,
    userContextError,
  ]);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingMessages(true);
    setIsLoadingShared(true);
    setError(null);

    if (chatId) {
      fetchDataForChat().then(() => {
        if (isMounted) setTimeout(scrollToBottom, 100);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [chatId, fetchDataForChat, scrollToBottom]);

  // STOMP WebSocket message handling for current chat
  useEffect(() => {
    if (!chatId || !user?.id) return;

    const onStompMessageReceived = (newMessage: Message) => {
      setMessages((prevMessages) => {
        // Find and replace optimistic message if it's our own message
        if (newMessage.senderId === user.id) {
          const optimisticIndex = prevMessages.findIndex(
            (msg) =>
              msg.senderId === user.id &&
              msg.content === newMessage.content &&
              Math.abs(
                msg.timestamp.getTime() - newMessage.timestamp.getTime()
              ) < 2000 && // Allow small timestamp diff for optimistic
              msg.id.startsWith("temp-") // Identify optimistic messages by temp ID
          );

          if (optimisticIndex !== -1) {
            // Replace optimistic message with the real one from server
            const newMessages = [...prevMessages];
            newMessages[optimisticIndex] = newMessage;
            return newMessages.sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            );
          }
        }
        // If not our message, or no matching optimistic message, just add it
        return [...prevMessages, newMessage].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
      });
      scrollToBottom();
    };

    // Subscribe to messages for the current chat ID
    const unsubscribe = subscribeToChatMessages(chatId, onStompMessageReceived);

    return () => {
      // Unsubscribe when component unmounts or chatId changes
      unsubscribe();
    };
  }, [chatId, user?.id, scrollToBottom]);

  const handleSendMessage = async (text: string, attachments?: any[]) => {
    if (!partnerInfo || !user) return;
    setIsSending(true);

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`, // Temporary ID for optimistic update
      senderId: user.id,
      content: text,
      timestamp: new Date(),
      type: "text", // Default optimistic type
      mediaUrl:
        attachments && attachments.length > 0 ? attachments[0].url : undefined,
      fileName:
        attachments && attachments.length > 0 && attachments[0].type === "file"
          ? attachments[0].name
          : undefined,
      fileSize:
        attachments && attachments.length > 0 && attachments[0].type === "file"
          ? attachments[0].size
          : undefined,
      fileType:
        attachments && attachments.length > 0 && attachments[0].type === "file"
          ? attachments[0].type
          : undefined,
    };

    if (attachments && attachments.length > 0) {
      optimisticMessage.type =
        attachments[0].type === "image"
          ? "image"
          : attachments[0].type === "video"
          ? "video"
          : "file";
    }

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await sendMessageToPerson(optimisticMessage, partnerInfo.id);
    } catch (sendError: any) {
      console.error("Failed to send message:", sendError);
      toast({
        title: "Send Failed",
        description: sendError.message || "Could not send message.",
        variant: "destructive",
      });
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSendAIMessage = async (question: string) => {
    if (!partnerInfo || !user) return;
    setIsSending(true);

    const optimisticAIMessage: Message = {
      id: `temp-ai-${Date.now()}`,
      senderId: user.id,
      content: question, // Content is the question
      timestamp: new Date(),
      type: "text", // AI question is always text
    };

    setMessages((prev) => [...prev, optimisticAIMessage]);

    try {
      await sendMessageToAI(question, partnerInfo.id);
    } catch (error: any) {
      console.error("Failed to send AI message:", error);
      toast({
        title: "AI Message Failed",
        description: error.message || "Could not send AI message.",
        variant: "destructive",
      });
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticAIMessage.id)
      );
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

  const currentUserGroupInfo: GroupMemberInfo = {
    id: user.id,
    name: user.name,
    avatar: user.avtURL || DEFAULT_AVATAR,
    role: "member", // Default role for display, can be more specific if needed
  };

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

        <ChatInput
          onSendMessage={handleSendMessage}
          onSendAIMessage={handleSendAIMessage} // Pass AI message handler
          isSending={isSending}
        />
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
          schedules={[]} // Personal chats don't have schedules
          currentUserInfo={currentUserGroupInfo} // Pass current user info
          groupMembers={undefined} // Personal chats don't have group members
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
          groupId={chatId} // Pass chatId as groupId for consistency, though not a group
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

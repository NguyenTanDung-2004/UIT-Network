"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Phone, Video, Info, UserPlus, CalendarPlus2 } from "lucide-react";
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
  GroupMemberInfo,
} from "@/types/chats/ChatData";
import AddMemberModal from "@/components/chat/group-chats/AddMemberModal";
import ScheduleModal, {
  ScheduleItemData,
} from "@/components/chat/group-chats/ScheduleModal";
import ConfirmationModal from "@/components/chat/group-chats/ConfirmationModal";

import { getListMessages } from "@/services/chatService";
import { useUser } from "@/contexts/UserContext";
import { useChatList } from "../../ChatListContext";

interface MediaItem {
  url: string;
  type: string;
}

interface GroupChatInfo {
  id: string;
  name: string;
  avatar: string;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_GROUP_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

async function fetchMockGroupMembers(
  groupId: string
): Promise<GroupMemberInfo[]> {
  await new Promise((res) => setTimeout(res, 350));
  return [
    {
      id: "mock-user-1",
      name: "Phan Giang",
      avatar: DEFAULT_AVATAR,
      role: "admin",
    },
    {
      id: "mock-user-2",
      name: "Bảo Phú",
      avatar: DEFAULT_AVATAR,
      role: "member",
    },
    {
      id: "mock-user-3",
      name: "Nguyễn Tấn Dũng",
      avatar: DEFAULT_AVATAR,
      role: "member",
    },
    {
      id: "mock-user-4",
      name: "Yen Tran",
      avatar: DEFAULT_AVATAR,
      role: "moderator",
    },
  ];
}

async function fetchSharedItems(chatId: string): Promise<{
  media: SharedMediaItem[];
  files: SharedFileItem[];
  links: SharedLinkItem[];
}> {
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
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
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

async function fetchSchedules(groupId: string): Promise<ScheduleItemData[]> {
  await new Promise((res) => setTimeout(res, 450));
  return [
    {
      id: "sched-1",
      title: "Lịch họp hằng tuần",
      startTime: "21:00",
      endTime: "22:00",
      date: new Date(2023, 8, 12),
      location: "Google Meet Link 1",
    },
    {
      id: "sched-2",
      title: "Họp đột xuất",
      startTime: "10:00",
      endTime: "11:00",
      date: new Date(2023, 8, 14),
      description: "Bàn về deadline project",
    },
    {
      id: "sched-3",
      title: "Họp offline",
      startTime: "15:00",
      endTime: "17:00",
      date: new Date(2023, 8, 16),
      location: "Phòng họp B4.1",
    },
  ].sort((a, b) => a.date.getTime() - b.date.getTime());
}

const GroupChat = () => {
  const params = useParams();
  const router = useRouter();
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

  const [groupInfo, setGroupInfo] = useState<GroupChatInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMemberInfo[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItemData[]>([]);
  const [sharedMedia, setSharedMedia] = useState<SharedMediaItem[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileItem[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLinkItem[]>([]);
  const [currentUserInfo, setCurrentUserInfo] =
    useState<GroupMemberInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [showDetails, setShowDetails] = useState(true);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerList, setMediaViewerList] = useState<MediaItem[]>([]);
  const [mediaViewerStartIndex, setMediaViewerStartIndex] = useState(0);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalMode, setScheduleModalMode] = useState<"create" | "view">(
    "create"
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleItemData | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationContext, setConfirmationContext] = useState<{
    type: "removeMember" | "deleteSchedule" | "leaveGroup";
    data: any;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!chatId) {
      setError("Invalid chat ID.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (userContextLoading || chatListLoading) {
          return;
        }
        if (userContextError || chatListError) {
          throw new Error(
            userContextError ||
              chatListError ||
              "Authentication or chat list error."
          );
        }
        if (!user || !user.id) {
          throw new Error("User not authenticated.");
        }

        const currentChatTopic = chats.find(
          (chat) => chat.id === chatId && chat.type === "group"
        );

        if (!currentChatTopic) {
          setError("Group chat not found for this conversation ID.");
          setIsLoading(false);
          return;
        }

        setGroupInfo({
          id: currentChatTopic.id,
          name: currentChatTopic.name,
          avatar: currentChatTopic.avatar || DEFAULT_GROUP_AVATAR,
        });

        const [messagesResponse, membersData, fetchedSchedules, shared] =
          await Promise.all([
            getListMessages(currentChatTopic.id),
            fetchMockGroupMembers(currentChatTopic.id),
            fetchSchedules(currentChatTopic.id),
            fetchSharedItems(currentChatTopic.id),
          ]);

        if (!isMounted) return;

        setMessages(messagesResponse.messages);
        setSharedMedia(messagesResponse.media); // Lấy media từ response getListMessages
        setSharedFiles(messagesResponse.files); // Lấy files từ response getListMessages
        setSharedLinks(shared.links); // Shared links vẫn mock

        setGroupMembers(membersData);
        setSchedules(fetchedSchedules);

        const currentMemberInfo = membersData.find((m) => m.id === user.id);
        setCurrentUserInfo(currentMemberInfo || null);
      } catch (err: any) {
        console.error("Failed to fetch group chat data:", err);
        if (isMounted)
          setError(err.message || "Could not load group chat data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [
    chatId,
    user,
    chats,
    userContextLoading,
    userContextError,
    chatListLoading,
    chatListError,
  ]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoading, scrollToBottom]);

  const handleSendMessage = async (text: string, attachments?: any[]) => {
    if (!groupInfo || !user || !currentUserInfo) return;
    setIsSending(true);

    const optimisticMessages: Message[] = [];
    const timestamp = new Date();

    if (attachments && attachments.length > 0) {
      attachments.forEach((att, index) => {
        const msgType =
          att.type === "image" || att.type === "video" ? att.type : "file";
        optimisticMessages.push({
          id: `temp-${Date.now()}-${index}`,
          senderId: currentUserInfo.id,
          senderName: currentUserInfo.name,
          senderAvatar: currentUserInfo.avatar,
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
        senderId: currentUserInfo.id,
        senderName: currentUserInfo.name,
        senderAvatar: currentUserInfo.avatar,
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
      console.log("Group message supposedly sent.");
    } catch (error) {
      console.error("Failed to send group message:", error);
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
  const closeMediaViewer = () => setMediaViewerOpen(false);

  const handleAddMember = () => setIsAddMemberModalOpen(true);
  const handleConfirmAddMembers = async (selectedIds: string[]) => {
    console.log("Adding members:", selectedIds);
    /* TODO: API Call */ await new Promise((r) => setTimeout(r, 500));
    setGroupMembers((prev) => [
      ...prev,
      ...selectedIds.map(
        (id) =>
          ({
            id,
            name: `New Member ${id.slice(-2)}`,
            avatar: DEFAULT_AVATAR,
            role: "member",
          } as GroupMemberInfo)
      ),
    ]);
  };
  const handleChatMember = (memberId: string) => {
    if (memberId !== (user?.id || "")) router.push(`/chat/person/${memberId}`);
  };
  const handleRemoveMember = (memberId: string, memberName: string) => {
    setConfirmationContext({
      type: "removeMember",
      data: { memberId, memberName },
      message: `Are you sure you want to remove ${memberName} from the group?`,
      onConfirm: async () => {
        console.log("Removing member:", memberId);
        /* TODO: API Call */ await new Promise((r) => setTimeout(r, 500));
        setGroupMembers((prev) => prev.filter((m) => m.id !== memberId));
        setIsConfirmationOpen(false);
      },
    });
    setIsConfirmationOpen(true);
  };
  const handleLeaveGroup = () => {
    setConfirmationContext({
      type: "leaveGroup",
      data: {},
      message: "Are you sure you want to leave this group?",
      onConfirm: async () => {
        console.log("Leaving group");
        /* TODO: API Call */ await new Promise((r) => setTimeout(r, 500));
        router.push("/chat");
        setIsConfirmationOpen(false);
      },
    });
    setIsConfirmationOpen(true);
  };

  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setScheduleModalMode("create");
    setIsScheduleModalOpen(true);
  };
  const handleViewScheduleDetails = (schedule: ScheduleItemData) => {
    setSelectedSchedule(schedule);
    setScheduleModalMode("view");
    setIsScheduleModalOpen(true);
  };
  const handleSubmitSchedule = async (data: Omit<ScheduleItemData, "id">) => {
    console.log("Creating schedule:", data);
    /* TODO: API Call */ await new Promise((r) => setTimeout(r, 500));
    const newSchedule = { ...data, id: `sched-${Date.now()}` };
    setSchedules((prev) =>
      [...prev, newSchedule].sort((a, b) => a.date.getTime() - b.date.getTime())
    );
  };
  const handleDeleteSchedule = (scheduleId: string, scheduleTitle: string) => {
    setConfirmationContext({
      type: "deleteSchedule",
      data: { scheduleId, scheduleTitle },
      message: `Are you sure you want to delete the schedule "${scheduleTitle}"?`,
      onConfirm: async () => {
        console.log("Deleting schedule:", scheduleId);
        /* TODO: API Call */ await new Promise((r) => setTimeout(r, 500));
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
        setIsConfirmationOpen(false);
      },
    });
    setIsConfirmationOpen(true);
  };
  const handleConfirmAction = async () => {
    if (!confirmationContext) return;
    setIsProcessingAction(true);
    try {
      await confirmationContext.onConfirm();
    } catch (err) {
      console.error("Confirmation action failed:", err);
    } finally {
      setIsProcessingAction(false);
      setConfirmationContext(null);
    }
  };

  if (isLoading || userContextLoading || chatListLoading) {
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

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1 h-full relative">
        <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center min-w-0">
            <div className="w-10 h-10 flex-shrink-0 mr-3 relative">
              <Image
                src={groupInfo?.avatar || DEFAULT_GROUP_AVATAR}
                alt={groupInfo?.name || "Group"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {groupInfo?.name || "Loading Group..."}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {groupMembers.length} members
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleCreateSchedule}
              className="p-2 text-primary dark:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              title="Add Member"
            >
              <CalendarPlus2 size={18} />
            </button>
            <button
              onClick={handleAddMember}
              className="p-2 text-primary dark:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              title="Add Member"
            >
              <UserPlus size={18} />
            </button>
            <button
              className="p-2 text-primary dark:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              title="Group Call (Not Implemented)"
            >
              <Phone size={18} />
            </button>
            <button
              className="p-2 text-primary dark:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              title="Group Video Call (Not Implemented)"
            >
              <Video size={18} />
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${
                showDetails
                  ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-light"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              title="Chat Details"
            >
              <Info size={18} />
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
              No messages yet
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

        <div className="flex-shrink-0 mt-auto">
          <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          showDetails ? "w-80 md:w-96" : "w-0"
        } overflow-hidden flex-shrink-0 h-full`}
      >
        {showDetails && groupInfo && (
          <ChatDetail
            type="group"
            groupName={groupInfo.name}
            groupAvatar={groupInfo.avatar}
            sharedMedia={sharedMedia}
            sharedFiles={sharedFiles}
            sharedLinks={sharedLinks}
            groupMembers={groupMembers}
            schedules={schedules}
            currentUserInfo={
              currentUserInfo || {
                id: user.id,
                name: user.name,
                avatar: user.avtURL || DEFAULT_AVATAR,
                role: "member",
              }
            }
            onClose={() => setShowDetails(false)}
            onAddMember={handleAddMember}
            onChatMember={handleChatMember}
            onRemoveMember={handleRemoveMember}
            onCreateSchedule={handleCreateSchedule}
            onViewScheduleDetails={handleViewScheduleDetails}
            onDeleteSchedule={handleDeleteSchedule}
            onLeaveGroup={handleLeaveGroup}
            onToggleNotifications={() =>
              console.log("Toggle group notifications")
            }
          />
        )}
      </div>

      <MediaViewerModal
        isOpen={mediaViewerOpen}
        onClose={closeMediaViewer}
        mediaList={mediaViewerList}
        startIndex={mediaViewerStartIndex}
      />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMembers={handleConfirmAddMembers}
        existingMemberIds={groupMembers.map((m) => m.id)}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        mode={scheduleModalMode}
        initialData={selectedSchedule}
        onSubmit={handleSubmitSchedule}
        onDelete={
          scheduleModalMode === "view" && selectedSchedule
            ? async (scheduleId: string) => {
                if (scheduleId === selectedSchedule.id) {
                  await handleDeleteSchedule(
                    selectedSchedule.id,
                    selectedSchedule.title
                  );
                }
              }
            : undefined
        }
        groupMembers={groupMembers}
      />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          confirmationContext?.type === "removeMember"
            ? "Remove Member"
            : confirmationContext?.type === "deleteSchedule"
            ? "Delete Schedule"
            : "Leave Group"
        }
        message={confirmationContext?.message || "Are you sure?"}
        isDangerous={true}
        isProcessing={isProcessingAction}
        confirmText={
          confirmationContext?.type === "removeMember"
            ? "Remove"
            : confirmationContext?.type === "deleteSchedule"
            ? "Delete"
            : "Leave"
        }
      />
    </div>
  );
};
export default GroupChat;

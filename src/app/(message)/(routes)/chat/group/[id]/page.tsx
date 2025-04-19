"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  Video,
  Info,
  Users,
  Calendar,
  UserPlus,
  CalendarPlus2,
} from "lucide-react";
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

interface MediaItem {
  url: string;
  type: string;
}

interface GroupInfo {
  id: string;
  name: string;
  avatar: string;
}

const CURRENT_USER_ID = "my-user-id";
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";
const DEFAULT_GROUP_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

async function fetchGroupInfo(groupId: string): Promise<GroupInfo | null> {
  console.log("Fetching info for group:", groupId);
  await new Promise((res) => setTimeout(res, 300));
  if (groupId === "not-found") return null;
  return {
    id: groupId,
    name: `Group UIT ${groupId.split("-")[1] || ""}`,
    avatar: DEFAULT_GROUP_AVATAR,
  };
}

async function fetchGroupMessages(
  chatId: string,
  limit = 20,
  offset = 0
): Promise<Message[]> {
  console.log(
    `Fetching group messages for ${chatId}, limit ${limit}, offset ${offset}`
  );
  await new Promise((res) => setTimeout(res, 500));
  const messages: Message[] = [];
  const messageCount = 40;
  const members = [
    { id: CURRENT_USER_ID, name: "You", avatar: DEFAULT_AVATAR },
    { id: "user-a", name: "Bảo Phú", avatar: DEFAULT_AVATAR },
    { id: "user-b", name: "Tấn Dũng", avatar: DEFAULT_AVATAR },
    { id: "user-c", name: "Phan Giang", avatar: DEFAULT_AVATAR },
  ];

  for (let i = offset; i < Math.min(offset + limit, messageCount); i++) {
    const randomSender = members[Math.floor(Math.random() * members.length)];
    const isSender = randomSender.id === CURRENT_USER_ID; // Technically redundant now
    const msgType = Math.random();
    let type: Message["type"] = "text";
    let content = `Group message ${messageCount - i}. `;
    let mediaUrl: string | undefined;
    let fileName: string | undefined,
      fileSize: number | undefined,
      fileType: string | undefined;

    if (msgType < 0.1)
      (type = "image"),
        (content = "Nice photo!"),
        (mediaUrl = `https://picsum.photos/seed/g${chatId}-${i}/600/400`);
    else if (msgType < 0.15)
      (type = "video"),
        (content = "Watch this"),
        (mediaUrl =
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    else if (msgType < 0.2)
      (type = "file"),
        (content = ""),
        (mediaUrl = `/mock-files/group-doc-${i}.docx`),
        (fileName = `Group Doc ${i}.docx`),
        (fileSize = 150 * 1024),
        (fileType = "application/msword");
    else content += "More discussion... ".repeat(Math.floor(Math.random() * 2));

    messages.push({
      id: `gmsg-${chatId}-${messageCount - i}`,
      senderId: randomSender.id,
      senderName: randomSender.name, // Add sender name
      senderAvatar: randomSender.avatar, // Add sender avatar
      content,
      timestamp: new Date(
        Date.now() - (i * 3 * 60 * 1000 + Math.random() * 60 * 1000)
      ), // Shorter intervals
      type,
      mediaUrl,
      fileName,
      fileSize,
      fileType,
    });
  }
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

async function fetchGroupMembers(groupId: string): Promise<GroupMemberInfo[]> {
  console.log("Fetching members for group:", groupId);
  await new Promise((res) => setTimeout(res, 350));
  return [
    {
      id: CURRENT_USER_ID,
      name: "Phan Giang",
      avatar: DEFAULT_AVATAR,
      role: "admin",
    },
    { id: "user-a", name: "Bảo Phú", avatar: DEFAULT_AVATAR, role: "member" },
    {
      id: "user-b",
      name: "Nguyễn Tấn Dũng",
      avatar: DEFAULT_AVATAR,
      role: "member",
    },
    {
      id: "user-c",
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

async function fetchSchedules(groupId: string): Promise<ScheduleItemData[]> {
  console.log("Fetching schedules for group:", groupId);
  await new Promise((res) => setTimeout(res, 450));
  return [
    {
      id: "sched-1",
      title: "Lịch họp hằng tuần",
      startTime: "21:00",
      endTime: "22:00",
      date: new Date(2023, 8, 12),
      location: "Google Meet Link 1",
    }, // Note: Month is 0-indexed (8 = September)
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
  ].sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date
}

const GroupChat = () => {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.id as string;

  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMemberInfo[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItemData[]>([]);
  const [sharedMedia, setSharedMedia] = useState<SharedMediaItem[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFileItem[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLinkItem[]>([]);
  const [currentUserInfo, setCurrentUserInfo] =
    useState<GroupMemberInfo | null>(null); // Store current user's info within the group

  const [isLoading, setIsLoading] = useState(true); // Combined loading state
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [showDetails, setShowDetails] = useState(true);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerList, setMediaViewerList] = useState<MediaItem[]>([]);
  const [mediaViewerStartIndex, setMediaViewerStartIndex] = useState(0);

  // Modals State
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
  const [isProcessingAction, setIsProcessingAction] = useState(false); // Loading state for confirmation actions

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  // Fetch all group data
  useEffect(() => {
    if (!groupId) {
      setError("Invalid group ID.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [info, initialMessages, members, fetchedSchedules, shared] =
          await Promise.all([
            fetchGroupInfo(groupId),
            fetchGroupMessages(groupId, 20, 0),
            fetchGroupMembers(groupId),
            fetchSchedules(groupId),
            fetchSharedItems(groupId),
          ]);

        if (!isMounted) return;

        if (!info) {
          setError("Group not found.");
        } else {
          setGroupInfo(info);
          setMessages(initialMessages);
          setGroupMembers(members);
          setSchedules(fetchedSchedules);
          setSharedMedia(shared.media);
          setSharedFiles(shared.files);
          setSharedLinks(shared.links);
          // Find current user's info within the fetched members
          const user = members.find((m) => m.id === CURRENT_USER_ID);
          if (user) setCurrentUserInfo(user);
          else console.warn("Current user not found in group members list!");
        }
      } catch (err) {
        console.error("Failed to fetch group chat data:", err);
        if (isMounted) setError("Could not load group chat data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [groupId]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoading, scrollToBottom]);

  // --- Handlers ---
  const handleSendMessage = async (text: string, attachments?: any[]) => {
    if (!groupInfo || !currentUserInfo) return;
    setIsSending(true);
    const optimisticMessages: Message[] = [];
    const timestamp = new Date();
    if (attachments && attachments.length > 0) {
      attachments.forEach((att, index) => {
        const msgType =
          att.type === "image" || att.type === "video" ? att.type : "file";
        optimisticMessages.push({
          id: `temp-${Date.now()}-${index}`,
          senderId: CURRENT_USER_ID,
          senderName: currentUserInfo.name,
          senderAvatar: currentUserInfo.avatar,
          content: index === attachments.length - 1 ? text : "",
          timestamp,
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
        senderName: currentUserInfo.name,
        senderAvatar: currentUserInfo.avatar,
        content: text,
        timestamp,
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

  // Member Actions
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
  }; // Optimistic UI update
  const handleChatMember = (memberId: string) => {
    if (memberId !== CURRENT_USER_ID) router.push(`/chat/person/${memberId}`);
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
        /* Redirect after leaving */ setIsConfirmationOpen(false);
      },
    });
    setIsConfirmationOpen(true);
  };

  // Schedule Actions
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
      console.error("Confirmation action failed:", err); /* Show toast? */
    } finally {
      setIsProcessingAction(false);
      setConfirmationContext(null);
    }
  };

  if (isLoading) {
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
  if (!groupInfo || !currentUserInfo) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-center text-gray-500">
        Group information not available.
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1 h-full relative">
        {/* Group Chat Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center min-w-0">
            <div className="w-10 h-10 flex-shrink-0 mr-3 relative">
              <Image
                src={groupInfo.avatar}
                alt={groupInfo.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {groupInfo.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {groupMembers.length} members
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Group specific actions like Add Member? or keep in details? */}
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

        {/* Message List */}
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
              isGroup={true} // It's a group chat
              onMediaClick={() =>
                msg.mediaUrl && (msg.type === "image" || msg.type === "video")
                  ? handleMediaClick(msg.id)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 mt-auto">
          <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
        </div>
      </div>

      {/* Details Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          showDetails ? "w-80 md:w-96" : "w-0"
        } overflow-hidden flex-shrink-0 h-full`}
      >
        {showDetails && (
          <ChatDetail
            type="group"
            groupName={groupInfo.name}
            groupAvatar={groupInfo.avatar}
            sharedMedia={sharedMedia}
            sharedFiles={sharedFiles}
            sharedLinks={sharedLinks}
            groupMembers={groupMembers}
            schedules={schedules}
            currentUserInfo={currentUserInfo}
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

      {/* Modals */}
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

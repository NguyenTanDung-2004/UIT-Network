import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Paperclip,
  Image as ImageIcon,
  Smile,
  SendHorizontal,
  X,
  HardHat, // Import HardHat icon for AI mode
} from "lucide-react";
import EmojiPicker from "@/components/post/create/EmojiPicker";
import { useToast } from "@/hooks/use-toast";
import { ClipLoader } from "react-spinners";

interface SelectedPreview {
  id: string;
  file: File;
  previewUrl: string;
  type: "image" | "video" | "file";
}

interface UploadedFileInfo {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface ChatInputProps {
  onSendMessage: (
    text: string,
    attachments?: UploadedFileInfo[]
  ) => Promise<void>;
  onSendAIMessage: (question: string) => Promise<void>; // New prop for AI messages
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendAIMessage,
  isSending,
}) => {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAIAssistMode, setIsAIAssistMode] = useState(false); // New state for AI mode
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const AI_PREFIX = "@AIAssist ";

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setInputText(text);

    // Check for AI assist mode activation
    if (text.startsWith(AI_PREFIX)) {
      setIsAIAssistMode(true);
    } else {
      setIsAIAssistMode(false);
    }

    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    allowedType: "media" | "file"
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // If in AI assist mode, do not allow file attachments
    if (isAIAssistMode) {
      toast({
        title: "AI Assist Mode",
        description: "Attachments are not allowed in AI Assist mode.",
        variant: "destructive",
      });
      event.target.value = ""; // Reset input value
      return;
    }

    const newPreviews: SelectedPreview[] = [];
    const fileLimit = 5;
    const sizeLimit = 10 * 1024 * 1024;

    for (
      let i = 0;
      i < Math.min(files.length, fileLimit - selectedFiles.length);
      i++
    ) {
      const file = files[i];

      if (file.size > sizeLimit) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        continue;
      }

      let fileType: "image" | "video" | "file" = "file";
      if (allowedType === "media") {
        if (file.type.startsWith("image/")) fileType = "image";
        else if (file.type.startsWith("video/")) fileType = "video";
        else {
          toast({
            title: "Invalid File Type",
            description: `Media uploader only accepts images and videos.`,
            variant: "destructive",
          });
          continue;
        }
      }

      const previewUrl = URL.createObjectURL(file);
      newPreviews.push({
        id: crypto.randomUUID(),
        file,
        previewUrl,
        type: fileType,
      });
    }

    setSelectedFiles((prev) => [...prev, ...newPreviews]);
    event.target.value = "";
  };

  const handleImageVideoSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileSelection(event, "media");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event, "file");
  };

  const handleDeletePreview = (idToRemove: string) => {
    const fileToDelete = selectedFiles.find((f) => f.id === idToRemove);
    if (fileToDelete) {
      URL.revokeObjectURL(fileToDelete.previewUrl);
      setSelectedFiles((prev) => prev.filter((f) => f.id !== idToRemove));
    }
  };

  const uploadFiles = async (
    filesToUpload: SelectedPreview[]
  ): Promise<UploadedFileInfo[]> => {
    setIsUploading(true);
    const uploadPromises = filesToUpload.map(async (selected) => {
      const formData = new FormData();
      formData.append("file", selected.file);
      const endpoint =
        selected.type === "file" ? "/api/file-upload" : "/api/test-cloudinary";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        if (!response.ok)
          throw new Error(`Upload failed for ${selected.file.name}`);
        const data = await response.json();
        if (!data.url)
          throw new Error(`API response missing URL for ${selected.file.name}`);

        return {
          url: data.url,
          name: selected.file.name,
          size: selected.file.size,
          type: selected.type === "file" ? selected.file.type : selected.type,
        };
      } catch (error) {
        console.error(`Error uploading ${selected.file.name}:`, error);
        toast({
          title: "Upload Failed",
          description: `Could not upload ${selected.file.name}.`,
          variant: "destructive",
        });
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    const trimmedInputText = inputText.trim();

    if (
      (!trimmedInputText && selectedFiles.length === 0) ||
      isSending ||
      isUploading
    ) {
      return;
    }

    // Handle AI assist mode
    if (isAIAssistMode) {
      const question = trimmedInputText.startsWith(AI_PREFIX)
        ? trimmedInputText.substring(AI_PREFIX.length).trim()
        : trimmedInputText;
      if (!question) return;

      try {
        await onSendAIMessage(question);
        setInputText("");
        setIsAIAssistMode(false); // Exit AI mode after sending
        const textarea = document.getElementById(
          "chat-textarea"
        ) as HTMLTextAreaElement;
        if (textarea) textarea.style.height = "auto";
      } catch (error) {
        console.error("Error sending AI message:", error);
        toast({
          title: "AI Message Failed",
          description: "Could not send message to AI.",
          variant: "destructive",
        });
      }
      return;
    }

    // Normal message sending
    let uploadedAttachments: UploadedFileInfo[] | undefined = undefined;

    if (selectedFiles.length > 0) {
      try {
        uploadedAttachments = await uploadFiles(selectedFiles);
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        setSelectedFiles([]);
      } catch (error) {
        return;
      }
    }

    try {
      await onSendMessage(trimmedInputText, uploadedAttachments);
      setInputText("");
      const textarea = document.getElementById(
        "chat-textarea"
      ) as HTMLTextAreaElement;
      if (textarea) textarea.style.height = "auto";
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Send Failed",
        description: "Could not send the message.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      {selectedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 max-h-32 overflow-y-auto scrollbar-thin">
          {selectedFiles.map((f) => (
            <div
              key={f.id}
              className="relative group w-16 h-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600"
            >
              {f.type === "image" && (
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="w-full h-full object-cover"
                />
              )}
              {f.type === "video" && (
                <video
                  src={f.previewUrl}
                  className="w-full h-full object-cover"
                />
              )}
              {f.type === "file" && (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                  <Paperclip
                    size={24}
                    className="text-gray-500 dark:text-gray-400 mb-1"
                  />
                  <span className="text-[10px] leading-tight text-gray-600 dark:text-gray-300 truncate block w-full">
                    {f.file.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => handleDeletePreview(f.id)}
                disabled={isUploading || isSending}
                className="absolute top-0.5 right-0.5 bg-black bg-opacity-60 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none disabled:opacity-50"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 justify-center">
        <div className="flex items-center gap-1">
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageVideoSelect}
            accept="image/*,video/*"
            multiple
            hidden
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            hidden
          />

          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading || isSending || isAIAssistMode} // Disable attachments in AI mode
            className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
          >
            <ImageIcon size={20} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isSending || isAIAssistMode} // Disable attachments in AI mode
            className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
          >
            <Paperclip size={20} />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            id="chat-textarea"
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isAIAssistMode ? "Ask AI something..." : "Aa ..."}
            className="w-full -mb-[6px] max-h-[120px] min-h-full border border-gray-300 rounded-3xl py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:placeholder-gray-400 resize-none overflow-y-hidden scrollbar-thin"
            disabled={isUploading || isSending}
          />
          {isAIAssistMode && (
            <HardHat
              size={18}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500"
            />
          )}
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isUploading || isSending}
            type="button"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full disabled:opacity-50 ${
              isAIAssistMode
                ? "text-gray-400 cursor-not-allowed" // Disable emoji picker in AI mode
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Smile size={20} />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full right-0 mb-2 z-20"
            >
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={
            (!inputText.trim() && selectedFiles.length === 0) ||
            isUploading ||
            isSending
          }
          className="p-2 text-white bg-primary rounded-full hover:bg-opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isUploading || isSending ? (
            <ClipLoader size={20} color="#FF70D9" />
          ) : (
            <SendHorizontal size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

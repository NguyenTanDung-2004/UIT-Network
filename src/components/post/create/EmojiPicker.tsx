"use client";
import React from "react";
import Picker from "emoji-picker-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

interface EmojiData {
  emoji: string;
  // Thêm các thuộc tính khác nếu có (ví dụ: name, skinTone)
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const handleEmojiClick = (emojiData: EmojiData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div>
      <Picker onEmojiClick={handleEmojiClick} width={400} height={400} />
    </div>
  );
};

export default EmojiPicker;

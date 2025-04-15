import React from "react";
import { UserMinus, UserX, ShieldX } from "lucide-react";
interface FriendActionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnfriend: () => void;
  onUnfollow: () => void;
  onBlock: () => void;
}

const FriendActionDropdown: React.FC<FriendActionDropdownProps> = ({
  isOpen,
  onClose,
  onUnfriend,
  onUnfollow,
  onBlock,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
      onClick={(e) => e.stopPropagation()} // Prevent card click
    >
      <div className="py-1">
        <button
          onClick={() => {
            onUnfriend();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Unfriend
        </button>
        <button
          onClick={() => {
            onUnfollow();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <UserX className="w-4 h-4 mr-2" />
          Unfollow
        </button>
        <button
          onClick={() => {
            onBlock();
            onClose();
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <ShieldX className="w-4 h-4 mr-2" />
          Block
        </button>
      </div>
    </div>
  );
};

export default FriendActionDropdown;

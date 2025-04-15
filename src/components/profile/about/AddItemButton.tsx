import React from "react";
import { Plus } from "lucide-react";

interface AddItemButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
  onClick,
  label,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full p-3 text-sm font-medium text-primary border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-150 ${className}`}
    >
      <Plus className="w-4 h-4 mr-2" />
      {label}
    </button>
  );
};

export default AddItemButton;

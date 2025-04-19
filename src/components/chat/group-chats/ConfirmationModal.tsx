import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { ClipLoader } from "react-spinners";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; // Allow async confirmation
  title: string;
  message: React.ReactNode; // Allow richer messages
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // Style confirm button as dangerous
  isProcessing?: boolean; // Show loading state
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            {isDangerous && (
              <AlertTriangle className="text-red-500 mr-2" size={20} />
            )}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </div>
        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px]
                   ${
                     isDangerous
                       ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                       : "bg-primary text-white hover:bg-opacity-80 focus:ring-primary"
                   }`}
          >
            {isProcessing ? (
              <ClipLoader size={18} color="#ffffff" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

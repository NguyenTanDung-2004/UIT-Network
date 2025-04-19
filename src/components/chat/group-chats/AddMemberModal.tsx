import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, Search, CheckCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

interface PotentialMember {
  id: string;
  name: string;
  avatar: string;
}
interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMembers: (selectedMemberIds: string[]) => Promise<void>;
  existingMemberIds: string[];
}

// Mockdata
const MOCK_POTENTIAL_MEMBERS: PotentialMember[] = [
  {
    id: "user-potential-1",
    name: "Kim Nhung Phạm A",
    avatar: "https://i.pravatar.cc/150?u=kima",
  },
  {
    id: "user-potential-2",
    name: "Ngô Hoàng Khang B",
    avatar: "https://i.pravatar.cc/150?u=khangb",
  },
  {
    id: "user-potential-3",
    name: "Kim Nhung Phạm C",
    avatar: "https://i.pravatar.cc/150?u=kimc",
  },
  {
    id: "user-potential-4",
    name: "Lê Thị Test D",
    avatar: "https://i.pravatar.cc/150?u=led",
  },
  {
    id: "user-potential-5",
    name: "Ngô Hoàng Khang E",
    avatar: "https://i.pravatar.cc/150?u=khange",
  },
  {
    id: "user-potential-6",
    name: "Kim Nhung Phạm F",
    avatar: "https://i.pravatar.cc/150?u=kimf",
  },
  {
    id: "user-potential-7",
    name: "Another Test User G",
    avatar: "https://i.pravatar.cc/150?u=testg",
  },
  {
    id: "user-potential-8",
    name: "Kim Test H",
    avatar: "https://i.pravatar.cc/150?u=kimh",
  },
];

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMembers,
  existingMemberIds,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set()
  );
  const [isAdding, setIsAdding] = useState(false);

  const filteredResults = useMemo(() => {
    const potential = MOCK_POTENTIAL_MEMBERS.filter(
      (user) => !existingMemberIds.includes(user.id)
    );

    if (!searchTerm.trim()) {
      return potential; // Show all person
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return potential.filter((user) =>
      user.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, existingMemberIds]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedMemberIds(new Set());
      setIsAdding(false);
    }
  }, [isOpen]);

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }

      return newSet;
    });
  };

  const handleConfirmAdd = async () => {
    if (selectedMemberIds.size === 0) return;
    setIsAdding(true);
    try {
      await onAddMembers(Array.from(selectedMemberIds));
      onClose();
    } catch (error) {
      console.error("Failed to add members:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-[#b0afaf] bg-opacity-80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-black dark:text-gray-200">
            Add member
          </h2>
          <button
            onClick={onClose}
            disabled={isAdding}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 min-h-[200px]">
          {filteredResults.length > 0 ? (
            filteredResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectMember(user.id)}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
              >
                <Image
                  src={user.avatar}
                  width={36}
                  height={36}
                  alt={user.name}
                  className="rounded-full mr-3"
                />
                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user.name}
                </span>
                <div
                  className={`w-5 h-5 border rounded-full flex items-center justify-center ${
                    selectedMemberIds.has(user.id)
                      ? "bg-primary border-primary"
                      : "border-gray-400 dark:border-gray-500"
                  }`}
                >
                  {selectedMemberIds.has(user.id) && (
                    <CheckCircle size={14} className="text-white" />
                  )}
                </div>
              </button>
            ))
          ) : searchTerm.trim() ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
              No users found matching "{searchTerm}".
            </p>
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
              No potential members found or all have been added.
            </p>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={handleConfirmAdd}
            disabled={selectedMemberIds.size === 0 || isAdding}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
          >
            {isAdding && <ClipLoader color="#FF69B4" size={16} />}
            Add member ({selectedMemberIds.size})
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddMemberModal;

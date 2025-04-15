import React from "react";
import AddItemButton from "./AddItemButton";
import { ProfileAboutData } from "@/types/profile/AboutData";

interface HobbiesContentProps {
  data: ProfileAboutData["hobbies"];
  isOwnProfile: boolean;
}

const HobbiesContent: React.FC<HobbiesContentProps> = ({
  data,
  isOwnProfile,
}) => {
  const handleAddHobby = () => console.log("Add Hobby");

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {data.map((hobby) => (
          <div
            key={hobby.id}
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 aspect-square justify-center"
          >
            <img
              src={hobby.iconUrl}
              alt={hobby.name}
              className="w-16 h-16 mb-2 object-contain" // Adjust size as needed
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              {hobby.name}
            </span>
          </div>
        ))}
      </div>
      {isOwnProfile && (
        <AddItemButton
          onClick={handleAddHobby}
          label="Add a hobby"
          className="max-w-xs mx-auto"
        />
      )}
    </div>
  );
};

export default HobbiesContent;

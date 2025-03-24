import React, { useState } from "react";
import Image from "next/image";

interface CreatePostProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onPostCreate?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPostCreate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 dark:bg-gray-800 dark:shadow-gray-700">
      <div className="flex items-start">
        <div className="w-10 h-10 relative rounded-full overflow-hidden border dark:border-gray-700">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 ml-3">
          <input
            type="text"
            placeholder="Share some what you are thingking?"
            onClick={onPostCreate}
            className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex justify-between mt-3">
        <div className="flex space-x-2">
          <button
            onClick={onPostCreate}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="far fa-image"></i>
          </button>
          <button
            onClick={onPostCreate}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="fas fa-paperclip"></i>
          </button>
          <button
            onClick={onPostCreate}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="far fa-smile"></i>
          </button>
        </div>

        <button
          onClick={onPostCreate}
          className={`px-6 text-base  rounded-full bg-primary text-white hover:bg-opacity-80 transition-colors duration-200`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

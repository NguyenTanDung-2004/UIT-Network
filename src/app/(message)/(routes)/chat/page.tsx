import React from "react";

const ChatPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 mb-4 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Welcome to Chat
      </h2>
      <p className="text-sm">Select a conversation from the left panel.</p>
      <p className="text-sm mt-1">
        No conversations yet? Try connecting with friends.
      </p>
    </div>
  );
};
export default ChatPage;

import React, { useState } from "react";
import Image from "next/image";

interface CreatePostProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onPostCreate?: (content: string, attachments: string[]) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPostCreate }) => {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!postContent.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onPostCreate) {
        onPostCreate(postContent, []);
      }
      setPostContent("");
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start">
        <div className="w-10 h-10 relative rounded-full overflow-hidden border">
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
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      <div className="flex justify-between mt-3">
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md">
            <i className="far fa-image"></i>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md">
            <i className="fas fa-video"></i>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md">
            <i className="fas fa-link"></i>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md">
            <i className="far fa-smile"></i>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!postContent.trim() || isSubmitting}
          className={`px-4 py-1 rounded-full ${
            !postContent.trim() || isSubmitting
              ? "bg-gray-200 text-gray-500"
              : "bg-pink-500 text-white hover:bg-pink-600"
          } transition-colors duration-200`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Posting...
            </span>
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;

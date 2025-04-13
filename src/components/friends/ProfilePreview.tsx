import React from "react";
import Image from "next/image";

interface ProfilePreviewProps {
  userId: string;
}

export default function ProfilePreview({ userId }: ProfilePreviewProps) {
  return (
    <div className="text-center text-gray-800 dark:text-gray-200">
      <h3 className="text-lg font-semibold mb-2">Profile Preview</h3>
      <p>Displaying profile for User ID:</p>
      <p className="font-mono text-primary">{userId}</p>
    </div>
  );
}

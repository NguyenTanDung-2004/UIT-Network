import React from "react";
import Link from "next/link";
import { Eye, Lock } from "lucide-react";

interface AboutData {
  bio: string;
  isPrivate: boolean;
  isVisible: boolean;
}

interface AboutSummaryWidgetProps {
  data: AboutData;
  groupId: string;
}

const AboutSummaryWidget: React.FC<AboutSummaryWidgetProps> = ({
  data,
  groupId,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          About
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {data.bio}
      </p>
      <div className="space-y-4">
        {/* Section for Private */}
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Private
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Only members can see who's in the group and what they post.
            </p>
          </div>
        </div>

        {/* Section for Visible */}
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Visible
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Anyone can find this group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutSummaryWidget;

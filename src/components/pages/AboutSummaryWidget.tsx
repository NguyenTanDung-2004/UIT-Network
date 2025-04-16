import React from "react";
import Link from "next/link";

interface AboutData {
  bio: string;
  details: { icon: string; text: string }[];
}

interface AboutSummaryWidgetProps {
  data: AboutData;
  pageId: string;
}

const AboutSummaryWidget: React.FC<AboutSummaryWidgetProps> = ({
  data,
  pageId,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          About
        </h3>
        <Link
          href={`/pages/${pageId}/about`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {data.bio}
      </p>
      <div className="space-y-2">
        {data.details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            <i
              className={`${detail.icon} w-4 mr-2 text-center text-gray-400 dark:text-gray-500`}
            ></i>
            <span>{detail.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AboutSummaryWidget;

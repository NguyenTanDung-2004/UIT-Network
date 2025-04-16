import React from "react";
import { PageAboutData } from "@/types/pages/PageData";
import { ShieldCheck, Clock, Users } from "lucide-react";

interface PageTransparencyProps {
  transparencyData: PageAboutData["pageTransparency"];
}

const PageTransparency: React.FC<PageTransparencyProps> = ({
  transparencyData,
}) => {
  const formatCreationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="space-y-8 min-h-[400px]">
      <div>
        <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-200">
          Page Transparency
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-semibold">
          Study Buddy is showing information to help you better understand the
          purpose of this Page.
        </p>

        <div className="space-y-6">
          {transparencyData.pageId && (
            <div className="flex items-start space-x-4">
              <ShieldCheck className="w-6 h-6 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {transparencyData.pageId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Page ID
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                {formatCreationDate(transparencyData.creationDate)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Creation Date
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Users className="w-6 h-6 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                Information about Page Admins
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {transparencyData.infoAdmin ||
                  "Administrator information will be available soon."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransparency;

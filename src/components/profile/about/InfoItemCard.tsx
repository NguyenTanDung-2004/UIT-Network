import React from "react";

interface InfoItemCardProps {
  icon: string;
  label?: string;
  value: React.ReactNode;
  className?: string;
}

const InfoItemCard: React.FC<InfoItemCardProps> = ({
  icon,
  label,
  value,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 ${className}`}
    >
      <i
        className={`${icon} text-gray-500 dark:text-gray-400 w-5 text-center mr-3 flex-shrink-0`}
        aria-hidden="true"
      ></i>
      <div className="text-sm text-gray-800 dark:text-gray-200">
        {label && <span className="font-medium mr-1">{label}</span>}
        <span>{value}</span>
      </div>
    </div>
  );
};

export default InfoItemCard;

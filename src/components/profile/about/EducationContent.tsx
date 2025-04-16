import React from "react";
import InfoItemCard from "./InfoItemCard";
import AddItemButton from "./AddItemButton";
import { ProfileAboutData } from "@/types/profile/AboutData";
import {
  Building,
  Briefcase,
  GraduationCap,
  School,
  Pencil,
} from "lucide-react";

interface EducationContentProps {
  data: ProfileAboutData["workAndEducation"];
  isOwnProfile: boolean;
}

const EducationContent: React.FC<EducationContentProps> = ({
  data,
  isOwnProfile,
}) => {
  const handleAddWorkplace = () => console.log("Add Workplace");
  const handleAddOccupation = () => console.log("Add Occupation");
  const handleAddCollege = () => console.log("Add College");
  const handleAddHighSchool = () => console.log("Add High School");
  const handleEditExperience = () => console.log("Edit Experience");

  return (
    <div className="space-y-8 min-h-[400px]">
      {/* Work Section */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Work
        </h4>
        <div className="space-y-3">
          {data.workplaces.map((job) => (
            <InfoItemCard
              key={job.id}
              icon="fas fa-building" // Use FontAwesome or Lucide equivalent
              value={`${job.position} at ${job.company} (${job.duration})`}
            />
          ))}
          {isOwnProfile && (
            <AddItemButton
              onClick={handleAddWorkplace}
              label="Add a workplace"
            />
          )}
        </div>
      </div>

      {/* Occupation Section */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Occupation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          {data.occupations.map((occ) => (
            <InfoItemCard
              key={occ.id}
              icon="fas fa-briefcase"
              value={occ.title}
            />
          ))}
        </div>
        {isOwnProfile && (
          <AddItemButton
            onClick={handleAddOccupation}
            label="Add an occupation"
          />
        )}
      </div>

      {/* Experience Section */}
      {(data.experienceSummary || isOwnProfile) && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Experience
          </h4>
          <div className="relative group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            {data.experienceSummary ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.experienceSummary}
              </p>
            ) : (
              isOwnProfile && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add your experience summary.
                </p>
              )
            )}

            {isOwnProfile && (
              <button
                onClick={handleEditExperience}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* College/University Section */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          College/University
        </h4>
        <div className="space-y-3">
          {data.colleges.map((college) => (
            <InfoItemCard
              key={college.id}
              icon="fas fa-graduation-cap"
              value={`${college.degree} at ${college.name} (${college.duration})`}
            />
          ))}
          {isOwnProfile && (
            <AddItemButton
              onClick={handleAddCollege}
              label="Add a college/university"
            />
          )}
        </div>
      </div>

      {/* High School Section */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          High School
        </h4>
        <div className="space-y-3">
          {data.highSchools.map((school) => (
            <InfoItemCard
              key={school.id}
              icon="fas fa-school"
              value={`${school.name} (${school.duration})`}
            />
          ))}
          {isOwnProfile && (
            <AddItemButton
              onClick={handleAddHighSchool}
              label="Add a high school"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationContent;

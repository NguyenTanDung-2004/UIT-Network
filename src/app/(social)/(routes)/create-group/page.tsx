import CreateGroup from "@/components/createGroup/CreateGroup";
import React from "react";

const CreateGroupPage = () => {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600  bg-gray-50 dark:bg-gray-900">
      <CreateGroup />
    </div>
  );
};

export default CreateGroupPage;

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface GroupIdParams {
  id: string;
}

const GroupManageRedirectPage = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  useEffect(() => {
    if (groupId) {
      router.replace(`/create-group/manage/${groupId}/info`);
    }
  }, [groupId, router]);

  return (
    <div className="flex justify-center items-center min-h-[300px] text-gray-500 dark:text-gray-400 my-10">
      <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
        <ClipLoader
          color="#FF70D9"
          loading={true}
          size={35}
          aria-label="Loading Spinner"
        />
      </div>
    </div>
  );
};

export default GroupManageRedirectPage;

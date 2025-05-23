"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface pageIdParams {
  id: string;
}

const PageManageRedirectPage = () => {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  useEffect(() => {
    if (pageId) {
      router.replace(`/create-page/manage/${pageId}/info`);
    }
  }, [pageId, router]);

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

export default PageManageRedirectPage;

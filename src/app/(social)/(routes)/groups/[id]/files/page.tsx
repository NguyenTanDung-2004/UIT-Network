"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import FileFilter, {
  FileTypeFilter,
} from "@/components/groups/files/FileFilter";
import { getFileIcon, formatFileSize } from "@/utils/ViewFilesUtils";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

// Mock function - Replace with API call
async function fetchGroupFiles(groupId: string): Promise<UploadedFile[]> {
  console.log(`Fetching files for group ${groupId}`);
  await new Promise((resolve) => setTimeout(resolve, 600));

  const files: UploadedFile[] = [
    {
      id: `file-${groupId}-1`,
      name: "Đề ôn thi cuối kỳ 2029-2030.pdf",
      size: 223 * 1024,
      url: "/mock-files/file1.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-2`,
      name: "Đáp án Giải tích 1 K22.docx",
      size: 150 * 1024,
      url: "/mock-files/file2.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      id: `file-${groupId}-3`,
      name: "Tổng hợp công thức Calculus.txt",
      size: 50 * 1024,
      url: "/mock-files/file3.txt",
      type: "text/plain",
    },
    {
      id: `file-${groupId}-4`,
      name: "Bài tập chương 1 - Vi phân.pdf",
      size: 310 * 1024,
      url: "/mock-files/file4.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-5`,
      name: "Hướng dẫn giải bài tập lớn.docx",
      size: 180 * 1024,
      url: "/mock-files/file5.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      id: `file-${groupId}-6`,
      name: "Đề thi giữa kỳ mẫu K21.pdf",
      size: 255 * 1024,
      url: "/mock-files/file6.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-7`,
      name: "Lịch thi chi tiết HK2.pdf",
      size: 120 * 1024,
      url: "/mock-files/file7.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-8`,
      name: "Report template.docx",
      size: 95 * 1024,
      url: "/mock-files/file8.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      id: `file-${groupId}-9`,
      name: "Ghi chú buổi học cuối.txt",
      size: 15 * 1024,
      url: "/mock-files/file9.txt",
      type: "text/plain",
    },
    {
      id: `file-${groupId}-10`,
      name: "Đề cương ôn tập giải tích.pdf",
      size: 450 * 1024,
      url: "/mock-files/file10.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-11`,
      name: "Slide bài giảng chương 5.docx",
      size: 1200 * 1024,
      url: "/mock-files/file11.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      id: `file-${groupId}-12`,
      name: "Tài liệu tham khảo thêm.pdf",
      size: 800 * 1024,
      url: "/mock-files/file12.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-13`,
      name: "Đề ôn thi cuối kỳ 2028-2029.pdf",
      size: 215 * 1024,
      url: "/mock-files/file13.pdf",
      type: "application/pdf",
    },
    {
      id: `file-${groupId}-14`,
      name: "Sample Exam Questions.docx",
      size: 165 * 1024,
      url: "/mock-files/file14.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      id: `file-${groupId}-15`,
      name: "Important Notes.txt",
      size: 25 * 1024,
      url: "/mock-files/file15.txt",
      type: "text/plain",
    },
  ];

  return files;
}

const FilesGroup = () => {
  const params = useParams();
  const groupId = params?.id as string;

  const [allFiles, setAllFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FileTypeFilter>("all");

  useEffect(() => {
    let isMounted = true;
    if (groupId) {
      setLoading(true);
      setError(null);
      fetchGroupFiles(groupId)
        .then((data) => {
          if (isMounted) {
            setAllFiles(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch files:", err);
          if (isMounted) {
            setError("Could not load files.");
            setLoading(false);
          }
        });
    } else {
      setError("Invalid Group ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const filteredFiles = useMemo(() => {
    return allFiles.filter((file) => {
      // Search filter
      const matchesSearch = searchTerm
        ? file.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Type filter
      let matchesFilter = true;
      const lowerType = file.type.toLowerCase();
      if (activeFilter === "pdf") {
        matchesFilter = lowerType.includes("pdf");
      } else if (activeFilter === "docx") {
        matchesFilter =
          lowerType.includes("doc") || lowerType.includes("wordprocessingml");
      } else if (activeFilter === "other") {
        matchesFilter =
          !lowerType.includes("pdf") &&
          !lowerType.includes("doc") &&
          !lowerType.includes("wordprocessingml");
      }

      return matchesSearch && matchesFilter;
    });
  }, [allFiles, searchTerm, activeFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-100px)]">
        <ClipLoader
          color="#FF69B4"
          loading={true}
          size={35}
          aria-label="Loading Spinner"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 min-h-[400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4 ">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
          Files
        </h2>
        <div className="relative w-full sm:w-64 md:w-80 flex-shrink ">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search-files"
            id="search-files"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <FileFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="border rounded-md shadow-sm p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700 transition-colors duration-150"
              onClick={() => window.open(file.url, "_blank")}
              title={`Open ${file.name}`}
            >
              <img
                src={getFileIcon(file.type)}
                alt={`${file.type} icon`}
                className="w-9 h-9 flex-shrink-0 object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          {searchTerm || activeFilter !== "all"
            ? "No files match your criteria."
            : "No files have been uploaded to this group yet."}
        </div>
      )}
    </div>
  );
};
export default FilesGroup;

"use client";

import React, { useEffect, useState, use } from "react";
import PeopleCard from "@/components/search/PeopleCard";
import PageCard from "@/components/search/PageCard";
import GroupCard from "@/components/search/GroupCard";
import { ClipLoader } from "react-spinners";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface PersonData {
  id: string;
  type: "people";
  name: string;
  avatar: string;
  followers?: number;
  headline?: string;
  isFriend: boolean;
}

interface PageData {
  id: string;
  type: "page";
  name: string;
  avatar: string;
  descriptionLines: string[];
  isFollowing: boolean;
}

interface GroupData {
  id: string;
  type: "group";
  name: string;
  avatar: string;
  stats?: string;
  isJoined: boolean;
}

type SearchResultItem = PersonData | PageData | GroupData;

interface SearchResultsPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ q: string }>;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}) => {
  const params = use(paramsPromise);
  const searchParams = use(searchParamsPromise);
  const { type } = params;
  const { q } = searchParams;

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSampleData = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let sampleData: SearchResultItem[] = [];

        if (type === "people" || type === "top") {
          sampleData.push(
            {
              id: `sample-person-1`,
              type: "people",
              name: `Bạn Tấn Dũng`,
              avatar: DEFAULT_AVATAR,
              followers: 123,
              headline: "Java Dev",
              isFriend: false,
            },
            {
              id: `Phan Nguyễn Trà Giang `,
              type: "people",
              name: `Fullstack Dev`,
              avatar: DEFAULT_AVATAR,
              followers: 45,
              isFriend: true,
            }
          );
        }

        if (type === "pages" || type === "top") {
          sampleData.push(
            {
              id: `sample-page-card-1`,
              type: "page",
              name: `Page rubic - Kỹ thuật số`,
              avatar: DEFAULT_AVATAR,
              descriptionLines: [
                "Personal Website · 38K followers · More than 10 posts in the past 2 weeks",
                "University Infomation of Technology - ",
              ],
              isFollowing: true,
            },
            {
              id: `sample-page-card-2`,
              type: "page",
              name: `Page Khoa Công nghệ phần mềm`,
              avatar: DEFAULT_AVATAR,
              descriptionLines: [
                "38K followers · More than 10 posts in the past 2 weeks",
                "University Infomation of Technology - Connect with fellow Java enthusiasts at UIT! ",
              ],
              isFollowing: false,
            }
          );
        }

        if (type === "groups" || type === "top") {
          sampleData.push(
            {
              id: `sample-group-card-1`,
              type: "group",
              name: `CLB CHẤT LƯỢNG MẶT TRỜI`,
              avatar: DEFAULT_AVATAR,
              stats: "10K members · 5 posts/day",
              isJoined: false,
            },
            {
              id: `sample-group-card-2`,
              type: "group",
              name: `CLB TOEIC WRITING - UIT`,
              avatar: DEFAULT_AVATAR,
              stats: "2K members · 1 posts/day",
              isJoined: true,
            }
          );
        }

        if (type !== "top") {
          sampleData = sampleData.filter((item) => {
            if (type === "people") return item.type === "people";
            if (type === "pages") return item.type === "page";
            if (type === "groups") return item.type === "group";
            return false;
          });
        }

        setResults(sampleData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    generateSampleData();
  }, [type]);

  const renderContent = () => {
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
        <div className="text-center p-10 text-red-500">Error: {error}</div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
          No sample results available for this type.
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {results.map((result) => {
          switch (result.type) {
            case "people":
              return (
                <PeopleCard key={result.id} person={result as PersonData} />
              );
            case "page":
              return <PageCard key={result.id} page={result as PageData} />;
            case "group":
              return <GroupCard key={result.id} group={result as GroupData} />;
            default:
              const _exhaustiveCheck: never = result;
              console.warn("Unknown result type:", _exhaustiveCheck);
              return null;
          }
        })}
      </div>
    );
  };

  return <div className="mx-2 md:mx-16 sm:mx-6">{renderContent()}</div>;
};

export default SearchResultsPage;

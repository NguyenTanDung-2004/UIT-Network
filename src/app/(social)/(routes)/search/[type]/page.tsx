// app/(social)/(routes)/search/[type]/page.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import Post from "@/components/post/Post";
import PeopleCard from "@/components/search/PeopleCard";
import PageCard from "@/components/search/PageCard";
import GroupCard from "@/components/search/GroupCard";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface AuthorInfo {
  id: string;
  name: string;
  avatar: string;
}

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface GroupInfo {
  id: string;
  name: string;
  isJoined: boolean;
}

interface PageInfo {
  isFollowing: boolean;
}

interface PostOriginPage {
  type: "page";
  pageInfo: PageInfo;
}

interface PostOriginGroup {
  type: "group";
  groupInfo: GroupInfo;
}

type PostOrigin = PostOriginPage | PostOriginGroup;

interface PostDataType {
  id: string;
  type: "post";
  author: AuthorInfo;
  origin?: PostOrigin;
  content: string;
  fullContent?: string;
  date: string;
  time: string;
  mediaList?: MediaItem[];
  likes: number;
  comments: number;
  shares: number;
  file?: { name: string; size: number; url: string; type: string };
}

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

type SearchResultItem = PostDataType | PersonData | PageData | GroupData;

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

        if (type === "posts" || type === "top") {
          sampleData.push(
            {
              id: `sample-post-1`,
              type: "post",
              author: {
                id: "user-sample-1",
                name: `Sample User`,
                avatar: DEFAULT_AVATAR,
              },
              origin: undefined,
              content:
                "Vietnam, located in Southeast Asia, is known for its rich history, diverse culture, and stunning landscapes, ranging from lush mountains to beautiful coastlines. The country has a vibrant economy, largely driven by agriculture, manufacturing, and ...",
              fullContent:
                "Vietnam, located in Southeast Asia, is known for its rich history, diverse culture, and stunning landscapes, ranging from lush mountains to beautiful coastlines. The country has a vibrant economy, largely driven by agriculture, manufacturing, and tourism. With a population of about 97 million people, Vietnam is one of the most populous countries in the world. The country's cuisine is renowned globally for its fresh ingredients, vibrant flavors, and healthy cooking techniques.",
              date: "Fri, February 7, 2025",
              time: "10:56 AM",
              mediaList: [
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661303/cld-sample-2.jpg",
                  type: "image",
                },
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
              ],
              likes: 293,
              comments: 18,
              shares: 10,
            },
            {
              id: `sample-post-page-1`,
              type: "post",
              author: {
                id: "pageJavaDev",
                name: "CLB Java Developer",
                avatar: DEFAULT_AVATAR,
              },
              origin: {
                type: "page",
                pageInfo: {
                  isFollowing: false,
                },
              },
              content: "Exciting news about our upcoming Java workshop!",
              date: "Thu, February 6, 2025",
              time: "02:30 PM",
              mediaList: [
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
              ],
              likes: 120,
              comments: 15,
              shares: 8,
            },
            {
              id: `sample-post-group-1`,
              type: "post",
              author: {
                id: "userTanDung",
                name: "Nguyễn Tấn Dũng",
                avatar: DEFAULT_AVATAR,
              },
              origin: {
                type: "group",
                groupInfo: {
                  id: "groupUITK22",
                  name: "UIT K22",
                  isJoined: true,
                },
              },
              content: "Anyone have notes for the last Algorithms lecture?",
              date: "Wed, February 5, 2025",
              time: "09:00 AM",
              mediaList: [
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
                {
                  url: "https://res.cloudinary.com/dhf9phgk6/image/upload/v1738661302/samples/cup-on-a-table.jpg",
                  type: "image",
                },
              ],
              likes: 30,
              comments: 5,
              shares: 2,
            }
          );
        }

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
            if (type === "posts") return item.type === "post";
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
        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
          Loading...
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
            case "post":
              return <Post key={result.id} post={result as PostDataType} />;
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

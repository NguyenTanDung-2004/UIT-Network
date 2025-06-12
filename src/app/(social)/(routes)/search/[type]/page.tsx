"use client";

import React, { useEffect, useState, use } from "react";
import PeopleCard from "@/components/search/PeopleCard";
import PageCard from "@/components/search/PageCard";
import GroupCard from "@/components/search/GroupCard";
import { ClipLoader } from "react-spinners";
import {
  searchPeople,
  searchFanpages,
  searchGroups,
  PersonData,
  PageData,
  GroupData,
} from "@/services/searchService";

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
    let isMounted = true;
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      if (!q || q.trim() === "") {
        setLoading(false);
        setError("Please enter a search query.");
        return;
      }

      try {
        let fetchedData: SearchResultItem[] = [];

        if (type === "people") {
          const people = await searchPeople(q);
          fetchedData = people.map((p) => ({
            ...p,
            isFriend: false,
          }));
        } else if (type === "pages") {
          const pages = await searchFanpages(q);
          fetchedData = pages.map((p) => ({
            ...p,
            isFollowing: false,
          }));
        } else if (type === "groups") {
          const groups = await searchGroups(q);
          fetchedData = groups.map((g) => ({
            ...g,
            isJoined: false,
          }));
        } else if (type === "top") {
          const [peopleResults, pagesResults, groupsResults] =
            await Promise.all([
              searchPeople(q),
              searchFanpages(q),
              searchGroups(q),
            ]);

          const combinedResults: SearchResultItem[] = [
            ...peopleResults.map((p) => ({ ...p, isFriend: false })),
            ...pagesResults.map((p) => ({ ...p, isFollowing: false })),
            ...groupsResults.map((g) => ({ ...g, isJoined: false })),
          ];
          fetchedData = combinedResults;
        } else {
          setError("Invalid search type.");
          setLoading(false);
          return;
        }

        if (isMounted) {
          setResults(fetchedData);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch search results.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [type, q]);

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
          No results found for "{q}".
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
              return null;
          }
        })}
      </div>
    );
  };

  return <div className="mx-2 md:mx-16 sm:mx-6">{renderContent()}</div>;
};

export default SearchResultsPage;

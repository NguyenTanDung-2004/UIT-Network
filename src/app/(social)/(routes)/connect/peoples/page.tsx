"use client";

import React from "react";
import ConnectPeople from "@/components/connect/ConnectPeople";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

interface PersonData {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  headline?: string;
  isFriend: boolean;
}

const ConnectPeoplePage = () => {
  const suggestedPeople: PersonData[] = [
    {
      id: `connect-person-1`,
      name: `Nguyễn Văn A`,
      avatar: DEFAULT_AVATAR,
      bio: "Software Engineer",
      headline: "Web Developer | React Enthusiast",
      isFriend: false,
    },
    {
      id: `connect-person-2`,
      name: `Trần Thị B`,
      avatar: `https://i.pravatar.cc/150?u=connect-person-2`,
      bio: "Software Engineer",
      headline: "Data Science Student",
      isFriend: true, // Already friends
    },
    {
      id: `connect-person-3`,
      name: `Lê Văn C`,
      bio: "Software Engineer",
      headline: "UI/UX Designer",
      isFriend: false,
    },
    {
      id: `connect-person-4`,
      name: `Phạm Thị D`,
      avatar: `https://i.pravatar.cc/150?u=connect-person-4`,
      bio: "Software Engineer",
      isFriend: false,
    },
  ];

  return (
    <div className="space-y-4 mx-8 md:mx-12 lg:mx-18 my-6">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 ">
        People You May Know
      </h2>
      {suggestedPeople.map((person) => (
        <ConnectPeople key={person.id} person={person} />
      ))}
    </div>
  );
};

export default ConnectPeoplePage;

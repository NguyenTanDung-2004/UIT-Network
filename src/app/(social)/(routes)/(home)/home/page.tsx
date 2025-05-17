"use client";
import React, { useState } from "react";
import CreatePost from "@/components/post/CreatePost";
import Post from "@/components/post/Post";
import { PostDataType } from "@/components/post/Post";
import {
  PeopleToConnectWidget,
  GroupsToJoinWidget,
  ConnectionStatus,
} from "@/components/home/Connect";
import CreatePostModal from "@/components/post/create/CreatePostModal";
import { UploadedFile } from "@/components/post/create/CreatePostModal";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg";

const HomePage = () => {
  // Mock user data
  const currentUser = {
    id: "user123",
    name: "Phan Nguyễn Trà Giang",
    avatar:
      "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
  };

  // Mock people to connect with
  const [peopleToConnect, setPeopleToConnect] = useState([
    {
      id: "user1",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.PENDING,
    },
    {
      id: "user2",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.NONE,
    },
    {
      id: "user3",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.CONNECTED,
    },
    {
      id: "user4",
      name: "Nguyễn Tấn Dũng",
      avatar:
        "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
      role: "Backend - Software Engineer",
      status: ConnectionStatus.NONE,
    },
  ]);

  // Mock groups to join
  const [groupsToJoin, setGroupsToJoin] = useState([
    {
      id: "group1",
      name: "UIT K22",
      joined: false,
    },
    {
      id: "group2",
      name: "UIT KHDL",
      joined: false,
    },
    {
      id: "group3",
      name: "Rubik Club",
      joined: true,
    },
    {
      id: "group4",
      name: "UIT CNPM",
      years: "2022 - 2025",
      joined: false,
    },
  ]);

  // Mock posts data
  const [posts, setPosts] = useState<PostDataType[]>([
    {
      id: "post1",
      author: {
        id: "author1",
        name: "Phan Nguyễn Trà Giang",
        avatar: DEFAULT_AVATAR,
      },
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
      id: "post-page1",
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
      likes: 150,
      comments: 22,
      shares: 5,
    },
    {
      id: "post-group1",
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
      likes: 45,
      comments: 8,
      shares: 2,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle creating a new post
  const handleCreatePost = (
    content: string,
    mediaList: { url: string; type: string }[],
    file?: UploadedFile
  ) => {
    let truncatedContent: string | undefined = undefined;
    if (content.length > 200) {
      truncatedContent = content.substring(0, 200);
    }
    const newPost = {
      id: `post${posts.length + 1}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      content: truncatedContent || "",
      fullContent: content,
      date: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      mediaList: mediaList,
      likes: 0,
      comments: 0,
      shares: 0,
      file: file,
    };

    setPosts([newPost, ...posts]);
  };

  // Handle connecting with a person
  const handleConnect = (userId: string) => {
    setPeopleToConnect(
      peopleToConnect.map((person) =>
        person.id === userId
          ? { ...person, status: ConnectionStatus.PENDING }
          : person
      )
    );
  };

  // Handle joining a group
  const handleJoinGroup = (groupId: string) => {
    setGroupsToJoin(
      groupsToJoin.map((group) =>
        group.id === groupId ? { ...group, joined: true } : group
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Feed */}
      <div className="flex-1 ">
        <CreatePost user={currentUser} onPostCreate={openModal} />

        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {/* <div className="hidden lg:block lg:w-72 ml-4 ">
        <PeopleToConnectWidget
          title="Who to connect"
          people={peopleToConnect}
          onConnect={handleConnect}
        />

        <GroupsToJoinWidget
          title="Group to join"
          groups={groupsToJoin}
          onJoin={handleJoinGroup}
        />
      </div> */}

      {/* Show CreatePostModal */}
      {isModalOpen && (
        <CreatePostModal
          onClose={closeModal}
          onPost={(content, mediaList, fileUrl) => {
            handleCreatePost(content, mediaList || [], fileUrl);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;

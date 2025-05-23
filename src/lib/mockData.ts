// lib/mockData.ts

export interface Group {
  id: string;
  name: string;
  intro: string;
  phone?: string;
  email?: string;
  avtUrl?: string;
  backgroundUrl?: string;
  memberCount: number;
  pendingRequestsCount: number;
  pendingPostsCount: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: "member" | "pending" | "admin"; // Thêm status
}

export interface Post {
  postId: string;
  userId: string; // Author ID
  authorName: string; // Mock author name for display
  authorAvatar: string; // Mock author avatar for display
  createdDate: string;
  caption: string;
  media: Array<{
    typeId: number;
    url: string;
    name?: string;
    unit?: string;
    sizeValue?: number;
  }>;
  postType: { id: number; typeName: string; value: string };
  status: "APPROVED" | "PENDING" | "REJECTED"; // Status for management
}

const SAMPLE_AVATARS = [
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738830166/cld-sample.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738270448/samples/upscale-face-1.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738333283/avt/kazlexgmzhz3izraigsv.jpg",
];

const SAMPLE_BACKGROUNDS = [
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738661302/samples/cup-on-a-table.jpg",
  "https://res.cloudinary.com/dos914bk9/image/upload/v1738661303/cld-sample-2.jpg",
];

const MOCK_USER_ID = "current-user-id"; // Simulate current logged-in user ID

const MOCK_GROUPS: Group[] = [
  {
    id: "group-1",
    name: "Next.js Study Group",
    intro: "Learn Next.js with us!",
    avtUrl: SAMPLE_AVATARS[0],
    backgroundUrl: SAMPLE_BACKGROUNDS[0],
    memberCount: 15,
    pendingRequestsCount: 3,
    pendingPostsCount: 2,
  },
  {
    id: "group-2",
    name: "React Frontend Masters",
    intro: "Deep dive into React",
    avtUrl: SAMPLE_AVATARS[1],
    backgroundUrl: SAMPLE_BACKGROUNDS[1],
    memberCount: 30,
    pendingRequestsCount: 0,
    pendingPostsCount: 5,
  },
  {
    id: "group-3",
    name: "TypeScript Enthusiasts",
    intro: "Strong types for everyone!",
    avtUrl: SAMPLE_AVATARS[2],
    backgroundUrl: SAMPLE_BACKGROUNDS[0],
    memberCount: 8,
    pendingRequestsCount: 1,
    pendingPostsCount: 0,
  },
];

const MOCK_MEMBERS_REQUESTS: {
  [groupId: string]: { members: User[]; requests: User[] };
} = {
  "group-1": {
    members: [
      {
        id: MOCK_USER_ID,
        name: "You",
        avatar: SAMPLE_AVATARS[2],
        status: "admin",
      },
      {
        id: "user-a",
        name: "Alice",
        avatar: SAMPLE_AVATARS[0],
        status: "member",
      },
      {
        id: "user-b",
        name: "Bob",
        avatar: SAMPLE_AVATARS[1],
        status: "member",
      },
    ],
    requests: [
      {
        id: "user-c",
        name: "Charlie",
        avatar: SAMPLE_AVATARS[0],
        status: "pending",
      },
      {
        id: "user-d",
        name: "David",
        avatar: SAMPLE_AVATARS[1],
        status: "pending",
      },
      {
        id: "user-e",
        name: "Eve",
        avatar: SAMPLE_AVATARS[2],
        status: "pending",
      },
    ],
  },
  "group-2": {
    members: [
      {
        id: MOCK_USER_ID,
        name: "You",
        avatar: SAMPLE_AVATARS[2],
        status: "admin",
      },
      {
        id: "user-f",
        name: "Frank",
        avatar: SAMPLE_AVATARS[0],
        status: "member",
      },
      {
        id: "user-g",
        name: "Grace",
        avatar: SAMPLE_AVATARS[1],
        status: "member",
      },
      {
        id: "user-h",
        name: "Heidi",
        avatar: SAMPLE_AVATARS[2],
        status: "member",
      },
    ],
    requests: [],
  },
  "group-3": {
    members: [
      {
        id: MOCK_USER_ID,
        name: "You",
        avatar: SAMPLE_AVATARS[2],
        status: "admin",
      },
      {
        id: "user-i",
        name: "Ivan",
        avatar: SAMPLE_AVATARS[0],
        status: "member",
      },
    ],
    requests: [
      {
        id: "user-j",
        name: "Judy",
        avatar: SAMPLE_AVATARS[1],
        status: "pending",
      },
    ],
  },
};

const MOCK_POSTS: { [groupId: string]: Post[] } = {
  "group-1": [
    {
      postId: "post-1-1",
      userId: "user-a",
      authorName: "Alice",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-10-27T10:00:00Z",
      caption: "Just finished building a component!",
      media: [],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "APPROVED",
    },
    {
      postId: "post-1-2",
      userId: "user-c",
      authorName: "Charlie",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-10-28T11:00:00Z",
      caption: "Question about hooks...",
      media: [],
      postType: { id: 6, typeName: "study_group_post", value: "anonymous" },
      status: "PENDING",
    },
    {
      postId: "post-1-3",
      userId: "user-b",
      authorName: "Bob",
      authorAvatar: SAMPLE_AVATARS[1],
      createdDate: "2023-10-28T14:30:00Z",
      caption: "Check out this cool article!",
      media: [
        {
          typeId: 2,
          url: "https://res.cloudinary.com/dos914bk9/image/upload/v1738661302/samples/cup-on-a-table.jpg",
        },
      ],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "PENDING",
    },
  ],
  "group-2": [
    {
      postId: "post-2-1",
      userId: "user-f",
      authorName: "Frank",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-11-01T09:00:00Z",
      caption: "Welcome!",
      media: [],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "APPROVED",
    },
    {
      postId: "post-2-2",
      userId: "user-g",
      authorName: "Grace",
      authorAvatar: SAMPLE_AVATARS[1],
      createdDate: "2023-11-01T10:00:00Z",
      caption: "Pending post 1",
      media: [],
      postType: { id: 6, typeName: "study_group_post", value: "anonymous" },
      status: "PENDING",
    },
    {
      postId: "post-2-3",
      userId: "user-h",
      authorName: "Heidi",
      authorAvatar: SAMPLE_AVATARS[2],
      createdDate: "2023-11-01T10:30:00Z",
      caption: "Pending post 2",
      media: [],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "PENDING",
    },
    {
      postId: "post-2-4",
      userId: "user-g",
      authorName: "Grace",
      authorAvatar: SAMPLE_AVATARS[1],
      createdDate: "2023-11-01T11:00:00Z",
      caption: "Pending post 3 with image",
      media: [{ typeId: 2, url: SAMPLE_BACKGROUNDS[1] }],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "PENDING",
    },
    {
      postId: "post-2-5",
      userId: "user-h",
      authorName: "Heidi",
      authorAvatar: SAMPLE_AVATARS[2],
      createdDate: "2023-11-01T11:30:00Z",
      caption: "Another pending post",
      media: [],
      postType: { id: 6, typeName: "study_group_post", value: "anonymous" },
      status: "PENDING",
    },
  ],
  "group-3": [
    {
      postId: "post-3-1",
      userId: "user-i",
      authorName: "Ivan",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-11-05T15:00:00Z",
      caption: "Just a test post",
      media: [],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "APPROVED",
    },
    {
      postId: "post-3-2",
      userId: "user-j",
      authorName: "Judy",
      authorAvatar: SAMPLE_AVATARS[1],
      createdDate: "2023-11-06T08:00:00Z",
      caption: "Hello group 3!",
      media: [],
      postType: { id: 7, typeName: "study_group_post", value: "unanonymous" },
      status: "PENDING",
    },
  ],
};

// --- Mock API Functions ---

// Simulate fetching groups managed by the current user
export const getMockUserGroups = (): Group[] => {
  // In a real app, you'd filter groups where the current user is an admin/manager
  return MOCK_GROUPS;
};

// Simulate fetching details for a specific group
export const getMockGroupInfo = (groupId: string): Group | undefined => {
  return MOCK_GROUPS.find((group) => group.id === groupId);
};

// Simulate fetching members and pending requests for a group
export const getMockGroupMembersAndRequests = (
  groupId: string
): { members: User[]; requests: User[] } => {
  return MOCK_MEMBERS_REQUESTS[groupId] || { members: [], requests: [] };
};

// Simulate fetching posts for a group
export const getMockGroupPosts = (groupId: string): Post[] => {
  return MOCK_POSTS[groupId] || [];
};

// Simulate updating group info (in-memory mock)
export const mockUpdateGroupInfo = (
  groupId: string,
  newData: Partial<Group>
): boolean => {
  const groupIndex = MOCK_GROUPS.findIndex((g) => g.id === groupId);
  if (groupIndex !== -1) {
    MOCK_GROUPS[groupIndex] = { ...MOCK_GROUPS[groupIndex], ...newData };
    console.log(`Mock: Updated group ${groupId}`, MOCK_GROUPS[groupIndex]);
    return true;
  }
  return false;
};

// Simulate accepting a join request (in-memory mock)
export const mockAcceptRequest = (groupId: string, userId: string): boolean => {
  const data = MOCK_MEMBERS_REQUESTS[groupId];
  if (data) {
    const requestIndex = data.requests.findIndex((r) => r.id === userId);
    if (requestIndex !== -1) {
      const [user] = data.requests.splice(requestIndex, 1); // Remove from requests
      user.status = "member"; // Update status
      data.members.push(user); // Add to members
      console.log(
        `Mock: Accepted request for user ${userId} in group ${groupId}`
      );
      // Simulate updating pending requests count in MOCK_GROUPS
      const group = MOCK_GROUPS.find((g) => g.id === groupId);
      if (group) group.pendingRequestsCount = data.requests.length;
      return true;
    }
  }
  return false;
};

// Simulate rejecting a join request (in-memory mock)
export const mockRejectRequest = (groupId: string, userId: string): boolean => {
  const data = MOCK_MEMBERS_REQUESTS[groupId];
  if (data) {
    const requestIndex = data.requests.findIndex((r) => r.id === userId);
    if (requestIndex !== -1) {
      data.requests.splice(requestIndex, 1); // Remove from requests
      console.log(
        `Mock: Rejected request for user ${userId} in group ${groupId}`
      );
      // Simulate updating pending requests count in MOCK_GROUPS
      const group = MOCK_GROUPS.find((g) => g.id === groupId);
      if (group) group.pendingRequestsCount = data.requests.length;
      return true;
    }
  }
  return false;
};

// Simulate removing a member (in-memory mock)
export const mockRemoveMember = (groupId: string, userId: string): boolean => {
  const data = MOCK_MEMBERS_REQUESTS[groupId];
  if (data) {
    const memberIndex = data.members.findIndex((m) => m.id === userId);
    if (memberIndex !== -1) {
      // Prevent removing the admin (current user in this mock)
      if (userId === MOCK_USER_ID) {
        console.warn("Mock: Cannot remove yourself (admin)");
        return false;
      }
      data.members.splice(memberIndex, 1); // Remove from members
      console.log(`Mock: Removed member ${userId} from group ${groupId}`);
      // Simulate updating member count in MOCK_GROUPS
      const group = MOCK_GROUPS.find((g) => g.id === groupId);
      if (group) group.memberCount = data.members.length;
      return true;
    }
  }
  return false;
};

// Simulate approving a post (in-memory mock)
export const mockApprovePost = (groupId: string, postId: string): boolean => {
  const posts = MOCK_POSTS[groupId];
  if (posts) {
    const post = posts.find(
      (p) => p.postId === postId && p.status === "PENDING"
    );
    if (post) {
      post.status = "APPROVED"; // Update status
      console.log(`Mock: Approved post ${postId} in group ${groupId}`);
      // Simulate updating pending posts count in MOCK_GROUPS
      const group = MOCK_GROUPS.find((g) => g.id === groupId);
      if (group)
        group.pendingPostsCount = posts.filter(
          (p) => p.status === "PENDING"
        ).length;
      return true;
    }
  }
  return false;
};

// Simulate rejecting a post (in-memory mock)
export const mockRejectPost = (groupId: string, postId: string): boolean => {
  const posts = MOCK_POSTS[groupId];
  if (posts) {
    const post = posts.find(
      (p) => p.postId === postId && p.status === "PENDING"
    );
    if (post) {
      post.status = "REJECTED"; // Update status
      console.log(`Mock: Rejected post ${postId} in group ${groupId}`);
      // Simulate updating pending posts count in MOCK_GROUPS
      const group = MOCK_GROUPS.find((g) => g.id === groupId);
      if (group)
        group.pendingPostsCount = posts.filter(
          (p) => p.status === "PENDING"
        ).length;
      return true;
    }
  }
  return false;
};

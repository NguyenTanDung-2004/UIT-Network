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

export interface Page {
  id: string;
  name: string;
  bio: string;
  avtUrl?: string;
  coverUrl?: string;
  followerCount: number;
  postCount: number;
}

// Follower is just a User object
export interface Follower extends User {}

// Page Post is similar to Group Post but might have different actions/status in this view
export interface PagePost {
  postId: string;
  authorId: string; // Should be the page ID itself for official posts, or a user ID for shared posts
  authorName: string; // Page Name or User Name
  authorAvatar: string; // Page Avatar or User Avatar
  createdDate: string;
  caption: string;
  media: Array<{
    typeId: number;
    url: string;
    name?: string;
    unit?: string;
    sizeValue?: number;
  }>;
  postType: { id: number; typeName: string; value: string }; // Still includes type
  // For page management, we just list existing posts, status might be 'PUBLISHED' or similar
  // We'll use 'PUBLISHED' for the mock
  status: "PUBLISHED" | "ARCHIVED" | "DRAFT"; // Example statuses for page posts
}

const MOCK_GROUP_POSTS: { [groupId: string]: Post[] } = {
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

// --- Mock Pages Data ---

const MOCK_PAGES: Page[] = [
  {
    id: "page-1",
    name: "Tech Insights Daily",
    bio: "Daily dose of technology news and analysis.",
    avtUrl: SAMPLE_AVATARS[0],
    coverUrl: SAMPLE_BACKGROUNDS[0],
    followerCount: 1500,
    postCount: 50,
  },
  {
    id: "page-2",
    name: "Creative Coding Hub",
    bio: "Exploring the art and science of creative coding.",
    avtUrl: SAMPLE_AVATARS[1],
    coverUrl: SAMPLE_BACKGROUNDS[1],
    followerCount: 800,
    postCount: 30,
  },
  {
    id: "page-3",
    name: "Digital Nomads Life",
    bio: "Tips and stories from remote workers around the world.",
    avtUrl: SAMPLE_AVATARS[2],
    coverUrl: SAMPLE_BACKGROUNDS[0],
    followerCount: 3200,
    postCount: 120,
  },
];

const MOCK_FOLLOWERS: { [pageId: string]: Follower[] } = {
  "page-1": [
    { id: "user-k", name: "Kyle", avatar: SAMPLE_AVATARS[0] },
    { id: "user-l", name: "Liam", avatar: SAMPLE_AVATARS[1] },
    { id: "user-m", name: "Mia", avatar: SAMPLE_AVATARS[2] },
    { id: "user-n", name: "Noah", avatar: SAMPLE_AVATARS[0] },
    { id: MOCK_USER_ID, name: "You", avatar: SAMPLE_AVATARS[2] }, // Simulate current user following
  ],
  "page-2": [
    { id: "user-o", name: "Olivia", avatar: SAMPLE_AVATARS[1] },
    { id: MOCK_USER_ID, name: "You", avatar: SAMPLE_AVATARS[2] },
  ],
  "page-3": [
    { id: "user-p", name: "Peter", avatar: SAMPLE_AVATARS[2] },
    { id: "user-q", name: "Quinn", avatar: SAMPLE_AVATARS[0] },
    { id: "user-r", name: "Ryan", avatar: SAMPLE_AVATARS[1] },
    { id: MOCK_USER_ID, name: "You", avatar: SAMPLE_AVATARS[2] },
  ],
};

const MOCK_PAGE_POSTS: { [pageId: string]: PagePost[] } = {
  "page-1": [
    {
      postId: "page-1-post-a",
      authorId: "page-1",
      authorName: "Tech Insights Daily",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-11-10T08:00:00Z",
      caption: "Latest AI breakthrough announced!",
      media: [{ typeId: 2, url: SAMPLE_BACKGROUNDS[0] }],
      postType: { id: 4, typeName: "fanpage_post", value: "public" },
      status: "PUBLISHED",
    },
    {
      postId: "page-1-post-b",
      authorId: "page-1",
      authorName: "Tech Insights Daily",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-11-09T15:00:00Z",
      caption: "New review of the latest smartphone.",
      media: [],
      postType: { id: 4, typeName: "fanpage_post", value: "public" },
      status: "PUBLISHED",
    },
    {
      postId: "page-1-post-c",
      authorId: "user-k",
      authorName: "Kyle",
      authorAvatar: SAMPLE_AVATARS[0],
      createdDate: "2023-11-08T10:00:00Z",
      caption: "Interesting article about tech ethics.",
      media: [],
      postType: { id: 8, typeName: "share_post", value: "share" },
      status: "PUBLISHED",
    },
  ],
  "page-2": [
    {
      postId: "page-2-post-a",
      authorId: "page-2",
      authorName: "Creative Coding Hub",
      authorAvatar: SAMPLE_AVATARS[1],
      createdDate: "2023-11-07T11:00:00Z",
      caption: "Tutorial on generating art with code.",
      media: [{ typeId: 2, url: SAMPLE_BACKGROUNDS[1] }],
      postType: { id: 4, typeName: "fanpage_post", value: "public" },
      status: "PUBLISHED",
    },
  ],
  "page-3": [
    {
      postId: "page-3-post-a",
      authorId: "page-3",
      authorName: "Digital Nomads Life",
      authorAvatar: SAMPLE_AVATARS[2],
      createdDate: "2023-11-06T09:00:00Z",
      caption: "Best cities for remote work in 2024.",
      media: [],
      postType: { id: 4, typeName: "fanpage_post", value: "public" },
      status: "PUBLISHED",
    },
    {
      postId: "page-3-post-b",
      authorId: "page-3",
      authorName: "Digital Nomads Life",
      authorAvatar: SAMPLE_AVATARS[2],
      createdDate: "2023-11-05T14:00:00Z",
      caption: "Tips for staying productive while traveling.",
      media: [],
      postType: { id: 4, typeName: "fanpage_post", value: "public" },
      status: "PUBLISHED",
    },
  ],
};

// --- Mock API Functions (Pages) ---

// Simulate fetching pages managed by the current user
export const getMockUserPages = (): Page[] => {
  // In a real app, filter pages based on user's admin role
  return MOCK_PAGES;
};

// Simulate fetching details for a specific page
export const getMockPageInfo = (pageId: string): Page | undefined => {
  return MOCK_PAGES.find((page) => page.id === pageId);
};

// Simulate fetching followers for a page
export const getMockPageFollowers = (pageId: string): Follower[] => {
  return MOCK_FOLLOWERS[pageId] || [];
};

// Simulate fetching posts for a page
export const getMockPagePosts = (pageId: string): PagePost[] => {
  return MOCK_PAGE_POSTS[pageId] || [];
};

// Simulate updating page info (in-memory mock)
export const mockUpdatePageInfo = (
  pageId: string,
  newData: Partial<Page>
): boolean => {
  const pageIndex = MOCK_PAGES.findIndex((p) => p.id === pageId);
  if (pageIndex !== -1) {
    MOCK_PAGES[pageIndex] = { ...MOCK_PAGES[pageIndex], ...newData };
    console.log(`Mock: Updated page ${pageId}`, MOCK_PAGES[pageIndex]);
    return true;
  }
  return false;
};

// Simulate removing a page post (in-memory mock)
export const mockRemovePagePost = (pageId: string, postId: string): boolean => {
  const posts = MOCK_PAGE_POSTS[pageId];
  if (posts) {
    const postIndex = posts.findIndex((p) => p.postId === postId);
    if (postIndex !== -1) {
      posts.splice(postIndex, 1); // Remove the post
      console.log(`Mock: Removed post ${postId} from page ${pageId}`);
      // Simulate updating post count in MOCK_PAGES
      const page = MOCK_PAGES.find((p) => p.id === pageId);
      if (page) page.postCount = posts.length;
      return true;
    }
  }
  return false;
};

// Simulate creating a page post (in-memory mock)
// This is a simplified mock, you'd need actual upload logic in a real app
export const mockCreatePagePost = (
  pageId: string,
  postData: {
    caption: string;
    media?: Array<{
      typeId: number;
      url: string;
      name?: string;
      unit?: string;
      sizeValue?: number;
    }>;
  }
): PagePost | undefined => {
  const page = MOCK_PAGES.find((p) => p.id === pageId);
  if (!page) return undefined;

  const newPost: PagePost = {
    postId: `page-post-${Date.now()}`, // Simple unique ID
    authorId: pageId,
    authorName: page.name,
    authorAvatar: page.avtUrl || "", // Use page avatar
    createdDate: new Date().toISOString(),
    caption: postData.caption,
    media: postData.media || [],
    postType: { id: 4, typeName: "fanpage_post", value: "public" }, // Default to public fanpage post
    status: "PUBLISHED", // Page posts are typically published immediately
  };

  if (!MOCK_PAGE_POSTS[pageId]) {
    MOCK_PAGE_POSTS[pageId] = [];
  }
  MOCK_PAGE_POSTS[pageId].unshift(newPost); // Add to the beginning
  page.postCount++; // Update post count
  console.log(`Mock: Created new post for page ${pageId}`, newPost);
  return newPost;
};

export type PageHeaderData = {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  followerCount: number;
  isFollowing: boolean;
};

export interface PageAboutData {
  overview: {
    bio: string;
  };
  contact: {
    phone: string | null;
    email: string | null;
    githubLink: string | null;
    socialLinks: { id: string; platform: string; url: string }[];
    websites: { id: string; url: string }[];
  };
  pageTransparency: {
    pageId: string | null;
    creationDate: string;
    infoAdmin: string;
  };
}

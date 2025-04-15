export interface ProfileAboutData {
  overview: {
    bio: string;
    born: string | null;
    status: string | null;
    occupation: string | null;
    livesIn: string | null;
    phone: string | null;
    email: string | null;
  };
  contact: {
    phone: string | null;
    email: string | null;
    githubLink: string | null;
    socialLinks: { id: string; platform: string; url: string }[];
    websites: { id: string; url: string }[];
  };
  basicInfo: {
    born: string | null;
    gender: string | null;
  };
  hobbies: { id: string; name: string; iconUrl: string }[];
  workAndEducation: {
    workplaces: {
      id: string;
      company: string;
      position: string;
      duration: string;
    }[];
    occupations: { id: string; title: string }[];
    experienceSummary: string | null;
    colleges: { id: string; name: string; degree: string; duration: string }[];
    highSchools: { id: string; name: string; duration: string }[];
  };
}

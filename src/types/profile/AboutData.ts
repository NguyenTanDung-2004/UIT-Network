export interface ProfileAboutData {
  id: string;
  avtURL: string;
  name: string;
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
  schedule?: {
    monday: { from: number; to: number }[];
    tuesday: { from: number; to: number }[];
    wednesday: { from: number; to: number }[];
    thursday: { from: number; to: number }[];
    friday: { from: number; to: number }[];
    saturday: { from: number; to: number }[];
    sunday: { from: number; to: number }[];
  };
}

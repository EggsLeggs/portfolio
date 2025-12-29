export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ProjectTag {
  id: string;
  label: string;
  color: string;
}

export interface Config {
  name: string;
  title: string;
  suffixes?: string[];
  email: string;
  location: string;
  about: string;
  social: SocialLink[];
  navigation: NavItem[];
  projects: {
    maxVisible: number;
  };
  awards: {
    maxVisible: number;
  };
  volunteering: {
    maxVisible: number;
  };
  projectTags: ProjectTag[];
  hackathonWins: number;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  technologies: string[];
  url?: string;
}

export interface ProjectLink {
  icon: string;
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  featured: boolean;
  date: string;
  endDate?: string;
  award?: string;
  technologies: string[];
  links: ProjectLink[];
  tags: string[];
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
  details?: string;
}

export interface CertificateResource {
  link: string;
  aspectRatio?: string;
  height?: number; // Height in pixels for PDF display
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  badge: string;
  certificate?: string | CertificateResource;
  url?: string;
  description?: string;
}

export interface Membership {
  organization: string;
  fullName: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  logo: string;
  memberId?: string;
  url?: string;
  description?: string;
}

export interface Volunteering {
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  url?: string;
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  grade?: string;
  activities?: string;
  skills?: string[];
  url?: string;
}

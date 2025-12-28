import { load } from "js-yaml";
import type {
  Config,
  Experience,
  Project,
  Certification,
  Membership,
  Volunteering,
  Education,
  Award,
} from "@/types";

// Import YAML files as raw text
import configRaw from "@/config/config.yaml?raw";
import experienceRaw from "@/config/experience.yaml?raw";
import projectsRaw from "@/config/projects.yaml?raw";
import certificationsRaw from "@/config/certifications.yaml?raw";
import membershipsRaw from "@/config/memberships.yaml?raw";
import volunteeringRaw from "@/config/volunteering.yaml?raw";
import educationRaw from "@/config/education.yaml?raw";
import awardsRaw from "@/config/awards.yaml?raw";

export const config: Config = load(configRaw) as Config;
export const experience: Experience[] = load(experienceRaw) as Experience[];
export const projects: Project[] = load(projectsRaw) as Project[];
export const certifications: Certification[] = load(
  certificationsRaw
) as Certification[];
export const memberships: Membership[] = load(membershipsRaw) as Membership[];
export const volunteering: Volunteering[] = load(
  volunteeringRaw
) as Volunteering[];
export const education: Education[] = load(educationRaw) as Education[];
export const awards: Award[] = load(awardsRaw) as Award[];

// Helper to check if an item is ongoing (endDate is "present")
const isPresent = (endDate: string | number | undefined): boolean => {
  if (!endDate) return false;
  return String(endDate).toLowerCase() === "present";
};

// Helper to parse date for sorting (handles various formats including numbers)
const parseDate = (dateStr: string | number | undefined): number => {
  if (!dateStr) return 0;
  const normalized = String(dateStr);
  if (normalized.toLowerCase() === "present") return Date.now();
  return new Date(normalized).getTime();
};

// Sort projects: present items first, then featured, then by date (newest first)
export const sortedProjects = [...projects].sort((a, b) => {
  const aPresent = isPresent(a.endDate);
  const bPresent = isPresent(b.endDate);

  // Present items come first
  if (aPresent && !bPresent) return -1;
  if (!aPresent && bPresent) return 1;

  // Within same present status, featured items come first
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;

  // Then sort by date (newest first)
  return parseDate(b.date) - parseDate(a.date);
});

// Sort certifications by date (newest first)
export const sortedCertifications = [...certifications].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Sort memberships by start date (newest first)
export const sortedMemberships = [...memberships].sort((a, b) => {
  return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
});

// Sort volunteering: present items first, then by start date (newest first)
export const sortedVolunteering = [...volunteering].sort((a, b) => {
  const aPresent = isPresent(a.endDate);
  const bPresent = isPresent(b.endDate);

  // Present items come first
  if (aPresent && !bPresent) return -1;
  if (!aPresent && bPresent) return 1;

  // Then sort by start date (newest first)
  return parseDate(b.startDate) - parseDate(a.startDate);
});

// Sort education by start date (newest first)
export const sortedEducation = [...education].sort((a, b) => {
  return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
});

// Sort awards by date (newest first)
export const sortedAwards = [...awards].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Get project tag configuration
export const getProjectTag = (tagId: string) => {
  return config.projectTags.find((tag) => tag.id === tagId);
};

// Stats helpers
export const getStats = () => {
  const certificationCount = certifications.length;
  const projectCount = projects.length;

  return {
    certifications: certificationCount,
    hackathonWins: config.hackathonWins,
    projects: projectCount,
  };
};

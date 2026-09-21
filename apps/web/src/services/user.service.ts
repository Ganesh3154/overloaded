import { apiClient } from "../helper/api-client";

export interface UserProfile {
  id: number;
  uid: string;
  username: string;
  fullName: string;
  email: string;
  yearsOfExperience: number;
  learningStyle: string[];
  techStack: string[];
  dsaLevel: number;
  systemDesignLevel: number;
  behavioralConfidence: number;
  skillsToLearn: string[];
  prepTime: number;
  hrsPerDay: number;
  isOnboarded: boolean;
  isDeleted: boolean;
  targetCompanies: {
    id: number;
    userId: number;
    companyId: number;
    company: { id: number; name: string };
  }[];
}

export async function getProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>("/user/profile");
}

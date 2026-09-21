import { z } from 'zod';

export const onboardingSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  yearsOfExperience: z.number().min(0).max(20),
  learningStyle: z
    .array(z.string())
    .min(1, 'Select at least one learning style'),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
  dsaLevel: z.number().min(0).max(3),
  systemDesignLevel: z.number().min(0).max(3),
  behavioralConfidence: z.number().min(0).max(3),
  targetCompanies: z
    .array(z.number())
    .min(1, 'Select at least one target company'),
  skillsToLearn: z.array(z.string()),
  prepTime: z.number().min(1, 'Set a prep timeline'),
  hrsPerDay: z.number().min(1, 'Set hours per day'),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
  ['username', 'learningStyle'],
  ['techStack'],
  ['targetCompanies'],
  ['prepTime', 'hrsPerDay'],
];

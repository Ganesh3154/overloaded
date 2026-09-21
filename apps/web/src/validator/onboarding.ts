import { onboardingSchema, type OnboardingInput } from '@overloaded/shared';

export { onboardingSchema };
export type OnboardingFormData = OnboardingInput;

export const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
  ['username', 'learningStyle'],
  ['techStack'],
  ['targetCompanies'],
  ['prepTime', 'hrsPerDay'],
];

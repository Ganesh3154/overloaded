import { apiClient } from "../helper/api-client";
import type { OnboardingFormData } from "../validator/onboarding";

export async function onboard(data: OnboardingFormData) {
  return await apiClient.post("/onboard", data);
}

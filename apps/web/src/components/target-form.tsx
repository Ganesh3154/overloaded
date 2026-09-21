import Chip from "./chip";
import { useFormContext } from "react-hook-form";
import type { OnboardingFormData } from "../validator/onboarding";

const SKILLS_TO_LEARN = [
  "System Design", "Kubernetes", "GenAI/LLMs",
  "Distributed Systems", "LLD", "Rust", "Go", "Cloud Architecture",
];

interface Props {
  companies: { id: number; name: string }[];
}

export default function TargetForm({ companies }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const targetCompanies = watch("targetCompanies");
  const skillsToLearn = watch("skillsToLearn");

  const toggleCompany = (id: number) => {
    const updated = targetCompanies.includes(id)
      ? targetCompanies.filter((c) => c !== id)
      : [...targetCompanies, id];
    setValue("targetCompanies", updated, { shouldValidate: true });
  };

  const toggleSkill = (skill: string) => {
    const updated = skillsToLearn.includes(skill)
      ? skillsToLearn.filter((s) => s !== skill)
      : [...skillsToLearn, skill];
    setValue("skillsToLearn", updated);
  };

  return (
    <div className="flex flex-col gap-6 bg-card rounded-lg border border-grid-gray/40 p-6">
      <div className="flex flex-col gap-2">
        <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
          Target Companies
        </label>
        <div className="flex flex-wrap gap-2">
          {companies.map((company) => (
            <Chip
              key={company.id}
              title={company.name}
              active={targetCompanies.includes(company.id)}
              onClick={() => toggleCompany(company.id)}
            />
          ))}
        </div>
        {errors.targetCompanies && (
          <p className="text-xs text-destructive">
            {(errors.targetCompanies as { message?: string }).message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
          New Skills to Learn
        </label>
        <div className="flex flex-wrap gap-2">
          {SKILLS_TO_LEARN.map((skill) => (
            <Chip
              key={skill}
              title={skill}
              active={skillsToLearn.includes(skill)}
              onClick={() => toggleSkill(skill)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

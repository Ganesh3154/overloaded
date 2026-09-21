import Slider from "./slider";
import { useFormContext } from "react-hook-form";
import type { OnboardingFormData } from "../validator/onboarding";

export default function PlanForm() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const prepTime = watch("prepTime");
  const hrsPerDay = watch("hrsPerDay");

  return (
    <div className="flex flex-col gap-6 bg-card rounded-lg border border-grid-gray/40 p-6">
      <div className="flex flex-col gap-1">
        <Slider
          label="Prep timeline (weeks)"
          min={0}
          max={48}
          value={prepTime}
          onChange={(e) =>
            setValue("prepTime", Number(e.target.value), { shouldValidate: true })
          }
        />
        {errors.prepTime && (
          <p className="text-xs text-destructive mt-1">{errors.prepTime.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Slider
          label="Hours available per day"
          min={0}
          max={24}
          value={hrsPerDay}
          onChange={(e) =>
            setValue("hrsPerDay", Number(e.target.value), { shouldValidate: true })
          }
        />
        {errors.hrsPerDay && (
          <p className="text-xs text-destructive mt-1">{errors.hrsPerDay.message}</p>
        )}
      </div>
    </div>
  );
}

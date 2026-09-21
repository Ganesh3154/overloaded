"use client";

import Button from "@/src/components/button";
import IdentifyForm from "@/src/components/identify-form";
import PlanForm from "@/src/components/plan-form";
import SkillForm from "@/src/components/skill-form";
import Stepper from "@/src/components/stepper";
import TargetForm from "@/src/components/target-form";
import {
  onboardingSchema,
  type OnboardingFormData,
  STEP_FIELDS,
} from "@/src/validator/onboarding";
import { validate } from "@/src/validator/resolver";
import { onboard } from "@/src/services/onboarding.service";
import { regenerateRoadmap } from "@/src/services/roadmap.service";
import { RoadmapGenerator } from "@/src/components/roadmap-generator";
import { getCompanies } from "@/src/services/company.service";
import { ArrowLeft, ArrowRight, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const STEPS = [
  { title: "Step 01", description: "Identify" },
  { title: "Step 02", description: "Skills" },
  { title: "Step 03", description: "Targets" },
  { title: "Step 04", description: "Plan" },
];

const DEFAULT_VALUES: OnboardingFormData = {
  username: "",
  yearsOfExperience: 0,
  learningStyle: [],
  techStack: [],
  dsaLevel: 0,
  systemDesignLevel: 0,
  behavioralConfidence: 0,
  targetCompanies: [],
  skillsToLearn: [],
  prepTime: 0,
  hrsPerDay: 0,
};

function StepContent({ step }: { step: number }) {
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  switch (step) {
    case 0:
      return <IdentifyForm />;
    case 1:
      return <SkillForm />;
    case 2:
      return <TargetForm companies={companies} />;
    case 3:
      return <PlanForm />;
    default:
      return null;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const [phase, setPhase] = useState<"form" | "generating">("form");

  useEffect(() => {
    if (localStorage.getItem("is_onboarded") === "true") router.replace("/dashboard");
  }, []);

  const form = useForm<OnboardingFormData>({
    resolver: validate(onboardingSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    mutate: generate,
    isPending: isGenerating,
    isError: isGenerateError,
  } = useMutation({
    mutationFn: regenerateRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      setTimeout(() => router.push("/dashboard"), 1200);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: onboard,
    onSuccess: () => {
      localStorage.setItem("is_onboarded", "true");
      setPhase("generating");
    },
  });

  if (phase === "generating") {
    return (
      <main className="flex-1 min-h-0 flex flex-col">
        <RoadmapGenerator
          profile={undefined}
          onGenerate={() => generate()}
          isGenerating={isGenerating}
          isError={isGenerateError}
          autoStart
        />
        {isGenerateError && (
          <div className="flex justify-center pb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-dim text-xs font-mono hover:text-foreground transition-colors underline underline-offset-4"
            >
              skip → go to dashboard
            </button>
          </div>
        )}
      </main>
    );
  }

  const handleNext = async () => {
    const valid = await form.trigger(STEP_FIELDS[activeStep]);
    if (valid) setActiveStep((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const handleBack = () => setActiveStep((i) => Math.max(0, i - 1));

  const progressPct = (activeStep / (STEPS.length - 1)) * 100;

  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex justify-center px-4 py-8 sm:py-12">
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-6 w-full max-w-2xl"
            onSubmit={form.handleSubmit((data) => mutate(data))}
          >
            {/* Header */}
            <div>
              <span className="text-lime-cs text-xs font-mono font-medium tracking-widest uppercase">
                // Onboarding
              </span>
              <h1 className="text-4xl font-bold mt-1">
                Let&apos;s get you{" "}
                <span className="bg-linear-to-r from-lime-cs to-[var(--gradient-sky)] bg-clip-text text-transparent">
                  set up
                </span>
              </h1>
              <p className="text-dim text-sm mt-1">
                Takes 60 seconds. You can update anything later.
              </p>
            </div>

            {/* Step navigation */}
            <div className="flex flex-col gap-2">
              {/* Progress bar */}
              <div className="relative h-0.5 bg-grid-gray/40 rounded-full">
                <div
                  className="absolute inset-y-0 left-0 bg-lime-cs rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Step tabs */}
              <div className="grid grid-cols-2 sm:flex gap-2">
                {STEPS.map((step, index) => {
                  const isCompleted = index < activeStep;
                  const isActive = activeStep === index;
                  return (
                    <Stepper
                      key={step.title}
                      step={step}
                      active={isActive}
                      completed={isCompleted}
                      onClick={() => setActiveStep(index)}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isCompleted ? (
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={11}
                            color="currentColor"
                          />
                        ) : (
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-lime-cs" : "bg-grid-gray/60"
                            }`}
                          />
                        )}
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-widest">
                          {step.title}
                        </span>
                      </div>
                      <span className="font-bold text-sm">
                        {step.description}
                      </span>
                    </Stepper>
                  );
                })}
              </div>
            </div>

            {/* Step content — key forces remount + re-animation on step change */}
            <div key={activeStep} className="animate-slide-up">
              <StepContent step={activeStep} />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                type="button"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <HugeiconsIcon icon={ArrowLeft} size={16} />
                <span className="ml-1">Back</span>
              </Button>

              {activeStep < STEPS.length - 1 ? (
                <Button variant="primary" type="button" onClick={handleNext}>
                  <span className="mr-1">Next</span>
                  <HugeiconsIcon icon={ArrowRight} size={16} />
                </Button>
              ) : (
                <Button variant="primary" type="submit" disabled={isPending}>
                  <span className="mr-1">
                    {isPending ? "Submitting…" : "Submit"}
                  </span>
                  <HugeiconsIcon icon={Tick02Icon} size={16} />
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}

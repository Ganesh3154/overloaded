"use client";

import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../services/user.service";

interface Props {
  profile: UserProfile | undefined;
  onGenerate: () => void;
  isGenerating: boolean;
  isError: boolean;
  autoStart?: boolean;
}

type Phase = "idle" | "generating" | "done" | "error";

interface LogLine {
  label: string;
  value: string;
  valueClass: string;
}

function buildSteps(profile: UserProfile | undefined): LogLine[] {
  const companies =
    profile?.targetCompanies
      ?.slice(0, 2)
      .map((tc) => tc.company.name.toLowerCase().replace(/\s+/g, "_"))
      .join(",  ") || "target_companies";

  return [
    { label: "reading", value: "profile_data", valueClass: "text-dim" },
    { label: "targeting", value: companies, valueClass: "text-lime-cs" },
    {
      label: "scheduling",
      value: `${profile?.prepTime ?? 12}_week_plan`,
      valueClass: "text-dim",
    },
    { label: "generating", value: "dsa_task_set", valueClass: "text-cat-dsa" },
    {
      label: "generating",
      value: "system_design_modules",
      valueClass: "text-cat-system-design",
    },
    {
      label: "generating",
      value: "behavioral_prep",
      valueClass: "text-cat-behavioral",
    },
    {
      label: "optimizing",
      value: "xp_difficulty_curve",
      valueClass: "text-cat-new-skill",
    },
    { label: "finalizing", value: "roadmap_structure", valueClass: "text-dim" },
  ];
}

export function RoadmapGenerator({ profile, onGenerate, isGenerating, isError, autoStart }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleCount, setVisibleCount] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevGenerating = useRef(false);
  const steps = buildSteps(profile);

  function startTyping() {
    setIsTyping(true);
    const cmd = "overloaded generate";
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setTypedText(cmd.slice(0, i));
      if (i === cmd.length) {
        clearInterval(tick);
        setTimeout(() => onGenerate(), 400);
      }
    }, 80);
  }

  function handleGenerate() {
    if (isTyping) return;
    startTyping();
  }

  function handleRetry() {
    setPhase("idle");
    setVisibleCount(0);
    setTypedText("");
    setIsTyping(false);
    // defer until state flush so isTyping guard in startTyping sees false
    setTimeout(() => startTyping(), 0);
  }

  useEffect(() => {
    if (isGenerating && !prevGenerating.current) {
      setPhase("generating");
      setVisibleCount(0);
    }
    if (!isGenerating && prevGenerating.current && phase === "generating") {
      if (isError) {
        setPhase("error");
      } else {
        setVisibleCount(steps.length);
        setPhase("done");
      }
    }
    prevGenerating.current = isGenerating;
  }, [isGenerating, isError]);

  useEffect(() => {
    if (phase !== "generating") return;
    const timer = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= steps.length) {
          clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, 450);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!autoStart) return;
    const t = setTimeout(() => startTyping(), 400);
    return () => clearTimeout(t);
  }, []);

  const isActive = phase === "generating" && visibleCount < steps.length;
  const activeStep = isActive ? steps[visibleCount] : null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 gap-8">
      <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
        <span className="text-xs font-mono font-medium text-lime-cs uppercase tracking-widest">
          // AI_ROADMAP_GENERATION
        </span>
        <h2 className="text-3xl font-bold">
          Build your{" "}
          <span className="bg-linear-to-r from-lime-cs to-[var(--gradient-sky)] bg-clip-text text-transparent">
            roadmap.
          </span>
        </h2>
        <p className="text-dim text-sm max-w-xs leading-relaxed">
          AI will analyse your profile and generate a personalised week-by-week
          interview prep plan.
        </p>
      </div>

      <div
        className="w-full max-w-lg bg-card border border-grid-gray/40 rounded-lg shadow-card overflow-hidden animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-grid-gray/40 bg-background/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-cat-behavioral/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-lime-cs/30" />
          </div>
          <span className="font-mono text-[10px] text-dim tracking-widest uppercase flex-1 text-center -ml-6">
            roadmap_generation.log
          </span>
        </div>

        {/* Log body */}
        <div className="p-5 font-mono text-xs space-y-2.5 min-h-[120px]">
          {phase === "idle" && (
            <>
              <div className="flex gap-3">
                <span className="text-accent shrink-0">›</span>
                <span className="text-dim shrink-0">status:</span>
                <span className="text-dim/60">no_roadmap_found</span>
              </div>
              <div className="flex gap-3">
                <span className="text-accent shrink-0">›</span>
                <span className="text-dim shrink-0">action:</span>
                <span className="text-lime-cs">
                  run overloaded generate to begin
                </span>
              </div>
              <div className="flex items-center gap-1 pt-1">
                <span className="text-lime-cs shrink-0">$</span>
                <span className="text-lime-cs">{typedText}</span>
                {!isTyping && (
                  <span
                    className="w-1.5 h-3.5 bg-lime-cs/70 inline-block"
                    style={{ animation: "cursor-blink 1s step-end infinite" }}
                  />
                )}
                {isTyping && typedText.length < 19 && (
                  <span className="w-1.5 h-3.5 bg-lime-cs inline-block" />
                )}
              </div>
            </>
          )}

          {phase === "error" && (
            <>
              {steps.slice(0, visibleCount).map((step, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <span className="text-accent shrink-0">›</span>
                  <span className="text-dim shrink-0 w-20">{step.label}:</span>
                  <span className={step.valueClass}>{step.value}</span>
                  <span className="ml-auto text-lime-cs/60">✓</span>
                </div>
              ))}
              <div className="flex gap-3 items-center pt-1">
                <span className="text-destructive shrink-0">›</span>
                <span className="text-dim shrink-0 w-20">error:</span>
                <span className="text-destructive font-semibold">generation_failed</span>
              </div>
              <div className="flex gap-3 pt-1">
                <span className="text-accent shrink-0">›</span>
                <span className="text-dim shrink-0">hint:</span>
                <span className="text-dim/60">check profile completeness and retry</span>
              </div>
            </>
          )}

          {(phase === "generating" || phase === "done") && (
            <>
              {steps.slice(0, visibleCount).map((step, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <span className="text-accent shrink-0">›</span>
                  <span className="text-dim shrink-0 w-20">{step.label}:</span>
                  <span className={step.valueClass}>{step.value}</span>
                  <span className="ml-auto text-lime-cs/60">✓</span>
                </div>
              ))}

              {isActive && (
                <div className="flex gap-3 items-center">
                  <span className="text-accent shrink-0">›</span>
                  <span className="text-dim shrink-0 w-20">
                    {activeStep!.label}:
                  </span>
                  <span className={`${activeStep!.valueClass}`}>
                    {activeStep!.value}
                    <span className="loader-ellipsis" />
                  </span>
                </div>
              )}

              {phase === "done" && (
                <div className="flex gap-3 items-center pt-1">
                  <span className="text-lime-cs shrink-0">›</span>
                  <span className="text-dim shrink-0 w-20">status:</span>
                  <span className="text-lime-cs font-semibold">
                    roadmap_ready
                  </span>
                  <span className="loader-ellipsis text-lime-cs ml-1" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {(phase === "idle" || phase === "error") && (
        <div className="flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
          {phase === "error" && (
            <p className="text-destructive text-xs font-mono">generation_failed — check your profile and retry</p>
          )}
          <button
            onClick={phase === "error" ? handleRetry : handleGenerate}
            disabled={isTyping}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lime-cs text-background font-semibold text-sm hover:bg-lime-cs/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {phase === "error" ? "Retry generation" : "Generate roadmap"}
          </button>
        </div>
      )}
    </div>
  );
}

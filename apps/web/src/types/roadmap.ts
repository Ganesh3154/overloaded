export type TagVariant =
  | "DSA"
  | "SYSTEM DESIGN"
  | "BEHAVIORAL"
  | "NEW SKILL"
  | "RESUME";

export type StatusFilter = "ALL" | "TODO" | "DONE";

export interface RoadmapTask {
  id: number;
  title: string;
  tag: TagVariant;
  duration: string;
  xp: number;
  done: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  tasks: RoadmapTask[];
}

export interface RoadmapStats {
  completion: number;
  readiness: number;
  totalHours: number;
  remainingHours: number;
  completedTasks: number;
  totalTasks: number;
}

export const tagStyles: Record<TagVariant, string> = {
  DSA: "bg-lime-500/15 text-[var(--cat-dsa)] border border-lime-500/30",
  "SYSTEM DESIGN": "bg-fuchsia-500/15 text-[var(--cat-system-design)] border border-fuchsia-500/30",
  BEHAVIORAL: "bg-amber-500/15 text-[var(--cat-behavioral)] border border-amber-500/30",
  "NEW SKILL": "bg-sky-500/15 text-[var(--cat-new-skill)] border border-sky-500/30",
  RESUME: "bg-slate-500/15 text-[var(--cat-resume)] border border-slate-500/30",
};

export const tagActiveStyles: Record<TagVariant, string> = {
  DSA: "bg-lime-500/30 text-[var(--cat-dsa)] border border-lime-500/60",
  "SYSTEM DESIGN": "bg-fuchsia-500/30 text-[var(--cat-system-design)] border border-fuchsia-500/60",
  BEHAVIORAL: "bg-amber-500/30 text-[var(--cat-behavioral)] border border-amber-500/60",
  "NEW SKILL": "bg-sky-500/30 text-[var(--cat-new-skill)] border border-sky-500/60",
  RESUME: "bg-slate-500/30 text-[var(--cat-resume)] border border-slate-500/60",
};

export interface RoadmapData {
  totalWeeks: number;
  generatedAt: string;
  stats: RoadmapStats;
  weeks: RoadmapWeek[];
}

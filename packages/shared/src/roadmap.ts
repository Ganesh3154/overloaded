import { z } from 'zod';

export const TASK_TAGS = [
  'DSA',
  'SYSTEM_DESIGN',
  'BEHAVIORAL',
  'NEW_SKILL',
  'RESUME',
] as const;
export type TaskTag = (typeof TASK_TAGS)[number];

// Human-readable label for each tag, used for display and for the LLM's
// structured output (which speaks in labels, not the DB's enum keys).
export const TASK_TAG_LABELS = {
  DSA: 'DSA',
  SYSTEM_DESIGN: 'SYSTEM DESIGN',
  BEHAVIORAL: 'BEHAVIORAL',
  NEW_SKILL: 'NEW SKILL',
  RESUME: 'RESUME',
} as const satisfies Record<TaskTag, string>;
export type TaskTagLabel = (typeof TASK_TAG_LABELS)[TaskTag];

export const TASK_LABEL_TO_TAG: Record<TaskTagLabel, TaskTag> =
  Object.fromEntries(
    (Object.entries(TASK_TAG_LABELS) as [TaskTag, TaskTagLabel][]).map(
      ([tag, label]) => [label, tag],
    ),
  ) as Record<TaskTagLabel, TaskTag>;

export const TASK_STATUSES = ['TODO', 'COMPLETED'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const WEEK_STATUSES = ['PENDING', 'ONGOING', 'COMPLETED'] as const;
export type WeekStatus = (typeof WEEK_STATUSES)[number];

export const ROADMAP_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type RoadmapStatus = (typeof ROADMAP_STATUSES)[number];

export const updateTaskStatusSchema = z.object({
  status: z.enum(TASK_STATUSES),
});
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

// The API's wire shape for a roadmap, as returned by GET/POST /roadmap.
export interface RoadmapTaskResponse {
  id: number;
  roadmapWeekId: number;
  title: string;
  tag: TaskTag;
  status: TaskStatus;
  duration: string;
  xp: number;
}

export interface RoadmapWeekResponse {
  id: number;
  roadmapId: number;
  weekNumber: number;
  title: string;
  status: WeekStatus;
  tasks: RoadmapTaskResponse[];
}

export interface RoadmapResponse {
  id: number;
  userId: number;
  totalWeeks: number;
  status: RoadmapStatus;
  generatedAt: string;
  weeks: RoadmapWeekResponse[];
}

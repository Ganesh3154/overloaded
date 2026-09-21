import { TaskTag } from '@prisma/client';
import {
  TASK_LABEL_TO_TAG,
  TASK_TAG_LABELS,
  type TaskTagLabel,
} from '@overloaded/shared';

// The LLM speaks in human-readable labels (e.g. "SYSTEM DESIGN"), which get
// translated to the DB's TaskTag enum (e.g. SYSTEM_DESIGN) once persisted.
export type RoadmapTag = TaskTagLabel;

export const roadmapTagToTaskTag: Record<RoadmapTag, TaskTag> =
  TASK_LABEL_TO_TAG;

const TASK_TAG_LABEL_LIST = Object.values(TASK_TAG_LABELS);

export interface RoadmapTask {
  title: string;
  tag: RoadmapTag;
  duration: string;
  xp: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  tasks: RoadmapTask[];
}

export interface RoadmapResponse {
  totalWeeks: number;
  weeks: RoadmapWeek[];
}

export const ROADMAP_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    totalWeeks: { type: 'number' },
    weeks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          weekNumber: { type: 'number' },
          title: { type: 'string' },
          tasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                tag: {
                  type: 'string',
                  enum: TASK_TAG_LABEL_LIST,
                },
                duration: { type: 'string' },
                xp: { type: 'number' },
              },
              required: ['title', 'tag', 'duration', 'xp'],
              additionalProperties: false,
            },
          },
        },
        required: ['weekNumber', 'title', 'tasks'],
        additionalProperties: false,
      },
    },
  },
  required: ['totalWeeks', 'weeks'],
  additionalProperties: false,
} as const;

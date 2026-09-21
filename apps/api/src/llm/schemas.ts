export type RoadmapTag =
  'DSA' | 'SYSTEM DESIGN' | 'BEHAVIORAL' | 'NEW SKILL' | 'RESUME';

import { TaskTag } from '@prisma/client';

export const roadmapTagToTaskTag: Record<RoadmapTag, TaskTag> = {
  DSA: TaskTag.DSA,
  'SYSTEM DESIGN': TaskTag.SYSTEM_DESIGN,
  BEHAVIORAL: TaskTag.BEHAVIORAL,
  'NEW SKILL': TaskTag.NEW_SKILL,
  RESUME: TaskTag.RESUME,
};

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
                  enum: [
                    'DSA',
                    'SYSTEM DESIGN',
                    'BEHAVIORAL',
                    'NEW SKILL',
                    'RESUME',
                  ],
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

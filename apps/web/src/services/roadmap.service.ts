import type { RoadmapResponse, TaskStatus } from '@overloaded/shared';
import { apiClient } from '../helper/api-client';
import type { RoadmapData, RoadmapStats, RoadmapWeek } from '../types/roadmap';

function mapRoadmap(api: RoadmapResponse): RoadmapData {
  const weeks = api.weeks.map((week) => ({
    weekNumber: week.weekNumber,
    title: week.title,
    tasks: week.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      tag: task.tag,
      duration: task.duration,
      xp: task.xp,
      done: task.status === 'COMPLETED',
    })),
  }));
  return {
    totalWeeks: api.totalWeeks,
    generatedAt: api.generatedAt,
    stats: computeStats(weeks),
    weeks,
  };
}

export async function getActiveRoadmap(): Promise<RoadmapData | null> {
  const roadmaps = await apiClient.get<RoadmapResponse[]>('/roadmap');
  const active = roadmaps.find((r) => r.status === 'ACTIVE') ?? roadmaps[0];
  return active ? mapRoadmap(active) : null;
}

export async function regenerateRoadmap() {
  const api = await apiClient.post<RoadmapResponse>('/roadmap', undefined);
  return api;
}

export async function updateTaskStatus(taskId: number, status: TaskStatus) {
  return apiClient.patch<void>(`/roadmap/task/${taskId}`, { status });
}

function parseDuration(duration: string): number {
  const s = duration.replace('~', '').toUpperCase();
  if (s.endsWith('H')) return parseFloat(s) * 60;
  if (s.endsWith('M')) return parseFloat(s);
  return 0;
}

export function computeStats(weeks: RoadmapWeek[]): RoadmapStats {
  const allTasks = weeks.flatMap((w) => w.tasks);
  const completedTasks = allTasks.filter((t) => t.done).length;
  const totalTasks = allTasks.length;
  const totalMinutes = allTasks.reduce(
    (sum, t) => sum + parseDuration(t.duration),
    0,
  );
  const remainingMinutes = allTasks
    .filter((t) => !t.done)
    .reduce((sum, t) => sum + parseDuration(t.duration), 0);
  const pct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return {
    completion: pct,
    readiness: pct,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    remainingHours: Math.round((remainingMinutes / 60) * 10) / 10,
    completedTasks,
    totalTasks,
  };
}

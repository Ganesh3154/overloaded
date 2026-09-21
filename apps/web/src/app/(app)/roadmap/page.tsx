'use client';

import { useState } from 'react';
import Accordion from '@/src/components/accordion';
import { Loader } from '@/src/components/loader';
import { StatsCard } from '@/src/components/stats-card';
import {
  tagStyles,
  tagActiveStyles,
  type StatusFilter,
  type RoadmapData,
} from '@/src/types/roadmap';
import {
  TASK_TAG_LABELS,
  TASK_TAGS,
  type TaskStatus,
  type TaskTag,
} from '@overloaded/shared';
import { Ai, FilterIcon, Target, Trophy } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  computeStats,
  getActiveRoadmap,
  regenerateRoadmap,
  updateTaskStatus,
} from '@/src/services/roadmap.service';
import { getProfile } from '@/src/services/user.service';
import { PageError } from '@/src/components/page-error';
import { RoadmapGenerator } from '@/src/components/roadmap-generator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const statusActiveStyle: Record<StatusFilter, string> = {
  ALL: 'bg-cat-new-skill/20 text-cat-new-skill',
  TODO: 'bg-cat-behavioral/20 text-cat-behavioral',
  DONE: 'bg-cat-dsa/20 text-cat-dsa',
};

export default function RoadmapPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedTags, setSelectedTags] = useState<Set<TaskTag>>(new Set());
  const queryClient = useQueryClient();

  const {
    data: roadmap,
    isLoading: isRoadmapLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['roadmap'],
    queryFn: getActiveRoadmap,
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const {
    mutate: generate,
    isPending: isGenerating,
    isError: isGenerateError,
  } = useMutation({
    mutationFn: regenerateRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });

  const { mutate: toggleTask } = useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: number;
      status: TaskStatus;
    }) => updateTaskStatus(taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['roadmap'] });
      const previous = queryClient.getQueryData<RoadmapData>(['roadmap']);
      queryClient.setQueryData<RoadmapData>(['roadmap'], (old) => {
        if (!old) return old;
        const updatedWeeks = old.weeks.map((w) => ({
          ...w,
          tasks: w.tasks.map((t) =>
            t.id === taskId ? { ...t, done: status === 'COMPLETED' } : t,
          ),
        }));
        return {
          ...old,
          weeks: updatedWeeks,
          stats: computeStats(updatedWeeks),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['roadmap'], context.previous);
      }
    },
  });

  const handleToggle = (taskId: number, currentDone: boolean) => {
    toggleTask({ taskId, status: currentDone ? 'TODO' : 'COMPLETED' });
  };

  const toggleTag = (tag: TaskTag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  if (isRoadmapLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <PageError
        message="Could not load your roadmap."
        onRetry={() => refetch()}
      />
    );
  }

  if (!roadmap) {
    return (
      <RoadmapGenerator
        profile={profile}
        onGenerate={() => generate()}
        isGenerating={isGenerating}
        isError={isGenerateError}
      />
    );
  }

  const { stats, weeks, totalWeeks, generatedAt } = roadmap;

  const formattedDate = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="flex flex-col gap-4 max-w-6xl w-full p-4 sm:p-6 mx-auto">
      <span className="text-xs font-mono font-medium text-lime-cs uppercase">
        {'// '}
        {totalWeeks}-WEEK PLAN . GENERATED {formattedDate}
      </span>
      <h2 className="text-4xl font-bold">
        Your{' '}
        <span className="bg-linear-to-r from-lime-cs to-(--gradient-sky) bg-clip-text text-transparent">
          roadmap
        </span>
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <StatsCard
          index={0}
          label="COMPLETION"
          icon={
            <HugeiconsIcon icon={Trophy} size={18} className="text-cat-dsa" />
          }
          value={`${stats.completion}%`}
          progress={stats.completion}
          subtitle={`${stats.completedTasks}/${stats.totalTasks} done`}
        />
        <StatsCard
          index={1}
          label="READINESS"
          icon={
            <HugeiconsIcon
              icon={Target}
              size={18}
              className="text-cat-system-design"
            />
          }
          value={`${stats.readiness}%`}
          progress={stats.readiness}
          subtitle={`for ${(profile?.targetCompanies ?? []).map((tc) => tc.company.name).join(', ')}`}
        />
        <StatsCard
          index={2}
          label="TIME INVESTMENT"
          icon={
            <HugeiconsIcon icon={Ai} size={18} className="text-cat-new-skill" />
          }
          value={`${stats.remainingHours}h left`}
          progress={stats.totalHours - stats.remainingHours}
          subtitle={`remaining of ${stats.totalHours}h total`}
          max={stats.totalHours}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap sm:flex-row items-center justify-center sm:justify-normal gap-3 px-4 py-3 bg-card shadow-card border border-grid-gray/40 rounded-lg animate-slide-up">
          <div className="flex gap-2 items-center text-xs font-mono font-semibold uppercase text-dim">
            <HugeiconsIcon icon={FilterIcon} size={15} />
            <span>Filter</span>
          </div>

          <div className="flex bg-background border border-grid-gray/40 rounded-md p-0.5">
            {(['ALL', 'TODO', 'DONE'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex items-center rounded text-[0.7rem] font-mono font-semibold py-1.5 px-3 transition-all duration-150 ${
                  statusFilter === s
                    ? statusActiveStyle[s]
                    : 'text-dim hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t sm:border-s sm:border-t-0 ps-3 sm:pt-0 pt-3 border-grid-gray/40">
            {TASK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-[0.7rem] px-2.5 py-1 rounded-full border font-semibold transition-all duration-150 uppercase ${
                  selectedTags.has(tag) ? tagActiveStyles[tag] : tagStyles[tag]
                }`}
              >
                {TASK_TAG_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>

        {weeks.map((week, i) => (
          <div
            key={week.weekNumber}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Accordion
              week={week}
              statusFilter={statusFilter}
              selectedTags={selectedTags}
              onToggle={handleToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Lightning,
  Clock01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import ProgressBar from './progress-bar';
import {
  tagStyles,
  type RoadmapWeek,
  type StatusFilter,
  type TagVariant,
} from '../types/roadmap';

interface AccordionProps {
  week: RoadmapWeek;
  statusFilter: StatusFilter;
  selectedTags: Set<TagVariant>;
  onToggle: (taskId: number, done: boolean) => void;
}

export default function Accordion({
  week,
  statusFilter,
  selectedTags,
  onToggle,
}: AccordionProps) {
  const [open, setOpen] = useState(true);

  const tasks = week.tasks;
  const doneCount = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const percent = Math.round((doneCount / total) * 100);
  const earnedXP = tasks.filter((t) => t.done).reduce((s, t) => s + t.xp, 0);
  const totalXP = tasks.reduce((s, t) => s + t.xp, 0);

  const visibleTasks = tasks.filter((t) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'DONE' && t.done) ||
      (statusFilter === 'TODO' && !t.done);
    const matchesTag = selectedTags.size === 0 || selectedTags.has(t.tag);
    return matchesStatus && matchesTag;
  });

  return (
    <div className="flex w-full gap-2">
      {/* Week indicator column */}
      <div className="flex flex-col items-center pt-3 shrink-0">
        <span className="flex items-center justify-center text-sm text-lime-cs font-semibold font-mono bg-card shadow-card border border-grid-gray/40 rounded-full h-10 w-10">
          W{week.weekNumber}
        </span>
        <div className="flex-1 w-px bg-grid-gray/40 mt-1" />
      </div>

      {/* Card */}
      <div className="w-full rounded-2xl bg-card shadow-card border border-grid-gray/40 overflow-hidden transition-colors duration-200 hover:border-grid-gray/60">
        {/* Accordion header */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-4 px-5 pt-5 pb-3 hover:bg-background transition-colors duration-150 group text-left"
        >
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold tracking-tight">
                  {week.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-dim text-[11px] font-semibold font-mono tracking-widest uppercase">
                    Week {week.weekNumber}
                  </span>
                  <span className="text-grid-gray">·</span>
                  <span className="text-dim text-[11px] font-medium">
                    {doneCount}/{total} done
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lime-cs text-[11px] font-bold font-mono">
                    {percent}%
                  </span>
                  <div className="w-16">
                    <ProgressBar value={percent} />
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-lime-cs/10 border border-lime-cs/20 rounded-lg px-2.5 py-1">
                  <HugeiconsIcon
                    icon={Lightning}
                    size={13}
                    color="var(--lime-cs)"
                  />
                  <span className="text-lime-cs text-[11px] font-bold font-mono">
                    {earnedXP} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`text-dim transition-transform duration-300 shrink-0 ${
              open ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={18}
              color="currentColor"
            />
          </div>
        </button>

        {/* Collapsible body */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="h-px bg-border/40" />
            <div className="divide-y divide-border/30">
              {visibleTasks.length === 0 ? (
                <p className="text-dim text-xs text-center py-6">
                  No tasks match the current filter.
                </p>
              ) : (
                visibleTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onToggle(task.id, task.done)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-background transition-colors duration-150 group text-left"
                  >
                    <div className="shrink-0 transition-transform duration-150 group-hover:scale-110">
                      <HugeiconsIcon
                        icon={task.done ? CheckmarkCircle02Icon : Cancel01Icon}
                        size={22}
                        color={
                          task.done ? 'var(--lime-cs)' : 'var(--grid-gray)'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-sm font-medium leading-snug transition-colors duration-200 ${
                          task.done
                            ? 'line-through text-dim'
                            : 'text-foreground/80 group-hover:text-foreground'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase ${tagStyles[task.tag]}`}
                        >
                          {task.tag}
                        </span>
                        <span className="flex items-center gap-1 text-dim text-[11px]">
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            size={12}
                            color="currentColor"
                          />
                          {task.duration}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-bold font-mono transition-colors duration-200 ${
                        task.done
                          ? 'text-lime-cs'
                          : 'text-lime-cs/20 group-hover:text-lime-cs/50'
                      }`}
                    >
                      +{task.xp} XP
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="px-6 py-3 border-t border-border/30 flex items-center justify-between">
              <span className="text-dim/50 text-[11px] font-mono font-semibold tracking-widest uppercase">
                {total - doneCount} remaining
              </span>
              <span className="text-dim/50 text-[11px] font-mono">
                {earnedXP} / {totalXP} XP earned
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

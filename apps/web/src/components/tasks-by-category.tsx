'use client';

import { RoadmapWeek } from '@/src/types/roadmap';
import { Cell, Pie, PieChart } from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  DSA: 'var(--cat-dsa)',
  'SYSTEM DESIGN': 'var(--cat-system-design)',
  BEHAVIORAL: 'var(--cat-behavioral)',
  'NEW SKILL': 'var(--cat-new-skill)',
  RESUME: 'var(--cat-resume)',
  MOCK: 'var(--cat-mock)',
};

function formatTag(tag: string) {
  return tag
    .split(' ')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

interface Props {
  weeks: RoadmapWeek[];
  completedTasks: number;
  totalTasks: number;
}

export function TasksByCategory({ weeks, completedTasks, totalTasks }: Props) {
  const categoryStats = weeks
    .flatMap((w) => w.tasks)
    .reduce(
      (acc, task) => {
        if (!acc[task.tag]) acc[task.tag] = { done: 0, total: 0 };
        acc[task.tag].total++;
        if (task.done) acc[task.tag].done++;
        return acc;
      },
      {} as Record<string, { done: number; total: number }>,
    );

  const donutData = Object.entries(categoryStats).map(([tag, s]) => ({
    name: tag,
    value: s.total,
    color: CATEGORY_COLORS[tag] ?? 'var(--text-dim)',
  }));

  return (
    <div
      className="bg-card border rounded-lg p-4 border-grid-gray/40 shadow-card transition-colors duration-200 animate-slide-up"
      style={{ animationDelay: '250ms' }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">Tasks by category</span>
        <span className="text-xs font-medium font-mono text-dim">
          {completedTasks} / {totalTasks}{' '}
          <span className="text-lime-cs">COMPLETE</span>
        </span>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center items-center">
        <div className="shrink-0">
          <PieChart width={180} height={180}>
            <Pie
              data={donutData}
              cx={90}
              cy={90}
              innerRadius={54}
              outerRadius={82}
              dataKey="value"
              paddingAngle={3}
              strokeWidth={0}
              isAnimationActive
            >
              {donutData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {Object.entries(categoryStats).map(([tag, s]) => {
            const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
            const color = CATEGORY_COLORS[tag] ?? 'var(--text-dim)';
            return (
              <div
                key={tag}
                className="flex items-center justify-between bg-card border border-grid-gray/20 rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full h-2 w-2 shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-sm">{formatTag(tag)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-dim">
                    {s.done}/{s.total}
                  </span>
                  <span
                    className="font-medium"
                    style={{
                      color: pct > 0 ? 'var(--lime-cs)' : 'var(--text-dim)',
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

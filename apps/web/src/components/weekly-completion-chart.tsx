"use client";

import { RoadmapWeek } from "@/src/types/roadmap";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  weeks: RoadmapWeek[];
}

export function WeeklyCompletionChart({ weeks }: Props) {
  const data = weeks.map((w) => ({
    name: `W${w.weekNumber}`,
    done: w.tasks.filter((t) => t.done).length,
    remaining: w.tasks.filter((t) => !t.done).length,
  }));

  return (
    <div
      className="flex-[2] min-h-0 bg-card border rounded-lg p-4 border-grid-gray/40 shadow-card transition-colors duration-200 flex flex-col h-72 lg:h-auto animate-slide-up"
      style={{ animationDelay: "150ms" }}
    >
      <div className="flex justify-between items-center mb-4 shrink-0">
        <span className="text-sm font-medium">Weekly completion</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="bg-lime-cs rounded-full h-2 w-2" />
            <span className="text-xs font-mono font-medium text-dim tracking-wide uppercase">
              Done
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-grid-gray/60 rounded-full h-2 w-2" />
            <span className="text-xs font-mono font-medium text-dim tracking-wide uppercase">
              Left
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: 1 }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={undefined}
          maxHeight={undefined}
        >
          <BarChart
            data={data}
            barSize={36}
            barCategoryGap="25%"
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--text-dim)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-dim)", fontSize: 11 }}
              allowDecimals={false}
              width={24}
            />
            <Tooltip
              cursor={{ fill: "var(--chart-cursor)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "var(--text-dim)" }}
            />
            <Bar
              dataKey="done"
              stackId="a"
              fill="var(--lime-cs)"
              radius={[0, 0, 0, 0]}
              isAnimationActive
            />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="var(--chart-remaining)"
              radius={[4, 4, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

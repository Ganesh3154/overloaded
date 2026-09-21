"use client";

import { Cell, Pie, PieChart } from "recharts";

interface Props {
  readiness: number;
}

const OUTER = 90;
const INNER = 60;
const MID = (OUTER + INNER) / 2;

export function ReadinessCard({ readiness }: Props) {
  const pct = Math.min(100, Math.max(0, readiness));
  const data = [{ value: pct }, { value: 100 - pct }];

  // Recharts: startAngle=90 is 12-o'clock, angles decrease clockwise
  const tipAngleRad = ((90 - (pct / 100) * 360) * Math.PI) / 180;
  const tipX = 100 + MID * Math.cos(tipAngleRad);
  const tipY = 100 - MID * Math.sin(tipAngleRad);

  return (
    <div
      className="sm:flex-1 bg-card border rounded-lg p-4 border-grid-gray/40 shadow-card transition-colors duration-200 flex flex-col animate-slide-up"
      style={{ animationDelay: "200ms" }}
    >
      <span className="text-sm font-medium">Readiness</span>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Radial lime glow */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-15 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, var(--lime-cs) 0%, transparent 70%)",
            }}
          />
          <PieChart width={200} height={200}>
            <Pie
              data={data}
              cx={100}
              cy={100}
              innerRadius={INNER}
              outerRadius={OUTER}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
              isAnimationActive
            >
              <Cell fill="var(--lime-cs)" />
              <Cell fill="var(--chart-remaining)" />
            </Pie>
          </PieChart>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-lime-cs">
              {readiness}%
            </span>
            <span className="text-xs font-mono font-medium text-dim tracking-wide uppercase">
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

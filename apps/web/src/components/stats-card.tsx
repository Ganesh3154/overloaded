import { ReactNode } from 'react';
import ProgressBar from './progress-bar';

interface Props {
  label: string;
  icon: ReactNode;
  value: string;
  subtitle: string;
  progress: number;
  min?: number;
  max?: number;
  index?: number;
}

export function StatsCard({
  label,
  icon,
  value,
  subtitle,
  progress,
  min,
  max,
  index = 0,
}: Props) {
  return (
    <div
      className="flex flex-col gap-2 flex-1 min-w-0 bg-card border rounded-lg p-4 border-grid-gray/40 shadow-card hover:border-lime-cs/20 hover:shadow-glow transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-dim font-medium tracking-wide uppercase">
          {label}
        </span>
        {icon}
      </div>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-xs text-dim truncate" title={subtitle}>
        {subtitle}
      </span>
      <ProgressBar value={progress} min={min} max={max} />
    </div>
  );
}

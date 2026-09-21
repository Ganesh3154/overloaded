'use client';

import { useEffect } from 'react';
import Button from '@/src/components/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 gap-10">
      <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
        <span className="text-xs font-mono font-medium text-lime-cs uppercase tracking-widest">
          {'// RUNTIME_EXCEPTION'}
        </span>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-none">
          Something{' '}
          <span className="bg-linear-to-r from-lime-cs to-(--gradient-sky) bg-clip-text text-transparent">
            crashed.
          </span>
        </h1>
        <p className="text-dim text-sm max-w-sm leading-relaxed">
          An unhandled exception interrupted your session. Your progress is
          intact — this is a temporary blip.
        </p>
      </div>

      <div
        className="w-full max-w-lg bg-card border border-grid-gray/40 rounded-lg shadow-card overflow-hidden animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-grid-gray/40 bg-background/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-cat-behavioral/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-lime-cs/30" />
          </div>
          <span className="font-mono text-[10px] text-dim tracking-widest uppercase flex-1 text-center -ml-6">
            crash_report.log
          </span>
        </div>

        <div className="p-5 font-mono text-xs space-y-2.5">
          <LogLine
            label="timestamp"
            value={new Date().toISOString()}
            valueClass="text-lime-cs"
          />
          <LogLine
            label="message"
            value={error.message || 'Unknown error'}
            valueClass="text-destructive"
          />
          {error.digest && (
            <LogLine
              label="digest"
              value={error.digest}
              valueClass="text-dim/60"
            />
          )}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-accent shrink-0">›</span>
            <span className="text-lime-cs">
              awaiting_recovery
              <span className="loader-ellipsis" />
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex gap-3 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <Button variant="primary" onClick={reset}>
          Retry session
        </Button>
      </div>
    </div>
  );
}

function LogLine({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-accent shrink-0">›</span>
      <span className="text-dim shrink-0">{label}:</span>
      <span className={`${valueClass} break-all`}>{value}</span>
    </div>
  );
}

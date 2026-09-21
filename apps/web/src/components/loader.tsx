import { cn } from '@/src/helper/class-merge';

interface LoaderProps {
  label?: string;
  className?: string;
}

export function Loader({ label = 'loading', className }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex flex-col items-center gap-5', className)}
    >
      {/* Brand mark with pulsing halo */}
      <div className="relative">
        <div
          className="absolute -inset-3 rounded-xl blur-xl opacity-25 animate-loader-halo pointer-events-none"
          style={{ background: 'var(--lime-cs)' }}
          aria-hidden="true"
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-lime-cs shadow-glow">
          <span
            className="font-mono font-bold text-base leading-none select-none"
            style={{ color: 'var(--logo-text)' }}
          >
            &gt;
            <span
              className="[animation:cursor-blink_1s_step-start_infinite]"
              aria-hidden="true"
            >
              _
            </span>
          </span>
        </div>
      </div>

      {/* Indeterminate scanning bar */}
      <div
        className="w-20 h-0.5 bg-grid-gray/60 rounded-full relative overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 w-1/3 bg-lime-cs rounded-full animate-loader-scan" />
      </div>

      {/* Label */}
      {label && (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
          <span className="loader-ellipsis" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}

export function FullscreenLoader({ label = 'loading' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <Loader label={label} />
    </div>
  );
}

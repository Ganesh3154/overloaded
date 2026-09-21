import Button from "./button";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = "The request failed. Check your connection and try again.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 gap-8">
      <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
        <span className="text-xs font-mono font-medium text-lime-cs uppercase tracking-widest">
          // API_ERROR
        </span>
        <h2 className="text-3xl font-bold">
          Failed to{" "}
          <span className="bg-linear-to-r from-lime-cs to-[var(--gradient-sky)] bg-clip-text text-transparent">
            load.
          </span>
        </h2>
        <p className="text-dim text-sm max-w-xs leading-relaxed">{message}</p>
      </div>

      <div
        className="w-full max-w-sm bg-card border border-grid-gray/40 rounded-lg shadow-card overflow-hidden animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-grid-gray/40 bg-background/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-cat-behavioral/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-lime-cs/30" />
          </div>
          <span className="font-mono text-[10px] text-dim tracking-widest uppercase flex-1 text-center -ml-6">
            network_error.log
          </span>
        </div>

        <div className="p-4 font-mono text-xs space-y-2">
          <div className="flex gap-3">
            <span className="text-accent shrink-0">›</span>
            <span className="text-dim shrink-0">status:</span>
            <span className="text-destructive">request_failed</span>
          </div>
          <div className="flex gap-3">
            <span className="text-accent shrink-0">›</span>
            <span className="text-dim shrink-0">action:</span>
            <span className="text-lime-cs">check_connection_and_retry</span>
          </div>
        </div>
      </div>

      {onRetry && (
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Button variant="primary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

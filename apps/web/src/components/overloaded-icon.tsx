export default function OverloadedIcon() {
  return (
    <div className="group flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-cs shadow-card">
        <span
          className="font-mono font-bold text-base leading-none"
          style={{ color: 'var(--logo-text)' }}
        >
          &gt;
          <span className="[animation:cursor-blink_1s_step-start_infinite]">
            _
          </span>
        </span>
      </div>
      <div>
        <span className="font-mono font-bold tracking-tight">Overloaded</span>
      </div>
    </div>
  );
}

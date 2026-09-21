import { useEffect, useState } from 'react';

interface Props {
  value?: number;
  min?: number;
  max?: number;
}

export default function ProgressBar({ value = 0, min = 0, max = 100 }: Props) {
  const [mounted, setMounted] = useState(false);

  const clamped = Math.min(max, Math.max(min, value));
  const width = `calc(${clamped - min} / ${max - min} * 100%)`;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="w-full bg-grid-gray/40 rounded-full h-1.5">
      <div
        className={`bg-lime-cs h-1.5 transition-[width] duration-700 ease-out ${
          clamped >= max ? 'rounded-full' : 'rounded-l-full'
        }`}
        style={{ width: mounted ? width : '0%' }}
      />
    </div>
  );
}

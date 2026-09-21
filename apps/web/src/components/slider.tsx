import { InputHTMLAttributes } from 'react';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min?: number;
  max?: number;
}

export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const pct = max > min ? ((Number(value) - min) / (max - min)) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-baseline">
        <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
          {label}
        </label>
        <span className="text-lime-cs text-xl font-bold font-mono leading-none">
          {value}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        style={{
          background: `linear-gradient(to right, var(--lime-cs) 0%, var(--lime-cs) ${pct}%, var(--grid-gray) ${pct}%, var(--grid-gray) 100%)`,
        }}
        className="w-full h-1.5 appearance-none rounded-full cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-lime-cs
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-lime-cs
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer"
        {...props}
      />
    </div>
  );
}

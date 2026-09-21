import { ButtonHTMLAttributes } from 'react';
import { cn } from '../helper/class-merge';

interface StepperProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  completed?: boolean;
}

export default function Stepper({
  active,
  completed = false,
  children,
  ...props
}: StepperProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col flex-1 border p-2.5 rounded-lg transition-all duration-150 text-left',
        active
          ? 'border-lime-cs/40 bg-lime-cs/10 text-lime-cs'
          : completed
            ? 'border-grid-gray/30 bg-card text-dim opacity-60 hover:opacity-80'
            : 'border-grid-gray/40 bg-card text-dim hover:border-grid-gray/60',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

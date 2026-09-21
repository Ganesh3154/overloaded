import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: IconSvgElement;
  rightElement?: ReactNode;
}

export default function Input({ icon, rightElement, ...props }: InputProps) {
  const base =
    'w-full rounded-lg border border-border bg-background py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime-cs/60 focus:ring-1 focus:ring-lime-cs/30 transition-all';

  return (
    <div className="relative">
      {icon && (
        <HugeiconsIcon
          icon={icon}
          size={15}
          color="currentColor"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          strokeWidth={1.5}
        />
      )}
      <input
        {...props}
        className={`${base} ${icon ? 'pl-10 pr-10' : 'px-4'}`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );
}

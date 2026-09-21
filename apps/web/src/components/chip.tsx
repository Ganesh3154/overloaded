"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "../helper/class-merge";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  active: boolean;
}

export default function Chip({ title, active, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-150",
        active
          ? "bg-lime-cs text-[#0d1117] border-lime-cs/60"
          : "border-grid-gray/60 text-dim hover:border-lime-cs/30 hover:text-foreground",
        className,
      )}
      {...props}
    >
      {title}
    </button>
  );
}

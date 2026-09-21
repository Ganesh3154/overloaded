'use client';

import { useTheme } from '@/src/app/theme-provider';
import {
  Moon01Icon,
  PanelRightClose,
  Sun01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border/60 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <div>
            <span className="text-[10px] font-mono font-medium text-lime-cs uppercase tracking-widest">
              // Settings
            </span>
            <p className="font-bold text-sm mt-0.5">Preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-dim hover:text-foreground hover:bg-background transition-colors duration-150"
          >
            <HugeiconsIcon
              icon={PanelRightClose}
              size={16}
              color="currentColor"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-5 flex-1 overflow-y-auto">
          {/* Theme */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono font-semibold text-dim uppercase tracking-widest">
              Appearance
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all duration-150 ${
                  theme === 'light'
                    ? 'border-lime-cs/50 bg-lime-cs/10 text-lime-cs'
                    : 'border-border/40 text-dim hover:border-border hover:text-foreground'
                }`}
              >
                <HugeiconsIcon
                  icon={Sun01Icon}
                  size={16}
                  color="currentColor"
                />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all duration-150 ${
                  theme === 'dark'
                    ? 'border-lime-cs/50 bg-lime-cs/10 text-lime-cs'
                    : 'border-border/40 text-dim hover:border-border hover:text-foreground'
                }`}
              >
                <HugeiconsIcon
                  icon={Moon01Icon}
                  size={16}
                  color="currentColor"
                />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

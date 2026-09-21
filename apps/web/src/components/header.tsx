'use client';

import Link from 'next/link';
import OverloadedIcon from './overloaded-icon';
import { SettingsPanel } from './settings-panel';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon } from '@hugeicons/core-free-icons';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useIsLoggedIn } from '../hooks/use-is-logged-in';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/profile', label: 'Profile' },
];

export default function Header() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  return (
    <>
      <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-border/60 bg-card/80 backdrop-blur-xl shadow-card">
        <div className="mx-auto flex max-w-6xl h-full items-center justify-between px-4 sm:px-6">
          <div className="flex-1">
            <OverloadedIcon />
          </div>

          <nav className="hidden md:flex items-center">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 text-xs font-mono font-medium tracking-widest transition-colors duration-200 ${
                    isActive ? 'text-lime-cs' : 'text-dim hover:text-foreground'
                  }`}
                >
                  {label.toUpperCase()}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-px w-2/5 -translate-x-1/2 bg-lime-cs animate-scale-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-1 justify-end items-center gap-2">
            {!isLoggedIn && (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-1.5 rounded-lg border border-lime-cs/40 text-lime-cs font-mono text-xs font-medium tracking-wide hover:bg-lime-cs/10 transition-colors"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-dim hover:text-foreground hover:bg-background transition-colors duration-200"
            >
              <HugeiconsIcon icon={Settings01Icon} />
            </button>
          </div>
        </div>
      </header>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}

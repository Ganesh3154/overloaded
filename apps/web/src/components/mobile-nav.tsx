'use client';

import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Trophy,
  DashboardBrowsingIcon,
  User02Icon,
  Login01Icon,
} from '@hugeicons/core-free-icons';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home01Icon },
  { href: '/dashboard', label: 'Dashboard', icon: DashboardBrowsingIcon },
  { href: '/roadmap', label: 'Roadmap', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User02Icon },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('access_token'));
  }, [pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-around px-2">
        {!isLoggedIn && (
          <Link
            href="/login"
            className="flex flex-col items-center gap-1 flex-1 py-2 text-lime-cs transition-colors duration-200"
          >
            <HugeiconsIcon icon={Login01Icon} size={20} color="currentColor" />
            <span className="text-[10px] font-mono font-medium tracking-wide uppercase">
              Login
            </span>
          </Link>
        )}
        {NAV_LINKS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors duration-200 ${
                isActive ? 'text-lime-cs' : 'text-dim'
              }`}
            >
              <HugeiconsIcon icon={icon} size={20} color="currentColor" />
              <span className="text-[10px] font-mono font-medium tracking-wide uppercase">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

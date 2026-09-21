'use client';

import Link from 'next/link';
import { ArrowRight } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

function K({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/80">&quot;{children}&quot;</span>;
}
function S({ children }: { children: React.ReactNode }) {
  return <span className="text-lime-cs">&quot;{children}&quot;</span>;
}
function N({ children }: { children: React.ReactNode }) {
  return <span className="text-cat-new-skill">{children}</span>;
}
function A({ children }: { children: React.ReactNode }) {
  return <span className="text-cat-behavioral">&quot;{children}&quot;</span>;
}

export default function HomePage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col">
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">
        {/* Badge */}
        <div className="animate-fade-in">
          <span className="flex items-center gap-2 border border-lime-cs/30 rounded-full px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-dim">
            <span
              className="w-1.5 h-1.5 rounded-full bg-lime-cs"
              style={{ animation: 'cursor-blink 2s step-end infinite' }}
            />
            V1.0 — ADAPTIVE PREP ENGINE
          </span>
        </div>

        {/* Heading */}
        <div
          className="text-center animate-slide-up"
          style={{ animationDelay: '60ms' }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Crack your next
          </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            <span className="bg-linear-to-r from-lime-cs to-(--gradient-sky) bg-clip-text text-transparent">
              dev interview{' '}
              <span className="text-foreground text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                on{' '}
              </span>
            </span>
          </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            <span className="bg-linear-to-r from-accent to-lime-cs bg-clip-text text-transparent">
              your&nbsp;&nbsp;terms.
            </span>
          </h1>
        </div>

        {/* Subtext */}
        <p
          className="text-dim text-sm sm:text-base max-w-md text-center leading-relaxed animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          A personalized, gamified prep OS. Tell us your stack, target companies
          and timeline — get a roadmap that adapts as you grow.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 animate-slide-up"
          style={{ animationDelay: '180ms' }}
        >
          <Link
            href="/roadmap"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-lime-cs text-background font-semibold text-sm hover:bg-lime-cs/90 transition-colors"
          >
            Build my roadmap
            <HugeiconsIcon icon={ArrowRight} size={15} color="currentColor" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-lime-cs/30 text-lime-cs font-semibold text-sm hover:bg-lime-cs/8 transition-colors"
          >
            View dashboard
          </Link>
        </div>

        {/* Terminal card */}
        <div
          className="w-full max-w-3xl animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <div className="bg-card border border-grid-gray/40 rounded-xl shadow-card">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-grid-gray/40 bg-background/60">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive/60" />
                <span className="w-3 h-3 rounded-full bg-cat-behavioral/60" />
                <span className="w-3 h-3 rounded-full bg-lime-cs/40" />
              </div>
              <span className="font-mono text-[11px] text-dim tracking-wide ml-2">
                ~/roadmap.json
              </span>
            </div>

            <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm leading-7 select-none">
              <div className="text-dim">{'{'}</div>
              <div className="pl-4 sm:pl-6">
                <div>
                  <K>target</K>
                  <span className="text-dim">{': ['}</span>
                  <S>Google</S>
                  <span className="text-dim">{', '}</span>
                  <S>Stripe</S>
                  <span className="text-dim">{'],'}</span>
                </div>
                <div>
                  <K>level</K>
                  <span className="text-dim">{': { '}</span>
                  <K>dsa</K>
                  <span className="text-dim">{': '}</span>
                  <S>intermediate</S>
                  <span className="text-dim">{', '}</span>
                  <K>system_design</K>
                  <span className="text-dim">{': '}</span>
                  <S>beginner</S>
                  <span className="text-dim">{' },'}</span>
                </div>
                <div>
                  <K>weeks</K>
                  <span className="text-dim">{': '}</span>
                  <N>8</N>
                  <span className="text-dim">,</span>
                </div>
                <div>
                  <K>focus</K>
                  <span className="text-dim">{': ['}</span>
                  <S>DSA</S>
                  <span className="text-dim">{', '}</span>
                  <S>System Design</S>
                  <span className="text-dim">{', '}</span>
                  <S>Behavioral</S>
                  <span className="text-dim">{'],'}</span>
                </div>
                <div>
                  <K>readiness</K>
                  <span className="text-dim">{': '}</span>
                  <N>68</N>
                  <span className="text-dim">,</span>
                </div>
                <div>
                  <K>next_task</K>
                  <span className="text-dim">{': '}</span>
                  <S>Solve 10 sliding window problems</S>
                  <span className="text-dim">,</span>
                </div>
                <div>
                  <K>xp</K>
                  <span className="text-dim">{': '}</span>
                  <N>420</N>
                  <span className="text-dim">,</span>
                </div>
                <div>
                  <K>level_up_in</K>
                  <span className="text-dim">{': '}</span>
                  <A>380 XP</A>
                </div>
              </div>
              <div className="text-dim">{'}'}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

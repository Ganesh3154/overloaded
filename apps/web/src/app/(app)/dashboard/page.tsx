'use client';

import { Loader } from '@/src/components/loader';
import { PageError } from '@/src/components/page-error';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ReadinessCard } from '@/src/components/readiness-card';
import { StatsCard } from '@/src/components/stats-card';
import { TasksByCategory } from '@/src/components/tasks-by-category';
import { WeeklyCompletionChart } from '@/src/components/weekly-completion-chart';
import { getActiveRoadmap } from '@/src/services/roadmap.service';
import { getProfile } from '@/src/services/user.service';
import {
  FireIcon,
  FlashIcon,
  Target02Icon,
  Trophy,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const router = useRouter();
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  function handleGoToRoadmap() {
    if (isTyping) return;
    setIsTyping(true);
    const cmd = 'cd roadmap';
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setTypedText(cmd.slice(0, i));
      if (i === cmd.length) {
        clearInterval(tick);
        setTimeout(() => router.push('/roadmap'), 400);
      }
    }, 80);
  }

  const {
    data: roadmap,
    isLoading: isRoadmapLoading,
    isError: isRoadmapError,
    refetch: refetchRoadmap,
  } = useQuery({
    queryKey: ['roadmap'],
    queryFn: getActiveRoadmap,
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  if (isRoadmapLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  }

  if (isRoadmapError || isProfileError) {
    return (
      <PageError
        message="Could not load your dashboard."
        onRetry={() => {
          refetchRoadmap();
          refetchProfile();
        }}
      />
    );
  }

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 gap-8">
        <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
          <span className="text-xs font-mono font-medium text-lime-cs uppercase tracking-widest">
            // NO_ACTIVE_ROADMAP
          </span>
          <h2 className="text-3xl font-bold">
            Nothing to{' '}
            <span className="bg-linear-to-r from-lime-cs to-[var(--gradient-sky)] bg-clip-text text-transparent">
              show yet.
            </span>
          </h2>
          <p className="text-dim text-sm max-w-xs leading-relaxed">
            Your dashboard will come alive once you generate a roadmap. It only
            takes a few seconds.
          </p>
        </div>

        <div
          className="w-full max-w-sm bg-card border border-grid-gray/40 rounded-lg shadow-card overflow-hidden animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-grid-gray/40 bg-background/60">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-cat-behavioral/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-lime-cs/30" />
            </div>
            <span className="font-mono text-[10px] text-dim tracking-widest uppercase flex-1 text-center -ml-6">
              dashboard.log
            </span>
          </div>
          <div className="p-5 font-mono text-xs space-y-2.5">
            <div className="flex gap-3">
              <span className="text-accent shrink-0">›</span>
              <span className="text-dim shrink-0">status:</span>
              <span className="text-dim/60">no_roadmap_found</span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent shrink-0">›</span>
              <span className="text-dim shrink-0">xp:</span>
              <span className="text-dim/60">—</span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent shrink-0">›</span>
              <span className="text-dim shrink-0">completion:</span>
              <span className="text-dim/60">—</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-accent shrink-0">›</span>
              <span className="text-dim shrink-0">action:</span>
              <span className="text-lime-cs">generate_roadmap to unlock</span>
            </div>
            <div className="flex items-center gap-1 pt-1">
              <span className="text-lime-cs shrink-0">$</span>
              <span className="text-lime-cs">{typedText}</span>
              {!isTyping && (
                <span
                  className="w-1.5 h-3.5 bg-lime-cs/70 inline-block"
                  style={{ animation: 'cursor-blink 1s step-end infinite' }}
                />
              )}
              {isTyping && typedText.length < 10 && (
                <span className="w-1.5 h-3.5 bg-lime-cs inline-block" />
              )}
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={handleGoToRoadmap}
            disabled={isTyping}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lime-cs text-background font-semibold text-sm hover:bg-lime-cs/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Go to roadmap
          </button>
        </div>
      </div>
    );
  }

  const { stats, weeks } = roadmap;
  const loggedHours = (stats.totalHours - stats.remainingHours).toFixed(1);

  const totalXp = weeks
    .flatMap((w) => w.tasks)
    .filter((t) => t.done)
    .reduce((sum, t) => sum + t.xp, 0);

  const companiesLabel = profile?.targetCompanies?.length
    ? profile.targetCompanies
        .slice(0, 2)
        .map((c) => c.company.name)
        .join(', ') + (profile.targetCompanies.length > 2 ? '...' : '')
    : 'your target companies';

  return (
    <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden flex flex-col gap-3 max-w-6xl w-full px-4 sm:px-6 py-4 mx-auto">
      <span className="text-xs font-mono font-medium text-lime-cs uppercase">
        // Hello, {profile?.username}
      </span>
      <h2 className="text-4xl font-bold">
        Your{' '}
        <span className="bg-linear-to-r from-lime-cs to-[var(--gradient-sky)] bg-clip-text text-transparent">
          dashboard
        </span>
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <StatsCard
          index={0}
          label="XP"
          icon={
            <div className="rounded-full p-2 bg-cat-dsa/20">
              <HugeiconsIcon
                icon={FlashIcon}
                size={16}
                className="text-cat-dsa"
              />
            </div>
          }
          value={String(totalXp)}
          subtitle="Rookie Engineer · 300 XP to SDE I"
          progress={totalXp}
          max={300}
        />
        <StatsCard
          index={1}
          label="Streak"
          icon={
            <div className="rounded-full p-2 bg-cat-behavioral/20">
              <HugeiconsIcon
                icon={FireIcon}
                size={16}
                className="text-cat-behavioral"
              />
            </div>
          }
          value="0d"
          subtitle="Keep going!"
          progress={0}
        />
        <StatsCard
          index={2}
          label="Readiness"
          icon={
            <div className="rounded-full p-2 bg-cat-system-design/20">
              <HugeiconsIcon
                icon={Target02Icon}
                size={16}
                className="text-cat-system-design"
              />
            </div>
          }
          value={`${stats.readiness}%`}
          subtitle={`for ${companiesLabel}`}
          progress={stats.readiness}
        />
        <StatsCard
          index={3}
          label="Roadmap Progress"
          icon={
            <div className="rounded-full p-2 bg-cat-new-skill/20">
              <HugeiconsIcon
                icon={Trophy}
                size={16}
                className="text-cat-new-skill"
              />
            </div>
          }
          value={`${stats.completion}%`}
          subtitle={`${stats.completedTasks} / ${stats.totalTasks} tasks`}
          progress={stats.completion}
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-1 lg:min-h-0">
        <span className="text-xs font-mono font-medium text-lime-cs uppercase">
          // Analytics
        </span>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Progress at a glance</h3>
          <span className="text-xs font-mono font-medium text-lime-cs">
            {loggedHours}H LOGGED
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-1 lg:min-h-0">
          <WeeklyCompletionChart weeks={weeks} />
          <ReadinessCard readiness={stats.readiness} />
        </div>

        <TasksByCategory
          weeks={weeks}
          completedTasks={stats.completedTasks}
          totalTasks={stats.totalTasks}
        />
      </div>
    </div>
  );
}

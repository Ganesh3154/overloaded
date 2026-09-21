'use client';

import { Loader } from '@/src/components/loader';
import { PageError } from '@/src/components/page-error';
import { getActiveRoadmap } from '@/src/services/roadmap.service';
import { getProfile } from '@/src/services/user.service';
import { LEVELS } from '@/src/types/level';
import {
  Award01Icon,
  BarChartIcon,
  Briefcase01Icon,
  Clock01Icon,
  Layers01Icon,
  PencilEdit01Icon,
  User02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ReactNode } from 'react';

function levelLabel(level: number): string {
  if (level <= 1) return LEVELS[level].title;
  if (level <= 2) return LEVELS[level].title;
  if (level <= 3) return LEVELS[level].title;
  if (level <= 4) return LEVELS[level].title;
  return 'Expert';
}

function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card shadow-card border border-grid-gray/40 rounded-lg p-4 text-foreground transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

function CardLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="text-xs font-mono font-medium text-dim tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="text-xs font-medium border border-grid-gray/60 rounded-full px-3 py-1">
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-sm text-dim shrink-0">{label}</span>
      <span className="text-sm font-bold text-right">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { data: roadmap } = useQuery({
    queryKey: ['roadmap'],
    queryFn: getActiveRoadmap,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <PageError
        message="Could not load your profile."
        onRetry={() => refetch()}
      />
    );
  }

  const allTasks = roadmap?.weeks.flatMap((w) => w.tasks) ?? [];
  const totalXp = allTasks
    .filter((t) => t.done)
    .reduce((sum, t) => sum + t.xp, 0);
  const tasksCompleted = roadmap?.stats.completedTasks ?? 0;
  const totalTasks = roadmap?.stats.totalTasks ?? 0;

  const badges = [
    tasksCompleted >= 1 && 'First Step',
    tasksCompleted >= 10 && 'Grinder',
    totalXp >= 100 && 'Century Club',
    totalXp >= 1000 && 'XP Master',
    tasksCompleted > 0 && tasksCompleted === totalTasks && 'Completionist',
  ].filter(Boolean) as string[];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 max-w-6xl w-full px-4 sm:px-6 py-4 mx-auto mt-6">
      {/* Header */}
      <div
        className="flex items-start gap-4 animate-slide-up"
        style={{ animationDelay: '60ms' }}
      >
        <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-xl border-2 border-lime-cs/40 bg-lime-cs/10">
          <HugeiconsIcon icon={User02Icon} size={34} className="text-lime-cs" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-mono font-medium text-lime-cs uppercase tracking-wide">
            {'// Profile'}
          </span>
          <h2 className="text-3xl font-bold">
            {profile.fullName || profile.username}
          </h2>
          <p className="text-sm text-dim">
            {profile.yearsOfExperience} yrs experience ·{' '}
            {profile.learningStyle.join(', ')} learner
          </p>
        </div>
        <Link
          href="/onboarding"
          className="self-start shrink-0 flex items-center gap-2 text-sm font-medium border border-grid-gray/60 rounded-lg px-3 py-2 hover:border-lime-cs/40 transition-colors"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
          Edit profile
        </Link>
      </div>

      {/* Tech stack + Target companies */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up"
        style={{ animationDelay: '120ms' }}
      >
        <Card>
          <CardLabel
            icon={
              <HugeiconsIcon
                icon={Layers01Icon}
                size={13}
                className="text-dim"
              />
            }
            label="Tech Stack"
          />
          <div className="flex flex-wrap gap-2">
            {profile.techStack.map((tech) => (
              <Tag key={tech} label={tech} />
            ))}
          </div>
        </Card>
        <Card>
          <CardLabel
            icon={
              <HugeiconsIcon
                icon={Briefcase01Icon}
                size={13}
                className="text-dim"
              />
            }
            label="Target Companies"
          />
          <div className="flex flex-wrap gap-2">
            {profile.targetCompanies.map((tc) => (
              <Tag key={tc.id} label={tc.company.name} />
            ))}
          </div>
        </Card>
      </div>

      {/* Levels + Plan */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up"
        style={{ animationDelay: '180ms' }}
      >
        <Card>
          <CardLabel
            icon={
              <HugeiconsIcon
                icon={BarChartIcon}
                size={13}
                className="text-dim"
              />
            }
            label="Levels"
          />
          <div className="flex flex-col gap-3">
            <InfoRow
              label="DSA / Coding"
              value={levelLabel(profile.dsaLevel)}
            />
            <InfoRow
              label="System Design"
              value={levelLabel(profile.systemDesignLevel)}
            />
            <InfoRow
              label="Behavioral"
              value={levelLabel(profile.behavioralConfidence)}
            />
          </div>
        </Card>
        <Card>
          <CardLabel
            icon={
              <HugeiconsIcon
                icon={Clock01Icon}
                size={13}
                className="text-dim"
              />
            }
            label="Plan"
          />
          <div className="flex flex-col gap-3">
            <InfoRow
              label="Prep timeline"
              value={`${profile.prepTime} Weeks`}
            />
            <InfoRow label="Hours per day" value={`${profile.hrsPerDay}h`} />
            <InfoRow
              label="New skills"
              value={profile.skillsToLearn.join(', ') || '—'}
            />
          </div>
        </Card>
      </div>

      {/* Badges */}
      <div className="animate-slide-up" style={{ animationDelay: '240ms' }}>
        <Card className="text-foreground">
          <CardLabel
            icon={
              <HugeiconsIcon
                icon={Award01Icon}
                size={13}
                className="text-dim"
              />
            }
            label="Badges"
          />
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:border-lime-cs/30 transition-colors border border-lime-cs/40 bg-lime-cs/10"
                >
                  <HugeiconsIcon
                    icon={Award01Icon}
                    size={13}
                    className="text-lime-cs"
                  />
                  <span className="text-xs font-medium">{badge}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-dim">Complete tasks to earn badges.</p>
          )}
        </Card>
      </div>

      {/* Reset */}
      <div
        className="flex items-center justify-between gap-4 border border-destructive/30 rounded-lg p-4 animate-slide-up"
        style={{ animationDelay: '300ms' }}
      >
        <div>
          <p className="text-sm font-bold">Reset everything</p>
          <p className="text-xs text-dim mt-0.5">
            Clears your profile, roadmap, XP, streak, and badges.
          </p>
        </div>
        <button className="shrink-0 text-sm font-medium border border-destructive/40 text-destructive rounded-lg px-3 py-2 hover:bg-destructive/10 transition-colors">
          Reset data
        </button>
      </div>
    </div>
  );
}

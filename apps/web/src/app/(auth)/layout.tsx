import FeatureCard from '@/src/components/feature-card';
import OverloadedIcon from '@/src/components/overloaded-icon';
import {
  Award03Icon,
  BrainIcon,
  Target01Icon,
} from '@hugeicons/core-free-icons';

const FEATURES = [
  {
    icon: Target01Icon,
    title: 'Company-targeted roadmaps',
    description: 'Tailored to Google, Amazon, Meta, and 50+ more',
  },
  {
    icon: BrainIcon,
    title: 'AI coaching',
    description: 'Instant answers and guided walkthroughs 24/7',
  },
  {
    icon: Award03Icon,
    title: 'Gamified progress',
    description: 'XP, streaks, and levels to keep you on track',
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Grid background */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none
          [background-image:linear-gradient(to_right,var(--grid-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-gray)_1px,transparent_1px)]
          [background-size:80px_80px]
          [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      {/* Left panel — marketing */}
      <div className="hidden lg:flex flex-col p-12 justify-between w-1/2 relative overflow-hidden">
        {/* Subtle lime radial glow */}
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-lime-cs/5 blur-3xl pointer-events-none" />

        <div className="animate-fade-in">
          <OverloadedIcon />
        </div>

        <div className="space-y-8">
          <div
            className="inline-flex border border-lime-cs/30 rounded-full items-center px-3 py-1 bg-lime-cs/10 text-lime-cs gap-2 animate-fade-in"
            style={{ animationDelay: '60ms' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-lime-cs" />
            <span className="text-xs font-mono font-medium">
              {'// AI-powered interview prep'}
            </span>
          </div>

          <div
            className="text-4xl xl:text-5xl font-bold animate-slide-up"
            style={{ animationDelay: '120ms' }}
          >
            <span>Crack your next </span>
            <br />
            <span className="text-lime-cs">technical interview</span>
          </div>

          <p
            className="text-dim text-base xl:text-lg font-sans animate-slide-up"
            style={{ animationDelay: '180ms' }}
          >
            Personalized roadmaps, adaptive learning
            <br /> paths, and an AI coach — all in one platform.
          </p>

          <div className="animate-slide-up" style={{ animationDelay: '220ms' }}>
            <FeatureCard features={FEATURES} />
          </div>
        </div>

        <div className="h-1/6" />
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="lg:hidden mb-6 animate-fade-in">
            <OverloadedIcon />
          </div>
          <div className="rounded-xl border border-border p-6 sm:p-8 bg-card animate-scale-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

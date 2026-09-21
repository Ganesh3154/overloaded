import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';

interface Feature {
  icon: IconSvgElement;
  title: string;
  description: string;
}

export default function FeatureCard({ features }: { features: Feature[] }) {
  return (
    <div className="flex flex-col gap-3 max-w-xl [mask-image:linear-gradient(to_right,black_40%,transparent_100%)]">
      {features.map((feature, i) => (
        <div
          key={feature.title}
          className="flex items-start gap-3 animate-slide-up bg-card border border-grid-gray/40 rounded-lg p-3 shadow-card"
          style={{ animationDelay: `${i * 80 + 200}ms` }}
        >
          <div className="inline-flex border text-lime-cs rounded-lg p-1.5 border-lime-cs/30 bg-lime-cs/10 shrink-0">
            <HugeiconsIcon
              icon={feature.icon}
              size={20}
              color="currentColor"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">
              {feature.title}
            </p>
            <p className="text-dim text-xs mt-0.5">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

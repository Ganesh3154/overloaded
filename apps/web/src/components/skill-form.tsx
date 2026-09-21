import Chip from './chip';
import Stepper from './stepper';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../validator/onboarding';
import { LEVELS } from '../types/level';

const TECHSTACK = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
];

function LevelSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (level: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:flex gap-2">
        {LEVELS.map((level) => (
          <Stepper
            key={level.title}
            active={value === level.level}
            onClick={() => onChange(level.level)}
          >
            <span className="font-semibold uppercase tracking-widest font-mono text-xs">
              {level.title}
            </span>
            <span className="text-xs opacity-70 mt-0.5">
              {level.description}
            </span>
          </Stepper>
        ))}
      </div>
    </div>
  );
}

export default function SkillForm() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const techStack = watch('techStack');
  const dsaLevel = watch('dsaLevel');
  const systemDesignLevel = watch('systemDesignLevel');
  const behavioralConfidence = watch('behavioralConfidence');

  const toggleChip = (chip: string) => {
    const updated = techStack.includes(chip)
      ? techStack.filter((c) => c !== chip)
      : [...techStack, chip];
    setValue('techStack', updated, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-6 bg-card rounded-lg border border-grid-gray/40 p-6">
      <div className="flex flex-col gap-2">
        <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
          Tech Stack
        </label>
        <div className="flex flex-wrap gap-2">
          {TECHSTACK.map((chip) => (
            <Chip
              key={chip}
              title={chip}
              active={techStack.includes(chip)}
              onClick={() => toggleChip(chip)}
            />
          ))}
        </div>
        {errors.techStack && (
          <p className="text-xs text-destructive">
            {(errors.techStack as { message?: string }).message}
          </p>
        )}
      </div>

      <LevelSelector
        label="DSA / Coding level"
        value={dsaLevel}
        onChange={(v) => setValue('dsaLevel', v)}
      />
      <LevelSelector
        label="System Design level"
        value={systemDesignLevel}
        onChange={(v) => setValue('systemDesignLevel', v)}
      />
      <LevelSelector
        label="Behavioral Confidence"
        value={behavioralConfidence}
        onChange={(v) => setValue('behavioralConfidence', v)}
      />
    </div>
  );
}

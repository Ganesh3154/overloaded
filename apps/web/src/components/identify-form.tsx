import Chip from './chip';
import Input from './input';
import Slider from './slider';
import { useFormContext } from 'react-hook-form';
import type { OnboardingFormData } from '../validator/onboarding';

const LEARNING_STYLES = [
  'Video',
  'Reading',
  'Practice-heavy',
  'Mock interviews',
];

export default function IdentifyForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const learningStyle = watch('learningStyle');
  const yearsOfExperience = watch('yearsOfExperience');

  const toggleLearningStyle = (style: string) => {
    const updated = learningStyle.includes(style)
      ? learningStyle.filter((s) => s !== style)
      : [...learningStyle, style];
    setValue('learningStyle', updated, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-6 bg-card rounded-lg border border-grid-gray/40 p-6">
      <div className="flex flex-col gap-2">
        <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
          Username
        </label>
        <Input {...register('username')} placeholder="your_handle" />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>

      <Slider
        label="Years of Experience"
        min={0}
        max={20}
        value={yearsOfExperience}
        onChange={(e) => setValue('yearsOfExperience', Number(e.target.value))}
      />

      <div className="flex flex-col gap-2">
        <label className="text-dim text-xs font-mono font-semibold uppercase tracking-wide">
          Learning style
        </label>
        <div className="flex flex-wrap gap-2">
          {LEARNING_STYLES.map((style) => (
            <Chip
              key={style}
              title={style}
              active={learningStyle.includes(style)}
              onClick={() => toggleLearningStyle(style)}
            />
          ))}
        </div>
        {errors.learningStyle && (
          <p className="text-xs text-destructive">
            {errors.learningStyle.message}
          </p>
        )}
      </div>
    </div>
  );
}

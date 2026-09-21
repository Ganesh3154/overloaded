import { Trophy } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function Card({ title }: { title: string }) {
  return (
    <div>
      <div className="flex">
        <label>{title}</label>
        <HugeiconsIcon icon={Trophy} />
      </div>
      <label>{}</label>
      <input type="range" max={100} min={0} />
      <label>
        {}/{} done
      </label>
    </div>
  );
}

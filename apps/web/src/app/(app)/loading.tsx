import { Loader } from '@/src/components/loader';

/**
 * Next.js Suspense boundary for the (app) route group.
 * Shown on initial navigation before the page shell hydrates.
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center flex-1">
      <Loader />
    </div>
  );
}

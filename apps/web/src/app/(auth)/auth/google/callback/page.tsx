'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Loading01Icon } from '@hugeicons/core-free-icons';
import { completeGoogleLogin } from '@/src/services/auth.service';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function completeSignIn() {
      const data = completeGoogleLogin(window.location.hash);
      if (!data) {
        setError('Google sign-in could not be completed. Please try again.');
        return;
      }

      router.replace(data.isOnboarded ? '/dashboard' : '/onboarding');
    }

    completeSignIn();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <HugeiconsIcon
          icon={Alert02Icon}
          size={28}
          color="var(--destructive)"
          strokeWidth={1.5}
        />
        <div>
          <h1 className="text-xl font-bold text-foreground">Sign-in failed</h1>
          <p className="text-sm text-dim mt-1">{error}</p>
        </div>
        <Link
          href="/login"
          className="font-semibold text-sm text-lime-cs hover:opacity-80 transition-opacity"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <HugeiconsIcon
        icon={Loading01Icon}
        size={28}
        color="var(--lime-cs)"
        strokeWidth={2}
        className="animate-spin"
      />
      <p className="text-sm text-dim">Finishing Google sign-in…</p>
    </div>
  );
}

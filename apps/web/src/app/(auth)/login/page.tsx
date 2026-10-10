'use client';

import { Suspense } from 'react';
import LoginForm from '@/src/components/login-form';
import { login } from '@/src/services/auth.service';
import { LoginFormData } from '@/src/types/form';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_oauth_denied: 'Google sign-in was cancelled.',
  google_oauth_invalid_state:
    'Google sign-in could not be verified. Please try again.',
  google_oauth_failed: 'Google sign-in failed. Please try again.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageContent error={null} />}>
      <LoginPageWithSearchParams />
    </Suspense>
  );
}

function LoginPageWithSearchParams() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const error = errorCode ? (GOOGLE_ERROR_MESSAGES[errorCode] ?? null) : null;

  return <LoginPageContent error={error} />;
}

function LoginPageContent({ error }: { error: string | null }) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) =>
      router.push(data.isOnboarded ? '/dashboard' : '/onboarding'),
  });

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <LoginForm
        onSubmit={(data: LoginFormData) => mutate(data)}
        isPending={isPending}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading01Icon } from '@hugeicons/core-free-icons';
import { redirectToGoogleLogin } from '../services/auth.service';
import GoogleIcon from './google-icon';

export default function GoogleButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleClick() {
    setIsRedirecting(true);
    try {
      await redirectToGoogleLogin();
    } catch {
      setIsRedirecting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRedirecting}
      className="flex items-center justify-center gap-2 text-sm font-medium text-foreground rounded-lg p-2 border border-border bg-card hover:bg-background transition-all duration-200 disabled:opacity-60"
    >
      {isRedirecting ? (
        <HugeiconsIcon
          icon={Loading01Icon}
          size={15}
          color="currentColor"
          strokeWidth={2}
          className="animate-spin"
        />
      ) : (
        <GoogleIcon size={16} />
      )}
      {isRedirecting ? 'Redirecting…' : 'Continue with Google'}
    </button>
  );
}

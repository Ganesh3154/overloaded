'use client';

import { useForm } from 'react-hook-form';
import Input from './input';
import {
  ArrowRight01Icon,
  Loading01Icon,
  LockPasswordIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import Button from './button';
import { LoginFormData, LoginFormInput } from '../types/form';
import { loginSchema } from '@overloaded/shared';
import { validate } from '../validator/resolver';

const INPUTS: LoginFormInput[] = [
  {
    label: 'Email',
    field: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@example.com',
    icon: Mail01Icon,
  },
  {
    label: 'Password',
    field: 'password',
    autoComplete: 'new-password',
    placeholder: '',
    icon: LockPasswordIcon,
  },
];

interface Props {
  onSubmit: (data: LoginFormData) => void;
  isPending: boolean;
}

export default function LoginForm({ onSubmit, isPending }: Props) {
  const form = useForm<LoginFormData>({ resolver: validate(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-dim mt-1">Sign in to continue</p>
        </div>
        <div className="text-dim flex flex-col gap-8">
          {INPUTS.map((input) => (
            <div key={input.field} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {input.label}
                </label>
                {input.field === 'password' && (
                  <button className="font-semibold text-xs text-lime-cs hover:opacity-80 transition-opacity">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                {...form.register(input.field)}
                {...input}
                type={
                  input.field === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : input.type
                }
                rightElement={
                  input.field === 'password' ? (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon
                        icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                        size={15}
                        color="currentColor"
                        strokeWidth={1.5}
                      />
                    </button>
                  ) : undefined
                }
              />
              {form.formState.errors[input.field] && (
                <p className="text-xs text-red-500 mt-0.5">
                  {form.formState.errors[input.field]?.message}
                </p>
              )}
            </div>
          ))}
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? (
              <>
                <HugeiconsIcon
                  icon={Loading01Icon}
                  size={15}
                  color="var(--logo-text)"
                  strokeWidth={2}
                  className="animate-spin"
                />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={15}
                  color="var(--logo-text)"
                  strokeWidth={2}
                />
              </>
            )}
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground text-dim">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-lime-cs hover:opacity-80 transition-opacity"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}

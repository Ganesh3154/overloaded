'use client';

import {
  ArrowRight01Icon,
  Loading01Icon,
  LockPasswordIcon,
  Mail01Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './input';
import Link from 'next/link';
import Button from './button';
import { z } from 'zod';
import { validate } from '../validator/resolver';
import { RegisterFormData, RegisterFormInput } from '../types/form';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const INPUTS: RegisterFormInput[] = [
  {
    label: 'Full Name',
    field: 'fullName',
    type: 'text',
    placeholder: 'John Doe',
    icon: UserIcon,
  },
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
  onSubmit: (data: RegisterFormData) => void;
  isPending: boolean;
}

export default function RegisterForm({ onSubmit, isPending }: Props) {
  const form = useForm<RegisterFormData>({
    resolver: validate(registerSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="text-dim flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Start your interview prep journey
          </p>
        </div>
        {INPUTS.map((input) => (
          <div key={input.field} className="flex flex-col gap-1">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {input.label}
            </label>
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
              Creating account…
            </>
          ) : (
            <>
              Create account
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
      <p className="mt-5 text-center text-sm text-dim">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-lime-cs hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

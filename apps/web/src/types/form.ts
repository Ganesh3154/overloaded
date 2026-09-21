import { IconSvgElement } from '@hugeicons/react';
import type { LoginInput, RegisterInput } from '@overloaded/shared';

export type RegisterFormData = RegisterInput;

export interface RegisterFormInput {
  label: string;
  field: keyof RegisterFormData;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  icon: IconSvgElement;
}

export type LoginFormData = LoginInput;

export interface LoginFormInput {
  label: string;
  field: keyof LoginFormData;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  icon: IconSvgElement;
}

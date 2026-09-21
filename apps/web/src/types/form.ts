import { IconSvgElement } from '@hugeicons/react';

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterFormInput {
  label: string;
  field: keyof RegisterFormData;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  icon: IconSvgElement;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormInput {
  label: string;
  field: keyof LoginFormData;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  icon: IconSvgElement;
}

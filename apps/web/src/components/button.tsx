import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant: 'primary' | 'secondary';
}

const VARIANT_CLASS = {
  primary:
    'flex items-center justify-center text-sm text-background font-semibold rounded-lg p-2 bg-lime-cs hover:shadow-glow transition-all duration-200',
  secondary:
    'flex items-center justify-start text-sm rounded-md p-2 hover:bg-accent hover:text-background transition-all duration-200',
};

export default function Button({ children, variant, ...props }: ButtonProps) {
  return (
    <button className={VARIANT_CLASS[variant]} {...props}>
      {children}
    </button>
  );
}

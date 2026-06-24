// components/ui/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'link' | 'income' | 'expense';
  size?: 'sm' | 'default' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const variantStyles: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-brand-hover focus:ring-brand',
    secondary: 'bg-canvas text-ink hover:bg-border focus:ring-muted',
    outline: 'border border-border text-ink hover:bg-canvas focus:ring-muted',
    link: 'text-brand hover:underline',
    income: 'bg-income text-white hover:brightness-95 focus:ring-income',
    expense: 'bg-expense text-white hover:brightness-95 focus:ring-expense',
  };

  return (
    <button
      className={cn(baseStyle, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
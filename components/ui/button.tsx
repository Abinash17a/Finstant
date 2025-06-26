// components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  size?: 'sm' | 'default' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyles: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const variantStyles: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    link: 'text-indigo-600 hover:underline',
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

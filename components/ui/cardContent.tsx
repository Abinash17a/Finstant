// components/ui/CardContent.tsx
import React from 'react';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={`mt-2 ${className}`}>{children}</div>;
};

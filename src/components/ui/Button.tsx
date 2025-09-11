'use client';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost';
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const base =
    variant === 'ghost'
      ? 'btn-ghost'
      : 'btn-primary';

  return <button className={cn(base, 'disabled:opacity-50', className)} {...props} />;
}

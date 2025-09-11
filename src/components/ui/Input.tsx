'use client';
import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Uses the global `.input` class which already includes dark styles
export function Input({ className, ...props }: InputProps) {
  return <input className={cn('input', className)} {...props} />;
}

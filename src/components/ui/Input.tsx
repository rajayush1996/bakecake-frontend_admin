'use client';
import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn('border border-slate-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-500', className)}
      {...props}
    />
  );
}

'use client';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn('rounded bg-slate-900 text-white px-4 py-2 hover:bg-slate-700 disabled:opacity-50', className)}
      {...props}
    />
  );
}

'use client';
import { InputHTMLAttributes } from 'react';

type SwitchProps = InputHTMLAttributes<HTMLInputElement>;

export function Switch(props: SwitchProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" {...props} />
      <div
        className="relative h-6 w-10 rounded-full
                   bg-slate-200 dark:bg-slate-700
                   transition-colors
                   peer-checked:bg-brand-600 dark:peer-checked:bg-brand-500
                   after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full
                   after:bg-white dark:after:bg-white/90
                   after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  );
}

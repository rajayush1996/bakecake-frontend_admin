'use client';
import { InputHTMLAttributes } from 'react';

type SwitchProps = InputHTMLAttributes<HTMLInputElement>;

export function Switch(props: SwitchProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-slate-900 relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
    </label>
  );
}

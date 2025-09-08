'use client';
import { useState } from 'react';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-sm"
        aria-haspopup="true"
        aria-expanded={open}
      >
        A
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded border border-slate-200 bg-white p-2 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <LocaleSwitcher />
        </div>
      )}
    </div>
  );
}


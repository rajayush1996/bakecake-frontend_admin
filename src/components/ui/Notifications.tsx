"use client";

import { useState } from 'react';
import { IconBell } from '@/components/ui/Icons';

interface Notification {
  id: number;
  text: string;
}

const sample: Notification[] = [
  { id: 1, text: 'Welcome to BakeCake!' },
  { id: 2, text: 'Your profile is 80% complete.' },
];

export default function Notifications() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-slate-600 dark:text-slate-300"
        aria-label="Notifications"
      >
        <IconBell className="h-5 w-5" />
        {sample.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 grid place-items-center">
            {sample.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/20 bg-white/90 p-2 text-sm shadow-lg backdrop-blur-md dark:bg-slate-800/90">
          {sample.map((n) => (
            <div
              key={n.id}
              className="rounded px-2 py-1 hover:bg-slate-100/60 dark:hover:bg-slate-700/60"
            >
              {n.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

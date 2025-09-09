'use client';

import { useEffect, useRef, useState } from 'react';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import { logout } from '@/lib/auth-client'; // change if your logout path is different

type User = {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
};

function initials(name: string) {
  const parts = (name || '').trim().split(/\s+/);
  return ((parts[0]?.[0] || 'U') + (parts[1]?.[0] || '')).toUpperCase();
}

export default function ProfileMenu({ user: u }: { user?: User }) {
  // Fallback demo user; replace with your auth context/session
  const user =
    u ?? { name: 'Ayush Raj', email: 'admin@example.com', role: 'SUPER_ADMIN' };

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click / ESC
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout(); // or fetch('/api/logout', { method: 'POST' })
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-9 w-9 rounded-full grid place-items-center ring-1 ring-black/5 hover:ring-black/10
                   bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white transition"
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">{initials(user.name)}</span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className="absolute right-0 mt-2 w-72 z-50 rounded-2xl border border-white/20
                     bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,.35)] p-2"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-2 py-2.5">
            <div className="h-10 w-10 rounded-full bg-brand-600 text-white grid place-items-center font-bold">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                initials(user.name)
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </div>
              {user.role && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {user.role}
                </div>
              )}
            </div>
          </div>

          <div className="my-2 h-px bg-slate-200/70 dark:bg-slate-700/60" />

          {/* Actions */}
          <ul className="py-1">
            <li>
              <a
                href="/admin/profile"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                           text-slate-700 hover:bg-slate-100/70
                           dark:text-slate-200 dark:hover:bg-slate-800/60"
              >
                View profile
              </a>
            </li>
            <li>
              <a
                href="/admin/settings"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                           text-slate-700 hover:bg-slate-100/70
                           dark:text-slate-200 dark:hover:bg-slate-800/60"
              >
                Account settings
              </a>
            </li>

            {/* Preferences */}
            <li className="px-3 py-2">
              <div className="text-xs mb-2 text-slate-500">Preferences</div>
              <LocaleSwitcher />
            </li>
          </ul>

          <div className="my-2 h-px bg-slate-200/70 dark:bg-slate-700/60" />

          {/* Sign out */}
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600
                       hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

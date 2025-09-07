"use client";

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { useI18n } from '@/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Notifications from '@/components/ui/Notifications';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconFolder,
  IconBox,
  IconUsers,
} from '@/components/ui/Icons';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  const nav = [
    { href: '/admin/dashboard', label: t('Navigation.dashboard'), icon: IconDashboard },
    { href: '/admin/catalog/categories', label: t('Navigation.categories'), icon: IconFolder },
    { href: '/admin/catalog/products', label: t('Navigation.products'), icon: IconBox },
    { href: '/admin/vendors', label: t('Navigation.vendors'), icon: IconUsers },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex flex-col border-r border-white/20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 ${collapsed ? 'w-16' : 'w-60'}`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h2 className="font-bold">BakeCake</h2>}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-slate-600 dark:text-slate-300"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <IconChevronRight className="h-5 w-5" />
            ) : (
              <IconChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-2 py-1 rounded hover:bg-slate-100/60 dark:hover:bg-slate-700/60"
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-end gap-4 px-4 border-b border-white/20 bg-white/60 backdrop-blur-md dark:bg-slate-800/60">
          <ThemeToggle />
          <Notifications />
          <LocaleSwitcher />
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-sm">A</div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

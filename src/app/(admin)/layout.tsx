"use client";
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { useI18n } from '@/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen w-full flex text-slate-900 dark:text-slate-100">
      <aside
        className={`bg-white/70 dark:bg-white/5 backdrop-blur-xl border-r border-white/10 transition-all ${collapsed ? 'w-20' : 'w-64'} p-4 flex flex-col`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="self-end mb-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
        <h2 className={`font-bold mb-6 ${collapsed ? 'text-center text-sm' : 'text-lg'}`}>{collapsed ? 'BC' : 'BakeCake'}</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin/dashboard" className="hover:text-indigo-500 dark:hover:text-indigo-400">
            {t('Navigation.dashboard')}
          </Link>
          <Link href="/admin/catalog/categories" className="hover:text-indigo-500 dark:hover:text-indigo-400">
            {t('Navigation.categories')}
          </Link>
          <Link href="/admin/catalog/products" className="hover:text-indigo-500 dark:hover:text-indigo-400">
            {t('Navigation.products')}
          </Link>
          <Link href="/admin/vendors" className="hover:text-indigo-500 dark:hover:text-indigo-400">
            {t('Navigation.vendors')}
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-end gap-4 p-4 bg-white/70 dark:bg-white/5 backdrop-blur-xl border-b border-white/10">
          <ThemeToggle />
          <button aria-label="Notifications" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
            🔔
          </button>
          <LocaleSwitcher />
          <button aria-label="Profile" className="h-8 w-8 rounded-full bg-indigo-600 text-white">
            U
          </button>
        </header>
        <main className="p-6 flex-1 overflow-auto">
          <div className="h-full w-full rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { ReactNode } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import TopNav from '@/components/navigation/TopNav';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Notifications from '@/components/ui/Notifications';
import ProfileMenu from '@/components/ui/ProfileMenu';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <aside className="border-r border-white/20 bg-white/60 p-4 backdrop-blur-md dark:bg-slate-800/60">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-between gap-4 px-4 border-b border-white/20 bg-white/60 backdrop-blur-md dark:bg-slate-800/60">
          <TopNav />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Notifications />
            <ProfileMenu />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

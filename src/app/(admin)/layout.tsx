// app/admin/layout.tsx (or wherever your admin layout lives)
'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import AdminHeader from '@/components/navigation/AdminHeader';
import { CatalogProvider } from '@/features/catalog/state';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen shrink-0 border-r border-white/20 bg-white/70 backdrop-blur-md dark:bg-slate-900/50">
          <Sidebar />
        </aside>

        {/* Main area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <AdminHeader />
          <CatalogProvider>
            <main className="flex-1 p-8">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </CatalogProvider>
        </div>
      </div>
    </div>
  );
}

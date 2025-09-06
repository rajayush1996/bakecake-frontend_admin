"use client";
import Link from 'next/link';
import { ReactNode } from 'react';
import { useI18n } from '@/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen grid grid-cols-[200px_1fr]">
      <aside className="bg-slate-100 p-4 space-y-4 flex flex-col">
        <h2 className="font-bold">BakeCake</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/dashboard">{t('Navigation.dashboard')}</Link>
          <Link href="/admin/catalog/categories">{t('Navigation.categories')}</Link>
          <Link href="/admin/catalog/products">{t('Navigation.products')}</Link>
          <Link href="/admin/vendors">{t('Navigation.vendors')}</Link>
        </nav>
        <LocaleSwitcher />
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}

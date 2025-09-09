// components/navigation/AdminHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import { navConfig } from '@/navigation/navConfig';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Notifications from '@/components/ui/Notifications';
import ProfileMenu from '@/components/ui/ProfileMenu';

type Flat = { label: string; href: string };

function flatten(items: any[], out: Flat[] = []): Flat[] {
  for (const it of items) {
    if (it.href) out.push({ label: it.label, href: it.href });
    if (it.children) flatten(it.children, out);
  }
  return out;
}

function buildBreadcrumb(pathname: string) {
  const flats = flatten(navConfig);
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Flat[] = [];
  let acc = '';
  for (const p of parts) {
    acc += '/' + p;
    const hit = flats.find(f => f.href === acc);
    if (hit) crumbs.push(hit);
  }
  return crumbs;
}

export default function AdminHeader() {
  const pathname = usePathname();
  const crumbs = buildBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between gap-6 px-6
                       border-b border-white/20 bg-white/70 backdrop-blur-md
                       dark:bg-slate-900/50">
      {/* left: breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300 truncate">
        <span className="font-semibold text-slate-700 dark:text-slate-100">BakeCake Studio</span>
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-2 truncate">
            <span className="text-slate-400">/</span>
            <span className={i === crumbs.length - 1 ? 'text-slate-900 dark:text-white font-medium truncate' : 'truncate'}>
              {c.label}
            </span>
          </span>
        ))}
      </nav>

      {/* right: locale / theme / notifications / profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <LocaleSwitcher />
        <ThemeToggle />
        <Notifications />
        {/* ProfileMenu should render name/email/avatar internally */}
        <ProfileMenu />
      </div>
    </header>
  );
}

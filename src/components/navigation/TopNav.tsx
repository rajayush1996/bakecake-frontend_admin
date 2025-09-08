'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { navConfig, NavItem, Role } from '@/navigation/navConfig';
import { useRole } from '@/contexts/role';
import { NavIcon } from './NavIcon';

function TopNavItem({ item, role, pathname }: { item: NavItem; role: Role; pathname: string }) {
  if (item.section) return null;
  const hasChildren = item.children && item.children.length > 0;
  const allowedChildren = item.children?.filter(child => !child.roles || child.roles.includes(role));
  const Icon = item.icon ? <NavIcon name={item.icon} className="h-4 w-4" /> : null;

  if (hasChildren && allowedChildren && allowedChildren.length > 0) {
    return (
      <div key={item.key} className="relative group">
        <button className="flex items-center gap-1 px-2 py-1 text-sm font-medium">
          {Icon}
          {item.label}
        </button>
        <div className="absolute left-0 mt-1 hidden w-40 flex-col rounded border border-slate-200 bg-white shadow-md group-hover:flex dark:border-slate-700 dark:bg-slate-800">
          {allowedChildren.map(child =>
            child.href ? (
              <Link
                key={child.key}
                href={child.href}
                className="px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {child.label}
              </Link>
            ) : null,
          )}
        </div>
      </div>
    );
  }

  if (item.href) {
    const active = pathname.startsWith(item.href);
    return (
      <Link
        key={item.key}
        href={item.href}
        className={`flex items-center gap-1 px-2 py-1 text-sm ${active ? 'font-semibold' : ''}`}
      >
        {Icon}
        {item.label}
      </Link>
    );
  }

  return null;
}

export default function TopNav() {
  const role = useRole();
  const pathname = usePathname();
  const items = useMemo(() => navConfig.filter(item => !item.roles || item.roles.includes(role)), [role]);

  return (
    <nav className="flex gap-4">
      {items.map(item => (
        <TopNavItem key={item.key} item={item} role={role} pathname={pathname} />
      ))}
    </nav>
  );
}


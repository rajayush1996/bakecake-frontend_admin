'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { navConfig, NavItem, Role } from '@/navigation/navConfig';
import { useRole } from '@/contexts/role';
import { NavIcon } from './NavIcon';

function NavItemComponent({ item, role, open, toggle, pathname }: { item: NavItem; role: Role; open: Record<string, boolean>; toggle: (key: string) => void; pathname: string }) {
  const active = item.href && pathname.startsWith(item.href);
  const hasChildren = item.children && item.children.length > 0;
  const allowedChildren = item.children?.filter(child => !child.roles || child.roles.includes(role));
  const Icon = item.icon ? <NavIcon name={item.icon} className="h-4 w-4" /> : null;

  if (item.section) {
    return (
      <div className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase" key={item.key}>
        {item.section}
      </div>
    );
  }

  if (hasChildren) {
    return (
      <div key={item.key}>
        <button
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-left"
          onClick={() => toggle(item.key)}
        >
          <span className="flex items-center gap-2">{Icon}{item.label}</span>
          <span>{open[item.key] ? '-' : '+'}</span>
        </button>
        {open[item.key] && (
          <div className="pl-4">
            {allowedChildren?.map(child => (
              <NavItemComponent key={child.key} item={child} role={role} open={open} toggle={toggle} pathname={pathname} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.href) {
    return (
      <Link
        key={item.key}
        href={item.href}
        className={`flex items-center px-3 py-2 text-sm ${active ? 'font-semibold' : ''}`}
      >
        {Icon && <span className="mr-2">{Icon}</span>}
        <span>{item.label}</span>
      </Link>
    );
  }

  return null;
}

export default function Sidebar() {
  const role = useRole();
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const items = useMemo(
    () =>
      navConfig.filter(item => {
        if (item.section) return true;
        if (!item.roles) return true;
        return item.roles.includes(role);
      }),
    [role],
  );

  const toggle = (key: string) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <nav className="w-64 p-2">
      {items.map(item => (
        <NavItemComponent key={item.key} item={item} role={role} open={open} toggle={toggle} pathname={pathname} />
      ))}
    </nav>
  );
}


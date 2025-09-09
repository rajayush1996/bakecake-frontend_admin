'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { navConfig, NavItem, Role } from '@/navigation/navConfig';
import { useRole } from '@/contexts/role';
import { NavIcon } from './NavIcon';

function clsx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(' ');
}

function NavItemComponent({
  item, role, open, toggle, pathname,
}: {
  item: NavItem;
  role: Role;
  open: Record<string, boolean>;
  toggle: (key: string) => void;
  pathname: string;
}) {
  const active = !!item.href && pathname.startsWith(item.href);
  const hasChildren = !!item.children?.length;
  const allowedChildren = item.children?.filter((c) => !c.roles || c.roles.includes(role));
  const icon = item.icon ? <NavIcon name={item.icon} className="h-5 w-5 shrink-0" /> : null;

  if (item.section) {
    return (
      <div className="mt-6 mb-2 px-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500/80"
           key={item.key}>
        {item.section}
      </div>
    );
  }

  if (hasChildren) {
    const isOpen = !!open[item.key];
    return (
      <div key={item.key} className="mb-1.5">
        <button
          type="button"
          onClick={() => toggle(item.key)}
          className="group w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] leading-6
                     text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-800/60
                     transition-colors"
        >
          <span className="flex items-center gap-3">
            {icon}
            <span className="truncate">{item.label}</span>
          </span>
          <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
            {isOpen ? '−' : '+'}
          </span>
        </button>

        {isOpen && (
          <div className="mt-1 ml-2 border-l border-slate-200/70 dark:border-slate-700/60 pl-3 space-y-1.5">
            {allowedChildren?.map((child) => (
              <NavItemComponent
                key={child.key}
                item={child}
                role={role}
                open={open}
                toggle={toggle}
                pathname={pathname}
              />
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
        className={clsx(
          'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] leading-6 transition-colors',
          'text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-800/60',
          active && 'font-semibold bg-slate-100/80 text-slate-900 dark:bg-slate-800 dark:text-white'
        )}
      >
        {icon}
        <span className="truncate">{item.label}</span>
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
      navConfig.filter((item) => {
        if (item.section) return true;
        if (!item.roles) return true;
        return item.roles.includes(role);
      }),
    [role]
  );

  const toggle = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <nav className="w-72 min-w-72 py-8 px-4">
      <div className="px-3.5 pb-4 text-sm font-extrabold tracking-wide text-slate-600 dark:text-slate-300">
        BAKECAKE STUDIO
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavItemComponent
            key={item.key}
            item={item}
            role={role}
            open={open}
            toggle={toggle}
            pathname={pathname}
          />
        ))}
      </div>
    </nav>
  );
}

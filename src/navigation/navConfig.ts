export type Role = 'SUPER_ADMIN' | 'CATALOG_MANAGER' | 'VENDOR_OPS' | 'SUPPORT';

export type NavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: string;
  roles?: Role[];
  children?: NavItem[];
  section?: string;
};

import { NAV_ITEMS } from "@/mocks/navigation/nav";

export const navConfig: NavItem[] = NAV_ITEMS;

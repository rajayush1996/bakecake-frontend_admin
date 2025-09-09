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

export const navConfig: NavItem[] = [
  {
    key: 'section-studio', section: 'BakeCake Studio',
    label: ""
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'gauge',
    roles: ['SUPER_ADMIN', 'CATALOG_MANAGER', 'VENDOR_OPS', 'SUPPORT'],
  },
  {
    key: 'catalog',
    label: 'Catalog',
    icon: 'package',
    roles: ['SUPER_ADMIN', 'CATALOG_MANAGER'],
    children: [
      {
        key: 'products',
        label: 'Products',
        children: [
          // Matches app route: src/app/(admin)/catalog/products/new/page.tsx
          { key: 'products-create', label: 'Create', href: '/catalog/products/new' },
          { key: 'products-list', label: 'List', href: '/catalog/products' },
        ],
      },
      { key: 'categories', label: 'Categories', href: '/catalog/categories' },
      // These sections are planned; routes not yet implemented
      // { key: 'options', label: 'Option Libraries', href: '/catalog/options' },
      // { key: 'addons', label: 'Add-ons', href: '/catalog/addons' },
    ],
  },
  {
    key: 'pricing',
    label: 'Pricing',
    icon: 'tags',
    roles: ['SUPER_ADMIN', 'CATALOG_MANAGER'],
    children: [
      // Matches app route: src/app/(admin)/catalog/price-segments/page.tsx
      { key: 'tiers', label: 'Price Segments', href: '/catalog/price-segments' },
      { key: 'promotions', label: 'Promotions', href: '/pricing/promotions' },
      { key: 'collections', label: 'Collections & Banners', href: '/marketing/collections' },
    ],
  },
  {
    key: 'vendors',
    label: 'Vendors',
    icon: 'store',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS'],
    children: [
      { key: 'vendor-profiles', label: 'Vendor Profiles', href: '/vendors' },
      { key: 'sku-mapping', label: 'SKU Mapping', href: '/vendors/mapping' },
      { key: 'zones', label: 'Zones & Pincodes', href: '/vendors/zones' },
      { key: 'slots', label: 'Slot Schedules', href: '/vendors/slots' },
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: 'list',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS', 'SUPPORT'],
    children: [
      { key: 'orders-list', label: 'List', href: '/orders' },
      { key: 'refunds', label: 'Refunds & Credits', href: '/orders/refunds' },
    ],
  },
  {
    key: 'delivery',
    label: 'Delivery',
    icon: 'truck',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS'],
    children: [
      { key: 'shipments', label: 'Shipments', href: '/delivery/shipments' },
      { key: 'riders', label: 'Fallback Riders', href: '/delivery/riders' },
    ],
  },
  {
    key: 'qa',
    label: 'QA & Compliance',
    icon: 'shield',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS'],
    children: [
      { key: 'audits', label: 'Photo Audits', href: '/qa/audits' },
      { key: 'sops', label: 'SOPs', href: '/qa/sops' },
      { key: 'defects', label: 'Defects & RCA', href: '/qa/defects' },
    ],
  },
  {
    key: 'comms',
    label: 'Communications',
    icon: 'message',
    roles: ['SUPER_ADMIN'],
    children: [
      { key: 'wa-templates', label: 'WhatsApp Templates', href: '/comms/templates' },
      { key: 'campaigns', label: 'Campaigns', href: '/comms/campaigns' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: 'chart',
    roles: ['SUPER_ADMIN'],
    children: [
      { key: 'sales', label: 'Sales & Conversion', href: '/reports/sales' },
      { key: 'vendor-perf', label: 'Vendor Performance', href: '/reports/vendors' },
      { key: 'promo-perf', label: 'Promotions Performance', href: '/reports/promotions' },
    ],
  },
  {
    key: 'users',
    label: 'Users & Roles',
    icon: 'users',
    roles: ['SUPER_ADMIN'],
    href: '/users',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'cog',
    roles: ['SUPER_ADMIN'],
    href: '/settings',
  },
  {
    key: 'audit',
    label: 'Audit Log',
    icon: 'clock',
    roles: ['SUPER_ADMIN'],
    href: '/audit',
  },
];

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
  { key: 'section-studio', section: 'BakeCake Studio' },
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
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
          { key: 'products-create', label: 'Create', href: '/admin/catalog/products/create' },
          { key: 'products-list', label: 'List', href: '/admin/catalog/products' },
        ],
      },
      { key: 'categories', label: 'Categories', href: '/admin/catalog/categories' },
      { key: 'options', label: 'Option Libraries', href: '/admin/catalog/options' },
      { key: 'addons', label: 'Add-ons', href: '/admin/catalog/addons' },
    ],
  },
  {
    key: 'pricing',
    label: 'Pricing',
    icon: 'tags',
    roles: ['SUPER_ADMIN', 'CATALOG_MANAGER'],
    children: [
      { key: 'tiers', label: 'Price Tiers', href: '/admin/pricing/tiers' },
      { key: 'promotions', label: 'Promotions', href: '/admin/pricing/promotions' },
      { key: 'collections', label: 'Collections & Banners', href: '/admin/marketing/collections' },
    ],
  },
  {
    key: 'vendors',
    label: 'Vendors',
    icon: 'store',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS'],
    children: [
      { key: 'vendor-profiles', label: 'Vendor Profiles', href: '/admin/vendors' },
      { key: 'sku-mapping', label: 'SKU Mapping', href: '/admin/vendors/mapping' },
      { key: 'zones', label: 'Zones & Pincodes', href: '/admin/vendors/zones' },
      { key: 'slots', label: 'Slot Schedules', href: '/admin/vendors/slots' },
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: 'list',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS', 'SUPPORT'],
    children: [
      { key: 'orders-list', label: 'List', href: '/admin/orders' },
      { key: 'refunds', label: 'Refunds & Credits', href: '/admin/orders/refunds' },
    ],
  },
  {
    key: 'delivery',
    label: 'Delivery',
    icon: 'truck',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS'],
    children: [
      { key: 'shipments', label: 'Shipments', href: '/admin/delivery/shipments' },
      { key: 'riders', label: 'Fallback Riders', href: '/admin/delivery/riders' },
    ],
  },
  {
    key: 'qa',
    label: 'QA & Compliance',
    icon: 'shield',
    roles: ['SUPER_ADMIN', 'VENDOR_OPS'],
    children: [
      { key: 'audits', label: 'Photo Audits', href: '/admin/qa/audits' },
      { key: 'sops', label: 'SOPs', href: '/admin/qa/sops' },
      { key: 'defects', label: 'Defects & RCA', href: '/admin/qa/defects' },
    ],
  },
  {
    key: 'comms',
    label: 'Communications',
    icon: 'message',
    roles: ['SUPER_ADMIN'],
    children: [
      { key: 'wa-templates', label: 'WhatsApp Templates', href: '/admin/comms/templates' },
      { key: 'campaigns', label: 'Campaigns', href: '/admin/comms/campaigns' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: 'chart',
    roles: ['SUPER_ADMIN'],
    children: [
      { key: 'sales', label: 'Sales & Conversion', href: '/admin/reports/sales' },
      { key: 'vendor-perf', label: 'Vendor Performance', href: '/admin/reports/vendors' },
      { key: 'promo-perf', label: 'Promotions Performance', href: '/admin/reports/promotions' },
    ],
  },
  {
    key: 'users',
    label: 'Users & Roles',
    icon: 'users',
    roles: ['SUPER_ADMIN'],
    href: '/admin/users',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'cog',
    roles: ['SUPER_ADMIN'],
    href: '/admin/settings',
  },
  {
    key: 'audit',
    label: 'Audit Log',
    icon: 'clock',
    roles: ['SUPER_ADMIN'],
    href: '/admin/audit',
  },
];


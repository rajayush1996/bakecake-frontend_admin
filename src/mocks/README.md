Mock data lives here. Keep only data, not behavior.

Structure:
- pricing/segments.ts — price segment tables
- catalog/products.ts — sample product listings
- catalog/categories.ts — category tree
- navigation/nav.ts — sidebar/topnav items
- forms/productFields.ts — form field options per product type
- admin/categorySeed.ts — localStorage seed for categories admin page

Consumers (libs/features/pages) should import these to avoid hard-coded data.


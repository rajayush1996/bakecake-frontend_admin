# BakeCake Admin – Architecture Overview

This repo is being migrated to a feature‑based structure with centralized state, a reusable design system, and Storybook for documentation. Next.js app routes remain in `src/app` for automatic code‑splitting, while domain logic/UI live in `src/features` and `src/shared`.

## New high‑level layout

- `src/app` — Next.js routes and layouts only
- `src/features` — Feature modules (Catalog, Pricing, Vendors…)
  - `catalog/`
    - `components/CategorySection.tsx`
    - `categories.ts` (category tree + helpers)
    - `state.tsx` (CatalogProvider + hooks)
  - `pricing/`
    - `PricePreview.tsx`
- `src/shared` — Cross‑feature building blocks
  - `ui/` — Design system re‑exports of primitives
- `src/components` — Existing components (migrating to `src/shared/ui` gradually)
- `src/lib` — In‑memory data sources and pure utilities (can be swapped with API later)

## Centralized state
`src/features/catalog/state.tsx` exposes a `CatalogProvider` that wraps admin pages and provides `useCatalog()` with products and price segments. Today it wraps in‑memory libs and bumps a version to re‑render; later you can plug in API calls without touching pages.

## Design system
- Primitives live in `src/components/ui/*` and are re‑exported from `src/shared/ui`.
- Storybook scaffolding lives in `.storybook/` and stories next to the primitives under `src/components/ui/*.stories.tsx`.

## Code‑splitting
- Next.js already splits by route. Heavier widgets can be moved into `src/features/*` and imported with `next/dynamic` when needed.

## Conventions
- Keep page components thin; import domain UI from `src/features/*`.
- Export typed hooks from each feature (`useCatalog`, `usePricing`, …).
- Keep cross‑cutting tokens and classes in Tailwind config and `globals.css`.

## Migration plan
1. Extract reusable UI from pages to `src/features/*/components` (e.g., we extracted `CategorySection`).
2. Replace direct `lib/*` calls in pages with feature hooks (`useCatalog()`) where convenient.
3. Move more primitives into `src/shared/ui` and add Storybook stories.
4. When ready, replace `src/lib` with real API calls; only providers/hooks change.


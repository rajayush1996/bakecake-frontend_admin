"use client";

import type { PriceEntry } from "@/lib/priceSegments";
import { listPriceSegments, getEffectivePriceTable } from "@/lib/priceSegments";
import type { ProductType } from "@/lib/productListing";

export function PricePreview({
  segmentId,
  customRows,
  segments = listPriceSegments(),
  productType,
  categoryId,
}: {
  segmentId: string;
  customRows: PriceEntry[];
  segments?: ReturnType<typeof listPriceSegments>;
  productType?: ProductType;
  categoryId?: string;
}) {
  const seg = segmentId !== "custom" ? segments.find((s) => s.id === segmentId) : undefined;
  const table: PriceEntry[] = seg
    ? getEffectivePriceTable(seg.id, { productType, categoryId })
    : customRows;
  if (!table.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4">
      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Price Preview</div>
      <div className="flex flex-wrap gap-2">
        {table.map((p, i) => (
          <span key={`${p.weight}-${i}`} className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
            {p.weight}: ₹{p.price}
          </span>
        ))}
      </div>
    </div>
  );
}

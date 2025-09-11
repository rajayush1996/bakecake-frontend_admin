import type { ProductType } from "./productListing";

export interface PriceEntry {
  weight: string;
  price: number;
}

export interface PriceSegment {
  id: string;
  label: string;
  priceTable: PriceEntry[];
  // Optional overrides by product type or specific category id
  perType?: Partial<Record<ProductType, PriceEntry[]>>;
  perCategory?: Record<string, PriceEntry[]>;
}
import { PRICE_SEGMENTS } from "@/mocks/pricing/segments";

export function listPriceSegments(): PriceSegment[] {
  return Object.values(PRICE_SEGMENTS);
}

export function getPriceSegment(id: string): PriceSegment | undefined {
  return PRICE_SEGMENTS[id];
}

export function addPriceSegment(segment: PriceSegment): void {
  PRICE_SEGMENTS[segment.id] = segment;
}

export function getEffectivePriceTable(
  id: string,
  opts?: { productType?: ProductType; categoryId?: string }
): PriceEntry[] {
  const segment = getPriceSegment(id);
  if (!segment) return [];

  // Category-specific override takes precedence
  if (opts?.categoryId && segment.perCategory?.[opts.categoryId]) {
    return segment.perCategory[opts.categoryId];
  }

  // Then product type–specific override
  if (opts?.productType && segment.perType?.[opts.productType]) {
    return segment.perType[opts.productType]!;
  }

  // Fallback to default table
  return segment.priceTable;
}

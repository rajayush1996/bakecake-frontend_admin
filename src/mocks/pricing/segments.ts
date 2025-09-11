import type { PriceSegment } from "@/lib/priceSegments";

// Centralized mock price segments
export const PRICE_SEGMENTS: Record<string, PriceSegment> = {
  tier1: {
    id: "tier1",
    label: "Tier 1",
    priceTable: [
      { weight: "500 g", price: 599 },
      { weight: "1 kg", price: 1099 },
      { weight: "1.5 kg", price: 1599 },
    ],
    // Example: different price units for flowers
    perType: {
      flowers: [
        { weight: "10 stems", price: 499 },
        { weight: "20 stems", price: 899 },
        { weight: "30 stems", price: 1299 },
      ],
    },
  },
  tier2: {
    id: "tier2",
    label: "Tier 2 (Premium)",
    priceTable: [
      { weight: "500 g", price: 900 },
      { weight: "1 kg", price: 1799 },
      { weight: "1.5 kg", price: 2199 },
    ],
    // Example: category-specific premium for designer cakes
    perCategory: {
      "designer-cakes": [
        { weight: "500 g", price: 1199 },
        { weight: "1 kg", price: 2299 },
        { weight: "1.5 kg", price: 2999 },
      ],
    },
    // And a flowers override for premium arrangements
    perType: {
      flowers: [
        { weight: "10 stems", price: 799 },
        { weight: "20 stems", price: 1499 },
        { weight: "30 stems", price: 2099 },
      ],
    },
  },
};

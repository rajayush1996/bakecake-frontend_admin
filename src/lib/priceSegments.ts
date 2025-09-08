export interface PriceEntry {
  weight: string;
  price: number;
}

export interface PriceSegment {
  id: string;
  label: string;
  priceTable: PriceEntry[];
}

const segments: Record<string, PriceSegment> = {
  tier1: {
    id: "tier1",
    label: "Tier 1",
    priceTable: [
      { weight: "500 g", price: 599 },
      { weight: "1 kg", price: 1099 },
      { weight: "1.5 kg", price: 1599 },
    ],
  },
  tier2: {
    id: "tier2",
    label: "Tier 2 (Premium)",
    priceTable: [
      { weight: "500 g", price: 900 },
      { weight: "1 kg", price: 1799 },
      { weight: "1.5 kg", price: 2199 },
    ],
  },
};

export function listPriceSegments(): PriceSegment[] {
  return Object.values(segments);
}

export function getPriceSegment(id: string): PriceSegment | undefined {
  return segments[id];
}

export function addPriceSegment(segment: PriceSegment): void {
  segments[segment.id] = segment;
}

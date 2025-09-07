import { PriceEntry, getPriceSegment } from "./priceSegments";

export interface ProductListing {
  title: string;
  highlights: string[];
  priceSegmentId: string;
  priceTable: PriceEntry[];
}

export interface ProductListingInput {
  title: string;
  highlights: string[];
  priceSegmentId: string;
  customPriceTable?: PriceEntry[];
}

export function createProductListing(
  input: ProductListingInput
): ProductListing {
  if (input.priceSegmentId === "custom") {
    return {
      title: input.title,
      highlights: input.highlights,
      priceSegmentId: input.priceSegmentId,
      priceTable: input.customPriceTable ?? [],
    };
  }
  const segment = getPriceSegment(input.priceSegmentId);
  return {
    title: input.title,
    highlights: input.highlights,
    priceSegmentId: input.priceSegmentId,
    priceTable: segment ? segment.priceTable : [],
  };
}

export const classicButterscotchListing = createProductListing({
  title: "Classic Butterscotch Crunch Cake",
  highlights: [
    "Buttery crunch layered with silky whipped cream",
    "Fresh vanilla sponge soaked in butterscotch syrup",
    "Crowned with golden praline shards and nuts",
    "Handcrafted daily for swift same-day delivery",
  ],
  priceSegmentId: "tier1",
});

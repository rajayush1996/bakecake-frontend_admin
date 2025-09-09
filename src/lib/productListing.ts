import { PriceEntry, getPriceSegment } from "./priceSegments";

export type ProductType = "cake" | "flowers";
export type ProductAttributes = Record<string, string>;

export interface ProductListing {
  // Basic
  title: string;
  description?: string;
  highlights: string[];

  // Pricing
  priceSegmentId: string;
  priceTable: PriceEntry[];

  // Catalog metadata
  productType: ProductType;
  attributes: ProductAttributes;
  sku?: string;
  slug?: string;

  // Media
  primaryImage?: string; // data URL for now
  secondaryImages?: string[];

  // Categories
  primaryCategoryId?: string;
  categoryIds?: string[];
}

export interface ProductListingInput {
  title: string;
  description?: string;
  highlights: string[];
  priceSegmentId: string;
  customPriceTable?: PriceEntry[];
  productType: ProductType;
  attributes: ProductAttributes;
  primaryImage?: string;
  secondaryImages?: string[];
  sku?: string;
  slug?: string;
  primaryCategoryId?: string;
  categoryIds?: string[];
}

export function createProductListing(input: ProductListingInput): ProductListing {
  const base: Omit<ProductListing, "priceTable"> = {
    title: input.title,
    description: input.description,
    highlights: input.highlights,
    priceSegmentId: input.priceSegmentId,
    productType: input.productType,
    attributes: input.attributes,
    primaryImage: input.primaryImage,
    secondaryImages: input.secondaryImages ?? [],
    sku: input.sku,
    slug: input.slug,
    primaryCategoryId: input.primaryCategoryId,
    categoryIds: input.categoryIds ?? [],
  };

  if (input.priceSegmentId === "custom") {
    return {
      ...base,
      priceTable: input.customPriceTable ?? [],
    };
  }
  const segment = getPriceSegment(input.priceSegmentId);
  return {
    ...base,
    priceTable: segment ? segment.priceTable : [],
  };
}

export const classicButterscotchListing = createProductListing({
  title: "Classic Butterscotch Crunch Cake",
  description: "A crunchy butterscotch cake with praline shards.",
  highlights: [
    "Buttery crunch layered with silky whipped cream",
    "Fresh vanilla sponge soaked in butterscotch syrup",
    "Crowned with golden praline shards and nuts",
    "Handcrafted daily for swift same-day delivery",
  ],
  priceSegmentId: "tier1",
  productType: "cake",
  attributes: { flavour: "Butterscotch" },
  slug: "classic-butterscotch-crunch-cake",
});

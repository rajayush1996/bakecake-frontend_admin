import { PriceEntry, getPriceSegment, getEffectivePriceTable } from "./priceSegments";

export type ProductType = "cake" | "flowers" | "teddy" | "gift";
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
    priceTable: segment
      ? getEffectivePriceTable(input.priceSegmentId, {
          productType: input.productType,
          categoryId: input.primaryCategoryId,
        })
      : [],
  };
}

// Example listings moved to mocks in: src/mocks/catalog/products.ts

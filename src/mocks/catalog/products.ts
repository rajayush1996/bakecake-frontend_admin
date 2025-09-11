import { createProductListing, type ProductListing } from "@/lib/productListing";

// Example product listings used across the app
const classicButterscotch = createProductListing({
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

export const MOCK_PRODUCTS: ProductListing[] = [classicButterscotch];


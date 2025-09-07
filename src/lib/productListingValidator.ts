import { ProductListing } from "./productListing";

export function validateListing(listing: ProductListing): { errors: string[] } {
  const errors: string[] = [];
  const { highlights } = listing;

  if (highlights.length < 3 || highlights.length > 5) {
    errors.push("Highlights should contain between 3 and 5 bullets.");
  }

  highlights.forEach((h, index) => {
    const wordCount = h.trim().split(/\s+/).length;
    if (wordCount < 6 || wordCount > 12) {
      errors.push(`Highlight ${index + 1} should be 6–12 words.`);
    }
  });

  return { errors };
}

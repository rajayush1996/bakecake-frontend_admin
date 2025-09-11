import type { ProductListing } from "./productListing";
import { MOCK_PRODUCTS } from "@/mocks/catalog/products";

const products: ProductListing[] = [...MOCK_PRODUCTS];

export function listProducts(): ProductListing[] {
  return products;
}

export function addProduct(product: ProductListing): void {
  products.push(product);
}

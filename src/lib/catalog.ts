import { ProductListing, classicButterscotchListing } from "./productListing";

const products: ProductListing[] = [classicButterscotchListing];

export function listProducts(): ProductListing[] {
  return products;
}

export function addProduct(product: ProductListing): void {
  products.push(product);
}

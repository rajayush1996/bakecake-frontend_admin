"use client";

import Link from "next/link";
import { listProducts } from "@/lib/catalog";

export default function ProductsPage() {
  const products = listProducts();
  return (
    <main className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/catalog/products/new" className="border px-2">
          Add Product
        </Link>
      </div>
      <ul className="list-disc pl-5">
        {products.map((p) => (
          <li key={p.title}>{p.title}</li>
        ))}
      </ul>
      <Link
        href="/catalog/price-segments"
        className="mt-4 inline-block text-blue-600"
      >
        Manage Price Segments
      </Link>
    </main>
  );
}

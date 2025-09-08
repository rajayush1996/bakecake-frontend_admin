"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { listPriceSegments, PriceEntry } from "@/lib/priceSegments";
import { createProductListing } from "@/lib/productListing";
import { addProduct } from "@/lib/catalog";
import { validateListing } from "@/lib/productListingValidator";

export default function NewProductPage() {
  const router = useRouter();
  const segments = listPriceSegments();
  const [form, setForm] = useState({
    title: "",
    highlights: "",
    segmentId: segments[0]?.id ?? "custom",
    priceTable: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let customPriceTable: PriceEntry[] | undefined;
    if (form.segmentId === "custom") {
      try {
        customPriceTable = JSON.parse(form.priceTable);
      } catch {
        setErrors(["Invalid price table JSON"]);
        return;
      }
    }
    const listing = createProductListing({
      title: form.title,
      highlights: form.highlights.split("\n").filter(Boolean),
      priceSegmentId: form.segmentId,
      customPriceTable,
    });
    const { errors: validationErrors } = validateListing(listing);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    addProduct(listing);
    router.push("/admin/catalog/products");
  };

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            className="w-full border p-1"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label
            htmlFor="highlights"
            className="mb-1 block text-sm font-medium"
          >
            Highlights (one per line)
          </label>
          <textarea
            id="highlights"
            className="w-full border p-1"
            value={form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="segment"
            className="mb-1 block text-sm font-medium"
          >
            Price Segment
          </label>
          <select
            id="segment"
            className="border p-1"
            value={form.segmentId}
            onChange={(e) => setForm({ ...form, segmentId: e.target.value })}
          >
            {segments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>
        {form.segmentId === "custom" && (
          <div>
            <label
              htmlFor="priceTable"
              className="mb-1 block text-sm font-medium"
            >
              Price Table JSON
            </label>
            <textarea
              id="priceTable"
              className="w-full border p-1"
              placeholder='e.g. [{"weight":"500 g","price":500}]'
              value={form.priceTable}
              onChange={(e) => setForm({ ...form, priceTable: e.target.value })}
            />
          </div>
        )}
        {errors.length > 0 && (
          <ul className="list-disc pl-5 text-red-600">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <button type="submit" className="border px-2">
          Save
        </button>
      </form>
    </main>
  );
}

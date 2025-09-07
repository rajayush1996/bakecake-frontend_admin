"use client";

import { useState } from "react";
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

  const handleSubmit = () => {
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
      <div className="mb-2">
        <input
          className="w-full border p-1"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <textarea
          className="w-full border p-1"
          placeholder="Highlights (one per line)"
          value={form.highlights}
          onChange={(e) => setForm({ ...form, highlights: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="mr-2 font-semibold">Price Segment</label>
        <select
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
        <div className="mb-2">
          <textarea
            className="w-full border p-1"
            placeholder='Price table JSON e.g. [{"weight":"500 g","price":500}]'
            value={form.priceTable}
            onChange={(e) => setForm({ ...form, priceTable: e.target.value })}
          />
        </div>
      )}
      {errors.length > 0 && (
        <ul className="mb-2 list-disc pl-5 text-red-600">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <button className="border px-2" onClick={handleSubmit}>
        Save
      </button>
    </main>
  );
}

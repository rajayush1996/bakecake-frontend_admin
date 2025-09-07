"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PriceSegment,
  PriceEntry,
  listPriceSegments,
  addPriceSegment,
} from "@/lib/priceSegments";

export default function PriceSegmentsPage() {
  const [segments, setSegments] = useState(listPriceSegments());
  const [form, setForm] = useState({ id: "", label: "", priceTable: "" });

  const handleAdd = () => {
    try {
      const priceTable: PriceEntry[] = JSON.parse(form.priceTable);
      const segment: PriceSegment = {
        id: form.id,
        label: form.label,
        priceTable,
      };
      addPriceSegment(segment);
      setSegments(listPriceSegments());
      setForm({ id: "", label: "", priceTable: "" });
    } catch {
      alert("Invalid price table JSON");
    }
  };

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Price Segments</h1>
      <ul className="mb-4 list-disc pl-5">
        {segments.map((s) => (
          <li key={s.id}>
            {s.label}: {s.priceTable.map((p) => `${p.weight}: ₹${p.price}`).join(", ")}
          </li>
        ))}
      </ul>
      <section>
        <h2 className="font-semibold">Add Segment</h2>
        <input
          className="mr-2 border p-1"
          placeholder="id"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <input
          className="mr-2 border p-1"
          placeholder="label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="mr-2 border p-1"
          placeholder='priceTable JSON e.g. [{"weight":"500 g","price":500}]'
          value={form.priceTable}
          onChange={(e) => setForm({ ...form, priceTable: e.target.value })}
        />
        <button className="border px-2" onClick={handleAdd}>
          Add
        </button>
      </section>
      <Link
        href="/admin/catalog/products"
        className="mt-4 inline-block text-blue-600"
      >
        Back to Products
      </Link>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";
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

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
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
      {segments.length > 0 && (
        <table className="mb-4 w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Label</th>
              <th className="border px-2 py-1 text-left">Prices</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.label}</td>
                <td className="border px-2 py-1">
                  {s.priceTable
                    .map((p) => `${p.weight}: ₹${p.price}`)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <section>
        <h2 className="mb-2 font-semibold">Add Segment</h2>
        <form onSubmit={handleAdd} className="space-y-2">
          <div>
            <label htmlFor="id" className="mb-1 block text-sm font-medium">
              ID
            </label>
            <input
              id="id"
              className="w-full border p-1"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="label" className="mb-1 block text-sm font-medium">
              Label
            </label>
            <input
              id="label"
              className="w-full border p-1"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </div>
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
              required
            />
          </div>
          <button type="submit" className="border px-2">
            Add
          </button>
        </form>
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

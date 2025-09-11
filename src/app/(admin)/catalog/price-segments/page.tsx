"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProductType } from "@/lib/productListing";
import {
  PriceSegment,
  PriceEntry,
  listPriceSegments,
  addPriceSegment,
} from "@/lib/priceSegments";

const TYPE_OPTIONS: ("base" | ProductType)[] = ["base", "cake", "flowers", "teddy", "gift"];
const typeLabel = (t: "base" | ProductType) => (t === "base" ? "Base (all types)" : t.charAt(0).toUpperCase() + t.slice(1));
const placeholderFor = (t: "base" | ProductType) => {
  switch (t) {
    case "flowers":
      return '[{"weight":"10 stems","price":499},{"weight":"20 stems","price":899}]';
    case "teddy":
      return '[{"weight":"Small","price":499},{"weight":"Medium","price":899},{"weight":"Large","price":1299}]';
    case "gift":
      return '[{"weight":"Standard","price":799},{"weight":"Deluxe","price":1299}]';
    default:
      return '[{"weight":"500 g","price":599},{"weight":"1 kg","price":1099}]';
  }
};

export default function PriceSegmentsPage() {
  const [segments, setSegments] = useState(listPriceSegments());
  const [activeType, setActiveType] = useState<"base" | ProductType>("base");
  const [form, setForm] = useState({ id: "", label: "", priceTable: "", perCategoryJson: "" });
  const [typeJsons, setTypeJsons] = useState<Record<ProductType, string>>({ cake: "", flowers: "", teddy: "", gift: "" });
  const [error, setError] = useState<string>("");

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const priceTable: PriceEntry[] = JSON.parse(form.priceTable);
      const segment: PriceSegment = {
        id: form.id.trim(),
        label: form.label.trim(),
        priceTable,
      };
      if (!segment.id || !segment.label) throw new Error("Missing fields");
      // Build perType from filled typeJsons
      const filledTypes = Object.entries(typeJsons).filter(([, v]) => v.trim());
      if (filledTypes.length) {
        const perType: Partial<Record<ProductType, PriceEntry[]>> = {};
        for (const [k, v] of filledTypes) {
          perType[k as ProductType] = JSON.parse(v) as PriceEntry[];
        }
        segment.perType = perType;
      }
      if (form.perCategoryJson.trim()) {
        segment.perCategory = JSON.parse(form.perCategoryJson);
      }
      addPriceSegment(segment);
      setSegments(listPriceSegments());
      setForm({ id: "", label: "", priceTable: "", perCategoryJson: "" });
      setTypeJsons({ cake: "", flowers: "", teddy: "", gift: "" });
      } catch {
      setError("Invalid input. Please provide valid JSON for the price table.");
    }
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="mb-6 text-3xl font-bold">Price Segments</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Existing segments */}
        <section className="card lg:col-span-1">
          <h2 className="card-title">Existing Segments</h2>
          {segments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-200 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/60">
                    <th className="p-2 text-left">Label</th>
                    <th className="p-2 text-left">Types</th>
                    <th className="p-2 text-left">Prices</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((s) => (
                    <tr key={s.id} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="p-2">{s.label}</td>
                      <td className="p-2 text-slate-600 dark:text-slate-300">
                        {[
                          s.priceTable?.length ? "Base" : null,
                          ...Object.keys(s.perType ?? {}).map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </td>
                      <td className="p-2 text-slate-600 dark:text-slate-300">
                        {s.priceTable.map((p) => `${p.weight}: ₹${p.price}`).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No segments yet.</p>
          )}
        </section>

        {/* Add segment */}
        <section className="card lg:col-span-1">
          <h2 className="card-title">Add Segment</h2>
          <form onSubmit={handleAdd} className="grid gap-4">
            <div>
              <label htmlFor="id" className="field-label">ID</label>
              <Input
                id="id"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="tier3"
                required
              />
            </div>
            <div>
              <label htmlFor="label" className="field-label">Label</label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Tier 3 (Budget)"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="field-label">Price Table For</label>
                <select className="select" value={activeType} onChange={(e) => setActiveType(e.target.value as any)}>
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {typeLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">
                  {activeType === "base" ? "Base Price Table JSON" : `${typeLabel(activeType)} Override JSON`}
                </label>
                <textarea
                  className="textarea h-36"
                  placeholder={placeholderFor(activeType)}
                  value={
                    activeType === "base"
                      ? form.priceTable
                      : typeJsons[activeType as ProductType]
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    if (activeType === "base") setForm({ ...form, priceTable: v });
                    else setTypeJsons((prev) => ({ ...prev, [activeType]: v } as typeof prev));
                  }}
                />
                {error && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="perCategory" className="field-label">Per Category Overrides (optional JSON)</label>
              <textarea
                id="perCategory"
                className="textarea h-24"
                placeholder='e.g. {"designer-cakes":[{"weight":"500 g","price":1199}]}'
                value={form.perCategoryJson}
                onChange={(e) => setForm({ ...form, perCategoryJson: e.target.value })}
              />
              <p className="mt-1 text-xs text-slate-500">Keys are category IDs; values are price arrays.</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit">Add Segment</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setForm({ id: "", label: "", priceTable: "", perCategoryJson: "" });
                  setTypeJsons({ cake: "", flowers: "", teddy: "", gift: "" });
                  setActiveType("base");
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </section>
      </div>

      <Link href="/catalog/products" className="mt-6 inline-block text-blue-600">
        Back to Products
      </Link>
    </main>
  );
}

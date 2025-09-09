"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { listPriceSegments, PriceEntry } from "@/lib/priceSegments";
import { createProductListing, ProductType } from "@/lib/productListing";
import { addProduct } from "@/lib/catalog";
import { validateListing } from "@/lib/productListingValidator";

/* ---------------- Product fields by type (trimmed) ---------------- */

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "select" | "textarea" | "number";
  options?: string[];
  required?: boolean;
  defaultValue?: string;
};

const FIELD_SCHEMAS: Record<ProductType, FieldDef[]> = {
  cake: [
    { key: "flavour", label: "Cake Flavour", type: "text", required: true },
    {
      key: "shape",
      label: "Shape",
      type: "select",
      options: ["Round", "Square", "Heart", "Rectangle", "Other"],
      required: true,
    },
    { key: "toppings", label: "Toppings (optional)", type: "text" },
    { key: "netQuantity", label: "Net Quantity", type: "text", defaultValue: "1 Cake" },
  ],
  flowers: [
    {
      key: "flowerType",
      label: "Flower Type",
      type: "select",
      options: ["Roses", "Lilies", "Carnations", "Tulips", "Mixed", "Other"],
      required: true,
    },
    {
      key: "arrangement",
      label: "Arrangement",
      type: "select",
      options: ["Bouquet", "Box", "Basket", "Bunch"],
      required: true,
    },
    { key: "color", label: "Primary Color (optional)", type: "text" },
    { key: "stemsCount", label: "Stems / Qty (optional)", type: "number" },
    { key: "careNotes", label: "Care Instructions (optional)", type: "textarea" },
  ],
};

const buildInitialAttributes = (type: ProductType) =>
  Object.fromEntries(FIELD_SCHEMAS[type].map((f) => [f.key, f.defaultValue ?? ""]));

/* ---------------- Category tree + helpers ---------------- */
type CategoryNode = {
  id: string;
  name: string;
  productType?: ProductType; // only on roots
  children?: CategoryNode[];
};

const CATEGORIES: CategoryNode[] = [
  {
    id: "cakes",
    name: "Cakes",
    productType: "cake",
    children: [
      {
        id: "chocolate-cakes",
        name: "Chocolate Cakes",
        children: [
          { id: "truffle-cakes", name: "Truffle Cakes" },
          { id: "photo-cakes", name: "Photo Cakes" },
        ],
      },
      { id: "designer-cakes", name: "Designer Cakes" },
      { id: "eggless-cakes", name: "Eggless Cakes" },
    ],
  },
  {
    id: "flowers",
    name: "Flowers",
    productType: "flowers",
    children: [
      { id: "bouquets", name: "Bouquets" },
      { id: "roses", name: "Roses" },
      { id: "lilies", name: "Lilies" },
    ],
  },
];

const findNode = (nodes: CategoryNode[], id?: string): CategoryNode | undefined => {
  if (!id) return undefined;
  for (const n of nodes) {
    if (n.id === id) return n;
    const hit = n.children && findNode(n.children, id);
    if (hit) return hit;
  }
};
const findRootForId = (id?: string): CategoryNode | undefined => {
  if (!id) return undefined;
  const contains = (node: CategoryNode): boolean =>
    node.id === id || (node.children?.some(contains) ?? false);
  return CATEGORIES.find(contains);
};
const flattenDescendantsWithPath = (root?: CategoryNode): { id: string; label: string }[] => {
  if (!root?.children) return [];
  const out: { id: string; label: string }[] = [];
  const walk = (n: CategoryNode, path: string[]) => {
    const label = [...path, n.name].join(" › ");
    out.push({ id: n.id, label });
    n.children?.forEach((c) => walk(c, [...path, n.name]));
  };
  root.children.forEach((c) => walk(c, []));
  return out;
};
const flattenAllWithDepth = (
  nodes: CategoryNode[],
  depth = 0
): { id: string; name: string; depth: number }[] => {
  const out: { id: string; name: string; depth: number }[] = [];
  for (const n of nodes) {
    out.push({ id: n.id, name: n.name, depth });
    if (n.children) out.push(...flattenAllWithDepth(n.children, depth + 1));
  }
  return out;
};

function CategorySection({
  mainId,
  setMainId,
  primaryId,
  setPrimaryId,
  additionalIds,
  setAdditionalIds,
  setProductType,
}: {
  mainId: string;
  setMainId: (id: string) => void;
  primaryId: string;
  setPrimaryId: (id: string) => void;
  additionalIds: string[];
  setAdditionalIds: (ids: string[]) => void;
  setProductType: (t: ProductType) => void;
}) {
  const mains = CATEGORIES;

  useEffect(() => {
    if (!primaryId) return;
    const root = findRootForId(primaryId);
    if (root && root.id !== mainId) setMainId(root.id);
  }, [primaryId, mainId, setMainId]);

  const mainNode = findNode(CATEGORIES, mainId);
  const subOptions = flattenDescendantsWithPath(mainNode);

  return (
    <section className="card">
      <h2 className="card-title">Categories</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Main Category */}
        <div>
          <label className="field-label">Main Category *</label>
          <select
            className="select"
            value={mainId}
            onChange={(e) => {
              const newMain = e.target.value;
              setMainId(newMain);
              const node = findNode(CATEGORIES, newMain);
              if (node?.productType) setProductType(node.productType);
              const hasSubs = !!flattenDescendantsWithPath(node).length;
              setPrimaryId(hasSubs ? "" : newMain);
            }}
          >
            <option value="">Select...</option>
            {mains.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="field-label">
            Subcategory {subOptions.length ? "*" : "(not required)"}
          </label>
          <select
            className="select"
            disabled={!subOptions.length || !mainId}
            value={subOptions.length ? primaryId : mainId}
            onChange={(e) => setPrimaryId(e.target.value)}
          >
            {subOptions.length ? (
              <>
                <option value="">Select...</option>
                {subOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </>
            ) : (
              <>
                <option value="">(No subcategories)</option>
                {mainId && <option value={mainId}>{findNode(CATEGORIES, mainId)?.name}</option>}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Additional Categories */}
      <div className="mt-4">
        <label className="field-label">Additional Categories</label>
        <select
          multiple
          className="select h-40"
          value={additionalIds}
          onChange={(e) => {
            const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
            setAdditionalIds([...new Set(ids)]);
          }}
        >
          {flattenAllWithDepth(CATEGORIES).map(({ id, name, depth }) => (
            <option key={id} value={id}>
              {depth > 0 ? "— ".repeat(depth) : ""}
              {name}
            </option>
          ))}
        </select>

        {additionalIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {additionalIds.map((id) => (
              <span
                key={id}
                className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-200"
              >
                {findNode(CATEGORIES, id)?.name ?? id}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- New Product Page ---------------- */
export default function NewProductPage() {
  const router = useRouter();
  const segments = listPriceSegments();

  const [productType, setProductType] = useState<ProductType>("cake");
  const [mainCategoryId, setMainCategoryId] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    highlights: "",
    description: "",
    attributes: buildInitialAttributes("cake") as Record<string, string>,
    segmentId: segments[0]?.id ?? "custom",
    primaryImage: "",
    secondaryImages: [] as string[],
    sku: "",
    slug: "",
    primaryCategoryId: "",
    categoryIds: [] as string[],
  });

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  useEffect(() => {
    setForm((f) => (!f.slug && f.title ? { ...f, slug: slugify(f.title) } : f));
  }, [form.title]);

  const [customRows, setCustomRows] = useState<PriceEntry[]>([{ weight: "500 g", price: 0 }]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];
    if (!form.primaryCategoryId) missing.push("Primary Category is required");
    for (const f of FIELD_SCHEMAS[productType]) {
      if (f.required && !String(form.attributes[f.key] ?? "").trim()) {
        missing.push(`${f.label} is required`);
      }
    }

    let customPriceTable: PriceEntry[] | undefined;
    if (form.segmentId === "custom") {
      const filtered = customRows.filter((r) => r.weight.trim() && !Number.isNaN(Number(r.price)));
      if (!filtered.length) {
        missing.push("Add at least one custom price row");
      } else {
        customPriceTable = filtered.map((r) => ({ weight: r.weight.trim(), price: Number(r.price) }));
      }
    }

    if (missing.length) {
      setErrors(missing);
      return;
    }

    const listing = createProductListing({
      title: form.title,
      description: form.description,
      productType,
      attributes: form.attributes,
      highlights: form.highlights
        .split("\n")
        .map((l) => l.replace(/^•\s*/, "").trim())
        .filter(Boolean),
      priceSegmentId: form.segmentId,
      customPriceTable,
      primaryImage: form.primaryImage,
      secondaryImages: form.secondaryImages,
      sku: form.sku,
      slug: form.slug,
      primaryCategoryId: form.primaryCategoryId,
      categoryIds: form.categoryIds,
    });

    const { errors: validationErrors } = validateListing(listing);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    addProduct(listing);
    router.push("/catalog/products");
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handlePrimaryUpload = async (files?: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setForm((f) => ({ ...f, primaryImage: dataUrl }));
  };

  const handleSecondaryUpload = async (files?: FileList | null) => {
    if (!files?.length) return;
    const urls = await Promise.all(Array.from(files).map(readFileAsDataURL));
    setForm((f) => ({ ...f, secondaryImages: [...f.secondaryImages, ...urls] }));
  };

  const schema = FIELD_SCHEMAS[productType];

  useEffect(() => {
    const root = findRootForId(form.primaryCategoryId);
    if (root && root.id !== mainCategoryId) setMainCategoryId(root.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="mb-6 text-3xl font-bold">New Product</h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* General */}
          <section className="card">
            <h2 className="card-title">General Info</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="field-label">Title</label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Product Type</label>
                  {/* readonly/derived from Main Category */}
                  <input className="input" value={productType} readOnly />
                </div>
              </div>

              {/* SKU + Slug */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="field-label">SKU</label>
                  <input
                    className="input"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                    placeholder="CAKE-CHOC-1KG"
                  />
                </div>
                <div>
                  <label className="field-label">Slug</label>
                  <input
                    className="input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="chocolate-truffle-1kg"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Highlights (one per line)</label>
                <textarea
                  rows={3}
                  className="textarea"
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  placeholder={`e.g.\n• Freshly baked\n• Eggless option`}
                />
              </div>

              <div>
                <label className="field-label">Description</label>
                <textarea
                  rows={5}
                  className="textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Categories */}
          <CategorySection
            mainId={mainCategoryId}
            setMainId={setMainCategoryId}
            primaryId={form.primaryCategoryId}
            setPrimaryId={(id) => setForm({ ...form, primaryCategoryId: id })}
            additionalIds={form.categoryIds}
            setAdditionalIds={(ids) => setForm({ ...form, categoryIds: ids })}
            setProductType={(t) => {
              setProductType(t);
              setForm((f) => ({ ...f, attributes: buildInitialAttributes(t) }));
            }}
          />

          {/* Attributes */}
          <section className="card">
            <h2 className="card-title">Attributes</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {schema.map((f) => {
                const val = form.attributes[f.key] ?? "";
                const set = (v: string) =>
                  setForm((prev) => ({ ...prev, attributes: { ...prev.attributes, [f.key]: v } }));

                if (f.type === "textarea") {
                  return (
                    <div key={f.key} className="md:col-span-2">
                      <label className="field-label">
                        {f.label}
                        {f.required ? " *" : ""}
                      </label>
                      <textarea rows={4} className="textarea" value={val} onChange={(e) => set(e.target.value)} />
                    </div>
                  );
                }
                if (f.type === "select") {
                  return (
                    <div key={f.key}>
                      <label className="field-label">
                        {f.label}
                        {f.required ? " *" : ""}
                      </label>
                      <select className="select" value={val} onChange={(e) => set(e.target.value)}>
                        <option value="" disabled>
                          Select...
                        </option>
                        {(f.options ?? []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <label className="field-label">
                      {f.label}
                      {f.required ? " *" : ""}
                    </label>
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      className="input"
                      value={val}
                      onChange={(e) => set(e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pricing */}
          <section className="card">
            <h2 className="card-title">Pricing</h2>
            <div className="grid gap-4">
              <div>
                <label className="field-label">Price Segment</label>
                <select
                  className="select"
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
                <div className="space-y-2">
                  {customRows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="input w-48"
                        placeholder="Weight (e.g. 1 kg)"
                        value={row.weight}
                        onChange={(e) =>
                          setCustomRows((r) => r.map((it, idx) => (idx === i ? { ...it, weight: e.target.value } : it)))
                        }
                      />
                      <input
                        type="number"
                        className="input w-36"
                        placeholder="Price"
                        value={row.price}
                        onChange={(e) =>
                          setCustomRows((r) =>
                            r.map((it, idx) => (idx === i ? { ...it, price: Number(e.target.value) } : it))
                          )
                        }
                      />
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setCustomRows((r) => r.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-ghost" onClick={() => setCustomRows((r) => [...r, { weight: "", price: 0 }])}>
                    + Add Row
                  </button>
                </div>
              )}

              <PricePreview segmentId={form.segmentId} customRows={customRows} segments={segments} />
            </div>
          </section>

          {/* Errors + Save */}
          {errors.length > 0 && (
            <ul className="list-disc rounded bg-red-50 dark:bg-red-900/30 p-3 text-red-700 dark:text-red-300">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          <button type="submit" className="btn-primary w-full">
            Save Product
          </button>
        </div>

        {/* RIGHT: media */}
        <div className="space-y-6">
          <section className="card">
            <h2 className="card-title">Primary Image</h2>
            <label
              htmlFor="primaryUpload"
              className="dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handlePrimaryUpload(e.dataTransfer.files);
              }}
            >
              Drop image here or click to upload
            </label>
            <input id="primaryUpload" type="file" accept="image/*" className="sr-only" onChange={(e) => handlePrimaryUpload(e.target.files)} />
            {form.primaryImage && (
              <img src={form.primaryImage} alt="Primary preview" className="mt-3 w-full rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
            )}
          </section>

          <section className="card">
            <h2 className="card-title">Secondary Images</h2>
            <label
              htmlFor="secondaryUpload"
              className="dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleSecondaryUpload(e.dataTransfer.files);
              }}
            >
              Drop images or click to upload (you can add multiple)
            </label>
            <input id="secondaryUpload" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => handleSecondaryUpload(e.target.files)} />

            {!!form.secondaryImages.length && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {form.secondaryImages.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt={`Secondary ${idx + 1}`} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-red-500 px-2 text-white"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          secondaryImages: f.secondaryImages.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </form>
    </main>
  );
}

/* ---------------- Price Preview (simple & stable) ---------------- */
function PricePreview({
  segmentId,
  customRows,
  segments,
}: {
  segmentId: string;
  customRows: PriceEntry[];
  segments: ReturnType<typeof listPriceSegments>;
}) {
  const seg = segmentId !== "custom" ? segments.find((s) => s.id === segmentId) : undefined;
  const table: PriceEntry[] = seg ? seg.priceTable : customRows;
  if (!table.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4">
      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Price Preview</div>
      <div className="flex flex-wrap gap-2">
        {table.map((p, i) => (
          <span key={`${p.weight}-${i}`} className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
            {p.weight}: ₹{p.price}
          </span>
        ))}
      </div>
    </div>
  );
}

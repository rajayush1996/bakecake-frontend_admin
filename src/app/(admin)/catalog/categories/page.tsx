"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useI18n } from "@/i18n";

/* ===================== Types ===================== */

type ProductType = "cake" | "flowers" | "combo";

interface Category {
  id: number;
  title: string;
  slug: string;
  iconUrl?: string | null;
  sortOrder?: number | null;
  isActive: boolean;
  parentId?: number | null;
  productType: ProductType; // children inherit parent’s type
}

/* ===================== Mock DB (localStorage) ===================== */

const LS_KEY = "bk_categories_v1";

type CatStore = { seq: number; items: Category[] };

const seed: CatStore = {
  seq: 2,
  items: [
    {
      id: 1,
      title: "Cakes",
      slug: "cakes",
      isActive: true,
      sortOrder: 1,
      parentId: null,
      productType: "cake",
    },
    {
      id: 2,
      title: "Flowers",
      slug: "flowers",
      isActive: true,
      sortOrder: 2,
      parentId: null,
      productType: "flowers",
    },
  ],
};

function loadStore(): CatStore {
  if (typeof window === "undefined") return structuredClone(seed);
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }
  try {
    const parsed = JSON.parse(raw) as CatStore;
    if (!parsed || !Array.isArray(parsed.items)) throw new Error("bad store");
    return parsed;
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return structuredClone(seed);
  }
}

function saveStore(s: CatStore) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

function listCats(): Promise<Category[]> {
  return Promise.resolve(loadStore().items);
}

function createCat(values: Omit<Category, "id">): Promise<Category> {
  const store = loadStore();
  const id = store.seq + 1;
  store.seq = id;
  const created: Category = { id, ...values };
  store.items.push(created);
  saveStore(store);
  return Promise.resolve(created);
}

function updateCat(id: number, patch: Partial<Category>): Promise<Category> {
  const store = loadStore();
  const idx = store.items.findIndex((c) => c.id === id);
  if (idx < 0) return Promise.reject(new Error("Not found"));
  const prev = store.items[idx];
  const next = { ...prev, ...patch };

  // If parent changed, enforce inheritance of productType
  if (patch.parentId !== undefined) {
    const parent = store.items.find((c) => c.id === (patch.parentId ?? -1));
    next.productType = parent ? parent.productType : next.productType;
  }

  store.items[idx] = next;

  // Propagate productType to descendants if it changed
  if (next.productType !== prev.productType) {
    const q = [next.id];
    while (q.length) {
      const cur = q.shift()!;
      const children = store.items.filter((c) => c.parentId === cur);
      for (const ch of children) {
        ch.productType = next.productType;
        q.push(ch.id);
      }
    }
  }

  saveStore(store);
  return Promise.resolve(next);
}

function deleteCat(id: number): Promise<void> {
  const store = loadStore();
  // guard: no children
  if (store.items.some((c) => c.parentId === id)) {
    return Promise.reject(new Error("Has children"));
  }
  store.items = store.items.filter((c) => c.id !== id);
  saveStore(store);
  return Promise.resolve();
}

/* ===================== Helpers ===================== */

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  iconUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().nonnegative().optional(),
  isActive: z.boolean(),
  parentId: z.number().int().nullable().optional(),
  productType: z.enum(["cake", "flowers", "combo"]),
});
type CategoryForm = z.infer<typeof schema>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function indexById(list: Category[]) {
  const m = new Map<number, Category>();
  list.forEach((c) => m.set(c.id, c));
  return m;
}

function depthOf(cat: Category, byId: Map<number, Category>) {
  let d = 0;
  let p = cat.parentId ? byId.get(cat.parentId) : undefined;
  while (p) {
    d += 1;
    p = p.parentId ? byId.get(p.parentId) : undefined;
  }
  return d;
}

function isDescendant(
  all: Category[],
  parentCandidate: number,
  possibleChild: number
) {
  const byId = indexById(all);
  let p = byId.get(possibleChild)?.parentId ?? null;
  while (p) {
    if (p === parentCandidate) return true;
    p = byId.get(p)?.parentId ?? null;
  }
  return false;
}

// ---- UI helpers (labels, grid rows) ----
const labelCls =
  "block text-[13px] font-medium text-slate-700 dark:text-slate-300";
const helpCls = "mt-1 text-xs text-slate-500 dark:text-slate-400";
const errorCls = "mt-1 text-xs text-red-600 dark:text-red-400";

const ctrlCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 " +
  "text-slate-900 placeholder-slate-400 focus:outline-none " +
  "focus:ring-2 focus:ring-brand-400 dark:border-slate-600 " +
  "dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500";

function Field({
  label,
  children,
  help,
  error,
  colSpan = 1,
}: {
  label: string;
  children: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  colSpan?: 1 | 2;
}) {
  return (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
      <label className={labelCls}>{label}</label>
      <div className="mt-1">{children}</div>
      {help ? <p className={helpCls}>{help}</p> : null}
      {error ? <p className={errorCls}>{error}</p> : null}
    </div>
  );
}

/* ===================== Page ===================== */

export default function CategoriesPage() {
  const { t } = useI18n();

  // local data (no API)
  const [cats, setCats] = useState<Category[]>([]);
  const reload = () => listCats().then(setCats);

  useEffect(() => {
    reload();
  }, []);

  const byId = useMemo(() => indexById(cats), [cats]);

  // modal & form
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      isActive: true,
      productType: "cake",
      parentId: null,
      sortOrder: 0,
      iconUrl: "",
    },
  });

  // auto-slug
  const title = watch("title");
  useEffect(() => {
    if (!slugTouched)
      setValue("slug", slugify(title ?? ""), { shouldValidate: true });
  }, [title, slugTouched, setValue]);

  // inherit type from parent
  const parentId = watch("parentId");
  useEffect(() => {
    if (parentId) {
      const p = byId.get(parentId);
      if (p) setValue("productType", p.productType, { shouldValidate: true });
    }
  }, [parentId, byId, setValue]);

  const openNew = () => {
    setSlugTouched(false);
    reset({
      title: "",
      slug: "",
      iconUrl: "",
      sortOrder: 0,
      isActive: true,
      parentId: null,
      productType: "cake",
    });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (cat: Category) => {
    setSlugTouched(true); // do not overwrite slug while editing
    const { id: _id, ...rest } = cat;
    void _id;
    reset({
      ...rest,
      parentId: rest.parentId ?? null,
      sortOrder: rest.sortOrder ?? 0,
      iconUrl: rest.iconUrl ?? "",
    });
    setEditing(cat);
    setOpen(true);
  };

  const onSubmit = async (values: CategoryForm) => {
    // Protect against cycles
    if (
      editing &&
      values.parentId &&
      (values.parentId === editing.id ||
        isDescendant(cats, editing.id, values.parentId))
    ) {
      alert("Invalid parent: would create a cycle.");
      return;
    }

    const payload: Omit<Category, "id"> = {
      ...values,
      parentId: values.parentId ?? null,
      productType: values.parentId
        ? byId.get(values.parentId!)?.productType ?? values.productType
        : values.productType,
    };

    if (editing) await updateCat(editing.id, payload);
    else await createCat(payload);

    await reload();
    setOpen(false);
    setEditing(null);
  };

  const handleDelete = async (cat: Category) => {
    if (cats.some((c) => c.parentId === cat.id)) {
      alert("Cannot delete: category has subcategories.");
      return;
    }
    if (!confirm("Delete this category?")) return;
    await deleteCat(cat.id);
    await reload();
  };

  const parentOptions = useMemo(() => {
    // sort by sortOrder then title
    const sorted = cats
      .slice()
      .sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
          a.title.localeCompare(b.title)
      );
    return sorted.map((cat) => ({ cat, depth: depthOf(cat, byId) }));
  }, [cats, byId]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("Categories.heading") ?? "Categories"}
        </h1>
        <Button onClick={openNew}>
          {t("Categories.new") ?? "New Category"}
        </Button>
      </div>

      <table className="w-full border border-slate-200 dark:border-slate-700">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800/60">
            <th className="p-2 text-left">
              {t("Categories.columns.title") ?? "Title"}
            </th>
            <th className="p-2 text-left">
              {t("Categories.columns.slug") ?? "Slug"}
            </th>
            <th className="p-2 text-left">
              {t("Categories.columns.isActive") ?? "Active"}
            </th>
            <th className="p-2 text-left">
              {t("Categories.columns.sortOrder") ?? "Sort Order"}
            </th>
            <th className="p-2">
              {t("Categories.columns.actions") ?? "Actions"}
            </th>
          </tr>
        </thead>
        <tbody>
          {cats
            .slice()
            .sort((a, b) => {
              const ao = a.sortOrder ?? 0;
              const bo = b.sortOrder ?? 0;
              if (ao !== bo) return ao - bo;
              // fallback: by path (rough alphabetical)
              const path = (n: Category) => {
                const segs: string[] = [];
                let cur: Category | undefined = n;
                while (cur) {
                  segs.unshift(cur.title);
                  cur = cur.parentId ? byId.get(cur.parentId) : undefined;
                }
                return segs.join(" / ");
              };
              return path(a).localeCompare(path(b));
            })
            .map((cat) => {
              const d = depthOf(cat, byId);
              return (
                <tr
                  key={cat.id}
                  className="border-t border-slate-200 dark:border-slate-700"
                >
                  <td className="p-2">
                    <div className="flex items-center">
                      <span
                        style={{ marginLeft: d * 16 }}
                        className="font-medium"
                      >
                        {cat.title}
                      </span>
                      <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {cat.productType}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-500">{cat.slug}</td>
                  <td className="p-2">{cat.isActive ? "Yes" : "No"}</td>
                  <td className="p-2">{cat.sortOrder ?? 0}</td>
                  <td className="p-2 space-x-2 text-right">
                    <Button className="px-2 py-1" onClick={() => openEdit(cat)}>
                      {t("Categories.edit") ?? "Edit"}
                    </Button>
                    <Button
                      className="bg-red-600 px-2 py-1 hover:bg-red-500"
                      onClick={() => handleDelete(cat)}
                    >
                      {t("Categories.delete") ?? "Delete"}
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* ------------- Modal ------------- */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {editing ? "Edit Category" : "New Category"}
            </h2>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Title (full width) */}
            <Field label="Title" colSpan={2} error={errors.title?.message}>
              <Input
                placeholder="e.g. Chocolate Cakes"
                className={ctrlCls}
                {...register("title")}
              />
            </Field>

            {/* Slug (full width) */}
            <Field
              label="Slug"
              colSpan={2}
              help="Auto-generated from title — feel free to edit."
              error={errors.slug?.message}
            >
              <Input
                placeholder="chocolate-cakes"
                className={ctrlCls}
                {...register("slug")}
                onChange={(e: any) => {
                  // keep your slugTouched behavior
                  setSlugTouched(true);
                  setValue("slug", e.target.value, { shouldValidate: true });
                }}
              />
            </Field>

            {/* Parent */}
            <Field label="Parent Category">
              <select
                className={ctrlCls}
                {...register("parentId", {
                  setValueAs: (v) => (v === "" ? null : Number(v)),
                })}
                defaultValue={editing?.parentId ?? ""}
              >
                <option value="">(No parent — root)</option>
                {parentOptions
                  .filter(({ cat }) => {
                    if (editing && cat.id === editing.id) return false;
                    if (editing && isDescendant(cats, editing.id, cat.id))
                      return false;
                    return true;
                  })
                  .map(({ cat, depth }) => (
                    <option key={cat.id} value={cat.id}>
                      {depth > 0 ? "— ".repeat(depth) : ""}
                      {cat.title}
                    </option>
                  ))}
              </select>
            </Field>

            {/* Product type (disabled when child) */}
            <Field
              label="Product Type"
              help={
                (watch("parentId")
                  ? "Inherited from parent"
                  : "Only settable for root categories") as React.ReactNode
              }
            >
              <Controller
                control={control}
                name="productType"
                render={({ field }) =>
                  watch("parentId") ? (
                    <Input disabled value={field.value} className={ctrlCls} />
                  ) : (
                    <select
                      className={ctrlCls}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="cake">cake</option>
                      <option value="flowers">flowers</option>
                      <option value="combo">combo</option>
                    </select>
                  )
                }
              />
            </Field>

            {/* Icon URL + live preview */}
            <Field label="Icon URL" help="Optional">
              <Input
                placeholder="https://…/icon.svg"
                className={ctrlCls}
                {...register("iconUrl")}
              />
              {/** simple preview if URL present */}
              {(() => {
                const url = (watch("iconUrl") || "").trim();
                if (!url) return null;
                return (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={url}
                      alt="icon preview"
                      className="h-8 w-8 rounded border border-slate-200 dark:border-slate-700 object-contain"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className="text-xs text-slate-500">Preview</span>
                  </div>
                );
              })()}
            </Field>

            {/* Sort order */}
            <Field label="Sort Order">
              <Input
                type="number"
                placeholder="0"
                className={ctrlCls}
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </Field>

            {/* Active switch (full width) */}
            <div className="md:col-span-2">
              <label className={labelCls}>Active</label>
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Show this category on storefront
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              className="bg-slate-500 hover:bg-slate-400"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

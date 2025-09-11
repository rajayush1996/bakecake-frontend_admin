"use client";

import { useEffect } from "react";
import type { ProductType } from "@/lib/productListing";
import {
  CATEGORIES,
  findNode,
  findRootForId,
  flattenDescendantsWithPath,
  flattenAllWithDepth,
} from "../categories";

export function CategorySection({
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

  // keep main & primary consistent if someone sets primary directly
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
                {mainId && (
                  <option value={mainId}>{findNode(CATEGORIES, mainId)?.name}</option>
                )}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Additional Categories (multi) */}
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


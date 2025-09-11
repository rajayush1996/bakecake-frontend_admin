import type { ProductType } from "@/lib/productListing";
import { CATEGORIES as RAW_CATEGORIES } from "@/mocks/catalog/categories";

export type CategoryNode = {
  id: string;
  name: string;
  productType?: ProductType; // only on roots
  children?: CategoryNode[];
};

// Central catalog tree (can be replaced by API later)
export const CATEGORIES: CategoryNode[] = RAW_CATEGORIES as CategoryNode[];

// find node anywhere in tree
export const findNode = (
  nodes: CategoryNode[],
  id?: string
): CategoryNode | undefined => {
  if (!id) return undefined;
  for (const n of nodes) {
    if (n.id === id) return n;
    const hit = n.children && findNode(n.children, id);
    if (hit) return hit;
  }
};

// find top-level root that contains a given id
export const findRootForId = (id?: string): CategoryNode | undefined => {
  if (!id) return undefined;
  const contains = (node: CategoryNode): boolean =>
    node.id === id || (node.children?.some(contains) ?? false);
  return CATEGORIES.find(contains);
};

// descendants of a root as path labels: "Chocolate Cakes › Truffle Cakes"
export const flattenDescendantsWithPath = (
  root?: CategoryNode
): { id: string; label: string }[] => {
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

// whole tree for multi-select (indent with depth)
export const flattenAllWithDepth = (
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

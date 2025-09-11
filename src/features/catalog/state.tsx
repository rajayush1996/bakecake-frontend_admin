"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { listProducts, addProduct as libAddProduct } from "@/lib/catalog";
import { listPriceSegments, addPriceSegment as libAddSegment, PriceSegment } from "@/lib/priceSegments";
import type { ProductListing } from "@/lib/productListing";

type CatalogContextType = {
  products: ProductListing[];
  segments: ReturnType<typeof listPriceSegments>;
  addProduct: (p: ProductListing) => void;
  addPriceSegment: (s: PriceSegment) => void;
};

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  // Simple versioned state to trigger rerenders when libs change
  const [version, setVersion] = useState(0);

  const products = useMemo(() => listProducts(), [version]);
  const segments = useMemo(() => listPriceSegments(), [version]);

  const addProduct = useCallback((p: ProductListing) => {
    libAddProduct(p);
    setVersion((v) => v + 1);
  }, []);
  const addPriceSegment = useCallback((s: PriceSegment) => {
    libAddSegment(s);
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo(() => ({ products, segments, addProduct, addPriceSegment }), [products, segments, addProduct, addPriceSegment]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}


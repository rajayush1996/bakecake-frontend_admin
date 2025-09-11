import type { ProductType } from "@/lib/productListing";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "select" | "textarea" | "number";
  options?: string[];
  required?: boolean;
  defaultValue?: string;
};

export const FIELD_SCHEMAS: Record<ProductType, FieldDef[]> = {
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
  teddy: [
    { key: "size", label: "Size", type: "select", options: ["Small", "Medium", "Large"], required: true },
    { key: "color", label: "Color", type: "text" },
    { key: "material", label: "Material", type: "text" },
    { key: "netQuantity", label: "Net Quantity", type: "text", defaultValue: "1 Teddy" },
  ],
  gift: [
    { key: "giftType", label: "Gift Type", type: "text", required: true },
    { key: "contents", label: "Contents (optional)", type: "textarea" },
    { key: "occasion", label: "Occasion (optional)", type: "text" },
    { key: "netQuantity", label: "Net Quantity", type: "text", defaultValue: "1 Unit" },
  ],
};

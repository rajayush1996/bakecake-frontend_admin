// Centralized mock category tree
export const CATEGORIES = [
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


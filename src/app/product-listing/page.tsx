"use client";

import { useState } from "react";
import { createProductListing } from "@/lib/productListing";
import { listPriceSegments } from "@/lib/priceSegments";
import { validateListing } from "@/lib/productListingValidator";

export default function Page() {
  const segments = listPriceSegments();
  const [segmentId, setSegmentId] = useState("tier1");

  const listing = createProductListing({
    title: "Classic Butterscotch Crunch Cake",
    highlights: [
      "Buttery crunch layered with silky whipped cream",
      "Fresh vanilla sponge soaked in butterscotch syrup",
      "Crowned with golden praline shards and nuts",
      "Handcrafted daily for swift same-day delivery",
    ],
    priceSegmentId: segmentId,
    customPriceTable: [
      { weight: "500 g", price: 750 },
      { weight: "1 kg", price: 1450 },
      { weight: "1.5 kg", price: 1950 },
    ],
  });

  const { errors } = validateListing(listing);

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{listing.title}</h1>

      <label className="mb-2 block font-semibold">
        Price Segment
        <select
          className="ml-2 border p-1"
          value={segmentId}
          onChange={(e) => setSegmentId(e.target.value)}
        >
          {segments.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </label>

      <section>
        <h2 className="font-semibold">Highlights</h2>
        <ul className="list-disc pl-5">
          {listing.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="font-semibold">Prices</h2>
        <ul className="list-disc pl-5">
          {listing.priceTable.map((p) => (
            <li key={p.weight}>
              {p.weight}: ₹{p.price}
            </li>
          ))}
        </ul>
      </section>

      {errors.length > 0 && (
        <section className="mt-4">
          <h2 className="font-semibold">Validation Issues</h2>
          <ul className="list-disc pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

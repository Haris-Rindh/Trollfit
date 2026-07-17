import type { Metadata } from "next";
import { CollectionsClient } from "./CollectionsClient";
import { DEMO_COLLECTIONS } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Shop Streetwear Collections | Anime, Meme & Oversized Tees",
  description: "Browse TrollFit's viral streetwear collections. High-quality oversized meme tees, premium anime shirts, and internet-culture inspired drip. Nationwide COD.",
  openGraph: {
    title: "All Collections | TrollFit",
    description: "Browse TrollFit's viral streetwear collections. Oversized meme tees, premium anime shirts, and internet culture drip.",
  },
};

export default function CollectionsPage() {
  return <CollectionsClient initialCollectionsCount={DEMO_COLLECTIONS.length} />;
}

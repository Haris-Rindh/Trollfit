import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About Our Brand",
  description: "TrollFit is Pakistan's first internet-native streetwear brand. We capture Gen-Z internet culture, memes, and anime vibes on premium oversized tees. Learn our story!",
  openGraph: {
    title: "About Us | TrollFit",
    description: "TrollFit is Pakistan's first internet-native streetwear brand. Learn our story!",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}

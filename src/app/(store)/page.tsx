import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { SocialProof } from "@/components/home/SocialProof";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { LimitedDrop } from "@/components/home/LimitedDrop";
import { AIDesignSection } from "@/components/home/AIDesignSection";
import { Newsletter } from "@/components/home/Newsletter";
import { MarqueeBanner } from "@/components/home/MarqueeBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <FeaturedCollections />
      <TrendingProducts />
      <BestSellers />
      <LimitedDrop />
      <SocialProof />
      <WhyChooseUs />
      <AIDesignSection />
      <Newsletter />
    </>
  );
}

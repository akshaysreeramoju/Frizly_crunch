import { Hero } from "@/components/sections/Hero";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { WhyUs } from "@/components/sections/WhyUs";
import { Products } from "@/components/sections/Products";
import { SocialProof } from "@/components/sections/SocialProof";
import { Process } from "@/components/sections/Process";
import { Uses } from "@/components/sections/Uses";
import { ReviewsCarousel } from "@/components/sections/ReviewsCarousel";
import { GiftBanner } from "@/components/sections/GiftBanner";
import { NewsletterStrip } from "@/components/sections/NewsletterStrip";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <MarqueeStrip />
      <TrustBadges />
      <WhyUs />
      <Products />
      <SocialProof />
      <Process />
      <Uses />
      <ReviewsCarousel />
      <GiftBanner />
      <NewsletterStrip />
    </div>
  );
}

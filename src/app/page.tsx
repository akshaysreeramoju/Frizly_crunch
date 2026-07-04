import { Hero } from "@/components/sections/Hero";
import { MarqueeStrip } from "@/components/sections/MarqueeStrip";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { WhyUs } from "@/components/sections/WhyUs";
import { Products } from "@/components/sections/Products";

import { Process } from "@/components/sections/Process";
import { Uses } from "@/components/sections/Uses";
import { HydrationTip } from "@/components/sections/HydrationTip";
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

      <Process />
      <Uses />
      <HydrationTip />
      <GiftBanner />
      <NewsletterStrip />
    </div>
  );
}

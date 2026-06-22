import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FaqSection from "@/components/FaqSection";
import ReviewsSection from "@/components/ReviewsSection";
import FooterSection from "@/components/FooterSection";
import InfosSection from "@/components/InfosSection";
import QuoteSection from "@/components/QuoteSection";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  return (
    <main>
      <SplashScreen />
      <HeroSection />
      <AboutSection />
      <FaqSection />
      <ReviewsSection />
      <InfosSection />
      <QuoteSection />
      <FooterSection />
    </main>
  );
}

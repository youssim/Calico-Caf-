import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FaqSection />
      <section id="infos" style={{ height: "100vh", background: "#f2ede3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>Infos — coming soon</span>
      </section>
      <FooterSection />
    </main>
  );
}

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <section id="faq" style={{ height: "100vh", background: "#f2ede3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>FAQ — coming soon</span>
      </section>
      <section id="infos" style={{ height: "100vh", background: "#f2ede3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>Infos — coming soon</span>
      </section>
    </main>
  );
}

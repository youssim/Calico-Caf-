import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section id="a-propos" style={{ height: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>À propos — coming soon</span>
      </section>
      <section id="menu" style={{ height: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>Menu — coming soon</span>
      </section>
      <section id="faq" style={{ height: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>FAQ — coming soon</span>
      </section>
      <section id="infos" style={{ height: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 24, opacity: 0.4 }}>Infos — coming soon</span>
      </section>
    </main>
  );
}

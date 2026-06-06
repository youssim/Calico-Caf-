"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay },
});

const navLinks = [
  { label: "À propos", href: "#a-propos" },
  { label: "Au menu", href: "#menu" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#infos" },
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Couleur habillage navbar (liens + tagline + bordure pill + bouton) ───
// TEST VERT (actuel) · Latte : "#c9b99a" · Noir d'origine : "#1a1a1a"
const NAV_COLOR = "#4a6741"; // TEST VERT

export default function HeroSection() {
  return (
    <section style={{
      height: "100vh",
      backgroundColor: "#f2ede3",
      background: "#f2ede3",
      position: "relative",
      overflow: "hidden",
      margin: 0,
      padding: 0,
    }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        style={{
          position: "fixed",
          top: 18,
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          padding: "2px 36px",
          borderRadius: 50,
          background: "rgba(242,237,227,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `2px solid ${NAV_COLOR}`,
          whiteSpace: "nowrap",
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/calico-logo.png"
          alt="Calico"
          style={{ height: 67, width: "auto", display: "block" }}
        />

        {/* Links */}
        <div className="nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-courier)",
                fontSize: 19,
                fontWeight: 400,
                color: NAV_COLOR,
                opacity: 0.7,
                transition: "opacity 0.2s",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              {link.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* CTA VOIR LE MENU — haut droite */}
      <motion.button
        className="nav-cta"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        onClick={() => scrollTo("#menu")}
        whileHover={{ scale: 1.03 }}
        style={{
          position: "fixed",
          top: 18,
          right: "2rem",
          zIndex: 100,
          background: NAV_COLOR,
          color: "#f2ede3",
          fontFamily: "var(--font-courier)",
          fontSize: 13,
          fontWeight: 700,
          padding: "14px 28px",
          borderRadius: 50,
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Voir le menu
      </motion.button>

      {/* HERO IMAGE — taille naturelle, collée en haut */}
      <div style={{
        position: "absolute",
        top: -57,
        left: 0,
        right: 0,
        maskImage: "linear-gradient(to bottom, black 70%, transparent 95%), linear-gradient(to left, black 50%, transparent 56%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%), linear-gradient(to left, black 50%, transparent 56%)",
        maskComposite: "add",
        WebkitMaskComposite: "source-over",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fresque-v3.png"
          alt="Fresque Calico"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Le gobelet est rendu par AboutSection (position fixed, piloté
          par le scroll) pour une continuité pixel-perfect Hero → About. */}

      {/* CAFÉ DE SPÉCIALITÉ — bas droite */}
      <motion.p
        {...fadeUp(0.3)}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          zIndex: 10,
          fontFamily: "var(--font-courier)",
          fontSize: "clamp(11px, 1vw, 14px)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--black)",
          opacity: 0.6,
        }}
      >
        Café de spécialité.
      </motion.p>

      {/* TAGLINE — énorme en bas pleine largeur */}
      <div
        className="hero-tagline"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          overflow: "hidden",
          lineHeight: 0.85,
        }}
      >
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontFamily: "var(--font-saira)",
            fontSize: "clamp(60px, 13vw, 180px)",
            fontWeight: 900,
            lineHeight: 0.85,
            color: "var(--black)", // titre héros en noir (cohérence avec la fresque)
            whiteSpace: "nowrap",
            paddingLeft: "1rem",
          }}
        >
          Brunch tous<br />
          les jours.
        </motion.p>
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-cta { display: none !important; }
          .hero-tagline {
            left: 1.5rem !important;
            right: 1.5rem !important;
            bottom: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}

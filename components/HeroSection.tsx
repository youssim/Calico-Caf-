"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay },
});

const navLinks = [
  { label: "À propos", href: "#a-propos" },
  { label: "Menu", href: "#menu" },
  { label: "FAQ", href: "#faq" },
  { label: "Infos", href: "#infos" },
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  return (
    <section style={{ height: "100vh", background: "#f5f0e8", position: "relative", overflow: "hidden" }}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        style={{
          position: "fixed",
          top: 16,
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          padding: "10px 24px",
          borderRadius: 50,
          background: "rgba(245,240,232,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "0.5px solid rgba(139,115,85,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        {/* Logo */}
        <span style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 17,
          fontWeight: 700,
          color: "var(--black)",
          letterSpacing: "-0.02em",
        }}>
          Calico
        </span>

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
                fontFamily: "var(--font-dm-sans)",
                fontSize: 12,
                fontWeight: 400,
                color: "var(--black)",
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

        {/* CTA dans la navbar */}
        <motion.button
          className="nav-cta"
          onClick={() => scrollTo("#menu")}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            background: "var(--black)",
            color: "#f5f0e8",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 12,
            fontWeight: 500,
            padding: "8px 18px",
            borderRadius: 50,
            border: "none",
            cursor: "pointer",
          }}
        >
          Voir le menu
        </motion.button>
      </motion.nav>

      {/* HERO IMAGE — taille naturelle, collée en haut */}
      <div style={{
        position: "absolute",
        top: -57,
        left: 0,
        right: 0,
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

      {/* TAGLINE — zone libre sous l'image */}
      <div
        className="hero-tagline"
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "4rem",
          zIndex: 10,
        }}
      >
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 700,
            lineHeight: 1.0,
            color: "var(--black)",
          }}
        >
          Brunch tous<br />
          les jours.<br />
          <em style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>Café de spécialité.</em>
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

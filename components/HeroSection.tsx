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
  { label: "Contact", href: "#contact" },
];

// Scroll fluide maîtrisé (durée + easing) plutôt que le smooth natif du navigateur,
// jugé trop sec. behavior:"instant" à chaque frame pour ne pas entrer en conflit
// avec le scroll-behavior:smooth global du CSS.
function smoothScrollTo(targetY: number, duration = 850) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;
  // easeInOutCubic : démarre doux, accélère, ralentit à l'arrivée
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let startTime: number | null = null;
  // Masque le gobelet "Spin-Land" pendant le trajet : sur un saut de navigation, il
  // ne doit pas rejouer sa chorégraphie au ralenti à travers le hero. Il réapparaît
  // à l'arrivée, déjà dans le bon état (piloté par le scroll sous-jacent).
  const root = document.documentElement;
  root.classList.add("cup-hide");
  function step(now: number) {
    if (startTime === null) startTime = now;
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo({ top: startY + diff * ease(t), behavior: "instant" });
    if (t < 1) requestAnimationFrame(step);
    else root.classList.remove("cup-hide");
  }
  requestAnimationFrame(step);
}

const SCROLL_OFFSET = 80; // marge sous la navbar fixe

function scrollTo(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  smoothScrollTo(y);
}

function scrollToTop() {
  smoothScrollTo(0);
}

// ─── Couleur habillage navbar (liens + bordure pill + bouton) ───
// Hero 100% N&B assumé : encre noire (pas d'accent couleur orphelin sur le hero).
// Alternatives : Latte "#c9b99a" · Vert "#4a6741"
const NAV_COLOR = "#1a1a1a"; // ENCRE

export default function HeroSection() {
  // La gestion du scroll au chargement (hero au refresh / restauration de la position
  // au retour des mentions légales) est centralisée dans SplashScreen, qui monte
  // toujours en premier — on évite ainsi que deux effets se battent pour le scroll.

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
        {/* Logo — clic = retour au héros */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/calico-logo.png"
          alt="Calico"
          onClick={scrollToTop}
          style={{ height: 67, width: "auto", display: "block", cursor: "pointer" }}
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
                fontSize: 17,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: NAV_COLOR,
                background: "transparent",
                padding: 0,
                borderRadius: 999,
                opacity: 0.85,
                // box-shadow = pastille au survol SANS occuper d'espace (pas de
                // décalage de mise en page → navbar de taille inchangée)
                transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = NAV_COLOR;
                e.currentTarget.style.color = "#f2ede3";
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = `0 0 0 7px ${NAV_COLOR}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = NAV_COLOR;
                e.currentTarget.style.opacity = "0.85";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* CTA HAUT DROITE — Instagram + Nous trouver */}
      <motion.div
        className="nav-cta"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        style={{
          position: "fixed",
          top: 18,
          right: "2rem",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Pastille Instagram */}
        <a
          href="https://instagram.com/calicolille"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Calico"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = NAV_COLOR;
            e.currentTarget.style.color = "#f2ede3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(242,237,227,0.85)";
            e.currentTarget.style.color = NAV_COLOR;
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "rgba(242,237,227,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: NAV_COLOR,
            border: `2px solid ${NAV_COLOR}`,
            transition: "background 0.22s ease, color 0.22s ease",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>

        {/* Nous trouver */}
        <motion.button
          onClick={() => scrollTo("#infos")}
          whileHover={{ scale: 1.03 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = NAV_COLOR;
            e.currentTarget.style.color = "#f2ede3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(242,237,227,0.85)";
            e.currentTarget.style.color = NAV_COLOR;
          }}
          style={{
            // même pastille crème translucide + flou que la navbar → lisible sur les
            // fonds sombres (photo devanture, carrousel noir), pas juste un contour
            background: "rgba(242,237,227,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: NAV_COLOR,
            fontFamily: "var(--font-courier)",
            fontSize: 13,
            fontWeight: 700,
            padding: "14px 28px",
            borderRadius: 50,
            border: `2px solid ${NAV_COLOR}`,
            cursor: "pointer",
            transition: "background 0.22s ease, color 0.22s ease",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Nous trouver
        </motion.button>
      </motion.div>

      {/* HERO IMAGE — taille naturelle, collée en haut */}
      <div style={{
        position: "absolute",
        top: -57,
        left: 0,
        right: 0,
        maskImage: "linear-gradient(to bottom, black 70%, transparent 95%), linear-gradient(to left, black 44%, transparent 50%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%), linear-gradient(to left, black 44%, transparent 50%)",
        maskComposite: "add",
        WebkitMaskComposite: "source-over",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fresque-v3.png?v=2"
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

      {/* CAFÉ DE SPÉCIALITÉ — haut gauche */}
      <motion.p
        {...fadeUp(0.3)}
        style={{
          position: "fixed",
          top: "30px",
          left: "2rem",
          zIndex: 100,
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
          bottom: "2.2vh",
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
            lineHeight: 0.7,
            textTransform: "uppercase",
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

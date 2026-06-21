"use client";

const CREAM = "#f2ede3";
const INK = "#1a1a1a";

export default function FooterSection() {
  const col: React.CSSProperties = {
    fontFamily: "var(--font-courier)",
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: CREAM,
    lineHeight: 1.7,
  };
  const linkUnderline: React.CSSProperties = {
    ...col,
    cursor: "pointer",
    textDecoration: "none",
    borderBottom: `1px solid ${CREAM}55`,
    paddingBottom: 2,
  };

  return (
    <footer
      style={{
        position: "relative",
        background: INK,
        minHeight: "55vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px) 0",
      }}
    >
      {/* ── Colonnes d'infos ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(48px, 8vw, 140px)",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={col}>
          Calico ©{new Date().getFullYear()}
          <br />
          Tous droits réservés
        </div>

        <a
          href="/mentions-legales"
          style={linkUnderline}
          onClick={() => {
            // mémorise la position pour y revenir au retour (sans dépendre du bfcache)
            try { sessionStorage.setItem("calico-return-y", String(Math.round(window.scrollY))); } catch {}
          }}
        >
          Mentions légales
        </a>

        <div style={col}>
          Suivez-nous
          <br />
          <a
            href="https://instagram.com/calicolille"
            target="_blank"
            rel="noreferrer"
            style={{ ...linkUnderline, display: "inline-block", marginTop: 4 }}
          >
            @calicolille
          </a>
        </div>

        <div style={col}>
          Café de spécialité
          <br />
          Brunch tous les jours · Lille
        </div>

      </div>

      {/* ── Wordmark géant CALICO (logo brush crème, déborde en bas) ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/calico-logo-cream.png"
        alt="Calico"
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(calc(-50% - 90px))", // décalé vers la gauche
          bottom: "clamp(-90px, -7vw, -56px)",         // déborde davantage (20px plus bas)
          width: "min(1500px, 96vw)",
          height: "auto",
          zIndex: 1,
          pointerEvents: "none",
          display: "block",
        }}
      />
    </footer>
  );
}

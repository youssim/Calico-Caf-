"use client";

import { useState } from "react";

const CREAM = "#f2ede3";
const INK = "#1a1a1a";
const GREEN = "#4a6741";
const TERRA = "#d45a30";

// ⚠️ À REMPLACER quand on a l'email du café :
// 1. Aller sur https://web3forms.com → entrer l'email de Calico → recevoir une clé gratuite
// 2. Coller la clé ici. Les messages du formulaire arriveront direct sur leur boîte mail.
// Tant que c'est le placeholder, le formulaire affiche "merci" sans rien envoyer (sûr pour la démo).
const WEB3FORMS_ACCESS_KEY = "REMPLACER_PAR_LA_CLE";

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-courier)",
  fontSize: 13,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: GREEN,
};
const h2: React.CSSProperties = {
  fontFamily: "var(--font-saira)",
  fontWeight: 900,
  color: INK,
  fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
  lineHeight: 0.95,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
  marginTop: 12,
};
const label: React.CSSProperties = {
  fontFamily: "var(--font-courier)",
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: INK,
  opacity: 0.55,
};
const value: React.CSSProperties = {
  fontFamily: "var(--font-courier)",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: INK,
};

export default function InfosSection() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);

    // Pas encore de clé (avant d'avoir l'email du café) → on simule l'envoi pour la démo.
    if (WEB3FORMS_ACCESS_KEY === "REMPLACER_PAR_LA_CLE") {
      setSent(true);
      return;
    }

    setSending(true);
    try {
      const form = e.currentTarget;
      const data = new FormData(form);
      data.append("access_key", WEB3FORMS_ACCESS_KEY);
      data.append("subject", "Nouveau message depuis le site Calico");
      data.append("from_name", "Site Calico");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) setSent(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="infos" style={{ background: CREAM, scrollMarginTop: "90px" }}>
      {/* ───────── HAUT : horaires + adresse SUR LA DEVANTURE (plein largeur) ───────── */}
      <div
        style={{
          position: "relative",
          backgroundImage: "url(/devanture.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 38%",
          minHeight: "min(82vh, 800px)",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* voile dégradé : sombre en bas pour la lisibilité du texte crème, clair en
            haut pour laisser respirer l'enseigne CALICO de la vitrine */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(14,10,7,0.96) 0%, rgba(14,10,7,0.88) 30%, rgba(14,10,7,0.62) 50%, rgba(14,10,7,0.22) 72%, rgba(14,10,7,0.28) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "min(1100px, 90vw)",
            margin: "0 auto",
            padding: "clamp(40px, 7vh, 80px) 0 clamp(80px, 14vh, 170px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px, 5vw, 80px)",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <span style={{ ...eyebrow, color: CREAM, opacity: 0.85, display: "block" }}>Infos</span>
            <h2 style={{ ...h2, color: CREAM }}>
              Passez
              <br />
              nous voir.
            </h2>
          </div>

          <div style={{ flex: "1 1 240px", minWidth: 220 }}>
            <div style={{ ...label, color: CREAM, opacity: 0.7 }}>Horaires</div>
            <div style={{ ...value, color: CREAM, marginTop: 10 }}>
              <strong>8h00 – 17h00</strong>
              <br />
              Tous les jours, sauf mercredi
              <br />
              <span style={{ opacity: 0.65 }}>Cuisine jusqu'à 16h</span>
            </div>
          </div>

          <div style={{ flex: "1 1 240px", minWidth: 220 }}>
            <div style={{ ...label, color: CREAM, opacity: 0.7 }}>Adresse</div>
            <div style={{ ...value, color: CREAM, marginTop: 10 }}>
              25 Boulevard Carnot
              <br />
              59800 Lille
              <br />
              <span style={{ opacity: 0.65 }}>Sans réservation</span>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Calico+25+Boulevard+Carnot+Lille"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: 22,
                background: CREAM,
                color: INK,
                fontFamily: "var(--font-courier)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "12px 26px",
                borderRadius: 50,
                textDecoration: "none",
              }}
            >
              Itinéraire →
            </a>
          </div>
        </div>
      </div>

      {/* ───────── BAS : formulaire de contact (sur crème) ───────── */}
      <div
        id="contact"
        style={{
          width: "min(1100px, 90vw)",
          margin: "0 auto",
          padding: "clamp(54px, 9vh, 110px) 0 clamp(44px, 8vh, 90px)",
          scrollMarginTop: "90px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(40px, 6vw, 90px)", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <span style={eyebrow}>Contact</span>
            <h2 style={h2}>
              Une question ?
              <br />
              Écrivez-nous.
            </h2>
            <p style={{ ...value, opacity: 0.7, marginTop: 20, maxWidth: 360 }}>
              On répond vite (et avec le sourire).
            </p>
          </div>

          <div style={{ flex: "1 1 380px", minWidth: 300 }}>
            {sent ? (
              <div style={{ ...value, padding: "40px 0", fontSize: "1.3rem" }}>
                Merci ! <span style={{ color: TERRA }}>On vous répond très vite.</span> ☕
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <Field label="Nom" name="nom" type="text" />
                <Field label="Email" name="email" type="email" />
                <Field label="Message" name="message" textarea />
                {error && (
                  <p style={{ ...value, color: TERRA, fontSize: "0.9rem", margin: 0 }}>
                    Oups, l'envoi a échoué. Réessayez ou écrivez-nous directement par mail.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 6,
                    background: INK,
                    color: CREAM,
                    fontFamily: "var(--font-courier)",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "16px 38px",
                    borderRadius: 50,
                    border: "none",
                    cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.6 : 1,
                  }}
                >
                  {sending ? "Envoi…" : "Envoyer"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label: lbl, name, type = "text", textarea = false }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const base: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: `1.5px solid ${INK}33`,
    borderRadius: 10,
    padding: "14px 16px",
    fontFamily: "var(--font-courier)",
    fontSize: "1rem",
    color: INK,
    outline: "none",
    resize: "vertical",
  };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ fontFamily: "var(--font-courier)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: INK, opacity: 0.55 }}>
        {lbl}
      </span>
      {textarea ? (
        <textarea name={name} rows={4} required style={base} />
      ) : (
        <input name={name} type={type} required style={base} />
      )}
    </label>
  );
}

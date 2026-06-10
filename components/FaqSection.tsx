"use client";

import { useState } from "react";

// ─── Contenu FAQ (placeholder — café-brunch lillois, à corriger) ───
type Faq = { id: number; label: string; question: string; answer: string; imageUrl: string };

const FAQS: Faq[] = [
  {
    id: 1,
    label: "Chiens",
    question: "Les chiens sont-ils acceptés ?",
    answer:
      "Évidemment, Calico est dog-friendly. Gamelle d'eau fraîche à l'entrée, puppyccino à 2,50€ et friandises offertes pour vos compagnons à quatre pattes.",
    imageUrl: "/faq/chiens.jpg",
  },
  {
    id: 2,
    label: "Horaires",
    question: "Quels sont les horaires ?",
    answer:
      "Ouvert de 8h à 17h tous les jours, sauf le mercredi. La cuisine tourne jusqu'à 16h — et c'est du brunch toute la journée, passez quand vous voulez.",
    imageUrl: "/faq/brunch.jpg",
  },
  {
    id: 3,
    label: "Réserver",
    question: "Faut-il réserver ?",
    answer:
      "Non, c'est sans réservation : premier arrivé, premier servi. On trouve (presque) toujours une place, même pour les grandes tablées.",
    imageUrl: "/faq/reserver.jpg",
  },
  {
    id: 4,
    label: "Télétravail",
    question: "Peut-on télétravailler chez vous ?",
    answer:
      "Oui, wifi rapide et prises disponibles en matinée. Aux heures de pointe du week-end, on privilégie les tablées qui mangent, merci de votre compréhension.",
    imageUrl: "/faq/teletravail.jpg",
  },
  {
    id: 5,
    label: "Régimes",
    question: "Avez-vous des options végétariennes ou véganes ?",
    answer:
      "Oui ! Des plats végétariens (V) et véganes (VG) sur la carte, et beaucoup de plats véganisables sur demande (VGA). Dites-nous, on s'adapte.",
    imageUrl: "/faq/vegane.jpg",
  },
];

const CREAM = "#f2ede3";
const INK = "#1a1a1a";
const GREEN = "#4a6741";

export default function FaqSection() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="faq"
      style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", padding: "6vh 0" }}
    >
      <div
        style={{
          width: "min(1200px, 92vw)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(32px, 5vw, 80px)",
          flexWrap: "wrap",
        }}
      >
        {/* ── Gauche : intro ── */}
        <div style={{ flex: "1 1 360px", minWidth: 300 }}>
          <span
            style={{
              fontFamily: "var(--font-courier)",
              fontSize: 14,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: GREEN,
            }}
          >
            FAQ
          </span>
          <h2
            style={{
              fontFamily: "var(--font-saira)",
              fontWeight: 900,
              color: INK,
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginTop: 14,
              textTransform: "uppercase",
            }}
          >
            Les questions
            <br />
            qu'on nous pose
            <br />
            souvent.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-courier)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: INK,
              opacity: 0.7,
              marginTop: 24,
              maxWidth: 460,
            }}
          >
            Survolez une carte pour la déployer. Une autre question ? Écrivez-nous,
            on répond vite (et avec le sourire).
          </p>
          <a
            href="#infos"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#infos")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "inline-block",
              marginTop: 32,
              background: INK,
              color: CREAM,
              fontFamily: "var(--font-courier)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "16px 34px",
              borderRadius: 50,
              cursor: "pointer",
            }}
          >
            Nous contacter
          </a>
        </div>

        {/* ── Droite : accordéon photos ── */}
        <div
          style={{
            flex: "1 1 520px",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {FAQS.map((faq, i) => {
            const isActive = i === active;
            return (
              <div
                key={faq.id}
                onMouseEnter={() => setActive(i)}
                style={{
                  position: "relative",
                  height: "clamp(380px, 56vh, 520px)",
                  width: isActive ? "clamp(300px, 30vw, 420px)" : 72,
                  borderRadius: 22,
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  border: `1.5px solid ${INK}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={faq.imageUrl}
                  alt={faq.question}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* overlay sombre — dégradé pour la lisibilité du texte */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.35) 55%, rgba(26,26,26,0.15) 100%)"
                      : "rgba(26,26,26,0.55)",
                    transition: "background 0.5s ease",
                  }}
                />

                {/* Titre vertical (carte repliée) */}
                <span
                  style={{
                    position: "absolute",
                    bottom: 28,
                    left: "50%",
                    transform: "translateX(-50%) rotate(90deg)",
                    transformOrigin: "center",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-saira)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontSize: "1.1rem",
                    color: CREAM,
                    opacity: isActive ? 0 : 1,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  {faq.label}
                </span>

                {/* Contenu (carte déployée) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.4s ease 0.15s",
                    pointerEvents: "none",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-saira)",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      color: CREAM,
                      fontSize: "1.6rem",
                      lineHeight: 1.05,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {faq.question}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-courier)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: CREAM,
                      opacity: 0.9,
                      marginTop: 14,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

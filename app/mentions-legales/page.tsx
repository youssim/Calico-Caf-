"use client";

import FooterSection from "@/components/FooterSection";

const CREAM = "#f2ede3";
const INK = "#1a1a1a";
const GREEN = "#4a6741";

type Section = { n: string; title: string; body: React.ReactNode };

const p: React.CSSProperties = { marginBottom: 12 };

// ⚠️ PLACEHOLDERS [à compléter] — infos légales fournies par le café.
const SECTIONS: Section[] = [
  {
    n: "1",
    title: "Éditeur du site",
    body: (
      <>
        <p style={p}>
          Le présent site est édité par <strong>Calico Café</strong>, SAS (société par
          actions simplifiée) au capital de <strong>21&nbsp;000&nbsp;€</strong>,
          immatriculée au RCS de Lille Métropole sous le numéro <strong>941&nbsp;826&nbsp;729</strong>{" "}
          (SIRET du siège : 941&nbsp;826&nbsp;729&nbsp;00019).
        </p>
        <p style={p}>N° TVA intracommunautaire : FR82&nbsp;941&nbsp;826&nbsp;729.</p>
        <p style={p}>Siège social : 25 Boulevard Carnot, 59800 Lille, France.</p>
        <p style={p}>Directrice de la publication : <strong>Aikerim Amabile</strong> (directrice générale).</p>
        <p style={p}>Contact : <strong>[email — à compléter]</strong>.</p>
      </>
    ),
  },
  {
    n: "2",
    title: "Hébergement",
    body: (
      <>
        <p style={p}>Le site est hébergé par :</p>
        <p style={p}>
          <strong>Vercel Inc.</strong>
          <br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
          <br />
          vercel.com
        </p>
        <p style={{ ...p, opacity: 0.6 }}>(à adapter si le site est hébergé ailleurs.)</p>
      </>
    ),
  },
  {
    n: "3",
    title: "Activité du site",
    body: (
      <p style={p}>
        Site vitrine présentant l'activité de Calico — café de spécialité et brunch
        à Lille. Aucune vente en ligne ni activité réglementée.
      </p>
    ),
  },
  {
    n: "4",
    title: "Propriété intellectuelle",
    body: (
      <>
        <p style={p}>
          L'ensemble des contenus présents sur ce site (textes, images, photos,
          illustrations, logo, mise en page) est la propriété exclusive de Calico,
          sauf mention contraire.
        </p>
        <p style={p}>
          Toute reproduction, représentation ou réutilisation, totale ou partielle,
          sans autorisation écrite préalable, est interdite.
        </p>
      </>
    ),
  },
  {
    n: "5",
    title: "Cookies & traceurs",
    body: (
      <p style={p}>
        Ce site ne dépose aucun cookie de suivi ou publicitaire, et n'utilise pas
        d'outil de profilage. Aucun consentement préalable n'est donc requis.
      </p>
    ),
  },
  {
    n: "6",
    title: "Données personnelles (RGPD)",
    body: (
      <>
        <p style={p}>
          Les données saisies via le formulaire de contact (nom, email, message)
          servent uniquement à répondre à votre demande. Elles ne sont ni cédées,
          ni vendues à des tiers, et conservées au maximum 1 an.
        </p>
        <p style={p}>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification
          et de suppression de vos données : <strong>[email — à compléter]</strong>.
        </p>
        <p style={p}>
          En cas de litige, vous pouvez saisir la CNIL : www.cnil.fr.
        </p>
      </>
    ),
  },
  {
    n: "7",
    title: "Création du site",
    body: (
      <p style={p}>
        Conception &amp; développement : site réalisé sur mesure.
      </p>
    ),
  },
];

export default function MentionsLegales() {
  // Retour = revenir exactement où on était (le footer d'où on a cliqué), via le
  // vrai « précédent » du navigateur (bfcache) → identique à la flèche Safari.
  // Fallback accueil si on a ouvert la page directement (pas d'historique).
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  return (
    <main style={{ background: CREAM, color: INK }}>
      {/* En-tête simple : logo → retour (position précédente) */}
      <header style={{ padding: "clamp(24px, 4vw, 48px) clamp(24px, 5vw, 80px)" }}>
        <button onClick={goBack} aria-label="Retour" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/calico-logo.png" alt="Calico" style={{ height: 56, width: "auto", display: "block" }} />
        </button>
      </header>

      <div style={{ width: "min(900px, 90vw)", margin: "0 auto", padding: "0 0 clamp(60px, 10vh, 120px)" }}>
        <button
          onClick={goBack}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: "var(--font-courier)", fontSize: 13, letterSpacing: "0.1em",
            textTransform: "uppercase", color: GREEN,
            borderBottom: `1px solid ${GREEN}55`, paddingBottom: 2,
          }}
        >
          ← Retour
        </button>

        <h1
          style={{
            fontFamily: "var(--font-saira)", fontWeight: 900, textTransform: "uppercase",
            fontSize: "clamp(2.6rem, 7vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em",
            margin: "clamp(24px, 4vh, 48px) 0 clamp(40px, 7vh, 80px)",
          }}
        >
          Mentions
          <br />
          légales
        </h1>

        {SECTIONS.map((s) => (
          <section
            key={s.n}
            id={s.n === "6" ? "confidentialite" : undefined}
            style={{ marginBottom: "clamp(40px, 6vh, 64px)", scrollMarginTop: "24px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-saira)", fontWeight: 900, textTransform: "uppercase",
                fontSize: "clamp(1.5rem, 3vw, 2.4rem)", lineHeight: 1, letterSpacing: "-0.01em",
                marginBottom: 18,
              }}
            >
              {s.n}. {s.title}
            </h2>
            <div
              style={{
                fontFamily: "var(--font-courier)", fontSize: "1.02rem", lineHeight: 1.75,
                maxWidth: 720,
              }}
            >
              {s.body}
            </div>
          </section>
        ))}
      </div>

      <FooterSection />
    </main>
  );
}

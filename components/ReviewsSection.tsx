"use client";

const CREAM = "#f2ede3";
const INK = "#1a1a1a";
const GREEN = "#4a6741";
const TERRA = "#d45a30";

// Lien vers tous les avis Google (fiche Calico)
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Calico+Caf%C3%A9/@50.6386484,3.0653636,17z/data=!4m8!3m7!1s0x47c2d58825015205:0x22c201e474f915c7!8m2!3d50.6386484!4d3.0653636!9m1!1b1!16s%2Fg%2F11vsnwg3b8?entry=ttu";

// ─── Avis Google réels de Calico ───
type Review = { name: string; meta: string; when: string; text: string };

const REVIEWS: Review[] = [
  {
    name: "Nicolas Karayannis",
    meta: "Local Guide · 50 avis",
    when: "il y a 4 mois",
    text:
      "Calico coche toutes les cases. L'endroit est lumineux, chaleureux, avec une vraie identité. Le café est excellent — cappuccino parfaitement exécuté, latte art soigné. On y va pour le café, on reste pour l'atmosphère.",
  },
  {
    name: "Bald Whale",
    meta: "Local Guide · 34 avis",
    when: "il y a 4 mois",
    text:
      "Un café que j'affectionne tout particulièrement. Les trois personnes qui l'ont ouvert sont des passionnés, et ça se ressent. La carte change régulièrement, toujours créative, originale et délicieuse. Allez-y les yeux fermés ✨",
  },
  {
    name: "Valentine Lemor",
    meta: "6 avis",
    when: "il y a 5 mois",
    text:
      "Le meilleur brunch de Lille ! Rapport qualité-prix imbattable. Personnel trop agréable et gentil, c'est un vrai plaisir d'y retourner encore et encore. Je vous conseille les turkish eggs et leurs cinnamon rolls, incroyables !",
  },
  {
    name: "Théo",
    meta: "Local Guide · 15 avis",
    when: "il y a 5 mois",
    text:
      "J'apprécie beaucoup cet endroit pour un brunch. L'ambiance est agréable et le cadre soigné. Le personnel est vraiment super : accueillant et souriant. Après plusieurs passages, une adresse fiable pour un brunch !",
  },
  {
    name: "Nina Simon",
    meta: "6 avis",
    when: "il y a 2 mois",
    text:
      "Accueil chaleureux, cadre très agréable et soigné, produits frais, une carte qui donne envie de tout goûter !!! Quel plaisir d'avoir découvert votre établissement !",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 2 }} aria-label="5 étoiles sur 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={TERRA} aria-hidden>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export default function ReviewsSection() {
  return (
    <section
      id="avis"
      style={{ background: CREAM, padding: "clamp(80px, 12vh, 140px) 0" }}
    >
      <div style={{ width: "min(1200px, 92vw)", margin: "0 auto" }}>
        {/* ── En-tête ── */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vh, 72px)" }}>
          <span
            style={{
              fontFamily: "var(--font-courier)",
              fontSize: 14,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: GREEN,
            }}
          >
            Ils en parlent
          </span>
          <h2
            style={{
              fontFamily: "var(--font-saira)",
              fontWeight: 900,
              color: INK,
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginTop: 14,
              textTransform: "uppercase",
            }}
          >
            Ce qu'on dit
            <br />
            de Calico.
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 22,
              fontFamily: "var(--font-courier)",
              fontSize: 14,
              color: INK,
              opacity: 0.8,
            }}
          >
            <Stars />
            <span>5,0 sur Google</span>
          </div>
        </div>

        {/* ── Cartes (masonry par colonnes) ── */}
        <div
          style={{
            columnGap: 20,
            columnWidth: "clamp(280px, 30vw, 360px)",
          }}
        >
          {REVIEWS.map((r) => (
            <article
              key={r.name}
              style={{
                breakInside: "avoid",
                marginBottom: 20,
                background: "#fffdf8",
                border: `1.5px solid ${INK}`,
                borderRadius: 22,
                padding: "26px 26px 22px",
                display: "inline-block",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Stars />
                {/* logo Google "G" */}
                <svg width="18" height="18" viewBox="0 0 48 48" aria-label="Google" role="img">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                  <path fill="#FBBC05" d="M11.69 28.18A13.6 13.6 0 0 1 10.97 24c0-1.45.25-2.86.72-4.18v-5.7H4.34A21.98 21.98 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
                </svg>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-courier)",
                  fontSize: "0.98rem",
                  lineHeight: 1.65,
                  color: INK,
                  margin: 0,
                }}
              >
                {r.text}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 20,
                  paddingTop: 18,
                  borderTop: `1px solid ${INK}22`,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: GREEN,
                    color: CREAM,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-saira)",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                  }}
                >
                  {initial(r.name)}
                </div>
                <div style={{ lineHeight: 1.3 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-saira)",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      fontSize: "0.95rem",
                      color: INK,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-courier)",
                      fontSize: 12,
                      color: INK,
                      opacity: 0.55,
                    }}
                  >
                    {r.meta} · {r.when}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Lien vers tous les avis ── */}
        <div style={{ textAlign: "center", marginTop: "clamp(32px, 5vh, 56px)" }}>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: INK,
              color: CREAM,
              fontFamily: "var(--font-courier)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "16px 34px",
              borderRadius: 50,
              textDecoration: "none",
            }}
          >
            Voir tous les avis sur Google
          </a>
        </div>
      </div>
    </section>
  );
}

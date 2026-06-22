"use client";

const CREAM = "#f2ede3";
const INK = "#1a1a1a";
const GREEN = "#4a6741";

// Lien vers tous les avis Google (fiche Calico)
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Calico+Caf%C3%A9/@50.6386484,3.0653636,17z/data=!4m8!3m7!1s0x47c2d58825015205:0x22c201e474f915c7!8m2!3d50.6386484!4d3.0653636!9m1!1b1!16s%2Fg%2F11vsnwg3b8?entry=ttu";

// ─── Avis Google réels de Calico ───
// Le "title" est une phrase forte tirée des propres mots du client (authentique).
type Review = { name: string; stars: number; when: string; title: string; text: string };

const REVIEWS: Review[] = [
  {
    name: "Nicolas K.",
    stars: 5,
    when: "il y a 4 mois",
    title: "On y va pour le café, on reste pour l'atmosphère",
    text:
      "Calico coche toutes les cases. L'endroit est lumineux, chaleureux, avec une vraie identité. Le café est excellent — cappuccino parfaitement exécuté, latte art soigné. Une adresse solide à Lille.",
  },
  {
    name: "Bald Whale",
    stars: 5,
    when: "il y a 4 mois",
    title: "Allez-y les yeux fermés",
    text:
      "Un café que j'affectionne tout particulièrement. Les trois personnes qui l'ont ouvert sont des passionnés, et ça se ressent. La carte change régulièrement, toujours créative, originale et délicieuse.",
  },
  {
    name: "Valentine L.",
    stars: 5,
    when: "il y a 5 mois",
    title: "Le meilleur brunch de Lille",
    text:
      "Rapport qualité-prix imbattable. Personnel trop agréable et gentil, c'est un vrai plaisir d'y retourner encore et encore. Je vous conseille les turkish eggs et leurs cinnamon rolls, incroyables !",
  },
  {
    name: "Théo",
    stars: 5,
    when: "il y a 5 mois",
    title: "Une adresse fiable pour un brunch",
    text:
      "L'ambiance est agréable et le cadre soigné, parfait pour un moment convivial. Le personnel est vraiment super : accueillant et souriant. À chaque visite, tout est frais et savoureux.",
  },
  {
    name: "Nina S.",
    stars: 5,
    when: "il y a 2 mois",
    title: "Une carte qui donne envie de tout goûter",
    text:
      "Accueil chaleureux, cadre très agréable et soigné, produits frais. Quel plaisir d'avoir découvert votre établissement !",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }} aria-label={`${n} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < n ? GREEN : "none"} stroke={GREEN} strokeWidth={i < n ? 0 : 1.5} aria-hidden>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsSection() {
  return (
    <section id="avis" style={{ background: CREAM, padding: "clamp(80px, 12vh, 150px) 0" }}>
      <div
        style={{
          width: "min(1200px, 92vw)",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(40px, 6vw, 90px)",
          alignItems: "flex-start",
        }}
      >
        {/* ── Gauche : grand titre (sticky sur desktop) ── */}
        <div style={{ flex: "1 1 320px", minWidth: 280, position: "sticky", top: "12vh" }}>
          <span
            style={{
              fontFamily: "var(--font-courier)",
              fontSize: 13,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: GREEN,
            }}
          >
            Avis Google
          </span>
          <h2
            style={{
              fontFamily: "var(--font-saira)",
              fontWeight: 900,
              color: INK,
              fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              marginTop: 16,
              textTransform: "uppercase",
            }}
          >
            Ils en
            <br />
            parlent
            <br />
            mieux
            <br />
            que nous
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 26,
              fontFamily: "var(--font-courier)",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: INK,
              opacity: 0.75,
            }}
          >
            <Stars n={5} />
            <span>5,0 sur Google</span>
          </div>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: 32,
              background: INK,
              color: CREAM,
              fontFamily: "var(--font-courier)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "15px 32px",
              borderRadius: 50,
              textDecoration: "none",
            }}
          >
            Voir tous les avis
          </a>
        </div>

        {/* ── Droite : liste des avis ── */}
        <div style={{ flex: "1 1 520px", minWidth: 300 }}>
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              style={{
                paddingBottom: "clamp(28px, 4vh, 40px)",
                marginBottom: "clamp(28px, 4vh, 40px)",
                borderBottom: i < REVIEWS.length - 1 ? `1px solid ${INK}33` : "none",
              }}
            >
              {/* ligne méta : étoiles · date · nom */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: "var(--font-courier)",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: INK,
                  opacity: 0.7,
                }}
              >
                <Stars n={r.stars} />
                <span>{r.when}</span>
                <span style={{ fontWeight: 700, opacity: 1 }}>· {r.name}</span>
              </div>

              {/* titre de l'avis */}
              <h3
                style={{
                  fontFamily: "var(--font-saira)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  color: INK,
                  fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  margin: "14px 0 12px",
                }}
              >
                {r.title}
              </h3>

              {/* corps de l'avis */}
              <p
                style={{
                  fontFamily: "var(--font-courier)",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: INK,
                  opacity: 0.85,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

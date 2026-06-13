"use client";

// Fiche Google Business de Calico (CID 2504566423498069447, extrait de l'URL Maps).
// Ouvre directement la fiche où le bouton "Laisser un avis" est accessible.
const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/place/?cid=2504566423498069447";

export default function ReviewButton() {
  return (
    <>
      <a
        className="review-fab"
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Laisser un avis sur Google"
      >
        <span className="review-fab__icon" aria-hidden>
          {/* étoile dessinée */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#f2ede3">
            <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
          </svg>
        </span>
        <span className="review-fab__label">Laisser un avis</span>
      </a>

      <style>{`
        .review-fab {
          position: fixed;
          right: 1.5rem;
          bottom: 1.5rem;
          z-index: 60;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          height: 52px;
          padding: 0 1.4rem 0 1.1rem;
          background: #4a6741;
          color: #f2ede3;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(26,26,26,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .review-fab__icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .review-fab__label {
          font-family: var(--font-courier);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        @media (hover: hover) {
          .review-fab:hover {
            transform: translateY(-2px);
            box-shadow: 0 9px 26px rgba(26,26,26,0.3);
          }
        }
      `}</style>
    </>
  );
}

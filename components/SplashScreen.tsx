"use client";

import { useEffect, useRef, useState } from "react";

const CREAM = "#f2ede3";

// Affiché une fois par session : intro vidéo "CALICO COFFEE DEALER" (logo brush
// animé, noir sur blanc) centrée sur fond crème. mix-blend-mode:multiply fait
// disparaître le blanc de la vidéo dans le crème → seul le logo noir reste, sans
// aucun rectangle visible. Après lecture (~3 s) → fondu vers le hero.
export default function SplashScreen() {
  const [show, setShow] = useState(false);   // monté ?
  const [fading, setFading] = useState(false); // en train de disparaître ?
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // accessibilité : si l'utilisateur réduit les animations, on saute l'intro
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // affiché à CHAQUE chargement/rafraîchissement de la page
    setShow(true);
    // bloque le scroll pendant l'intro
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // lecture pilotée par un timer calé sur la durée de la vidéo (~3,04 s) plutôt
    // que sur l'event onEnded (peu fiable selon les navigateurs) → fermeture
    // déterministe juste après la fin du logo.
    const VIDEO_MS = 3050;
    const close = setTimeout(() => finish(), VIDEO_MS);
    return () => clearTimeout(close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lance la lecture dès que la vidéo est montée (fiabilité Safari/iOS)
  useEffect(() => {
    if (show) videoRef.current?.play().catch(() => {});
  }, [show]);

  const finish = () => {
    setFading(true);
    document.body.style.overflow = "";
    // laisse le temps au fondu (600 ms) avant de démonter
    setTimeout(() => setShow(false), 650);
  };

  if (!show) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: CREAM,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        src="/splash-calico.mp4?v=2"
        autoPlay
        muted
        playsInline
        preload="auto"
        style={{
          width: "min(60vw, 620px)",
          height: "auto",
          // `darken` = min(vidéo, crème) par pixel : tout ce qui est plus clair que le
          // crème (fond blanc + bandes de compression) devient EXACTEMENT crème → plus
          // aucun rectangle visible ; seul le noir du logo (plus foncé) ressort.
          mixBlendMode: "darken",
        }}
      />
    </div>
  );
}

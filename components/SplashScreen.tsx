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
    const v = videoRef.current;
    // cible = logo CALICO de la navbar (dans le hero, sous le splash)
    const navLogo = document.querySelector("nav img") as HTMLElement | null;
    if (v && navLogo) {
      const vr = v.getBoundingClientRect();
      const tr = navLogo.getBoundingClientRect();
      const scale = tr.height / vr.height;
      const tx = tr.left + tr.width / 2 - (vr.left + vr.width / 2);
      const ty = tr.top + tr.height / 2 - (vr.top + vr.height / 2);
      // le logo file vers la navbar en rétrécissant
      v.style.transition = "transform 0.7s cubic-bezier(0.7, 0, 0.25, 1)";
      v.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    document.body.style.overflow = "";
    // une fois le logo (presque) arrivé, le crème se lève pour révéler le hero
    setTimeout(() => setFading(true), 520);
    setTimeout(() => setShow(false), 900);
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
        transition: "opacity 0.38s ease",
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
          width: "min(44vw, 460px)",
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

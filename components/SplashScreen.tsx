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
  const calicoRef = useRef<HTMLImageElement>(null); // logo CALICO seul (docking navbar)

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
    const cal = calicoRef.current;
    // cible = logo CALICO de la navbar (dans le hero, sous le splash)
    const navLogo = document.querySelector("nav img") as HTMLElement | null;
    if (v && cal && navLogo) {
      // 1) crossfade : le lockup vidéo (CALICO COFFEE DEALER) s'efface, le logo
      //    CALICO seul (même image que la navbar) apparaît à sa place.
      v.style.transition = "opacity 0.3s ease";
      v.style.opacity = "0";

      const cr = cal.getBoundingClientRect();
      const tr = navLogo.getBoundingClientRect();
      const scale = tr.height / cr.height;
      const tx = tr.left + tr.width / 2 - (cr.left + cr.width / 2);
      const ty = tr.top + tr.height / 2 - (cr.top + cr.height / 2);
      // 2) "CALICO" continue sa route et vient se caler PILE dans la navbar
      //    (même image → match parfait, le logo du splash devient celui du site).
      cal.style.transition =
        "opacity 0.3s ease, transform 0.8s cubic-bezier(0.7, 0, 0.2, 1)";
      cal.style.opacity = "1";
      cal.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
    }
    document.body.style.overflow = "";
    // le crème se lève une fois CALICO arrivé dans la navbar → handoff invisible
    setTimeout(() => setFading(true), 700);
    setTimeout(() => setShow(false), 1050);
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
      {/* Logo CALICO seul (= image de la navbar) : invisible pendant l'intro, il
          apparaît en crossfade à la fin et file se caler dans la navbar. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={calicoRef}
        src="/calico-logo.png"
        alt=""
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(34vw, 360px)",
          height: "auto",
          opacity: 0,
        }}
      />
    </div>
  );
}

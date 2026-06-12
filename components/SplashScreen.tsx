"use client";

import { useEffect, useRef, useState } from "react";

const CREAM = "#f2ede3";

// Animation de sortie du splash : "curtain" (le panneau crème monte et révèle le
// hero) ou "dock" (le logo CALICO file se caler dans la navbar). On bascule ici.
const EXIT_MODE: "curtain" | "dock" = "dock";

// Affiché une fois par session : intro vidéo "CALICO COFFEE DEALER" (logo brush
// animé, noir sur blanc) centrée sur fond crème. mix-blend-mode:multiply fait
// disparaître le blanc de la vidéo dans le crème → seul le logo noir reste, sans
// aucun rectangle visible. Après lecture (~3 s) → fondu vers le hero.
export default function SplashScreen() {
  const [show, setShow] = useState(false);   // monté ?
  const [fading, setFading] = useState(false); // en train de disparaître ? (mode dock)
  const [exiting, setExiting] = useState(false); // rideau qui monte (mode curtain)
  const videoRef = useRef<HTMLVideoElement>(null);
  const calicoRef = useRef<HTMLImageElement>(null); // logo CALICO seul (docking navbar)

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // ── Retour depuis une autre page (mentions légales) : on restaure la position
    //    mémorisée (le footer) au lieu de rejouer l'intro / revenir au hero. La
    //    PRÉSENCE de la position sauvegardée (posée uniquement au clic du lien footer)
    //    suffit à savoir qu'on revient — pas besoin de se fier au type de navigation
    //    (peu fiable selon les navigateurs). Couvre le cas RECHARGEMENT ; le cas
    //    bfcache (Safari) est géré par le listener `pageshow` plus bas. ──
    const returnY = sessionStorage.getItem("calico-return-y");
    if (returnY != null) {
      sessionStorage.removeItem("calico-return-y");
      const y = parseInt(returnY, 10) || 0;
      const restore = () => window.scrollTo(0, y);
      restore();
      requestAnimationFrame(() => { restore(); requestAnimationFrame(restore); });
      const t1 = setTimeout(restore, 250);
      const t2 = setTimeout(restore, 600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    // accessibilité : si l'utilisateur réduit les animations, on saute l'intro (hero en haut)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { window.scrollTo(0, 0); return; }

    // intro normale (à chaque chargement/rafraîchissement) : hero en haut, on joue
    setShow(true);
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // lecture pilotée par un timer calé sur la durée de la vidéo (~3,04 s) plutôt
    // que sur l'event onEnded (peu fiable selon les navigateurs).
    const VIDEO_MS = 3050;
    const close = setTimeout(() => finish(), VIDEO_MS);
    return () => clearTimeout(close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lance la lecture dès que la vidéo est montée (fiabilité Safari/iOS)
  useEffect(() => {
    if (show) videoRef.current?.play().catch(() => {});
  }, [show]);

  // ── Retour via le bfcache (Safari surtout) : la page est restaurée GELÉE, les
  //    useEffect ne se relancent pas. `pageshow` avec persisted=true détecte ce cas.
  //    Si une position de retour est mémorisée (clic mentions légales), on y revient. ──
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return; // seulement restauration bfcache
      const y = sessionStorage.getItem("calico-return-y");
      if (y == null) return;
      sessionStorage.removeItem("calico-return-y");
      const yy = parseInt(y, 10) || 0;
      window.scrollTo(0, yy);
      requestAnimationFrame(() => window.scrollTo(0, yy));
      setTimeout(() => window.scrollTo(0, yy), 200);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const finish = () => {
    // Refresh → on revient TOUJOURS au hero : on force le haut de page pendant que
    // le crème couvre encore (le navigateur a pu restaurer le scroll précédent vu
    // que Next remet scrollRestoration sur "auto"). Le retour des mentions légales,
    // lui, passe par history.back()/bfcache et NE rejoue PAS le splash → position
    // conservée, donc ce scrollTo ne le concerne pas.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // ── Mode "rideau vers le haut" : le panneau crème (avec le logo) glisse hors
    //    de l'écran par le haut → révèle le hero en dessous. ──
    if (EXIT_MODE === "curtain") {
      document.body.style.overflow = "";
      setExiting(true);
      setTimeout(() => setShow(false), 760);
      return;
    }

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
        transform: exiting ? "translateY(-100%)" : "none",
        transition: "opacity 0.38s ease, transform 0.72s cubic-bezier(0.76, 0, 0.24, 1)",
        pointerEvents: fading || exiting ? "none" : "auto",
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

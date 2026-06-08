"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MenuCarousel from "./MenuCarousel";

gsap.registerPlugin(ScrollTrigger);

// 544 * 1.4 ≈ 762px
const H = 762;
const PEEK_VISIBLE = 410;
const TILT = 15;
const HERO_X = 240;

const GREEN = "#4a6741";
const LATTE = "#c9b99a";

type Panel = {
  // 2 brushstrokes fins + variés ; le B "boucle" (feeling circulaire)
  shapeA: { d: string; color: string; w: number };
  shapeB: { d: string; color: string; w: number };
  card: { src: string; pos: React.CSSProperties; rot: number };
  text: { side: "left" | "right"; line1: string; line2: string };
};

const PANELS: Panel[] = [
  {
    // S-curve fluide (latte) + petite boucle qui revient (vert)
    shapeA: { d: "M-120,360 C 360,170 430,640 820,540 C 1180,450 1230,300 1620,620", color: LATTE, w: 72 },
    shapeB: { d: "M1500,740 C 1300,700 1230,800 1320,690 C 1390,610 1230,610 1160,710", color: GREEN, w: 46 },
    card: { src: "/about/carte-1.png", pos: { left: "7vw", bottom: "10vh" }, rot: -4 },
    text: { side: "right", line1: "Chiens bienvenus.", line2: "Humains tolérés." },
  },
  {
    // grand arc circulaire (vert) — continuité depuis le bas-droit du panneau 1
    shapeA: { d: "M-120,640 C 250,210 1190,210 1620,640", color: GREEN, w: 72 },
    shapeB: { d: "M1480,300 C 1250,270 1150,400 1290,450 C 1400,490 1300,320 1170,350", color: LATTE, w: 46 },
    card: { src: "/about/carte-2.png", pos: { right: "7vw", bottom: "10vh" }, rot: 3 },
    text: { side: "left", line1: "Mais d'abord,", line2: "le café." },
  },
];

export default function AboutSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const cup1Ref      = useRef<HTMLImageElement>(null);
  const panelRefs    = useRef<(HTMLElement | null)[]>([]);
  const cardRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const landingRef   = useRef<HTMLElement>(null);
  const cupWrapRef   = useRef<HTMLDivElement>(null);
  const cupDrawnRef  = useRef<HTMLImageElement>(null);
  // asset du gobelet dessiné — change selon la catégorie active du carrousel
  const DRAWN_DEFAULT = "/carousel/gobelet-dessin.png?v=2";
  const [drawnSrc, setDrawnSrc] = useState(DRAWN_DEFAULT);
  // src + décalage Y par asset → toutes les "lignes de table" alignées (même surface)
  const ASSETS: Record<string, { src: string; offsetY: number }> = {
    "White Coffee": { src: "/carousel/white-coffee.png", offsetY: 84 },
    "Cold Drinks":  { src: "/carousel/cold-drinks.png?v=1", offsetY: -4 },
    "Cocktail":     { src: "/carousel/cocktail.png", offsetY: -158 },
  };

  useEffect(() => {
    gsap.killTweensOf(cup1Ref.current);

    const ctx = gsap.context(() => {
      const peekY = () => window.innerHeight / 2 + H / 2 - PEEK_VISIBLE;

      /* ── GOBELET (seul) — animation de rotation INCHANGÉE, juste retimée
            pour finir droit pile à la zone d'atterrissage ── */
      gsap.set(cup1Ref.current, { xPercent: -50, yPercent: -50, x: HERO_X, y: peekY(), rotation: TILT, opacity: 1 });
      // Gobelet DESSINÉ : superposé au centre (état final du vrai gobelet), caché au départ
      gsap.set(cupDrawnRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          // fin = quand la page noire arrive en haut (= début du pin) → le gobelet
          // est droit PILE quand la page noire se cale, puis reste tel quel.
          endTrigger: landingRef.current,
          end: "top top",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      // ROTATION : vitesse CONSTANTE sur tout le parcours (TILT → 360), ease none.
      // → même sensation de spin du début (décalé/hero) jusqu'au centre, plus de
      //   coup d'accélération au démarrage.
      tl.to(cup1Ref.current, { rotation: 360, ease: "none", duration: 1.0 }, 0);
      // GLISSE : du coin (hero, décalé à droite, en bas) vers le centre, avec un
      // ease doux (power2.out) → sensation d'être guidé élégamment vers le centre.
      tl.to(cup1Ref.current, { x: 0, y: 0, ease: "power2.out", duration: 0.34 }, 0);
      // Le gobelet finit DROIT (360) pile quand la page noire se cale (endTrigger).

      /* ── Cartes + titres : chaque panneau déclenche son anim ── */
      PANELS.forEach((panel, i) => {
        const card = cardRefs.current[i];
        const text = textRefs.current[i];
        const finalRot = panel.card.rot;
        gsap.set(card, { y: -250, opacity: 0, rotation: finalRot + 8 });
        gsap.set(text, { opacity: 0, y: 20 });
        const ptl = gsap.timeline({
          scrollTrigger: { trigger: panelRefs.current[i], start: "top 60%" },
        });
        ptl.to(card, { y: 0, opacity: 1, rotation: finalRot, duration: 0.9, ease: "back.out(1.5)" }, 0);
        ptl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3);
      });

      /* ── PAUSE + CARROUSEL : la page noire (= le carrousel menu) est STICKY
            l'espace d'1 scroll. Le gobelet reste figé centré dessus pendant qu'on
            navigue le menu au clic (flèches/toggle). À la toute fin, le gobelet
            s'efface (fondu, il ne bouge pas) en laissant la place au menu suivant. ── */
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: landingRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: true,
        },
      });
      pinTl.to({}, { duration: 0.9 }); // page tenue → navigation carrousel au clic
      pinTl.to(cupWrapRef.current, { opacity: 0, ease: "power1.in", duration: 0.1 });

      /* ── NAVBAR : disparaît quand le carrousel est en vue (le toggle
            À boire/À manger la remplace), réapparaît en remontant. toggleClass
            gère le sens automatiquement ; la classe CSS .nav-hidden (!important)
            l'emporte sur l'opacité inline de framer-motion. ── */
      const navEls = [document.querySelector("nav"), document.querySelector(".nav-cta")].filter(Boolean) as Element[];
      ScrollTrigger.create({
        trigger: landingRef.current,
        start: "top 70%",
        end: "bottom top",
        toggleClass: { targets: navEls, className: "nav-hidden" },
      });

      /* ── CROSSFADE : à l'atterrissage (gobelet centré droit), le vrai gobelet
            se fond vers le gobelet DESSINÉ (même position/taille/centre).
            En remontant, inverse → le vrai gobelet revient et reprend le SPINLAND. ── */
      ScrollTrigger.create({
        trigger: landingRef.current,
        start: "top top",
        onEnter: () => {
          gsap.to(cup1Ref.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
          gsap.to(cupDrawnRef.current, { opacity: 1, duration: 0.6, ease: "power2.inOut" });
        },
        onLeaveBack: () => {
          gsap.to(cupDrawnRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
          gsap.to(cup1Ref.current, { opacity: 1, duration: 0.6, ease: "power2.inOut" });
        },
      });
    }, sectionRef);

    return () => { ctx.revert(); };
  }, []);

  return (
    <div ref={sectionRef} id="a-propos" style={{ background: "#f2ede3" }}>
      {/* ════════ FOND : 2 panneaux plein écran (le gobelet flotte au-dessus) ════════ */}
      {PANELS.map((panel, i) => (
        <section
          key={i}
          ref={(el) => { panelRefs.current[i] = el; }}
          style={{ position: "relative", width: "100%", height: "100vh", background: "#f2ede3", overflow: "hidden" }}
        >
          {/* 2 brushstrokes (z-index 0) */}
          <svg viewBox="0 0 1440 900" preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
            <path d={panel.shapeA.d} fill="none" stroke={panel.shapeA.color}
              strokeWidth={panel.shapeA.w} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={panel.shapeB.d} fill="none" stroke={panel.shapeB.color}
              strokeWidth={panel.shapeB.w} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Carte poster détourée (z-index 2) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={(el) => { cardRefs.current[i] = el; }} src={panel.card.src} alt=""
            style={{ position: "absolute", width: 300, height: "auto", zIndex: 2, ...panel.card.pos }} />

          {/* Titre punchline (z-index 2) */}
          <div ref={(el) => { textRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [panel.text.side]: "clamp(40px, 7vw, 130px)",
              maxWidth: "min(44vw, 540px)",
              zIndex: 2,
              fontFamily: "var(--font-saira)",
              fontWeight: 900,
              color: "#1a1a1a",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 0.92,
            } as React.CSSProperties}>
            <div>{panel.text.line1}</div>
            <div>{panel.text.line2}</div>
          </div>
        </section>
      ))}

      {/* ════════ ATTERRISSAGE NOIR (pinned 100vh = scroll-lock).
            La courbe Taru Bali ci-dessous "dripse" du crème vers le noir au top. ════════ */}
      <section ref={landingRef} style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#1a1a1a",
        margin: 0,
        overflow: "hidden",
      }}>
        {/* Carrousel menu (state-driven, navigation au clic). Le gobelet fixed
            flotte au-dessus (z 11), pointer-events none → les clics passent. */}
        <MenuCarousel onCategoryChange={(name) => {
          const a = ASSETS[name];
          setDrawnSrc(a?.src || DRAWN_DEFAULT);
          gsap.set(cupDrawnRef.current, { y: a?.offsetY ?? 0 });
        }} />
      </section>

      {/* ════════ GOBELET — wrapper fixed plein écran (z 11). Le wrapper gère la
            SORTIE (translate avec la page noire) ; l'img gère le spin/montée. ════════ */}
      <div ref={cupWrapRef} style={{ position: "fixed", inset: 0, zIndex: 11, pointerEvents: "none",
        transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cup1Ref} src="/goblet1.png?v=2" alt="Black Coffee"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden" }} />
        {/* Gobelet DESSINÉ (carrousel) — même position/taille, crossfade au landing */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cupDrawnRef} src={drawnSrc} alt=""
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden", filter: "brightness(0) invert(1)" }} />
      </div>
    </div>
  );
}

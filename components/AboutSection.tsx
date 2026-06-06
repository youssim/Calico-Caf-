"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const arcPathRef   = useRef<SVGPathElement>(null);
  const arcSvgRef    = useRef<SVGSVGElement>(null);
  const landingRef   = useRef<HTMLElement>(null);
  const cupWrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.killTweensOf(cup1Ref.current);

    const ctx = gsap.context(() => {
      const peekY = () => window.innerHeight / 2 + H / 2 - PEEK_VISIBLE;

      /* ── GOBELET (seul) — animation de rotation INCHANGÉE, juste retimée
            pour finir droit pile à la zone d'atterrissage ── */
      gsap.set(cup1Ref.current, { xPercent: -50, yPercent: -50, x: HERO_X, y: peekY(), rotation: TILT, opacity: 1 });

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
      // p0→0.20 : monte au centre + amorce la rotation
      tl.to(cup1Ref.current, { x: 0, y: 0, rotation: 187, ease: "none", duration: 0.20 }, 0);
      // p0.20→1.0 : termine son tour → DROIT (360) pile à la fin du pin landing.
      // Le master ScrollTrigger end="bottom bottom" inclut désormais le pin
      // (pinSpacing) donc l'instant t=1 = sortie du pin = arc plat. Synchro auto.
      tl.to(cup1Ref.current, { rotation: 360, ease: "none", duration: 0.80 }, 0.20);
      // Pas de fade : le gobelet RESTE FIGÉ à center, rotation 360 (=0deg),
      // position:fixed naturel — aucun mouvement supplémentaire.

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

      /* ── COURBE TARU BALI (bande 200px, noir-rempli, courbe plus ovale).
            Path morph : "M0,0 Q720,200 1440,0 L1440,200 L0,200 Z" (courbé profond)
                       → "M0,0 Q720,0   1440,0 L1440,200 L0,200 Z" (plat). ── */
      const renderArc = (p: number) => {
        const path = arcPathRef.current;
        if (!path) return;
        const cy = 200 * (1 - p); // control point y : 200 → 0
        path.setAttribute("d", `M0,0 Q720,${cy} 1440,0 L1440,200 L0,200 Z`);
      };
      renderArc(0);
      const arcProxy = { p: 0 };
      gsap.to(arcProxy, {
        p: 1, ease: "none",
        scrollTrigger: {
          trigger: landingRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 0.7,
        },
        onUpdate: () => renderArc(arcProxy.p),
      });

      /* ── SORTIE : le gobelet repart AVEC la page noire. Tant que la page noire
            remplit l'écran → gobelet centré droit. Dès qu'on continue à scroller,
            la page noire défile vers le haut et le gobelet monte EXACTEMENT à la
            même vitesse (collé à elle) → il sort par le haut avec elle et ne reste
            JAMAIS par-dessus menu/FAQ/infos. On translate le WRAPPER. ── */
      gsap.fromTo(cupWrapRef.current,
        { y: 0 },
        {
          y: () => -window.innerHeight,
          ease: "none",
          scrollTrigger: {
            trigger: landingRef.current,
            start: "top top",     // page noire plein écran (gobelet centré)
            end: "bottom top",    // page noire entièrement sortie par le haut
            scrub: true,
          },
        }
      );
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
      }}>
        {/* Courbe Taru Bali : bande NOIRE (#1a1a1a) de 120px collée en haut du noir,
            son bord supérieur dipse dans le crème puis se redresse. */}
        <svg ref={arcSvgRef} viewBox="0 0 1440 200" preserveAspectRatio="none"
          style={{ position: "absolute", top: -200, left: 0, width: "100%", height: 200,
            display: "block", pointerEvents: "none", zIndex: 1 }}>
          <path ref={arcPathRef} d="M0,0 Q720,200 1440,0 L1440,200 L0,200 Z" fill="#1a1a1a" />
        </svg>
      </section>

      {/* ════════ GOBELET — wrapper fixed plein écran (z 11). Le wrapper gère la
            SORTIE (translate avec la page noire) ; l'img gère le spin/montée. ════════ */}
      <div ref={cupWrapRef} style={{ position: "fixed", inset: 0, zIndex: 11, pointerEvents: "none", willChange: "transform" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cup1Ref} src="/goblet1.png?v=2" alt="Black Coffee"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            willChange: "transform, opacity" }} />
      </div>
    </div>
  );
}

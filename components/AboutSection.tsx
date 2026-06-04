"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 544 * 1.4 ≈ 762px
const H = 762;
// Combien du haut du gobelet dépasse en bas de la Hero (assez pour voir
// le couvercle + les lunettes du chien)
const PEEK_VISIBLE = 410;
// Inclinaison du gobelet au repos sur la Hero (se redresse au scroll)
const TILT = 15;
// Décalage horizontal des gobelets latéraux dans le trio final
const SIDE = 460;

export default function AboutSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const cup1Ref       = useRef<HTMLImageElement>(null);
  const cup1LabelRef  = useRef<HTMLSpanElement>(null);
  const cup2Ref       = useRef<HTMLImageElement>(null);
  const cup2LabelRef  = useRef<HTMLSpanElement>(null);
  const cup3Ref       = useRef<HTMLImageElement>(null);
  const cup3LabelRef  = useRef<HTMLSpanElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const all = [cup1Ref, cup1LabelRef, cup2Ref, cup2LabelRef, cup3Ref, cup3LabelRef, taglineRef];
    all.forEach(r => r.current && gsap.killTweensOf(r.current));

    const ctx = gsap.context(() => {
      // Position de départ du gobelet 1 : il dépasse du bas (≈ PEEK_VISIBLE px visibles)
      const peekY = () => window.innerHeight / 2 + H / 2 - PEEK_VISIBLE;

      /* ── États initiaux (tout est position: fixed, centré via xPercent/yPercent) ── */
      gsap.set(cup1Ref.current,      { xPercent: -50, yPercent: -50, y: peekY(), rotation: TILT, opacity: 1 });
      gsap.set(cup1LabelRef.current, { xPercent: -50, yPercent: -50, y: H / 2 + 40, opacity: 0 });
      gsap.set(cup2Ref.current,      { xPercent: -50, yPercent: -50, x: -SIDE, y: 80, opacity: 0 });
      gsap.set(cup2LabelRef.current, { xPercent: -50, yPercent: -50, x: -SIDE, y: H / 2 + 40, opacity: 0 });
      gsap.set(cup3Ref.current,      { xPercent: -50, yPercent: -50, x:  SIDE, y: 80, opacity: 0 });
      gsap.set(cup3LabelRef.current, { xPercent: -50, yPercent: -50, x:  SIDE, y: H / 2 + 40, opacity: 0 });
      gsap.set(taglineRef.current,   { xPercent: -50, opacity: 0 });

      /* ── Une seule timeline pilotée par le scroll, de tout en haut de la Hero
            jusqu'au bas de la section About ──
            start "top bottom"  = haut de About au bas du viewport = scroll page = 0 (haut de la Hero)
            end   "bottom bottom" = bas de About atteint */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      /* p 0 → 0.20  (pendant la Hero) : le gobelet (incliné à TILT°) monte du
         bas vers le centre en amorçant sa rotation (TILT → 187°). */
      tl.to(cup1Ref.current,
        { y: 0, rotation: 187, ease: "none", duration: 0.20 }, 0);

      /* p 0.20 → 0.60 : il termine son tour (180 → 360 = droit), reste centré. */
      tl.to(cup1Ref.current,
        { rotation: 360, ease: "none", duration: 0.40 }, 0.20);

      /* p 0.62 → 0.78 : les deux autres gobelets arrivent sur les côtés. */
      tl.to(cup2Ref.current,
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.10 }, 0.62);
      tl.to(cup3Ref.current,
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.10 }, 0.70);

      /* p 0.78 → 0.86 : labels + tagline. */
      tl.to(cup1LabelRef.current, { opacity: 1, ease: "power2.out", duration: 0.06 }, 0.78);
      tl.to(cup2LabelRef.current, { opacity: 1, ease: "power2.out", duration: 0.06 }, 0.78);
      tl.to(cup3LabelRef.current, { opacity: 1, ease: "power2.out", duration: 0.06 }, 0.78);
      tl.to(taglineRef.current,   { opacity: 1, ease: "power2.out", duration: 0.06 }, 0.84);

      /* (maintien p 0.86 → 0.93) */

      /* p 0.93 → 1.0 : tout le groupe s'efface en glissant vers le haut
         pendant qu'on entre dans la section suivante. */
      const exit = [cup1Ref, cup2Ref, cup3Ref, cup1LabelRef, cup2LabelRef, cup3LabelRef, taglineRef];
      exit.forEach(r =>
        tl.to(r.current, { opacity: 0, y: "-=80", ease: "power1.in", duration: 0.07 }, 0.93)
      );
    }, sectionRef);

    return () => { ctx.revert(); };
  }, []);

  /* Les PNG ont désormais un fond transparent (détourés) — plus besoin de
     mix-blend-mode (qui buggait sur Safari avec les couches composées). */
  const cupStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    height: H,
    width: "auto",
    display: "block",
    zIndex: 6,
    pointerEvents: "none",
    willChange: "transform, opacity",
  };

  const labelStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    fontFamily: "var(--font-dm)",
    fontSize: 11,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#8b7355",
    zIndex: 7,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    opacity: 0,
  };

  return (
    <div
      ref={sectionRef}
      id="a-propos"
      style={{ height: "500vh", background: "#f5f0e8" }}
    >
      {/* eslint-disable @next/next/no-img-element */}
      <img ref={cup2Ref} src="/gobelet2.png" alt="Iced Latte"   style={cupStyle} />
      <img ref={cup3Ref} src="/gobelet3.png" alt="Matcha"        style={cupStyle} />
      <img ref={cup1Ref} src="/goblet1.png"  alt="Black Coffee"  style={{ ...cupStyle, zIndex: 11 }} />
      {/* eslint-enable @next/next/no-img-element */}

      <span ref={cup2LabelRef} style={labelStyle}>Iced Latte</span>
      <span ref={cup1LabelRef} style={labelStyle}>Black Coffee</span>
      <span ref={cup3LabelRef} style={labelStyle}>Matcha</span>

      <p
        ref={taglineRef}
        style={{
          position: "fixed",
          top: "76%",
          left: "50%",
          textAlign: "center",
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: 22,
          color: "#1a1a1a",
          opacity: 0,
          zIndex: 9,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        La famille Calico.
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 544 * 1.4 ≈ 762px
const H = 762;

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
    [cup1Ref, cup1LabelRef, cup2Ref, cup2LabelRef, cup3Ref, cup3LabelRef, taglineRef]
      .forEach(r => r.current && gsap.killTweensOf(r.current));

    const ctx = gsap.context(() => {
      /* ── Initial states ──
         cup1 est DÉJÀ visible (pas d'animation d'entrée) — il prolonge
         le gobelet aperçu sur la Hero. Il démarre haut et "tombe". */
      gsap.set(cup1Ref.current,      { opacity: 1, y: -200, scale: 1, rotation: 0 });
      gsap.set(cup1LabelRef.current, { opacity: 0 });
      gsap.set(cup2Ref.current,      { opacity: 0, x: -460, y: 80 });
      gsap.set(cup2LabelRef.current, { opacity: 0 });
      gsap.set(cup3Ref.current,      { opacity: 0, x: 460,  y: 80 });
      gsap.set(cup3LabelRef.current, { opacity: 0 });
      gsap.set(taglineRef.current,   { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.8,
        },
      });

      /* ── Chute scroll-driven : le gobelet descend en tournant.
             rotation 0 → 360 (1 tour complet) et y -200 → 0 sur 0 → 78%.
             ease "none" = linéaire avec le scroll, atterrit droit (360°=0°)
             et centré entre les deux autres gobelets. ── */
      tl.to(cup1Ref.current,
        { rotation: 360, ease: "none", duration: 0.78 }, 0);
      tl.to(cup1Ref.current,
        { y: 0, ease: "none", duration: 0.78 }, 0);

      /* ── Phase 4 — trio rises (75% → 100%) ────────────────── */
      tl.to(cup2Ref.current,
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.10 }, 0.75);
      tl.to(cup3Ref.current,
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.10 }, 0.85);

      tl.to(cup2LabelRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.08 }, 0.85);
      tl.to(cup3LabelRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.08 }, 0.85);
      tl.to(cup1LabelRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.08 }, 0.85);

      tl.to(taglineRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.06 }, 0.96);
    }, sectionRef);

    return () => { ctx.revert(); };
  }, []);

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm)",
    fontSize: 11,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#8b7355",
    position: "absolute",
    zIndex: 9,
  };

  return (
    <div
      ref={sectionRef}
      id="a-propos"
      style={{ height: "500vh", background: "#f5f0e8" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f0e8",
        }}
      >
        {/* ── Cup 1 — black coffee, scroll-rotates ─────────────── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={cup1Ref}
          src="/goblet1.png"
          alt="Black Coffee"
          style={{
            position: "absolute",
            zIndex: 10,
            height: H,
            width: "auto",
            display: "block",
            mixBlendMode: "multiply",
          }}
        />
        <span ref={cup1LabelRef} style={{
          ...labelStyle,
          top: `calc(50% + ${H / 2 + 10}px)`,
        }}>
          Black Coffee
        </span>

        {/* ── Cup 2 — iced latte ───────────────────────────────── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={cup2Ref}
          src="/gobelet2.png"
          alt="Iced Latte"
          style={{
            position: "absolute",
            zIndex: 8,
            height: H,
            width: "auto",
            display: "block",
            mixBlendMode: "multiply",
          }}
        />
        <span ref={cup2LabelRef} style={{
          ...labelStyle,
          top: `calc(50% + ${H / 2 + 10}px)`,
          transform: "translateX(-460px)",
          opacity: 0,
        }}>
          Iced Latte
        </span>

        {/* ── Cup 3 — matcha ───────────────────────────────────── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={cup3Ref}
          src="/gobelet3.png"
          alt="Matcha"
          style={{
            position: "absolute",
            zIndex: 8,
            height: H,
            width: "auto",
            display: "block",
            mixBlendMode: "multiply",
          }}
        />
        <span ref={cup3LabelRef} style={{
          ...labelStyle,
          top: `calc(50% + ${H / 2 + 10}px)`,
          transform: "translateX(460px)",
          opacity: 0,
        }}>
          Matcha
        </span>

        {/* ── Tagline ───────────────────────────────────────────── */}
        <p
          ref={taglineRef}
          style={{
            position: "absolute",
            bottom: "10%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: 22,
            color: "#1a1a1a",
            opacity: 0,
            zIndex: 15,
          }}
        >
          La famille Calico.
        </p>
      </div>
    </div>
  );
}

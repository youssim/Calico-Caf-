"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { side: "left"  as const, title: "Dogs welcome.",          sub: "Humans tolerated.",                    rotate: "-2deg"  },
  { side: "right" as const, title: "Café de spécialité.",    sub: "Specialty coffee since day one.",      rotate: "1.5deg" },
  { side: "left"  as const, title: "Brunch tous les jours.", sub: "Du mardi au dimanche, 8h–17h.",        rotate: "-2deg"  },
  { side: "right" as const, title: "Fait maison.",           sub: "Recettes du jour, produits locaux.",   rotate: "1.5deg" },
];

const H = 320;

export default function AboutSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  // cup1 — black coffee, rotates, GSAP owns all transforms
  const cup1Ref       = useRef<HTMLImageElement>(null);
  const cup1LabelRef  = useRef<HTMLSpanElement>(null);
  // cup2 — iced latte (left, x: -180)
  const cup2Ref       = useRef<HTMLImageElement>(null);
  const cup2LabelRef  = useRef<HTMLSpanElement>(null);
  // cup3 — matcha (right, x: +180)
  const cup3Ref       = useRef<HTMLImageElement>(null);
  const cup3LabelRef  = useRef<HTMLSpanElement>(null);

  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const taglineRef  = useRef<HTMLParagraphElement>(null);

  const rotRef      = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    // Kill any stale tweens
    [cup1Ref, cup1LabelRef, cup2Ref, cup2LabelRef, cup3Ref, cup3LabelRef, taglineRef]
      .forEach(r => r.current && gsap.killTweensOf(r.current));
    cardRefs.current.forEach(c => c && gsap.killTweensOf(c));

    const ctx = gsap.context(() => {
      /* ── Initial states (GSAP owns these properties) ── */
      gsap.set(cup1Ref.current,      { opacity: 0, y: 150, scale: 0.5 });
      gsap.set(cup1LabelRef.current, { opacity: 0 });
      // cup2 starts at x:-180 (held there), fades in from y:60
      gsap.set(cup2Ref.current,      { opacity: 0, x: -180, y: 60 });
      gsap.set(cup2LabelRef.current, { opacity: 0 });
      // cup3 starts at x:+180
      gsap.set(cup3Ref.current,      { opacity: 0, x: 180,  y: 60 });
      gsap.set(cup3LabelRef.current, { opacity: 0 });
      gsap.set(taglineRef.current,   { opacity: 0, y: 14 });
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        gsap.set(c, { opacity: 0, x: CARDS[i].side === "left" ? -300 : 300 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          onUpdate: (self) => { progressRef.current = self.progress; },
        },
      });

      /* Phase 1 — cup1 enters (0 → 10%) */
      tl.to(cup1Ref.current,
        { y: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 0.10 }, 0);

      /* Phase 2 — cards one by one (10% → 65%) */
      const phases: [number, number][] = [[0.10,0.25],[0.25,0.40],[0.40,0.52],[0.52,0.65]];
      CARDS.forEach((card, i) => {
        const toX = card.side === "left" ? -380 : 380;
        const [s, e] = phases[i];
        tl.to(cardRefs.current[i],
          { x: toX, opacity: 1, ease: "power2.out", duration: e - s }, s);
      });

      /* Phase 3 — cards fade + cup descends (65% → 80%) */
      cardRefs.current.forEach(card =>
        tl.to(card, { opacity: 0, ease: "power2.in", duration: 0.15 }, 0.65)
      );
      tl.to(cup1Ref.current, { y: 80, ease: "power1.inOut", duration: 0.15 }, 0.65);

      /* Phase 4 — trio rises (75% → 100%) */
      // cup2 (iced latte, left) — x stays at -180, just y+opacity
      tl.to(cup2Ref.current,
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.09 }, 0.75);
      tl.to(cup2LabelRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.08 }, 0.84);
      // cup3 (matcha, right)
      tl.to(cup3Ref.current,
        { y: 0, opacity: 1, ease: "power2.out", duration: 0.09 }, 0.84);
      tl.to(cup3LabelRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.08 }, 0.84);
      // cup1 label
      tl.to(cup1LabelRef.current,
        { opacity: 1, ease: "power2.out", duration: 0.08 }, 0.84);
      // tagline last
      tl.to(taglineRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.06 }, 0.96);
    }, sectionRef);

    /* Continuous rotation — quickSetter avoids tween interference */
    const setRotation = gsap.quickSetter(cup1Ref.current, "rotation", "deg");
    const ticker = gsap.ticker.add(() => {
      const p = progressRef.current;
      let speed = 0.4;
      if (p >= 0.65 && p < 0.80) speed = 0.4 * (1 - (p - 0.65) / 0.15);
      else if (p >= 0.80) speed = 0;

      if (speed > 0.005) rotRef.current += speed;
      else if (p >= 0.80) {
        const nearest = Math.round(rotRef.current / 360) * 360;
        rotRef.current += (nearest - rotRef.current) * 0.08;
      }
      setRotation(rotRef.current);
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(ticker);
    };
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
        {/* ── Cards ─────────────────────────────────────────────── */}
        {CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-60px",
              marginLeft: "-130px",
              width: 260,
              background: "white",
              border: "1.5px solid #1a1a1a",
              borderRadius: 16,
              padding: "20px 24px",
              zIndex: 20,
              rotate: card.rotate,
              opacity: 0,
            }}
          >
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              fontSize: 16,
              textTransform: "uppercase",
              color: "#1a1a1a",
              lineHeight: 1.2,
              marginBottom: 6,
            }}>
              {card.title}
            </p>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontWeight: 300,
              fontSize: 12,
              color: "rgba(0,0,0,0.55)",
              lineHeight: 1.5,
            }}>
              {card.sub}
            </p>
          </div>
        ))}

        {/* ── Cup 1 — black coffee, spinning ────────────────────── */}
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
        <span ref={cup1LabelRef} style={{ ...labelStyle, top: `calc(50% + ${H / 2 + 8}px)` }}>
          Black Coffee
        </span>

        {/* ── Cup 2 — iced latte (animates from x:-180) ─────────── */}
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
          top: `calc(50% + ${H / 2 + 8}px)`,
          transform: "translateX(-180px)",
          opacity: 0,
        }}>
          Iced Latte
        </span>

        {/* ── Cup 3 — matcha (animates from x:+180) ─────────────── */}
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
          top: `calc(50% + ${H / 2 + 8}px)`,
          transform: "translateX(180px)",
          opacity: 0,
        }}>
          Matcha
        </span>

        {/* ── Tagline ───────────────────────────────────────────── */}
        <p
          ref={taglineRef}
          style={{
            position: "absolute",
            bottom: "11%",
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

"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

const CREAM = "#f2ede3";

// wrap(min, max, v) — repris de @motionone/utils, réimplémenté pour éviter la dépendance
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

const lineStyle: React.CSSProperties = {
  fontFamily: "var(--font-saira)",
  fontSize: "clamp(60px, 13vw, 180px)",
  fontWeight: 900,
  lineHeight: 0.85,
  textTransform: "uppercase",
  color: "var(--black)",
  whiteSpace: "nowrap",
  display: "block",
};

function MarqueeRow({
  text,
  baseVelocity,
}: {
  text: string;
  baseVelocity: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        flexWrap: "nowrap",
      }}
    >
      <motion.div
        style={{
          x,
          display: "flex",
          whiteSpace: "nowrap",
          flexWrap: "nowrap",
          gap: "2.5rem",
          willChange: "transform",
          backfaceVisibility: "hidden",
          translateZ: 0,
        }}
      >
        <span style={lineStyle}>{text}</span>
        <span style={lineStyle}>{text}</span>
        <span style={lineStyle}>{text}</span>
        <span style={lineStyle}>{text}</span>
      </motion.div>
    </div>
  );
}

export default function QuoteSection() {
  return (
    <section
      style={{
        background: CREAM,
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "0.5rem",
        overflow: "hidden",
        padding: "8vh 0",
      }}
    >
      <MarqueeRow text="Life happens," baseVelocity={-3} />
      <MarqueeRow text="Coffee helps." baseVelocity={3} />
    </section>
  );
}

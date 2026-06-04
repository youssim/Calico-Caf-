"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const cards = [
  {
    title: "Café de spécialité.",
    body: "Chaque tasse est pensée — grains sélectionnés, torréfaction soignée.",
    rotate: -6,
    top: "8%",
    left: "4%",
  },
  {
    title: "Brunch tous les jours.",
    body: "Du mardi au dimanche, de l'ouverture jusqu'à la fermeture.",
    rotate: 4,
    top: "6%",
    right: "4%",
  },
  {
    title: "Une adresse, un caractère.",
    body: "Un lieu pensé pour ralentir, manger bien, repartir chargé.",
    rotate: -4,
    bottom: "10%",
    left: "4%",
  },
  {
    title: "Fait maison.",
    body: "Recettes du jour, produits locaux, rien de superflu.",
    rotate: 5,
    bottom: "10%",
    right: "4%",
  },
];

export default function CupSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const cupY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const cupRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section
      ref={ref}
      id="a-propos"
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "6rem 2rem",
      }}
    >
      {/* Cartes flottantes */}
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: card.top,
            left: card.left,
            right: card.right,
            bottom: card.bottom,
            rotate: card.rotate,
            width: "clamp(200px, 22vw, 300px)",
            background: "transparent",
            border: "2px solid #1a1a1a",
            borderRadius: 16,
            padding: "1.4rem 1.6rem",
            zIndex: 5,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-saira)",
              fontWeight: 900,
              fontSize: "clamp(18px, 2vw, 26px)",
              color: "var(--black)",
              lineHeight: 1,
              marginBottom: "0.6rem",
              textTransform: "uppercase",
            }}
          >
            {card.title}
          </p>
          <p
            style={{
              fontFamily: "var(--font-courier)",
              fontSize: "clamp(11px, 1vw, 13px)",
              color: "var(--black)",
              opacity: 0.65,
              lineHeight: 1.5,
            }}
          >
            {card.body}
          </p>
        </motion.div>
      ))}

      {/* Gobelet central */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        animate={{ y: [0, -18, 0] }}
        // @ts-ignore
        style={{
          y: cupY,
          rotate: cupRotate,
          zIndex: 10,
          position: "relative",
        }}
      >
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gobelet-transparent.png"
          alt="Gobelet Calico"
          style={{
            width: "clamp(320px, 38vw, 560px)",
            height: "auto",
            display: "block",
            imageRendering: "high-quality",
            filter: "drop-shadow(0px 40px 80px rgba(0,0,0,0.22))",
          }}
        />
        </motion.div>
      </motion.div>
    </section>
  );
}

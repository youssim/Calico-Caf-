"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisRef } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Scroll doux/inertiel (Lenis) — même feeling que Mon Nuage : inertie + léger écho.
// Synchronisé avec le ticker GSAP et ScrollTrigger pour ne pas casser la section
// épinglée (Spin-Land / carrousel) d'AboutSection.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15, // inertie : plus grand = plus doux/traînant
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
      // On force ScrollTrigger à se mettre à jour à CHAQUE frame (pas seulement sur
      // l'event "scroll" de Lenis). Sinon, le scrub:0.7 du gobelet a besoin de ~0.7s
      // de frames supplémentaires pour rattraper après un arrêt/saut : si Lenis a
      // cessé d'émettre, le rattrapage ne se termine jamais → le gobelet reste figé.
      ScrollTrigger.update();
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}

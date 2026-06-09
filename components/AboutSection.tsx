"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
const TERRA = "#d45a30";

type Panel = {
  photo: { src: string; side: "left" | "right"; rot: number };
  text: { side: "left" | "right"; vAlign: "top" | "bottom"; body: React.ReactNode };
  poster: { src: string; side: "left" | "right"; vAlign: "top" | "bottom"; rot: number; w: string };
};

const pStyle: React.CSSProperties = { marginBottom: 16 };

const PANELS: Panel[] = [
  {
    // L'histoire / le nom — photo patronne+chien à droite, texte à gauche
    photo: { src: "/patronne-chien.jpeg", side: "right", rot: 3 },
    poster: { src: "/about/carte-1.png", side: "left", vAlign: "bottom", rot: -5, w: "min(21vw, 290px)" },
    text: {
      side: "left",
      vAlign: "top",
      body: (
        <>
          <p style={pStyle}>
            Tout commence par une histoire de pirate. Le nom <strong>Calico</strong> vient
            de <strong>Calico&nbsp;Jack</strong>, le flibustier resté célèbre pour avoir,
            le premier, embarqué des femmes dans son équipage.
          </p>
          <p style={pStyle}>
            Ici, le <span style={{ color: GREEN, fontWeight: 700 }}>café de spécialité</span> est
            une obsession : grains pointus, extractions soignées, et un brunch maison du
            matin au début d'après-midi.
          </p>
        </>
      ),
    },
  },
  {
    // L'équipe / coffee dealer — photo équipe à gauche, texte à droite
    photo: { src: "/equipe.jpeg", side: "left", rot: -3 },
    poster: { src: "/about/carte-2.png", side: "right", vAlign: "bottom", rot: 5, w: "min(18vw, 258px)" },
    text: {
      side: "right",
      vAlign: "top",
      body: (
        <>
          <p style={pStyle}>
            Du beige doux, des plantes partout, une lumière à la fois généreuse et
            tamisée — un cocon où l'on traîne seul avec son laptop ou à plusieurs,{" "}
            <strong>chien compris</strong>.
          </p>
          {/* À VÉRIFIER (Salim) : si Fabio fait aussi partie de la direction, le nommer
              ici → "Aïka, Luca et Fabio, ..." au lieu de "entourés de leur équipe". */}
          <p style={pStyle}>
            Derrière le comptoir, <strong>Aïka et Luca</strong>, le couple qui a tout
            imaginé, entourés de leur équipe.
          </p>
          <p style={{ ...pStyle, marginBottom: 22 }}>
            Nous, on préfère dire qu'on est vos{" "}
            <span style={{ color: TERRA, fontWeight: 700 }}>coffee dealers</span>.
          </p>
          <p style={{ fontFamily: "var(--font-saira)", fontWeight: 900, textTransform: "uppercase", color: TERRA, fontSize: "clamp(1.3rem, 1.8vw, 1.8rem)", lineHeight: 1, letterSpacing: "-0.01em" }}>
            Soutenez votre coffee dealer.
          </p>
        </>
      ),
    },
  },
];

// ─── Assets dessinés du carrousel (module-scope = stables) ───
const DRAWN_DEFAULT = "/carousel/gobelet-dessin.png?v=3";
const DRAWN_DEFAULT_MATTE = "/carousel/gobelet-dessin-matte.png?v=4";
type Asset = { src: string; matte: string; baseY: number; scale: number; dx?: number; dy?: number };
// baseY = Y (px canvas 4672) du bas de l'objet ; scale ; dx/dy = décalages px optionnels.
const ASSETS: Record<string, Asset> = {
  "White Coffee": { src: "/carousel/white-coffee.png?v=2",   matte: "/carousel/white-coffee-matte.png?v=2", baseY: 3187, scale: 1, dx: 35 },
  "Cold Drinks":  { src: "/carousel/cold-drinks-noline.png", matte: "/carousel/cold-drinks-matte.png?v=2",  baseY: 3727, scale: 1, dy: 30 },
  "Cocktail":     { src: "/carousel/cocktail.png?v=2",       matte: "/carousel/cocktail-matte.png?v=2", baseY: 4148, scale: 0.80, dy: 40 },
  "Not Coffee":   { src: "/carousel/not-coffee.png",         matte: "/carousel/not-coffee-matte.png",   baseY: 3706, scale: 1.30, dy: 50 },
  "Bière":        { src: "/carousel/biere.png",              matte: "/carousel/biere-matte.png",        baseY: 3706, scale: 1.30, dy: 60 },
  "Vin":          { src: "/carousel/vin.png?v=2",            matte: "/carousel/vin-matte.png?v=2",      baseY: 3706, scale: 1.12, dy: 50 },
  "Sweet":        { src: "/carousel/sweet.png?v=3",          matte: "/carousel/sweet-matte.png?v=3",    baseY: 3706, scale: 0.935, dy: 15 },
};
const ASSET_URLS = [DRAWN_DEFAULT, DRAWN_DEFAULT_MATTE, ...Object.values(ASSETS).flatMap((a) => [a.src, a.matte])];
const PXR = H / 4672;
// translateY pour poser la base de l'objet ~25px sous la ligne (68% de la hauteur viewport).
const alignY = (baseY: number, scale: number) => {
  const fromCenter = 0.18 * window.innerHeight + 25;
  return fromCenter - (baseY - 2336) * PXR * scale;
};

export default function AboutSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const cup1Ref      = useRef<HTMLImageElement>(null);
  const panelRefs    = useRef<(HTMLElement | null)[]>([]);
  const cardRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const landingRef   = useRef<HTMLElement>(null);
  const cupWrapRef   = useRef<HTMLDivElement>(null);
  const cupDrawnRef  = useRef<HTMLImageElement>(null);
  const cupMatteRef  = useRef<HTMLImageElement>(null);
  // calques "fantômes" : montrent l'ANCIEN asset pendant la transition de catégorie
  // (le primaire swap son src en étant invisible → aucun flash, aucun gap).
  const ghostDrawnRef = useRef<HTMLImageElement>(null);
  const ghostMatteRef = useRef<HTMLImageElement>(null);
  const initRef = useRef(true);
  const [drawnSrc, setDrawnSrc] = useState(DRAWN_DEFAULT);
  const [matteSrc, setMatteSrc] = useState(DRAWN_DEFAULT_MATTE);

  // PRÉCHARGE : décode toutes les images au montage → changement de catégorie instantané.
  useEffect(() => {
    ASSET_URLS.forEach((u) => { const img = new Image(); img.src = u; img.decode?.().catch(() => {}); });
  }, []);

  // Changement de catégorie : transition slide+fade avec calque fantôme (anti-flash).
  // dir = +1 (flèche droite / suivant), -1 (gauche / précédent), 0 (toggle / init).
  const handleCategory = useCallback((name: string, dir = 0) => {
    const a = ASSETS[name];
    const src = a?.src || DRAWN_DEFAULT;
    const matte = a?.matte || DRAWN_DEFAULT_MATTE;
    const tx = a?.dx ?? 0;
    const ty = a ? alignY(a.baseY, a.scale) + (a.dy ?? 0) : 0;
    const sc = a?.scale ?? 1;
    const drawn = cupDrawnRef.current, m = cupMatteRef.current;
    const gd = ghostDrawnRef.current, gm = ghostMatteRef.current;
    if (!drawn || !m) return;

    // 1er passage (montage) : pose directe, sans animation ni toucher l'opacité
    // (gérée par le crossfade d'atterrissage).
    if (initRef.current) {
      initRef.current = false;
      setDrawnSrc(src); setMatteSrc(matte);
      gsap.set([drawn, m], { x: tx, y: ty, scale: sc });
      return;
    }

    // position/opacité actuelles → reprises par le fantôme (ancien asset, src lu en DOM)
    const curX = gsap.getProperty(drawn, "x") as number;
    const curY = gsap.getProperty(drawn, "y") as number;
    const curSc = (gsap.getProperty(drawn, "scaleX") as number) || 1;
    const curOp = gsap.getProperty(drawn, "opacity") as number;
    if (gd && gm) {
      gd.src = drawn.src; gm.src = m.src;            // src direct = instantané (pas de state)
      gsap.killTweensOf([gd, gm]);
      gsap.set([gd, gm], { x: curX, y: curY, scale: curSc, opacity: curOp });
    }
    // primaire = nouvel asset, placé à l'entrée (côté opposé au sens), invisible
    setDrawnSrc(src); setMatteSrc(matte);
    const SLIDE = 220 * dir;
    gsap.killTweensOf([drawn, m]);
    gsap.set([drawn, m], { x: tx + SLIDE, y: ty, scale: sc, opacity: 0 });
    // chevauchement : fantôme sort + s'efface, primaire entre + apparaît → pas de gap
    if (gd && gm) gsap.to([gd, gm], { x: curX - SLIDE, opacity: 0, duration: 0.3, ease: "power2.inOut" });
    gsap.to([drawn, m], { x: tx, opacity: 1, duration: 0.3, ease: "power2.inOut" });
  }, []);

  useEffect(() => {
    gsap.killTweensOf(cup1Ref.current);

    const ctx = gsap.context(() => {
      const peekY = () => window.innerHeight / 2 + H / 2 - PEEK_VISIBLE;

      /* ── GOBELET (seul) — animation de rotation INCHANGÉE, juste retimée
            pour finir droit pile à la zone d'atterrissage ── */
      gsap.set(cup1Ref.current, { xPercent: -50, yPercent: -50, x: HERO_X, y: peekY(), rotation: TILT, opacity: 1 });
      // Gobelet DESSINÉ + MATTE (+ fantômes) : superposés au centre, cachés au départ
      gsap.set([cupDrawnRef.current, cupMatteRef.current, ghostDrawnRef.current, ghostMatteRef.current],
        { xPercent: -50, yPercent: -50, opacity: 0 });

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
        const finalRot = panel.photo.rot;
        gsap.set(card, { y: -250, opacity: 0, rotation: finalRot + 8 });
        gsap.set(text, { opacity: 0, y: 20 });
        const ptl = gsap.timeline({
          scrollTrigger: { trigger: panelRefs.current[i], start: "top 60%" },
        });
        ptl.to(card, { y: 0, opacity: 1, rotation: finalRot, duration: 0.9, ease: "back.out(1.5)" }, 0);
        ptl.to(text, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3);
      });

      /* ── PAUSE + CARROUSEL : la page noire (= le carrousel menu) est STICKY
            l'espace d'1 scroll. Le gobelet reste VISIBLE tout le long du carrousel
            (navigation au clic). Il ne s'efface QUE lorsqu'on quitte le carrousel
            vers le bas (onLeave), et réapparaît en remontant (onEnterBack) → il ne
            disparaît jamais tant que le menu est affiché. ── */
      /* ── SORTIE sans tremblement : pendant le carrousel le gobelet est `fixed`.
            À la fin du pin (onLeave, scroll vers le bas), on le bascule en
            `position: absolute` ancré à la position document courante → il défile
            ALORS EN NATIF avec la page, exactement comme le contenu (zéro transform
            JS par frame → zéro désync/tremblement, et il reste collé à la ligne).
            En remontant (onEnterBack), on rebascule en `fixed`. ── */
      const setCupFixed = () => {
        const w = cupWrapRef.current; if (!w) return;
        gsap.set(w, { clearProps: "y" });
        w.style.position = "fixed";
        w.style.top = "0px";
        w.style.bottom = "0px";
        w.style.height = "";
      };
      const setCupAbsolute = () => {
        const w = cupWrapRef.current; if (!w) return;
        gsap.set(w, { clearProps: "y" });
        w.style.position = "absolute";
        w.style.top = window.scrollY + "px";   // = haut du viewport actuel → reste centré, puis défile
        w.style.bottom = "auto";
        w.style.height = "100vh";
      };
      ScrollTrigger.create({
        trigger: landingRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onLeave: setCupAbsolute,
        onEnterBack: setCupFixed,
      });

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
          gsap.to([cupDrawnRef.current, cupMatteRef.current], { opacity: 1, duration: 0.6, ease: "power2.inOut" });
        },
        onLeaveBack: () => {
          gsap.to([cupDrawnRef.current, cupMatteRef.current], { opacity: 0, duration: 0.6, ease: "power2.inOut" });
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
          {/* Photo réelle (z-index 2) — sur un côté, le gobelet descend au centre */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={(el) => { cardRefs.current[i] = el; }} src={panel.photo.src} alt=""
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [panel.photo.side]: "clamp(24px, 5vw, 90px)",
              width: "min(32vw, 440px)",
              height: "auto",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: 20,
              zIndex: 2,
              boxShadow: "0 18px 50px rgba(26,26,26,0.18)",
            } as React.CSSProperties} />

          {/* Affiche du café "punaisée" (z-index 1, déco — vrais posters du lieu) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={panel.poster.src} alt=""
            style={{
              position: "absolute",
              [panel.poster.side]: "clamp(24px, 4vw, 70px)",
              ...(panel.poster.vAlign === "top" ? { top: "clamp(80px, 9vh, 110px)" } : { bottom: "4vh" }),
              width: panel.poster.w,
              height: "auto",
              zIndex: 1,
              transform: `rotate(${panel.poster.rot}deg)`,
            } as React.CSSProperties} />

          {/* Texte histoire (z-index 2) */}
          <div ref={(el) => { textRefs.current[i] = el; }}
            style={{
              position: "absolute",
              [panel.text.side]: "clamp(24px, 5vw, 90px)",
              ...(panel.text.vAlign === "top" ? { top: "clamp(92px, 14vh, 150px)" } : { bottom: "8vh" }),
              maxWidth: "min(32vw, 380px)",
              zIndex: 2,
              fontFamily: "var(--font-courier)",
              color: "#1a1a1a",
              fontSize: "clamp(0.95rem, 1.05vw, 1.1rem)",
              lineHeight: 1.7,
            } as React.CSSProperties}>
            {panel.text.body}
          </div>
        </section>
      ))}

      {/* ════════ ATTERRISSAGE NOIR (pinned 100vh = scroll-lock).
            La courbe Taru Bali ci-dessous "dripse" du crème vers le noir au top. ════════ */}
      <section ref={landingRef} id="menu" style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#1a1a1a",
        margin: 0,
        overflow: "hidden",
      }}>
        {/* Carrousel menu (state-driven, navigation au clic). Le gobelet fixed
            flotte au-dessus (z 11), pointer-events none → les clics passent. */}
        <MenuCarousel onCategoryChange={handleCategory} />
      </section>

      {/* ════════ GOBELET — wrapper fixed plein écran (z 11). Le wrapper gère la
            SORTIE (translate avec la page noire) ; l'img gère le spin/montée. ════════ */}
      <div ref={cupWrapRef} style={{ position: "fixed", inset: 0, zIndex: 11, pointerEvents: "none",
        transform: "translateZ(0)", backfaceVisibility: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cup1Ref} src="/goblet1.png?v=2" alt="Black Coffee"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden" }} />
        {/* MATTE — silhouette pleine #1a1a1a (= couleur du fond, donc invisible) posée
            sous les traits ; occulte la ligne de table là où il y a l'asset (la ligne
            reste visible de part et d'autre). Même position/taille que le gobelet dessiné. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cupMatteRef} src={matteSrc} alt="" decoding="async"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden" }} />
        {/* FANTÔME MATTE — ancien asset pendant la transition (src posé en JS) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={ghostMatteRef} alt="" decoding="async"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden", opacity: 0 }} />
        {/* Gobelet DESSINÉ (carrousel) — même position/taille, crossfade au landing */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={cupDrawnRef} src={drawnSrc} alt="" decoding="async"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden", filter: "brightness(0) invert(1)" }} />
        {/* FANTÔME DESSINÉ — ancien asset pendant la transition (src posé en JS) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={ghostDrawnRef} alt="" decoding="async"
          style={{ position: "absolute", top: "50%", left: "50%", height: H, width: "auto", display: "block",
            backfaceVisibility: "hidden", filter: "brightness(0) invert(1)", opacity: 0 }} />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

type Item = { name: string; price: string };
type Category = {
  group: "boire" | "manger";
  name: string;
  bg: string;
  text: string;
  items: Item[];
  extras?: string;
};

const CATEGORIES: Category[] = [
  {
    group: "boire", name: "Black Coffee", bg: "#1a1a1a", text: "#f2ede3",
    items: [
      { name: "Espresso", price: "2.5€" }, { name: "Double", price: "3.5€" },
      { name: "Long Black", price: "3.5€" }, { name: "Café filtre", price: "4.5€" },
      { name: "Red Eye", price: "6€" },
    ],
    extras: "extra shot +1€ · lait avoine/coco +0.5€ · glacé +0€ · sirop caramel/vanille +0.5€",
  },
  {
    group: "boire", name: "White Coffee", bg: "#c9b99a", text: "#1a1a1a",
    items: [
      { name: "Cappuccino", price: "4.5€" }, { name: "Latte", price: "4.5€" },
      { name: "Flat White", price: "5€" }, { name: "Mocha", price: "5.5€" },
      { name: "Dirty Chai", price: "6€" },
    ],
  },
  {
    group: "boire", name: "Not Coffee", bg: "#4a6741", text: "#f2ede3",
    items: [
      { name: "Chai Latte", price: "5.5€" }, { name: "Chocolat chaud", price: "5.5€" },
      { name: "Matcha Latte", price: "5.5€" }, { name: "Ube Latte", price: "5.5€" },
      { name: "Spiruline Latte", price: "5.5€" }, { name: "Hojicha Latte", price: "5.5€" },
      { name: "Puppyccino", price: "2.5€" },
    ],
  },
  {
    group: "boire", name: "Cold Drinks", bg: "#f2ede3", text: "#1a1a1a",
    items: [
      { name: "Espresso Tonic", price: "6€" }, { name: "Orange Espresso", price: "6€" },
      { name: "Citronnade maison 35cl", price: "4.5€" }, { name: "Vittel 50cl", price: "4.5€" },
      { name: "San Pellegrino 50cl", price: "4.5€" }, { name: "Community Cola 33cl", price: "4.5€" },
      { name: "Community Cola Zero 33cl", price: "4.5€" }, { name: "Charitea Green 33cl", price: "4.5€" },
      { name: "Charitea Mate 33cl", price: "4.5€" }, { name: "Lemonaid Citron Vert 33cl", price: "4.5€" },
    ],
  },
  {
    group: "boire", name: "Bière", bg: "#1a1a1a", text: "#f2ede3",
    items: [
      { name: "Mongy Blonde 6.2°", price: "6€" }, { name: "Brunehaut Blanche SG 5.5°", price: "6€" },
    ],
  },
  {
    group: "boire", name: "Vin", bg: "#1a1a1a", text: "#f2ede3",
    items: [
      { name: "Vin blanc", price: "7€/25€" }, { name: "Vin rosé", price: "7€/25€" },
    ],
  },
  {
    group: "boire", name: "Cocktail", bg: "#1a1a1a", text: "#f2ede3",
    items: [
      { name: "Spritz", price: "8€" }, { name: "Mimosa", price: "8€" },
    ],
  },
  {
    group: "manger", name: "Salty", bg: "#d45a30", text: "#f2ede3",
    items: [
      { name: "Avo Toast", price: "16€" }, { name: "Turkish Eggs (V)", price: "13€" },
      { name: "Burrata Bruschetta (V)", price: "16€" }, { name: "Mushroom Toast (VGA)", price: "16€" },
      { name: "Shakshouka (V)", price: "14€" }, { name: "Eggs Your Way", price: "8€" },
    ],
    extras: "œuf +2€ · burrata +5€ · haricots +3€ · purée avocat +3€ · bacon +3€ · cheddar +3€ · cheddar vegan +3€ · houmous +3€ · saumon fumé +6€ · champignons rôtis +4€",
  },
  {
    group: "manger", name: "Sweet", bg: "#c9b99a", text: "#1a1a1a",
    items: [
      { name: "Granola Bowl (VGA)", price: "12€" }, { name: "PB & Banana Toast (VG)", price: "8€" },
      { name: "Pain beurre confiture (V)", price: "5€" }, { name: "Cookie", price: "4.5€" },
    ],
  },
];

const GROUPS = {
  boire: CATEGORIES.filter((c) => c.group === "boire"),
  manger: CATEGORIES.filter((c) => c.group === "manger"),
};

export default function MenuCarousel({ onCategoryChange }: { onCategoryChange?: (name: string) => void }) {
  const [group, setGroup] = useState<"boire" | "manger">("boire");
  const [idx, setIdx] = useState(0); // index dans le groupe actif

  const cats = GROUPS[group];
  const cat = cats[idx];

  // notifie le parent (AboutSection) pour swapper l'asset du gobelet dessiné
  useEffect(() => { onCategoryChange?.(cat.name); }, [cat.name, onCategoryChange]);

  const switchGroup = (g: "boire" | "manger") => { setGroup(g); setIdx(0); };
  const prev = () => setIdx((i) => (i - 1 + cats.length) % cats.length);
  const next = () => setIdx((i) => (i + 1) % cats.length);

  // clé qui change à chaque changement de catégorie → relance les animations CSS
  const animKey = `${group}-${idx}`;

  // items en 2 colonnes (gauche / droite du gobelet)
  const mid = Math.ceil(cat.items.length / 2);
  const leftItems = cat.items.slice(0, mid);
  const rightItems = cat.items.slice(mid);

  // Toutes les catégories : fond noir, texte crème (uniforme).
  const ink = "#f2ede3";

  // Titre style menu Calico inversé : le 1er mot est surligné (rectangle crème,
  // texte noir), le reste en crème simple. (Mots seuls = entièrement surlignés.)
  const [titleFirst, ...titleRestArr] = cat.name.split(" ");
  const titleRest = titleRestArr.join(" ");

  const toggleBtn = (g: "boire" | "manger"): React.CSSProperties => ({
    padding: "12px 34px",
    borderRadius: 999,
    border: "1.5px solid #f2ede3",
    background: group === g ? "#4a6741" : "transparent",
    color: "#f2ede3",
    fontFamily: "var(--font-courier)",
    fontSize: "1.2rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "background 0.3s ease, color 0.3s ease",
  });

  const colStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "min(28vw, 320px)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    zIndex: 4,
  };

  const renderItems = (items: Item[], align: "left" | "right", offset: number) =>
    items.map((it, i) => (
      <div
        key={it.name}
        className="mc-item"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          textAlign: align,
          flexDirection: align === "right" ? "row-reverse" : "row",
          fontFamily: "var(--font-courier)",
          fontSize: "1rem",
          lineHeight: 2.2,
          color: ink,
          borderBottom: `1px solid ${ink}22`,
          paddingBottom: 6,
          animationDelay: `${(offset + i) * 0.05}s`,
        }}
      >
        <span>{it.name}</span>
        <span style={{ opacity: 0.7, whiteSpace: "nowrap" }}>{it.price}</span>
      </div>
    ));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#1a1a1a",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes mcName { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mcItem { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .mc-name { animation: mcName 0.5s ease both; }
        .mc-item { animation: mcItem 0.4s ease both; }
        .mc-arrow { transition: transform 0.2s ease; cursor: pointer; }
        .mc-arrow:hover { transform: scale(1.1); }
      `}</style>

      {/* TOGGLE À boire / À manger — tout en haut (remplace la navbar) */}
      <div style={{
        position: "absolute", top: "3.5%", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 12, zIndex: 6,
      }}>
        <button style={toggleBtn("boire")} onClick={() => switchGroup("boire")}>À boire</button>
        <button style={toggleBtn("manger")} onClick={() => switchGroup("manger")}>À manger</button>
      </div>

      {/* NOM DE CATÉGORIE */}
      <div
        key={`name-${animKey}`}
        className="mc-name"
        style={{
          position: "absolute", top: "13%", left: 0, right: 0, textAlign: "center", zIndex: 4,
          fontFamily: "var(--font-saira)", fontWeight: 900,
          fontSize: "clamp(5rem, 10vw, 9rem)", lineHeight: 0.9, marginBottom: 20,
          textTransform: "uppercase",
          color: ink, pointerEvents: "none",
        }}
      >
        <span style={{
          background: "#f2ede3", color: "#1a1a1a",
          padding: "4px 10px", display: "inline-block", borderRadius: 6,
        }}>{titleFirst}</span>
        {titleRest && <> {titleRest}</>}
      </div>

      {/* ITEMS — 2 colonnes */}
      <div key={`left-${animKey}`} style={{ ...colStyle, left: "6vw", alignItems: "flex-start" }}>
        {renderItems(leftItems, "left", 0)}
      </div>
      <div key={`right-${animKey}`} style={{ ...colStyle, right: "6vw", alignItems: "flex-end" }}>
        {renderItems(rightItems, "right", leftItems.length)}
      </div>

      {/* EXTRAS (si présents) — bas, sous les dots */}
      {cat.extras && (
        <div key={`extras-${animKey}`} className="mc-item" style={{
          position: "absolute", bottom: "13%", left: "50%", transform: "translateX(-50%)",
          width: "min(80vw, 760px)", textAlign: "center",
          fontFamily: "var(--font-courier)", fontSize: "clamp(10px, 0.85vw, 12px)",
          color: ink, opacity: 0.75, zIndex: 4, lineHeight: 1.6,
        }}>
          {cat.extras}
        </div>
      )}

      {/* FLÈCHES — proches du gobelet (≈80px de ses bords), centrées verticalement */}
      <div className="mc-arrow" onClick={prev} style={{
        position: "absolute", top: "50%", left: "calc(50% - 320px)", transform: "translate(-50%, -50%)",
        fontSize: 40, color: ink, zIndex: 5, userSelect: "none", lineHeight: 1,
      }}>←</div>
      <div className="mc-arrow" onClick={next} style={{
        position: "absolute", top: "50%", left: "calc(50% + 320px)", transform: "translate(-50%, -50%)",
        fontSize: 40, color: ink, zIndex: 5, userSelect: "none", lineHeight: 1,
      }}>→</div>

      {/* DOTS */}
      <div style={{
        position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 5,
      }}>
        {cats.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 28 : 10, height: 10, borderRadius: 999,
            background: i === idx ? ink : "transparent",
            border: `1.5px solid ${ink}`, padding: 0, cursor: "pointer",
            transition: "width 0.3s ease, background 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

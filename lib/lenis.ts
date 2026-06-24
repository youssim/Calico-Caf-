import type Lenis from "lenis";

// Référence partagée vers l'instance Lenis active (créée dans <SmoothScroll/>),
// pour que le scroll programmatique custom (navbar/gobelet) puisse la mettre en
// pause pendant son animation et la relancer ensuite.
export const lenisRef: { current: Lenis | null } = { current: null };

import type { Metadata } from "next";
import { Saira_Extra_Condensed, Courier_Prime, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import ReviewButton from "@/components/ReviewButton";
import SmoothScroll from "@/components/SmoothScroll";

const saira = Saira_Extra_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["900"],
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Calico — Café de spécialité, Lille",
  description: "Brunch tous les jours. Café de spécialité. 25 Bd Carnot, Lille.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${saira.variable} ${courier.variable} ${playfair.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full">
        <SmoothScroll />
        {children}
        <ReviewButton />
      </body>
    </html>
  );
}

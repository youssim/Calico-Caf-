import type { Metadata } from "next";
import { Saira_Extra_Condensed, Courier_Prime } from "next/font/google";
import "./globals.css";

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
    <html lang="fr" className={`${saira.variable} ${courier.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

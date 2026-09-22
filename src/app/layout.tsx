import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { siteOriginFromEnv } from "@/lib/site-url";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOriginFromEnv()),
  title: {
    default: "WoW Roster",
    template: "%s · WoW Roster",
  },
  description:
    "Shareable signup sheets for World of Warcraft: Forever. No accounts. Nickname-first lineup with faction and race/class checks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-dvh font-sans text-ink antialiased">{children}</body>
    </html>
  );
}

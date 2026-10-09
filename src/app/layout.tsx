import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { siteOriginFromEnv } from "@/lib/site-url";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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

export const viewport: Viewport = {
  themeColor: "#100e0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-dvh font-sans text-ink antialiased">{children}</body>
    </html>
  );
}

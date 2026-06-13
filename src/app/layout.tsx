import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const SITE_URL = "https://xklic.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Xklic — Le site pro qui te ramène des clients, en ligne en 2h",
    template: "%s · Xklic",
  },
  description:
    "Xklic crée le site web de ton activité, clés en main et en ligne en 2h. Sans prise de tête, sans engagement. 49€ à la création puis 9,90€/mois.",
  keywords: [
    "site internet artisan",
    "site vitrine TPE",
    "création site web pas cher",
    "site femme de ménage",
    "site plombier électricien",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Xklic",
    title: "Xklic — Le site pro qui te ramène des clients, en ligne en 2h",
    description:
      "Le site web de ton activité, clés en main et en ligne en 2h. 49€ à la création puis 9,90€/mois, sans engagement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xklic — Le site pro qui te ramène des clients, en ligne en 2h",
    description:
      "Le site web de ton activité, clés en main et en ligne en 2h. Sans prise de tête.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="bg-ink text-cream min-h-full flex flex-col font-sans selection:bg-ember/30 selection:text-cream">
        {children}
      </body>
    </html>
  );
}

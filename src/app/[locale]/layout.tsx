import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import "../globals.css";
import { SITE_URL, IS_INDEXABLE } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, websiteLd } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { isRtl, type Locale } from "@/i18n/config";

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

// Pré-génère une variante statique par langue (SSG conservé pour le SEO).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: IS_INDEXABLE,
    follow: IS_INDEXABLE,
    googleBot: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
  },
  title: {
    default: "Xklic — Le site pro qui te ramène des clients, en ligne en 48h",
    template: "%s · Xklic",
  },
  description:
    "Xklic crée le site web de ton activité, clés en main et en ligne en 48h. Sans prise de tête, sans engagement. 49€ à la création puis 9,99€/mois.",
  openGraph: {
    type: "website",
    siteName: "Xklic",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Locale inconnue (préfixe d'URL invalide) → 404.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Active le rendu statique pour cette langue.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="bg-ink text-cream min-h-full flex flex-col font-sans selection:bg-ember/30 selection:text-cream">
        <NextIntlClientProvider locale={locale as Locale} messages={messages}>
          <JsonLd data={websiteLd()} />
          <JsonLd data={organizationLd()} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

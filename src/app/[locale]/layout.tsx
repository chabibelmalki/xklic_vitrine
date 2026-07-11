import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { SITE_URL, IS_INDEXABLE } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, websiteLd } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { isRtl, ogLocale, type Locale } from "@/i18n/config";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    robots: {
      index: IS_INDEXABLE,
      follow: IS_INDEXABLE,
      googleBot: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
    },
    title: {
      default: t("defaultTitle"),
      template: "%s · Xklic",
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: "Xklic",
      locale: ogLocale[safeLocale as Locale],
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  };
}

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

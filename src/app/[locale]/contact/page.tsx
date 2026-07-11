import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingActions } from "@/components/site/floating-actions";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section";
import { ContactForm } from "@/components/form/contact-form";
import { brand } from "@/lib/content";
import { telLink, waLink } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("contact");
  return (
    <div className="grain relative flex min-h-full flex-col">
      <Header />

      <main className="relative flex-1 pt-28 pb-20 sm:pt-32 lg:pt-36">
        {/* Lueur chaude en haut, comme /demarrer */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] glow-ember"
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h1 className="font-display text-3xl font-light leading-[1.05] tracking-tight text-cream sm:text-4xl">
                {t("title")}
              </h1>
              <p className="text-base leading-relaxed text-cream-muted">
                {t("subtitle")}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              <a
                href={telLink(brand.phone)}
                className="text-cream-muted transition-colors hover:text-cream"
              >
                {brand.phoneDisplay}
              </a>
              <a
                href={waLink(brand.whatsapp, brand.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="text-cream-muted transition-colors hover:text-cream"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="text-cream-muted transition-colors hover:text-cream"
              >
                {brand.email}
              </a>
            </div>

            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}

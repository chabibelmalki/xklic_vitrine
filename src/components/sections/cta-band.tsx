import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { brand } from "@/lib/content";
import { cn, telLink, waLink } from "@/lib/utils";

// Bandeau CTA fort, à contraste inversé (encre foncée sur ivoire). Réutilise
// les MÊMES conversions que le reste du site : Créer mon site (/demarrer),
// appel direct (tel:), WhatsApp. Conversions = sacrées : ne pas dévier.
export function CtaBand({
  title = "Prêt à être trouvé par vos clients ?",
  subtitle = "On crée votre site pro, clés en main, en ligne en 2h. Sans engagement.",
  primaryLabel = "Créer mon site",
  className,
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative py-16 sm:py-20", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-cream px-6 py-12 text-center shadow-float sm:px-12 sm:py-16">
          {/* Lueur d'accent (CSS) sur fond sombre */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-1/3 h-[160%] opacity-70 [background:radial-gradient(60%_60%_at_50%_0%,rgba(229,67,31,0.28)_0%,rgba(242,161,58,0.12)_38%,transparent_72%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:24px_24px]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-panel sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/demarrer"
                size="lg"
                className="w-full sm:w-auto"
              >
                {primaryLabel}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>
              <a
                href={telLink(brand.phone)}
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink/10 px-7 text-[0.95rem] font-medium text-ink ring-1 ring-inset ring-ink/15 transition-colors duration-300 hover:bg-ink/15 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                <Phone size={17} />
                {brand.phoneDisplay}
              </a>
              <a
                href={waLink(brand.whatsapp, brand.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                aria-label="Écrire sur WhatsApp"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-[0.95rem] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:-translate-y-0.5 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

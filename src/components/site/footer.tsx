import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";
import { brand } from "@/lib/content";
import { telLink, waLink } from "@/lib/utils";

// Colonnes de liens du footer. Pensées pour le maillage interne multi-pages
// (métiers, zones, réalisations, blog, tarifs, faq, contact, légal).
const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Services",
    links: [
      { href: "/metiers", label: "Tous les métiers" },
      { href: "/realisations", label: "Réalisations" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "L'offre",
    links: [
      { href: "/#tarif", label: "Formules & tarifs" },
      { href: "/#process", label: "Comment ça marche" },
      { href: "/#faq", label: "Questions fréquentes" },
      { href: "/demarrer", label: "Créer mon site" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="max-w-xs lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-cream-muted">
              {brand.tagline} Sans prise de tête, sans engagement.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-cream-faint">
                {col.title}
              </span>
              {col.links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-cream-muted transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-cream-faint">
              Contact
            </span>
            <a
              href={`mailto:${brand.email}`}
              className="text-sm text-cream-muted transition-colors hover:text-cream"
            >
              {brand.email}
            </a>
            <a
              href={telLink(brand.phone)}
              className="text-sm text-cream-muted transition-colors hover:text-cream"
            >
              {brand.phoneDisplay}
            </a>
            <a
              href={waLink(brand.whatsapp, brand.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-cream-muted transition-colors hover:text-cream"
            >
              WhatsApp
            </a>
            <Link
              href="/demarrer"
              className="text-sm text-ember-deep transition-colors hover:text-ember"
            >
              Créer mon site →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-cream-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/contact" className="transition-colors hover:text-cream">
              Contact
            </Link>
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-cream"
            >
              Mentions légales
            </Link>
            <Link href="/cgv" className="transition-colors hover:text-cream">
              CGV
            </Link>
            <Link
              href="/confidentialite"
              className="transition-colors hover:text-cream"
            >
              Confidentialité
            </Link>
            <span className="hidden sm:inline">Conçu en France</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

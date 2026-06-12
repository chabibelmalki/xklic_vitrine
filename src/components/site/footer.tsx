import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";
import { brand, nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative border-t border-line py-14">
      <Container>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-cream-muted">
              {brand.tagline} Sans prise de tête, sans engagement.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-cream-faint">
              Navigation
            </span>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-cream-muted transition-colors hover:text-cream"
              >
                {item.label}
              </Link>
            ))}
          </nav>

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
            <Link
              href="/demarrer"
              className="text-sm text-ember-soft transition-colors hover:text-ember"
            >
              Créer mon site →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-cream-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. Tous droits réservés.</p>
          <p>Conçu en France · 49€ à la création puis 9,90€/mois</p>
        </div>
      </Container>
    </footer>
  );
}

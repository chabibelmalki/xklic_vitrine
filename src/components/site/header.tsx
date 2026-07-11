"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Liens de navigation : href stable, libellé traduit via la clé `nav.*`.
// `frOnly` = pointe vers un contenu franco-français non traduit (métiers,
// réalisations) → masqué dans les autres langues.
const NAV_ITEMS = [
  { href: "/metiers", key: "metiers", frOnly: true },
  { href: "/realisations", key: "realisations", frOnly: true },
  { href: "/tarifs", key: "tarifs", frOnly: false },
  { href: "/faq", key: "faq", frOnly: false },
  { href: "/contact", key: "contact", frOnly: false },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const navItems = NAV_ITEMS.filter((i) => locale === "fr" || !i.frOnly);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-line bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:h-18">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-cream-muted transition-colors hover:text-cream"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ButtonLink href="/demarrer" size="md">
            {t("cta")}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-line bg-ink/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 ease-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-cream-muted transition-colors hover:bg-cream/[0.04] hover:text-cream"
            >
              {t(item.key)}
            </Link>
          ))}
          <ButtonLink href="/demarrer" size="lg" className="mt-3 w-full">
            {t("cta")}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Globe, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

// Sélecteur de langue — change la locale active pour la MÊME page.
// next-intl s'occupe de préfixer l'URL (ou non, pour `fr`) et d'écrire le
// cookie NEXT_LOCALE, qui prime ensuite sur la détection IP.
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur + touche Échap.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = localeMeta[locale];

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      // Conserve la page courante, change juste la langue.
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("choose")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-cream-muted",
          "transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
          isPending && "opacity-60",
        )}
      >
        <Globe size={16} aria-hidden />
        <span className="font-medium">{locale.toUpperCase()}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className={cn(
            "absolute end-0 z-50 mt-2 min-w-52 overflow-hidden rounded-2xl border border-line",
            "bg-ink/95 p-1.5 shadow-2xl backdrop-blur-xl",
          )}
        >
          {locales.map((l) => {
            const meta = localeMeta[l];
            const active = l === locale;
            return (
              <li key={l} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => switchTo(l)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                    active
                      ? "bg-cream/[0.06] text-cream"
                      : "text-cream-muted hover:bg-cream/[0.04] hover:text-cream",
                  )}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {meta.flag}
                  </span>
                  <span className="flex-1" dir={meta.dir}>
                    {meta.label}
                  </span>
                  {active && <Check size={16} className="text-ember" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

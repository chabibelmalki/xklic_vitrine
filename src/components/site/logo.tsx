import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 text-cream",
        className,
      )}
      aria-label="Brio — accueil"
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-[10px] bg-gradient-to-br from-ember to-ember-deep shadow-[0_4px_16px_-4px_rgba(255,106,61,0.6)] transition-transform duration-300 group-hover:scale-105" />
        <span className="relative font-display text-lg font-medium text-ink">
          B
        </span>
      </span>
      <span className="font-display text-xl font-medium tracking-tight">
        Brio
      </span>
    </Link>
  );
}
